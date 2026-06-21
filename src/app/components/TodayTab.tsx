import { useState, useEffect, useCallback, useRef } from "react";
import { PLAYER_COLORS, getOwner } from "../lib/sweepstake";
import { useTournamentEvents } from "../hooks/useTournamentEvents";
import squirrelImg from "../../imports/squirrel.png";
import robotSquirrelImg from "../../imports/robot-squirrel.png";
import FORECASTS from "../data/forecasts.json";
import ORIGINAL_FORECASTS from "../data/original-forecasts.json";

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

const FRUIT_MEDLEYS = [
  "mango & passionfruit", "strawberry & kiwi", "watermelon & lime",
  "peach & raspberry", "pineapple & coconut", "cherry & pomegranate",
  "lychee & dragon fruit", "apricot & blueberry", "fig & blood orange",
  "papaya & guava", "plum & blackcurrant", "melon & mint",
];
const DOG_BREEDS = [
  "labradoodle", "shih tzu", "border collie", "bichon frise",
  "dachshund", "golden retriever", "french bulldog", "whippet",
  "pomeranian", "basset hound", "cocker spaniel", "dalmatian",
];
function fixtureHash(home: string, away: string): number {
  let h = 0;
  for (const c of home + away) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return h;
}

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
  { date: "2026-06-19", home: "Mexico", away: "South Korea", time: "2:00am", timeAEST: "11:00am", stage: "Group A", tv: "BBC" },
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
  clock: string | null;
  winner: string | null;
  goals: Goal[];
  bookings: Booking[];
  venue: string | null;
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

        const homeTeamId: string = homeComp?.team?.id ?? "";
        const goals: Goal[] = (comp?.details ?? [])
          .filter((d: any) => d.scoringPlay)
          .map((d: any) => ({
            minute: Math.floor((d.clock?.value ?? 0) / 60),
            type: d.ownGoal ? "OWN_GOAL" : d.penaltyKick ? "PENALTY" : "REGULAR",
            scorer: d.athletesInvolved?.[0]?.shortName ?? d.athletesInvolved?.[0]?.displayName ?? "Unknown",
            team: d.ownGoal ? (d.team?.id === homeTeamId ? away : home) : (d.team?.id === homeTeamId ? home : away),
          }));

        updated[key] = {
          home: homeScore,
          away: awayScore,
          status: isLive ? "IN_PLAY" : isHalfTime ? "HALF_TIME" : isFinished ? "FINISHED" : statusName,
          clock: (isLive || isHalfTime) ? (event.status?.displayClock ?? null) : null,
          winner,
          goals,
          bookings: [],
          venue: comp?.venue?.fullName ?? null,
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

function GoalList({ goals, align }: { goals: Goal[]; align: "left" | "right" }) {
  if (goals.length === 0) return <div style={{ flex: 1 }} />;

  // Group consecutive entries by scorer+type, combine minutes
  const grouped: { scorer: string; type: Goal["type"]; minutes: number[] }[] = [];
  for (const g of goals) {
    const last = grouped[grouped.length - 1];
    if (last && last.scorer === g.scorer && last.type === g.type) {
      last.minutes.push(g.minute);
    } else {
      grouped.push({ scorer: g.scorer, type: g.type, minutes: [g.minute] });
    }
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px", alignItems: align === "right" ? "flex-end" : "flex-start" }}>
      {grouped.map((g, i) => {
        const mins = g.minutes.map(m => `${m}'`).join(", ");
        const icon = g.type === "OWN_GOAL" ? "⚽ OG" : g.type === "PENALTY" ? "⚽ pen." : "⚽";
        const color = g.type === "OWN_GOAL" ? "#ff4444" : g.type === "PENALTY" ? "#e8ff00" : "#777";
        return (
          <span key={i} style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.72rem", color, textAlign: align }}>
            {align === "left"
              ? <>{icon} {g.scorer} {mins}</>
              : <>{mins} {g.scorer} {icon}</>
            }
          </span>
        );
      })}
    </div>
  );
}

function MatchEventSummary({ goals, bookings, isFinished, home, away }: { goals: Goal[]; bookings: Booking[]; isFinished: boolean; home: string; away: string }) {
  const hasEvents = goals.length > 0 || bookings.length > 0;
  if (!isFinished && !hasEvents) return null;
  // Own goals are stored under the scorer's team but should display under the benefiting team
  const homeGoals = goals.filter(g => g.type === "OWN_GOAL" ? g.team === away : g.team === home);
  const awayGoals = goals.filter(g => g.type === "OWN_GOAL" ? g.team === home : g.team === away);
  return (
    <div className="mt-3 pt-2" style={{ borderTop: "1px dashed #2a2a2a" }}>
      {isFinished && !hasEvents && (
        <span style={{ fontFamily: "'Share Tech Mono', monospace", color: "#333", fontSize: "0.7rem" }}>
          loading match events...
        </span>
      )}
      {goals.length > 0 && (
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
          <GoalList goals={homeGoals} align="left" />
          <div style={{ flexShrink: 0, width: "70px" }} />
          <GoalList goals={awayGoals} align="right" />
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

  if (phase === "gone") return (
    <img
      src={squirrelImg}
      alt="Alan Jackson"
      style={{
        width: "90px",
        display: "inline-block",
        marginBottom: "8px",
        animation: "alanAppear 0.4s cubic-bezier(0.2,1.6,0.6,1) forwards",
      }}
    />
  );

  return (
    <>
      <style>{`@keyframes alanAppear { from { opacity:0; transform: scale(0.2) rotate(-20deg); } to { opacity:1; transform: scale(1) rotate(0deg); } }`}</style>
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
    </>
  );
}

function SpinningSquirrel() {
  const [spun, setSpun] = useState(false);
  const [spinning, setSpinning] = useState(false);

  function handleHover() {
    if (spinning || spun) return;
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      setSpun(true);
    }, 600);
  }

  return (
    <>
      <style>{`
        @keyframes squirrelSpin {
          0%   { transform: scaleX(-1) rotate(0deg); }
          100% { transform: scaleX(-1) rotate(1080deg); }
        }
      `}</style>
      <img
        src={squirrelImg}
        alt="Alan Jackson"
        onMouseEnter={handleHover}
        style={{
          position: "absolute",
          top: "-52px",
          right: "12px",
          width: "70px",
          zIndex: 5,
          cursor: "pointer",
          transformOrigin: "center center",
          transform: spun
            ? "scaleX(-1) rotate(180deg)"
            : "scaleX(-1) rotate(0deg)",
          animation: spinning ? "squirrelSpin 0.6s cubic-bezier(0.2, 0, 0.8, 1) forwards" : "none",
          transition: spinning ? "none" : "none",
        }}
      />
    </>
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
        liveClock: live.clock ?? null,
        venue: live.venue ?? null,
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
            const showSquirrel = idx % 4 === 2;

            return (
              <div
                key={idx}
                style={{
                  border: isSweepstakeMatch
                    ? `3px solid ${homeOwner ? PLAYER_COLORS[homeOwner] : awayOwner ? PLAYER_COLORS[awayOwner!] : "#444"}`
                    : "2px solid #222",
                  backgroundColor: isSweepstakeMatch ? "#111" : "#0d0d0d",
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {/* Squirrel perching */}
                {showSquirrel && <SpinningSquirrel />}
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
                      <span className="score-flicker" style={{
                        fontSize: fixture.score ? "1.6rem" : "1.3rem",
                        color: (fixture as any).liveStatus && (fixture as any).liveStatus !== "FT" ? "#39ff14" : fixture.score ? "#ffffff" : "#e8ff00",
                        whiteSpace: "nowrap",
                        cursor: "default",
                      }}>
                        {fixture.score ?? fixture.time ?? "VS"}
                      </span>
                      {(fixture as any).liveStatus && (fixture as any).liveStatus !== "FT" && (fixture as any).liveClock && (
                        <div style={{ fontSize: "0.65rem", color: "#39ff14", letterSpacing: "0.05em", marginTop: "2px", fontFamily: "'Black Han Sans', sans-serif" }}>
                          {(fixture as any).liveClock}
                        </div>
                      )}
                      {fixture.score && (fixture as any).liveStatus === "FT" && (
                        <div style={{ fontSize: "0.6rem", color: "#555", letterSpacing: "0.08em", marginTop: "2px" }}>
                          FT
                        </div>
                      )}
                      {(fixture as any).venue && (
                        <div style={{ fontSize: "0.6rem", color: "#444", letterSpacing: "0.04em", marginTop: "4px", fontFamily: "'Share Tech Mono', monospace", whiteSpace: "nowrap" }}>
                          {(fixture as any).venue}
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
                        </div>
                        <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{FLAGS[fixture.away] || "🏳"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Goal scorers */}
                  <MatchEventSummary
                    goals={(fixture as any).goals ?? []}
                    bookings={(fixture as any).bookings ?? []}
                    isFinished={(fixture as any).liveStatus === "FT"}
                    home={fixture.home}
                    away={fixture.away}
                  />

                  {/* AI forecast — group stage only */}
                  {fixture.stage.startsWith("Group") && (() => {
                    const key = `${fixture.home} vs ${fixture.away}` as keyof typeof FORECASTS;
                    const fc = FORECASTS[key] as any;
                    if (!fc) return null;

                    const isFinished = fixture.score && ((fixture as any).liveStatus === "FT" || fixture.time === "FT");

                    if (!isFinished) {
                      return (
                        <div
                          className="mt-3 px-3 py-2"
                          style={{ borderTop: "1px dashed #222", display: "flex", alignItems: "center", gap: "10px" }}
                        >
                          <img src={robotSquirrelImg} alt="robot squirrel" style={{ width: "28px", height: "28px", objectFit: "cover", flexShrink: 0, borderRadius: "2px" }} />
                          <span style={{ fontFamily: "'Share Tech Mono', monospace", color: "#666", fontSize: "0.75rem", lineHeight: 1.4 }}>
                            {fc.prediction}
                            <span style={{ color: "#e8ff00", marginLeft: "8px", fontFamily: "'VT323', monospace", fontSize: "1rem" }}>{fc.score}</span>
                            <span style={{ color: fc.confidence >= 80 ? "#39ff14" : fc.confidence >= 65 ? "#e8ff00" : "#ff6b35", marginLeft: "8px", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem" }}>{fc.confidence}%</span>
                          </span>
                        </div>
                      );
                    }

                    // Use original locked predictions for verdict, not the regenerated ones
                    const origKey = key as keyof typeof ORIGINAL_FORECASTS;
                    const orig = (ORIGINAL_FORECASTS[origKey] ?? fc) as any;

                    // Determine actual result
                    const actualResult = fixture.winner === fixture.home ? "HOME" : fixture.winner === fixture.away ? "AWAY" : "DRAW";
                    const gotResultRight = orig.result === actualResult;
                    const gotScoreRight = orig.score === fixture.score;

                    // Pick from a pool deterministically so each match gets a unique quip
                    const pick = (arr: string[]) => arr[fixtureHash(fixture.home, fixture.away) % arr.length];

                    const verdict = (() => {
                      if (gotScoreRight) {
                        const text = pick([
                          `Nailed it. ${fixture.score}. Don't ever doubt me.`,
                          `Get in. Called it exactly. I'll have the buffalo wings, cheers.`,
                          `${fixture.score}. Told you. I don't just make this stuff up, boi.`,
                          `Spot on. You're welcome. Someone write that down.`,
                          `${fixture.score}. Bang on the money. I'm wasted doing this for free.`,
                        ]);
                        return { text, color: "#39ff14", label: "✓ CORRECT" };
                      }
                      if (gotResultRight) {
                        const text = pick([
                          `Got the right winner, wrong score. I'll take it.`,
                          `Winner right, scoreline was pure guesswork if I'm honest.`,
                          `Direction right, numbers wrong. Close enough for a robot squirrel.`,
                          `Predicted ${orig.score}, got ${fixture.score}. Near enough, boi.`,
                          `Right team, wrong margin. My confidence was clearly doing overtime.`,
                          `Called the winner at least. The actual score was a bit of a spanner situation.`,
                        ]);
                        return { text, color: "#e8ff00", label: "~ CLOSE" };
                      }
                      // Wrong result
                      const awayGoals = parseInt(fixture.score?.split(" - ")[1] ?? "0");
                      const homeGoals = parseInt(fixture.score?.split(" - ")[0] ?? "0");
                      if (actualResult === "DRAW") {
                        const text = pick([
                          `${fixture.home} and ${fixture.away} both bottled it. Absolute dinlows the pair of them.`,
                          `A draw. Neither side wanted to win apparently.`,
                          `Didn't have that down as a draw. Both teams played like cold chicken nuggets look.`,
                          `They cancelled each other out. I'm as surprised as you are.`,
                          `Neither side could be bothered. Disappointing from both of them.`,
                        ]);
                        return { text, color: "#ff6b35", label: "✗ WRONG" };
                      }
                      if (actualResult === "AWAY") {
                        const text = pick([
                          `${fixture.home} were proper plonkers. Didn't see ${fixture.away} doing that.`,
                          `${fixture.away} turned up. ${fixture.home} very much did not.`,
                          `My bad. ${fixture.home} played like they'd had one too many at the Hooters bar.`,
                          `${fixture.away} had other ideas. Fair play to them.`,
                          `${fixture.home} were an absolute spanner in their own box all game.`,
                          `Didn't see that coming. ${fixture.away} were quality, ${fixture.home} were melon-level bad.`,
                        ]);
                        return { text, color: "#ff6b35", label: "✗ WRONG" };
                      }
                      // Predicted away or draw, home won
                      const text = pick([
                        `${fixture.home} proved me wrong. Fair play to them.`,
                        `${fixture.away} were the doorknobs here, not ${fixture.home}. Got that the wrong way round.`,
                        `${homeGoals > 3 ? `${fixture.home} absolutely battered them. Didn't see that coming.` : `${fixture.home} dug it out. I underestimated them.`}`,
                        `My bad. ${fixture.away} were utter turnips and I wasn't ready for it.`,
                        `${fixture.home} were brilliant. ${fixture.away} were a disgrace. Wrong call from me.`,
                      ]);
                      return { text, color: "#ff6b35", label: "✗ WRONG" };
                    })();

                    return (
                      <div
                        className="mt-3 px-3 py-2"
                        style={{ borderTop: "1px dashed #222", display: "flex", alignItems: "flex-start", gap: "10px" }}
                      >
                        <img src={robotSquirrelImg} alt="robot squirrel" style={{ width: "28px", height: "28px", objectFit: "cover", flexShrink: 0, borderRadius: "2px", marginTop: "2px" }} />
                        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.75rem", lineHeight: 1.5 }}>
                          <span style={{ color: verdict.color, fontSize: "0.65rem", letterSpacing: "0.08em", marginRight: "8px" }}>{verdict.label}</span>
                          <span style={{ color: "#444", fontSize: "0.65rem" }}>predicted {orig.score}</span>
                          <br />
                          <span style={{ color: "#666" }}>{verdict.text}</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Sweepstake narrative */}
                  {isSweepstakeMatch && (
                    <div
                      className="mt-3 px-3 py-2"
                      style={{ borderTop: "1px dashed #333", fontFamily: "'VT323', monospace", color: "#aaaaaa", fontSize: "1rem", lineHeight: 1.4 }}
                    >
                      {homeOwner && awayOwner && homeOwner !== awayOwner ? (() => {
                        const isMedleyVsPooch = new Set([homeOwner, awayOwner]).has("MEDLEY") && new Set([homeOwner, awayOwner]).has("POOCH");
                        if (isMedleyVsPooch) {
                          const h = fixtureHash(fixture.home, fixture.away);
                          const fruit = FRUIT_MEDLEYS[h % FRUIT_MEDLEYS.length];
                          const breed = DOG_BREEDS[h % DOG_BREEDS.length];
                          return (
                            <>
                              <span style={{ color: PLAYER_COLORS["MEDLEY"] }}>{fruit} medley</span>
                              {" "}vs{" "}
                              <span style={{ color: PLAYER_COLORS["POOCH"] }}>{breed}</span>
                              {" "}— sweepstake beef. choose your side.
                            </>
                          );
                        }
                        return <><span style={{ color: PLAYER_COLORS[homeOwner] }}>{homeOwner}</span>{" "}vs{" "}<span style={{ color: PLAYER_COLORS[awayOwner] }}>{awayOwner}</span>{" "}— sweepstake beef. choose your side.</>;
                      })() : homeOwner && awayOwner && homeOwner === awayOwner ? (
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
