import { useState, useEffect, useCallback, useRef } from "react";
import { PLAYER_COLORS, getOwner } from "../lib/sweepstake";
import { useTournamentEvents } from "../hooks/useTournamentEvents";
import { getCountryStats } from "../hooks/useCountryStats";

const FLAGS: Record<string, string> = {
  Morocco: "🇲🇦", Turkey: "🇹🇷", Austria: "🇦🇹", "Cape Verde Islands": "🇨🇻", "Cape Verde": "🇨🇻",
  "New Zealand": "🇳🇿", Egypt: "🇪🇬", Iraq: "🇮🇶", Spain: "🇪🇸",
  Croatia: "🇭🇷", "Curaçao": "🇨🇼", Curacao: "🇨🇼", Australia: "🇦🇺", Uzbekistan: "🇺🇿",
  Japan: "🇯🇵", Netherlands: "🇳🇱", "Czech Republic": "🇨🇿", Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  Argentina: "🇦🇷", Ghana: "🇬🇭", Switzerland: "🇨🇭", Ecuador: "🇪🇨",
  "Korea Republic": "🇰🇷", "South Korea": "🇰🇷", Tunisia: "🇹🇳", Panama: "🇵🇦", Sweden: "🇸🇪",
  Jordan: "🇯🇴", "South Africa": "🇿🇦", Portugal: "🇵🇹", Haiti: "🇭🇹",
  "Bosnia & Herzegovina": "🇧🇦", "Bosnia-Herzegovina": "🇧🇦",
  Belgium: "🇧🇪", Senegal: "🇸🇳", Mexico: "🇲🇽",
  "Saudi Arabia": "🇸🇦", Algeria: "🇩🇿", Brazil: "🇧🇷", Uruguay: "🇺🇾",
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Norway: "🇳🇴", France: "🇫🇷", "United States": "🇺🇸", USA: "🇺🇸",
  "Congo DR": "🇨🇩", "DR Congo": "🇨🇩", Paraguay: "🇵🇾", Germany: "🇩🇪",
  Canada: "🇨🇦", Iran: "🇮🇷", Colombia: "🇨🇴", "Côte d'Ivoire": "🇨🇮", "Ivory Coast": "🇨🇮", Qatar: "🇶🇦",
};

// Fixture-display name → sweepstake name (for getOwner lookups)
const ALIASES: Record<string, string> = {
  "South Korea": "Korea Republic",
  "Ivory Coast": "Côte d'Ivoire",
  "DR Congo": "Congo DR",
  "Cape Verde": "Cape Verde Islands",
  "Bosnia-Herzegovina": "Bosnia & Herzegovina",
  Curacao: "Curaçao",
  USA: "United States",
};

const FIXTURES: { date: string; home: string; away: string; time: string; timeAEST: string; stage: string; tv: string; score?: string; winner?: string }[] = [
  // June 11
  { date: "2026-06-11", home: "Mexico", away: "South Africa", time: "FT", timeAEST: "FT", stage: "Group A", tv: "", score: "2 - 0", winner: "Mexico" },
  // June 12
  { date: "2026-06-12", home: "South Korea", away: "Czech Republic", time: "FT", timeAEST: "FT", stage: "Group A", tv: "", score: "2 - 1", winner: "South Korea" },
  { date: "2026-06-12", home: "Canada", away: "Bosnia-Herzegovina", time: "FT", timeAEST: "FT", stage: "Group B", tv: "BBC", score: "1 - 1", winner: "DRAW" },
  // June 13
  { date: "2026-06-13", home: "USA", away: "Paraguay", time: "FT", timeAEST: "FT", stage: "Group D", tv: "BBC", score: "4 - 1", winner: "USA" },
  { date: "2026-06-13", home: "Qatar", away: "Switzerland", time: "FT", timeAEST: "FT", stage: "Group B", tv: "ITV", score: "1 - 1", winner: "DRAW" },
  { date: "2026-06-13", home: "Brazil", away: "Morocco", time: "FT", timeAEST: "FT", stage: "Group C", tv: "BBC", score: "1 - 1", winner: "DRAW" },
  // June 14
  { date: "2026-06-14", home: "Haiti", away: "Scotland", time: "FT", timeAEST: "FT", stage: "Group C", tv: "BBC", score: "0 - 1", winner: "Scotland" },
  { date: "2026-06-14", home: "Australia", away: "Turkey", time: "FT", timeAEST: "FT", stage: "Group D", tv: "ITV", score: "2 - 0", winner: "Australia" },
  { date: "2026-06-14", home: "Germany", away: "Curacao", time: "FT", timeAEST: "FT", stage: "Group E", tv: "ITV", score: "7 - 1", winner: "Germany" },
  { date: "2026-06-14", home: "Netherlands", away: "Japan", time: "FT", timeAEST: "FT", stage: "Group F", tv: "ITV", score: "2 - 2", winner: "DRAW" },
  // June 15
  { date: "2026-06-15", home: "Ivory Coast", away: "Ecuador", time: "FT", timeAEST: "FT", stage: "Group E", tv: "BBC", score: "1 - 0", winner: "Ivory Coast" },
  { date: "2026-06-15", home: "Sweden", away: "Tunisia", time: "FT", timeAEST: "FT", stage: "Group F", tv: "ITV", score: "5 - 1", winner: "Sweden" },
  { date: "2026-06-15", home: "Spain", away: "Cape Verde", time: "5:00pm", timeAEST: "2:00am (+1)", stage: "Group H", tv: "ITV" },
  { date: "2026-06-15", home: "Belgium", away: "Egypt", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Group G", tv: "BBC" },
  { date: "2026-06-15", home: "Saudi Arabia", away: "Uruguay", time: "11:00pm", timeAEST: "8:00am (+1)", stage: "Group H", tv: "ITV" },
  // June 16
  { date: "2026-06-16", home: "Iran", away: "New Zealand", time: "2:00am", timeAEST: "11:00am", stage: "Group G", tv: "BBC" },
  { date: "2026-06-16", home: "France", away: "Senegal", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Group I", tv: "BBC" },
  { date: "2026-06-16", home: "Iraq", away: "Norway", time: "11:00pm", timeAEST: "8:00am (+1)", stage: "Group I", tv: "BBC" },
  // June 17
  { date: "2026-06-17", home: "Argentina", away: "Algeria", time: "2:00am", timeAEST: "11:00am", stage: "Group J", tv: "ITV" },
  { date: "2026-06-17", home: "Austria", away: "Jordan", time: "5:00am", timeAEST: "2:00pm", stage: "Group J", tv: "BBC" },
  { date: "2026-06-17", home: "Portugal", away: "DR Congo", time: "6:00pm", timeAEST: "3:00am (+1)", stage: "Group K", tv: "BBC" },
  { date: "2026-06-17", home: "England", away: "Croatia", time: "9:00pm", timeAEST: "6:00am (+1)", stage: "Group L", tv: "ITV" },
  // June 18
  { date: "2026-06-18", home: "Ghana", away: "Panama", time: "12:00am", timeAEST: "9:00am", stage: "Group L", tv: "ITV" },
  { date: "2026-06-18", home: "Uzbekistan", away: "Colombia", time: "3:00am", timeAEST: "12:00pm", stage: "Group K", tv: "BBC" },
  { date: "2026-06-18", home: "Czech Republic", away: "South Africa", time: "5:00pm", timeAEST: "2:00am (+1)", stage: "Group A", tv: "BBC" },
  { date: "2026-06-18", home: "Switzerland", away: "Bosnia-Herzegovina", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Group B", tv: "ITV" },
  { date: "2026-06-18", home: "Canada", away: "Qatar", time: "11:00pm", timeAEST: "8:00am (+1)", stage: "Group B", tv: "ITV" },
  // June 19
  { date: "2026-06-19", home: "Mexico", away: "South Africa", time: "2:00am", timeAEST: "11:00am", stage: "Group A", tv: "BBC" },
  { date: "2026-06-19", home: "USA", away: "Australia", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Group D", tv: "BBC" },
  { date: "2026-06-19", home: "Scotland", away: "Morocco", time: "11:00pm", timeAEST: "8:00am (+1)", stage: "Group C", tv: "ITV" },
  // June 20
  { date: "2026-06-20", home: "Brazil", away: "Haiti", time: "2:00am", timeAEST: "11:00am", stage: "Group C", tv: "ITV" },
  { date: "2026-06-20", home: "Turkey", away: "Paraguay", time: "5:00am", timeAEST: "2:00pm", stage: "Group D", tv: "ITV" },
  { date: "2026-06-20", home: "Netherlands", away: "Sweden", time: "6:00pm", timeAEST: "3:00am (+1)", stage: "Group F", tv: "BBC" },
  { date: "2026-06-20", home: "Germany", away: "Ivory Coast", time: "9:00pm", timeAEST: "6:00am (+1)", stage: "Group E", tv: "ITV" },
  // June 21
  { date: "2026-06-21", home: "Ecuador", away: "Curacao", time: "1:00am", timeAEST: "10:00am", stage: "Group E", tv: "BBC" },
  { date: "2026-06-21", home: "Tunisia", away: "Japan", time: "5:00am", timeAEST: "2:00pm", stage: "Group F", tv: "BBC" },
  { date: "2026-06-21", home: "Spain", away: "Saudi Arabia", time: "5:00pm", timeAEST: "2:00am (+1)", stage: "Group H", tv: "BBC" },
  { date: "2026-06-21", home: "Belgium", away: "Iran", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Group G", tv: "ITV" },
  { date: "2026-06-21", home: "Uruguay", away: "Cape Verde", time: "11:00pm", timeAEST: "8:00am (+1)", stage: "Group H", tv: "BBC" },
  // June 22
  { date: "2026-06-22", home: "New Zealand", away: "Egypt", time: "2:00am", timeAEST: "11:00am", stage: "Group G", tv: "ITV" },
  { date: "2026-06-22", home: "Argentina", away: "Austria", time: "6:00pm", timeAEST: "3:00am (+1)", stage: "Group J", tv: "BBC" },
  { date: "2026-06-22", home: "France", away: "Iraq", time: "10:00pm", timeAEST: "7:00am (+1)", stage: "Group I", tv: "BBC" },
  // June 23
  { date: "2026-06-23", home: "Norway", away: "Senegal", time: "1:00am", timeAEST: "10:00am", stage: "Group I", tv: "ITV" },
  { date: "2026-06-23", home: "Jordan", away: "Algeria", time: "4:00am", timeAEST: "1:00pm", stage: "Group J", tv: "ITV" },
  { date: "2026-06-23", home: "Portugal", away: "Uzbekistan", time: "6:00pm", timeAEST: "3:00am (+1)", stage: "Group K", tv: "ITV" },
  { date: "2026-06-23", home: "England", away: "Ghana", time: "9:00pm", timeAEST: "6:00am (+1)", stage: "Group L", tv: "BBC" },
  // June 24
  { date: "2026-06-24", home: "Panama", away: "Croatia", time: "12:00am", timeAEST: "9:00am", stage: "Group L", tv: "BBC" },
  { date: "2026-06-24", home: "Colombia", away: "DR Congo", time: "3:00am", timeAEST: "12:00pm", stage: "Group K", tv: "ITV" },
  { date: "2026-06-24", home: "Bosnia-Herzegovina", away: "Qatar", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Group B", tv: "ITV" },
  { date: "2026-06-24", home: "Switzerland", away: "Canada", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Group B", tv: "ITV" },
  { date: "2026-06-24", home: "Morocco", away: "Haiti", time: "11:00pm", timeAEST: "8:00am (+1)", stage: "Group C", tv: "BBC" },
  { date: "2026-06-24", home: "Scotland", away: "Brazil", time: "11:00pm", timeAEST: "8:00am (+1)", stage: "Group C", tv: "BBC" },
  // June 25
  { date: "2026-06-25", home: "Czech Republic", away: "Mexico", time: "2:00am", timeAEST: "11:00am", stage: "Group A", tv: "BBC" },
  { date: "2026-06-25", home: "South Africa", away: "South Korea", time: "2:00am", timeAEST: "11:00am", stage: "Group A", tv: "BBC" },
  { date: "2026-06-25", home: "Curacao", away: "Ivory Coast", time: "9:00pm", timeAEST: "6:00am (+1)", stage: "Group E", tv: "BBC" },
  { date: "2026-06-25", home: "Ecuador", away: "Germany", time: "9:00pm", timeAEST: "6:00am (+1)", stage: "Group E", tv: "BBC" },
  // June 26
  { date: "2026-06-26", home: "Japan", away: "Sweden", time: "12:00am", timeAEST: "9:00am", stage: "Group F", tv: "BBC" },
  { date: "2026-06-26", home: "Tunisia", away: "Netherlands", time: "12:00am", timeAEST: "9:00am", stage: "Group F", tv: "BBC" },
  { date: "2026-06-26", home: "Paraguay", away: "Australia", time: "3:00am", timeAEST: "12:00pm", stage: "Group D", tv: "ITV" },
  { date: "2026-06-26", home: "Turkey", away: "USA", time: "3:00am", timeAEST: "12:00pm", stage: "Group D", tv: "ITV" },
  { date: "2026-06-26", home: "Norway", away: "France", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Group I", tv: "ITV" },
  { date: "2026-06-26", home: "Senegal", away: "Iraq", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Group I", tv: "ITV" },
  // June 27
  { date: "2026-06-27", home: "Cape Verde", away: "Saudi Arabia", time: "1:00am", timeAEST: "10:00am", stage: "Group H", tv: "ITV" },
  { date: "2026-06-27", home: "Uruguay", away: "Spain", time: "1:00am", timeAEST: "10:00am", stage: "Group H", tv: "ITV" },
  { date: "2026-06-27", home: "Egypt", away: "Iran", time: "4:00am", timeAEST: "1:00pm", stage: "Group G", tv: "BBC" },
  { date: "2026-06-27", home: "New Zealand", away: "Belgium", time: "4:00am", timeAEST: "1:00pm", stage: "Group G", tv: "BBC" },
  { date: "2026-06-27", home: "Croatia", away: "Ghana", time: "10:00pm", timeAEST: "7:00am (+1)", stage: "Group L", tv: "ITV" },
  { date: "2026-06-27", home: "Panama", away: "England", time: "10:00pm", timeAEST: "7:00am (+1)", stage: "Group L", tv: "ITV" },
  // June 28
  { date: "2026-06-28", home: "Colombia", away: "Portugal", time: "12:30am", timeAEST: "9:30am", stage: "Group K", tv: "BBC" },
  { date: "2026-06-28", home: "DR Congo", away: "Uzbekistan", time: "12:30am", timeAEST: "9:30am", stage: "Group K", tv: "BBC" },
  { date: "2026-06-28", home: "Algeria", away: "Austria", time: "3:00am", timeAEST: "12:00pm", stage: "Group J", tv: "BBC" },
  { date: "2026-06-28", home: "Jordan", away: "Argentina", time: "3:00am", timeAEST: "12:00pm", stage: "Group J", tv: "BBC" },
  { date: "2026-06-28", home: "Runner-up A", away: "Runner-up B", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Round of 32", tv: "TBC" },
  // June 29
  { date: "2026-06-29", home: "Winner C", away: "Runner-up F", time: "6:00pm", timeAEST: "3:00am (+1)", stage: "Round of 32", tv: "TBC" },
  { date: "2026-06-29", home: "Winner E", away: "Best 3rd", time: "9:30pm", timeAEST: "6:30am (+1)", stage: "Round of 32", tv: "TBC" },
  // June 30
  { date: "2026-06-30", home: "Winner F", away: "Runner-up C", time: "2:00am", timeAEST: "11:00am", stage: "Round of 32", tv: "TBC" },
  { date: "2026-06-30", home: "Runner-up E", away: "Runner-up I", time: "6:00pm", timeAEST: "3:00am (+1)", stage: "Round of 32", tv: "TBC" },
  { date: "2026-06-30", home: "Winner I", away: "Best 3rd", time: "10:00pm", timeAEST: "7:00am (+1)", stage: "Round of 32", tv: "TBC" },
  // July 1
  { date: "2026-07-01", home: "Winner A", away: "Best 3rd", time: "2:00am", timeAEST: "11:00am", stage: "Round of 32", tv: "TBC" },
  { date: "2026-07-01", home: "Winner L", away: "Best 3rd", time: "5:00pm", timeAEST: "2:00am (+1)", stage: "Round of 32", tv: "TBC" },
  { date: "2026-07-01", home: "Winner G", away: "Best 3rd", time: "9:00pm", timeAEST: "6:00am (+1)", stage: "Round of 32", tv: "TBC" },
  // July 2
  { date: "2026-07-02", home: "Winner D", away: "Best 3rd", time: "1:00am", timeAEST: "10:00am", stage: "Round of 32", tv: "TBC" },
  { date: "2026-07-02", home: "Winner H", away: "Runner-up J", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Round of 32", tv: "TBC" },
  // July 3
  { date: "2026-07-03", home: "Runner-up K", away: "Runner-up L", time: "12:00am", timeAEST: "9:00am", stage: "Round of 32", tv: "TBC" },
  { date: "2026-07-03", home: "Winner B", away: "Best 3rd", time: "4:00am", timeAEST: "1:00pm", stage: "Round of 32", tv: "TBC" },
  { date: "2026-07-03", home: "Runner-up D", away: "Runner-up G", time: "7:00pm", timeAEST: "4:00am (+1)", stage: "Round of 32", tv: "TBC" },
  { date: "2026-07-03", home: "Winner J", away: "Runner-up H", time: "11:00pm", timeAEST: "8:00am (+1)", stage: "Round of 32", tv: "TBC" },
  // July 4
  { date: "2026-07-04", home: "Winner K", away: "Best 3rd", time: "2:30am", timeAEST: "11:30am", stage: "Round of 32", tv: "TBC" },
  { date: "2026-07-04", home: "TBD", away: "TBD", time: "6:00pm", timeAEST: "3:00am (+1)", stage: "Round of 16", tv: "TBC" },
  { date: "2026-07-04", home: "TBD", away: "TBD", time: "10:00pm", timeAEST: "7:00am (+1)", stage: "Round of 16", tv: "TBC" },
  // July 5
  { date: "2026-07-05", home: "TBD", away: "TBD", time: "9:00pm", timeAEST: "6:00am (+1)", stage: "Round of 16", tv: "TBC" },
  // July 6
  { date: "2026-07-06", home: "TBD", away: "TBD", time: "1:00am", timeAEST: "10:00am", stage: "Round of 16", tv: "TBC" },
  { date: "2026-07-06", home: "TBD", away: "TBD", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Round of 16", tv: "TBC" },
  // July 7
  { date: "2026-07-07", home: "TBD", away: "TBD", time: "1:00am", timeAEST: "10:00am", stage: "Round of 16", tv: "TBC" },
  { date: "2026-07-07", home: "TBD", away: "TBD", time: "5:00pm", timeAEST: "2:00am (+1)", stage: "Round of 16", tv: "TBC" },
  { date: "2026-07-07", home: "TBD", away: "TBD", time: "9:00pm", timeAEST: "6:00am (+1)", stage: "Round of 16", tv: "TBC" },
  // Quarter-finals
  { date: "2026-07-09", home: "TBD", away: "TBD", time: "9:00pm", timeAEST: "6:00am (+1)", stage: "Quarter-Final", tv: "TBC" },
  { date: "2026-07-10", home: "TBD", away: "TBD", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Quarter-Final", tv: "TBC" },
  { date: "2026-07-11", home: "TBD", away: "TBD", time: "10:00pm", timeAEST: "7:00am (+1)", stage: "Quarter-Final", tv: "TBC" },
  { date: "2026-07-12", home: "TBD", away: "TBD", time: "2:00am", timeAEST: "11:00am", stage: "Quarter-Final", tv: "TBC" },
  // Semi-finals
  { date: "2026-07-14", home: "TBD", away: "TBD", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Semi-Final", tv: "TBC" },
  { date: "2026-07-15", home: "TBD", away: "TBD", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Semi-Final", tv: "TBC" },
  // Third place + Final
  { date: "2026-07-18", home: "TBD", away: "TBD", time: "10:00pm", timeAEST: "7:00am (+1)", stage: "Third-Place Play-off", tv: "TBC" },
  { date: "2026-07-19", home: "TBD", away: "TBD", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "FINAL 🏆", tv: "TBC" },
];


type Goal = { minute: number; type: "REGULAR" | "OWN_GOAL" | "PENALTY"; scorer: string; team: string };
type Booking = { minute: number; type: "YELLOW_CARD" | "RED_CARD" | "YELLOW_RED_CARD"; player: string; team: string };
type LiveScore = {
  home: number | null;
  away: number | null;
  status: string;
  winner: string | null;
  goals: Goal[];
  bookings: Booking[];
};
type LiveScores = Record<string, LiveScore>;

// ESPN uses different team names than the fixture list
const ESPN_TO_FIXTURE: Record<string, string> = {
  "Türkiye": "Turkey",
  "Czechia": "Czech Republic",
  "Ivory Coast": "Ivory Coast",
  "DR Congo": "DR Congo",
  "Cape Verde": "Cape Verde",
  "Bosnia-Herzegovina": "Bosnia-Herzegovina",
  "Curacao": "Curacao",
  "United States": "USA",
  "South Korea": "South Korea",
};

function normaliseTeamName(name: string): string {
  return ESPN_TO_FIXTURE[name] ?? name;
}

function useLiveScores(selectedDate: string) {
  const [scores, setScores] = useState<LiveScores>({});
  const [lastFetched, setLastFetched] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetch_ = useCallback(async (date: string) => {
    setFetching(true);
    try {
      const res = await fetch(
        `https://site.web.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?limit=20&dates=${date.replace(/-/g, "")}`
      );
      if (!res.ok) {
        setApiError(`ESPN ${res.status}`);
        return;
      }
      setApiError(null);

      const data = await res.json();
      const updated: LiveScores = {};

      for (const event of data.events ?? []) {
        const comp = event.competitions?.[0];
        const homeComp = comp?.competitors?.find((c: any) => c.homeAway === "home");
        const awayComp = comp?.competitors?.find((c: any) => c.homeAway === "away");
        const home = normaliseTeamName(homeComp?.team?.displayName ?? "");
        const away = normaliseTeamName(awayComp?.team?.displayName ?? "");
        const key = `${home}|${away}`;

        const statusName: string = event.status?.type?.name ?? "";
        const isLive = ["STATUS_IN_PROGRESS", "STATUS_FIRST_HALF", "STATUS_SECOND_HALF"].includes(statusName);
        const isHalfTime = statusName === "STATUS_HALFTIME";
        const isFinished = statusName === "STATUS_FULL_TIME";

        const homeScore = homeComp?.score != null ? parseInt(homeComp.score, 10) : null;
        const awayScore = awayComp?.score != null ? parseInt(awayComp.score, 10) : null;

        let winner: string | null = null;
        if (isFinished && homeScore !== null && awayScore !== null) {
          if (homeScore > awayScore) winner = "HOME_TEAM";
          else if (awayScore > homeScore) winner = "AWAY_TEAM";
          else winner = "DRAW";
        }

        updated[key] = {
          home: homeScore,
          away: awayScore,
          status: isLive ? "IN_PLAY" : isHalfTime ? "HALF_TIME" : isFinished ? "FINISHED" : statusName,
          winner,
          goals: [],
          bookings: [],
        };
      }

      setScores(updated);
      setLastFetched(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    } catch (e: any) {
      setApiError(`Network error: ${e?.message ?? "unknown"}`);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => { fetch_(selectedDate); }, [selectedDate, fetch_]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (selectedDate !== today) return;

    const id = setInterval(() => {
      const now = new Date();
      const bstHour = (now.getUTCHours() + 1) % 24;
      const inWindow = bstHour >= 17 || bstHour <= 6;
      if (inWindow) fetch_(selectedDate);
    }, 60_000);

    return () => clearInterval(id);
  }, [selectedDate, fetch_]);

  return { scores, lastFetched, fetching, apiError };
}

function resolveOwner(team: string): string | null {
  return getOwner(ALIASES[team] ?? team);
}

function MatchEventSummary({ goals, bookings, isFinished }: { goals: Goal[]; bookings: Booking[]; isFinished: boolean }) {
  if (!isFinished) return null;
  const hasEvents = goals.length > 0 || bookings.length > 0;
  return (
    <div className="mt-3 pt-2" style={{ borderTop: "1px dashed #2a2a2a" }}>
      {!hasEvents && (
        <span style={{ fontFamily: "'Share Tech Mono', monospace", color: "#333", fontSize: "0.7rem" }}>
          loading match events...
        </span>
      )}
      {goals.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-1">
          {goals.map((g, i) => (
            <span key={i} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.72rem", color: g.type === "OWN_GOAL" ? "#ff4444" : g.type === "PENALTY" ? "#e8ff00" : "#777" }}>
              {g.type === "OWN_GOAL" ? "⚽ OG" : g.type === "PENALTY" ? "⚽ pen." : "⚽"} {g.scorer} {g.minute}'
            </span>
          ))}
        </div>
      )}
      {bookings.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {bookings.map((b, i) => (
            <span key={i} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.72rem", color: b.type === "RED_CARD" || b.type === "YELLOW_RED_CARD" ? "#ff4444" : "#bb8800" }}>
              {b.type === "RED_CARD" ? "🟥" : b.type === "YELLOW_RED_CARD" ? "🟨🟥" : "🟨"} {b.player} {b.minute}'
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDateDisplay(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

const TV_COLORS: Record<string, { bg: string; text: string }> = {
  BBC: { bg: "#cc0000", text: "#ffffff" },
  ITV: { bg: "#004998", text: "#ffffff" },
  TBC: { bg: "#333333", text: "#888888" },
};


function GdpBadge({ team, stats, align }: { team: string; stats: Record<string, any>; align?: "right" }) {
  const stat = stats[team];
  const gdp = stat?.gdp_growth;
  const funFact = stat?.funFact;
  if (!stat) return null;
  const positive = gdp == null ? null : gdp >= 0;
  return (
    <div style={{ textAlign: align === "right" ? "right" : "left", marginTop: "3px" }}>
      {gdp != null && (
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", color: positive ? "#39ff14" : "#ff4444" }}>
          GDP {positive ? "▲" : "▼"} {gdp > 0 ? "+" : ""}{gdp.toFixed(1)}%
        </div>
      )}
      {funFact && (
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.62rem", color: "#555", marginTop: "1px" }}>
          {funFact}
        </div>
      )}
    </div>
  );
}


function TodayHeader() {
  const [phase, setPhase] = useState<"idle" | "shimmer" | "dissolve" | "gone">("idle");
  const [, rerender] = useState(0);
  const tickRef = useRef(0);

  useEffect(() => {
    if (phase === "shimmer") {
      const tick = setInterval(() => { tickRef.current += 1; rerender(n => n + 1); }, 50);
      const next = setTimeout(() => { clearInterval(tick); setPhase("dissolve"); }, 1000);
      return () => { clearInterval(tick); clearTimeout(next); };
    }
    if (phase === "dissolve") {
      const next = setTimeout(() => setPhase("gone"), 600);
      return () => clearTimeout(next);
    }
  }, [phase]);

  const t = tickRef.current;
  const shimmerPos = `${((t * 5) % 220) - 60}%`;

  if (phase === "gone") return null;

  return (
    <div
      className="inline-block border-4 px-6 py-3 mb-2 cursor-default"
      onMouseEnter={() => { if (phase === "idle") setPhase("shimmer"); }}
      style={{
        borderColor: "#00ffff",
        fontFamily: "'VT323', monospace",
        fontSize: "1.2rem",
        transition: phase === "dissolve" ? "opacity 0.6s ease-out, filter 0.6s ease-out, max-height 0.6s ease-out, padding 0.6s ease-out" : "none",
        opacity: phase === "dissolve" ? 0 : 1,
        filter: phase === "dissolve" ? "blur(16px) brightness(4)" : "none",
        backgroundImage: phase === "shimmer"
          ? `linear-gradient(105deg, transparent ${shimmerPos}, rgba(255,255,255,0.9) calc(${shimmerPos} + 60px), transparent calc(${shimmerPos} + 120px))`
          : "none",
        backgroundClip: phase === "shimmer" ? "text" : undefined,
        WebkitBackgroundClip: phase === "shimmer" ? "text" : undefined,
        color: phase === "shimmer" ? "transparent" : "#00ffff",
        WebkitTextFillColor: phase === "shimmer" ? "transparent" : undefined,
      }}
    >
      ★ TODAY'S ACTION ★ WHO IS PLAYING WHO ★
    </div>
  );
}

export function TodayTab() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const allDates = [...new Set(FIXTURES.map((f) => f.date))].sort();
  const todayFixtures = FIXTURES.filter((f) => f.date === selectedDate);

  const nearestDate = allDates.reduce((prev, curr) => {
    const prevDiff = Math.abs(new Date(prev).getTime() - new Date(today).getTime());
    const currDiff = Math.abs(new Date(curr).getTime() - new Date(today).getTime());
    return currDiff < prevDiff ? curr : prev;
  }, allDates[0]);

  useEffect(() => {
    if (todayFixtures.length === 0 && nearestDate) {
      setSelectedDate(nearestDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { scores, lastFetched, fetching, apiError } = useLiveScores(selectedDate);
  const { matchMap } = useTournamentEvents();
  const allTeams = [...new Set(FIXTURES.flatMap(f => [f.home, f.away]))];
  const countryStats = getCountryStats(allTeams);

  const displayFixtures = FIXTURES.filter((f) => f.date === selectedDate).map((f) => {
    const liveKey = `${f.home}|${f.away}`;
    const live = scores[liveKey];
    // Try matchMap with both the fixture name and common aliases
    const homeResolved = ALIASES[f.home] ?? f.home;
    const awayResolved = ALIASES[f.away] ?? f.away;
    const historical = matchMap[`${homeResolved}|${awayResolved}`] ?? matchMap[`${f.home}|${f.away}`];

    const goals: Goal[] = historical?.goals ?? live?.goals ?? [];
    const bookings: Booking[] = historical?.bookings ?? live?.bookings ?? [];

    if (live) {
      const isFinished = live.status === "FINISHED";
      const isLive = ["IN_PLAY", "PAUSED", "HALF_TIME"].includes(live.status);
      const hasScore = (isLive || isFinished) && live.home !== null && live.away !== null;
      return {
        ...f,
        score: hasScore ? `${live.home} - ${live.away}` : isLive ? "? - ?" : f.score,
        winner: live.winner === "HOME_TEAM" ? f.home : live.winner === "AWAY_TEAM" ? f.away : live.winner === "DRAW" ? "DRAW" : undefined,
        liveStatus: isLive ? live.status : isFinished ? "FT" : null,
        goals,
        bookings,
      };
    }
    if (historical) {
      const w = historical.homeScore > historical.awayScore ? f.home : historical.awayScore > historical.homeScore ? f.away : "DRAW";
      return { ...f, score: f.score ?? `${historical.homeScore} - ${historical.awayScore}`, winner: f.winner ?? w, liveStatus: "FT", goals, bookings };
    }
    return { ...f, goals, bookings };
  });

  const currentIdx = allDates.indexOf(selectedDate);
  const prevDate = currentIdx > 0 ? allDates[currentIdx - 1] : null;
  const nextDate = currentIdx < allDates.length - 1 ? allDates[currentIdx + 1] : null;

  return (
    <div className="p-4 md:p-8">
      <div className="text-center mb-8">
        <TodayHeader />
        <div className="mt-2">
          {apiError ? (
            <span style={{ fontFamily: "'Share Tech Mono', monospace", color: "#ff4444", fontSize: "0.7rem" }}>
              {apiError}
            </span>
          ) : (
            <span style={{ fontFamily: "'Share Tech Mono', monospace", color: "#444", fontSize: "0.7rem" }}>
              {fetching ? "fetching scores..." : lastFetched ? `scores updated ${lastFetched}` : ""}
            </span>
          )}
        </div>
      </div>

      {/* Date navigator */}
      <div
        className="flex items-center justify-between mb-6 px-4 py-3"
        style={{ border: "3px solid #333", backgroundColor: "#111" }}
      >
        <button
          onClick={() => prevDate && setSelectedDate(prevDate)}
          disabled={!prevDate}
          style={{
            fontFamily: "'VT323', monospace",
            color: prevDate ? "#e8ff00" : "#333",
            fontSize: "1.2rem",
            background: "none",
            border: "none",
            cursor: prevDate ? "pointer" : "default",
          }}
        >
          ◀ PREV
        </button>

        <div className="text-center">
          <div style={{ fontFamily: "'Black Han Sans', sans-serif", color: "#ffffff", fontSize: "1.1rem" }}>
            {formatDateDisplay(selectedDate)}
          </div>
          {selectedDate === today && (
            <div
              className="inline-block px-2 py-0 mt-1"
              style={{ backgroundColor: "#39ff14", color: "#000", fontFamily: "'VT323', monospace", fontSize: "0.9rem" }}
            >
              ● TODAY
            </div>
          )}
        </div>

        <button
          onClick={() => nextDate && setSelectedDate(nextDate)}
          disabled={!nextDate}
          style={{
            fontFamily: "'VT323', monospace",
            color: nextDate ? "#e8ff00" : "#333",
            fontSize: "1.2rem",
            background: "none",
            border: "none",
            cursor: nextDate ? "pointer" : "default",
          }}
        >
          NEXT ▶
        </button>
      </div>

      {/* Fixtures */}
      {displayFixtures.length === 0 ? (
        <div
          className="text-center py-12"
          style={{ fontFamily: "'VT323', monospace", color: "#444", fontSize: "1.5rem", border: "2px dashed #222" }}
        >
          NO FIXTURES ON THIS DATE
          <br />
          <span style={{ color: "#333", fontSize: "1rem" }}>use the arrows to find match days</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {displayFixtures.map((fixture, idx) => {
            const homeOwner = resolveOwner(fixture.home);
            const awayOwner = resolveOwner(fixture.away);
            const isSweepstakeMatch = homeOwner || awayOwner;
            const tv = TV_COLORS[fixture.tv] ?? TV_COLORS.TBC;

            return (
              <div
                key={idx}
                style={{
                  border: isSweepstakeMatch
                    ? `3px solid ${homeOwner ? PLAYER_COLORS[homeOwner] : awayOwner ? PLAYER_COLORS[awayOwner!] : "#444"}`
                    : "2px solid #222",
                  backgroundColor: isSweepstakeMatch ? "#111" : "#0d0d0d",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Sweepstake badge */}
                {isSweepstakeMatch && (
                  <div
                    className="absolute top-0 left-0 px-3 py-1"
                    style={{
                      backgroundColor: "#e8ff00",
                      color: "#000",
                      fontFamily: "'VT323', monospace",
                      fontSize: "0.75rem",
                      letterSpacing: "0.05em",
                    }}
                  >
                    ⚡ SWEEPSTAKE MATCH
                  </div>
                )}

                <div className={`p-4 ${isSweepstakeMatch ? "pt-7" : ""}`}>
                  {/* Stage + time + TV */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span style={{ fontFamily: "'Share Tech Mono', monospace", color: "#555", fontSize: "0.75rem" }}>
                      {fixture.stage} · {fixture.time} BST{fixture.timeAEST && fixture.timeAEST !== "FT" ? ` · ${fixture.timeAEST} AEST` : ""}
                    </span>
                    {fixture.tv && (
                      <span
                        className="px-2 py-0"
                        style={{
                          backgroundColor: tv.bg,
                          color: tv.text,
                          fontFamily: "'Black Han Sans', sans-serif",
                          fontSize: "0.7rem",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {fixture.tv}
                      </span>
                    )}
                  </div>

                  {/* Match — fixed 3-col grid, never wraps */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "8px" }}>
                    {/* Home team */}
                    <div style={{ minWidth: 0 }}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{FLAGS[fixture.home] || "🏳"}</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{
                            fontFamily: "'Black Han Sans', sans-serif",
                            color: fixture.winner && fixture.winner !== fixture.home ? "#444" : homeOwner ? PLAYER_COLORS[homeOwner] : "#cccccc",
                            fontSize: "0.85rem",
                            lineHeight: 1.2,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}>
                            {fixture.home}{fixture.winner === fixture.home ? " ✓" : ""}
                          </div>
                          {homeOwner && (
                            <div style={{ fontFamily: "'Share Tech Mono', monospace", color: PLAYER_COLORS[homeOwner], fontSize: "0.62rem", opacity: 0.8, whiteSpace: "nowrap" }}>
                              → {homeOwner}
                            </div>
                          )}
                          <GdpBadge team={fixture.home} stats={countryStats} />
                        </div>
                      </div>
                    </div>

                    {/* VS / Score — fixed width centre column */}
                    <div style={{ fontFamily: "'VT323', monospace", textAlign: "center", lineHeight: 1, flexShrink: 0, minWidth: "70px" }}>
                      {(fixture as any).liveStatus && (fixture as any).liveStatus !== "FT" && (
                        <div style={{
                          fontSize: "0.7rem", letterSpacing: "0.1em", marginBottom: "2px",
                          color: "#39ff14", animation: "pulse 0.8s ease-in-out infinite",
                          fontFamily: "'Black Han Sans', sans-serif",
                          whiteSpace: "nowrap",
                        }}>
                          {(fixture as any).liveStatus === "HALF_TIME" ? "● HT" : "● LIVE"}
                        </div>
                      )}
                      <span style={{
                        fontSize: fixture.score ? "1.6rem" : "1.3rem",
                        color: (fixture as any).liveStatus && (fixture as any).liveStatus !== "FT" ? "#39ff14" : fixture.score ? "#ffffff" : "#e8ff00",
                        whiteSpace: "nowrap",
                      }}>
                        {fixture.score ?? fixture.time ?? "VS"}
                      </span>
                      {fixture.score && (fixture as any).liveStatus === "FT" && (
                        <div style={{ fontSize: "0.6rem", color: "#555", letterSpacing: "0.08em", marginTop: "2px" }}>
                          FT
                        </div>
                      )}
                      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.2} }`}</style>
                    </div>

                    {/* Away team */}
                    <div style={{ minWidth: 0, textAlign: "right" }}>
                      <div className="flex items-center gap-2 justify-end">
                        <div style={{ minWidth: 0 }}>
                          <div style={{
                            fontFamily: "'Black Han Sans', sans-serif",
                            color: fixture.winner && fixture.winner !== fixture.away ? "#444" : awayOwner ? PLAYER_COLORS[awayOwner] : "#cccccc",
                            fontSize: "0.85rem",
                            lineHeight: 1.2,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}>
                            {fixture.winner === fixture.away ? "✓ " : ""}{fixture.away}
                          </div>
                          {awayOwner && (
                            <div style={{ fontFamily: "'Share Tech Mono', monospace", color: PLAYER_COLORS[awayOwner], fontSize: "0.62rem", opacity: 0.8, whiteSpace: "nowrap" }}>
                              {awayOwner} ←
                            </div>
                          )}
                          <GdpBadge team={fixture.away} stats={countryStats} align="right" />
                        </div>
                        <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{FLAGS[fixture.away] || "🏳"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sweepstake narrative */}
                  {isSweepstakeMatch && (
                    <div
                      className="mt-3 px-3 py-2"
                      style={{ borderTop: "1px dashed #333", fontFamily: "'VT323', monospace", color: "#aaaaaa", fontSize: "1rem", lineHeight: 1.4 }}
                    >
                      {homeOwner && awayOwner && homeOwner !== awayOwner ? (
                        <><span style={{ color: PLAYER_COLORS[homeOwner] }}>{homeOwner}</span>{" "}vs{" "}<span style={{ color: PLAYER_COLORS[awayOwner] }}>{awayOwner}</span>{" "}— sweepstake beef. choose your side.</>
                      ) : homeOwner && awayOwner && homeOwner === awayOwner ? (
                        <>both teams belong to{" "}<span style={{ color: PLAYER_COLORS[homeOwner] }}>{homeOwner}</span>. absolute shambles either way.</>
                      ) : homeOwner ? (
                        <><span style={{ color: PLAYER_COLORS[homeOwner] }}>{homeOwner}</span>{" "}has a dog in this fight.</>
                      ) : awayOwner ? (
                        <><span style={{ color: PLAYER_COLORS[awayOwner!] }}>{awayOwner}</span>{" "}has a dog in this fight.</>
                      ) : null}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Date grid */}
      <div className="mt-8">
        <div className="px-4 py-2 mb-3" style={{ borderBottom: "2px solid #333", fontFamily: "'Share Tech Mono', monospace", color: "#555", fontSize: "0.8rem" }}>
          JUMP TO DATE
        </div>
        <div className="flex flex-wrap gap-2">
          {allDates.map((d) => {
            const hasMyTeams = FIXTURES.filter((f) => f.date === d).some((f) => resolveOwner(f.home) || resolveOwner(f.away));
            return (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.75rem",
                  padding: "4px 8px",
                  border: selectedDate === d ? "2px solid #e8ff00" : hasMyTeams ? "2px solid #39ff1444" : "2px solid #222",
                  backgroundColor: selectedDate === d ? "#e8ff00" : hasMyTeams ? "#39ff1411" : "transparent",
                  color: selectedDate === d ? "#000" : hasMyTeams ? "#39ff14" : "#444",
                  cursor: "pointer",
                }}
              >
                {d.slice(5)}{d === today && " •"}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
