export const API_KEY = "67319518ef034ba48822a8cf6d610858";
export const API_HEADERS = { "X-Auth-Token": API_KEY };

export const PLAYER_TEAMS: Record<string, string[]> = {
  POOCH: ["Morocco", "Turkey", "Austria", "Cape Verde Islands", "New Zealand", "Egypt", "Iraq", "Spain"],
  WIGGLES: ["Croatia", "Curaçao", "Australia", "Uzbekistan", "Japan", "Netherlands", "Czech Republic", "Scotland"],
  "CHONKIE BOO": ["Argentina", "Ghana", "Switzerland", "Ecuador", "Korea Republic", "Tunisia", "Panama", "Sweden"],
  MEDLEY: ["Jordan", "South Africa", "Portugal", "Haiti", "Bosnia & Herzegovina", "Belgium", "Senegal", "Mexico"],
  "TINY CANS": ["Saudi Arabia", "Algeria", "Brazil", "Uruguay", "England", "Norway", "France", "United States"],
  BURGER: ["Congo DR", "Paraguay", "Germany", "Canada", "Iran", "Colombia", "Côte d'Ivoire", "Qatar"],
};

export const PLAYER_COLORS: Record<string, string> = {
  POOCH: "#ff00ff",
  WIGGLES: "#00ffff",
  "CHONKIE BOO": "#39ff14",
  MEDLEY: "#e8ff00",
  "TINY CANS": "#ff6600",
  BURGER: "#ff0088",
};

// API team names → sweepstake team names
export const TEAM_ALIASES: Record<string, string> = {
  "Korea Republic": "Korea Republic",
  "Côte d'Ivoire": "Côte d'Ivoire",
  "Ivory Coast": "Côte d'Ivoire",
  "Congo DR": "Congo DR",
  "DR Congo": "Congo DR",
  "Cape Verde": "Cape Verde Islands",
  "Bosnia & Herzegovina": "Bosnia & Herzegovina",
  "Bosnia-Herzegovina": "Bosnia & Herzegovina",
  "Curaçao": "Curaçao",
  "Curacao": "Curaçao",
  "United States": "United States",
  "USA": "United States",
  "South Korea": "Korea Republic",
};

export function normaliseTeam(name: string): string {
  return TEAM_ALIASES[name] ?? name;
}

// Add teams here as they get knocked out
export const ELIMINATED_TEAMS = new Set<string>([
  "Czech Republic",   // Group A
  "Korea Republic",   // Group A
  "Qatar",            // Group B
  "Haiti",            // Group C
  "Scotland",         // Group C
  "Turkey",           // Group D
  "Curaçao",          // Group E
  "Tunisia",          // Group F
  "New Zealand",      // Group G
  "Uruguay",          // Group H
  "Saudi Arabia",     // Group H
  "Iraq",             // Group I
  // Round of 32
  "South Africa",     // lost to Canada
  "Japan",            // lost to Brazil
  "Germany",          // lost to Paraguay (pens)
  "Netherlands",      // lost to Morocco (pens)
  "Côte d'Ivoire",    // lost to Norway
  "Sweden",           // lost to France
  "Ecuador",          // lost to Mexico
]);

export function isEliminated(team: string): boolean {
  return ELIMINATED_TEAMS.has(normaliseTeam(team));
}

export function getOwner(team: string): string | null {
  const resolved = normaliseTeam(team);
  for (const [player, teams] of Object.entries(PLAYER_TEAMS)) {
    if (teams.includes(resolved)) return player;
  }
  return null;
}
