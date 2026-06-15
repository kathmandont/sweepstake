import { useState, useEffect } from "react";
import { getOwner, PLAYER_TEAMS, normaliseTeam } from "../lib/sweepstake";

export type Goal = { minute: number; type: "REGULAR" | "OWN_GOAL" | "PENALTY"; scorer: string; team: string; matchLabel: string; date: string };
export type Booking = { minute: number; type: "YELLOW_CARD" | "RED_CARD" | "YELLOW_RED_CARD"; player: string; team: string; matchLabel: string; date: string };

export type MatchSummary = {
  id: string;
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
  yellowCardTotals: Record<string, number>;
};

const CACHE_PREFIX = "wc2026_espn_match_v2_";
const TODAY = new Date().toISOString().split("T")[0];
const PAST_MATCH_TTL = Infinity;
const TODAY_MATCH_TTL = 15 * 60 * 1000;

// ESPN uses different names for some teams
const ESPN_ALIASES: Record<string, string> = {
  "Türkiye": "Turkey",
  "Czechia": "Czech Republic",
  "Ivory Coast": "Côte d'Ivoire",
  "DR Congo": "Congo DR",
  "Cape Verde": "Cape Verde Islands",
  "Bosnia-Herzegovina": "Bosnia & Herzegovina",
  "Curacao": "Curaçao",
  "USA": "United States",
  "South Korea": "Korea Republic",
};

function espnNormalise(name: string): string {
  return normaliseTeam(ESPN_ALIASES[name] ?? name);
}

function getCached(id: string, matchDate: string): MatchSummary | null {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${id}`);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    const ttl = matchDate < TODAY ? PAST_MATCH_TTL : TODAY_MATCH_TTL;
    if (Date.now() - ts > ttl) return null;
    return data;
  } catch { return null; }
}

function setCache(id: string, data: MatchSummary) {
  try { localStorage.setItem(`${CACHE_PREFIX}${id}`, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

async function fetchMatchDetail(id: string, date: string, homeTeam: string, awayTeam: string): Promise<MatchSummary | null> {
  const cached = getCached(id, date);
  if (cached) return cached;

  try {
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary?event=${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    const matchLabel = `${homeTeam} vs ${awayTeam}`;

    const goals: Goal[] = [];
    const bookings: Booking[] = [];

    for (const e of data.keyEvents ?? []) {
      const eventType: string = e.type?.type ?? "";
      const minute = Math.floor((e.clock?.value ?? 0) / 60);
      const teamName = espnNormalise(e.team?.displayName ?? "");
      const playerName = e.participants?.[0]?.athlete?.displayName ?? "Unknown";

      if (eventType === "own-goal") {
        // ESPN sets team to the benefiting side; we want the scorer's team
        const ownGoalTeam = teamName === homeTeam ? awayTeam : homeTeam;
        goals.push({ minute, type: "OWN_GOAL", scorer: playerName, team: ownGoalTeam, matchLabel, date });
      } else if (eventType === "penalty---scored") {
        goals.push({ minute, type: "PENALTY", scorer: playerName, team: teamName, matchLabel, date });
      } else if (eventType.startsWith("goal")) {
        goals.push({ minute, type: "REGULAR", scorer: playerName, team: teamName, matchLabel, date });
      } else if (eventType === "yellow-card") {
        bookings.push({ minute, type: "YELLOW_CARD", player: playerName, team: teamName, matchLabel, date });
      } else if (eventType === "red-card") {
        bookings.push({ minute, type: "RED_CARD", player: playerName, team: teamName, matchLabel, date });
      } else if (eventType === "yellow-red-card") {
        bookings.push({ minute, type: "YELLOW_RED_CARD", player: playerName, team: teamName, matchLabel, date });
      }
    }

    const comp = data.header?.competitions?.[0];
    let homeScore = 0;
    let awayScore = 0;
    for (const c of comp?.competitors ?? []) {
      if (c.homeAway === "home") homeScore = parseInt(c.score ?? "0", 10);
      if (c.homeAway === "away") awayScore = parseInt(c.score ?? "0", 10);
    }

    const summary: MatchSummary = { id, date, homeTeam, awayTeam, homeScore, awayScore, goals, bookings };
    setCache(id, summary);
    return summary;
  } catch { return null; }
}

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
        // Single request gets all 102 WC matches across the tournament window
        const res = await fetch(
          "https://site.web.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?limit=200&dates=20260611-20260720"
        );
        if (!res.ok || cancelled) return;
        const data = await res.json();

        const finishedEvents = (data.events ?? []).filter(
          (e: any) => e.status?.type?.name === "STATUS_FULL_TIME"
        );

        const summaries: MatchSummary[] = [];
        for (const event of finishedEvents) {
          if (cancelled) break;
          const comp = event.competitions?.[0];
          const homeComp = comp?.competitors?.find((c: any) => c.homeAway === "home");
          const awayComp = comp?.competitors?.find((c: any) => c.homeAway === "away");
          const home = espnNormalise(homeComp?.team?.displayName ?? "");
          const away = espnNormalise(awayComp?.team?.displayName ?? "");
          const date = event.date?.split("T")[0] ?? "";

          const cached = getCached(event.id, date);
          if (cached) {
            summaries.push(cached);
          } else {
            const detail = await fetchMatchDetail(event.id, date, home, away);
            if (detail) summaries.push(detail);
          }
        }

        if (cancelled) return;
        setMatches(summaries);

        const allGoals = summaries.flatMap(s => s.goals);
        const allBookings = summaries.flatMap(s => s.bookings);

        const redCards = allBookings.filter(b => b.type === "RED_CARD" || b.type === "YELLOW_RED_CARD");
        const firstRed = redCards[0] ?? null;

        const ownGoals = allGoals.filter(g => g.type === "OWN_GOAL");
        const firstOG = ownGoals[0] ?? null;

        let highestGame: PrizeDetection["highestScoringGame"] = null;
        for (const s of summaries) {
          const total = s.homeScore + s.awayScore;
          if (!highestGame || total > highestGame.total) {
            const owners = [...new Set([getOwner(s.homeTeam), getOwner(s.awayTeam)].filter(Boolean) as string[])];
            highestGame = { matchLabel: `${s.homeTeam} vs ${s.awayTeam}`, total, owners };
          }
        }

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

  const matchMap = Object.fromEntries(matches.map(m => [`${m.homeTeam}|${m.awayTeam}`, m]));

  return { matches, matchMap, prizes, loading };
}
