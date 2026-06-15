import { useState, useEffect } from "react";
import { API_HEADERS, getOwner, PLAYER_TEAMS, normaliseTeam } from "../lib/sweepstake";

export type Goal = { minute: number; type: "REGULAR" | "OWN_GOAL" | "PENALTY"; scorer: string; team: string; matchLabel: string; date: string };
export type Booking = { minute: number; type: "YELLOW_CARD" | "RED_CARD" | "YELLOW_RED_CARD"; player: string; team: string; matchLabel: string; date: string };

export type MatchSummary = {
  id: number;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  goals: Goal[];
  bookings: Booking[];
};

export type PrizeDetection = {
  firstRedCard: { player: string; team: string; opponent: string; minute: number; matchLabel: string } | null;
  firstOwnGoal: { player: string; team: string; scorer: string; minute: number; matchLabel: string } | null;
  highestScoringGame: { matchLabel: string; total: number; owners: string[] } | null;
  yellowCardTotals: Record<string, number>; // sweepstake player → total yellows
};

const CACHE_PREFIX = "wc2026_match_v3_";
const LIST_CACHE_KEY = "wc2026_list_v3";
const TODAY = new Date().toISOString().split("T")[0];
const PAST_MATCH_TTL = Infinity;     // finished matches from previous days never expire
const TODAY_MATCH_TTL = 15 * 60 * 1000;  // today's match details: 15 min
const LIST_TTL = 30 * 60 * 1000;         // finished matches list: 30 min

function getCached(id: number, matchDate: string): MatchSummary | null {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${id}`);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    const ttl = matchDate < TODAY ? PAST_MATCH_TTL : TODAY_MATCH_TTL;
    if (Date.now() - ts > ttl) return null;
    return data;
  } catch { return null; }
}

function setCache(id: number, data: MatchSummary) {
  try { localStorage.setItem(`${CACHE_PREFIX}${id}`, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

function getCachedList(): any[] | null {
  try {
    const raw = localStorage.getItem(LIST_CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > LIST_TTL) return null;
    return data;
  } catch { return null; }
}

function setCachedList(data: any[]) {
  try { localStorage.setItem(LIST_CACHE_KEY, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

async function fetchDetail(id: number, date: string, homeTeam: string, awayTeam: string): Promise<MatchSummary | null> {
  const cached = getCached(id, date);
  if (cached) return cached;

  try {
    const res = await fetch(`https://api.football-data.org/v4/matches/${id}`, { headers: API_HEADERS });
    if (!res.ok) return null;
    const data = await res.json();
    const matchLabel = `${homeTeam} vs ${awayTeam}`;

    const goals: Goal[] = (data.goals ?? []).map((g: any) => ({
      minute: g.minute,
      type: g.type,
      scorer: g.scorer?.name ?? "Unknown",
      team: normaliseTeam(g.team?.name ?? ""),
      matchLabel,
      date,
    }));

    const bookings: Booking[] = (data.bookings ?? []).map((b: any) => ({
      minute: b.minute,
      type: b.type,
      player: b.player?.name ?? "Unknown",
      team: normaliseTeam(b.team?.name ?? ""),
      matchLabel,
      date,
    }));

    const summary: MatchSummary = {
      id,
      date,
      homeTeam,
      awayTeam,
      homeScore: data.score?.fullTime?.home ?? 0,
      awayScore: data.score?.fullTime?.away ?? 0,
      goals,
      bookings,
    };

    setCache(id, summary);
    return summary;
  } catch { return null; }
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

export function useTournamentEvents() {
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [prizes, setPrizes] = useState<PrizeDetection>({
    firstRedCard: null,
    firstOwnGoal: null,
    highestScoringGame: null,
    yellowCardTotals: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        let finishedMatches: any[] = getCachedList() ?? [];
        if (!finishedMatches.length) {
          const res = await fetch(
            "https://api.football-data.org/v4/competitions/2000/matches?status=FINISHED",
            { headers: API_HEADERS }
          );
          if (!res.ok || cancelled) return;
          const data = await res.json();
          finishedMatches = data.matches ?? [];
          setCachedList(finishedMatches);
        }
        if (cancelled) return;

        const summaries: MatchSummary[] = [];
        for (const m of finishedMatches) {
          if (cancelled) break;
          const home = normaliseTeam(m.homeTeam?.name ?? "");
          const away = normaliseTeam(m.awayTeam?.name ?? "");
          const date = m.utcDate?.split("T")[0] ?? "";
          const cached = getCached(m.id, date);
          if (cached) {
            summaries.push(cached);
          } else {
            const detail = await fetchDetail(m.id, date, home, away);
            if (detail) summaries.push(detail);
            await sleep(300); // stay well under rate limit
          }
        }

        if (cancelled) return;
        setMatches(summaries);

        // Prize detection
        const allGoals = summaries.flatMap(s => s.goals);
        const allBookings = summaries.flatMap(s => s.bookings);

        // First red card
        const redCards = allBookings.filter(b => b.type === "RED_CARD" || b.type === "YELLOW_RED_CARD");
        const firstRed = redCards[0] ?? null;

        // First own goal
        const ownGoals = allGoals.filter(g => g.type === "OWN_GOAL");
        const firstOG = ownGoals[0] ?? null;

        // Highest scoring game
        let highestGame: PrizeDetection["highestScoringGame"] = null;
        for (const s of summaries) {
          const total = s.homeScore + s.awayScore;
          if (!highestGame || total > highestGame.total) {
            const owners = [...new Set([getOwner(s.homeTeam), getOwner(s.awayTeam)].filter(Boolean) as string[])];
            highestGame = { matchLabel: `${s.homeTeam} vs ${s.awayTeam}`, total, owners };
          }
        }

        // Yellow card totals per sweepstake player
        const yellowTotals: Record<string, number> = {};
        for (const player of Object.keys(PLAYER_TEAMS)) yellowTotals[player] = 0;
        for (const b of allBookings) {
          if (b.type !== "YELLOW_CARD" && b.type !== "YELLOW_RED_CARD") continue;
          const owner = getOwner(b.team);
          if (owner) yellowTotals[owner] = (yellowTotals[owner] ?? 0) + 1;
        }

        setPrizes({
          firstRedCard: firstRed ? {
            player: getOwner(firstRed.team) ?? "Unknown",
            team: firstRed.team,
            opponent: firstRed.player,
            minute: firstRed.minute,
            matchLabel: firstRed.matchLabel,
          } : null,
          firstOwnGoal: firstOG ? {
            player: getOwner(firstOG.team) ?? "Unknown",
            team: firstOG.team,
            scorer: firstOG.scorer,
            minute: firstOG.minute,
            matchLabel: firstOG.matchLabel,
          } : null,
          highestScoringGame: highestGame,
          yellowCardTotals: yellowTotals,
        });
      } catch {
        // silently fail
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // Map for quick lookup: "homeTeam|awayTeam" → MatchSummary
  const matchMap = Object.fromEntries(matches.map(m => [`${m.homeTeam}|${m.awayTeam}`, m]));

  return { matches, matchMap, prizes, loading };
}
