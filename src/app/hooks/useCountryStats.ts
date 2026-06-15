export type CountryStat = {
  gdp_growth: number | null;
  capital: string | null;
  population: number | null;      // millions
  life_expectancy: number | null;
  area: number | null;            // km²
  funFact: string;
};
export type CountryStats = Record<string, CountryStat>;

const STATIC_DATA: CountryStats = {
  // POOCH
  Morocco:              { gdp_growth: 3.4,  capital: "Rabat",           population: 37.5,  life_expectancy: 74,  area: 446550,    funFact: "Capital: Rabat" },
  Turkey:               { gdp_growth: 4.5,  capital: "Ankara",          population: 85.3,  life_expectancy: 78,  area: 783562,    funFact: "Capital: Ankara" },
  Austria:              { gdp_growth: 0.3,  capital: "Vienna",          population: 9.1,   life_expectancy: 82,  area: 83871,     funFact: "Capital: Vienna" },
  "Cape Verde Islands": { gdp_growth: 4.2,  capital: "Praia",           population: 0.6,   life_expectancy: 73,  area: 4033,      funFact: "Capital: Praia" },
  "New Zealand":        { gdp_growth: 0.6,  capital: "Wellington",      population: 5.1,   life_expectancy: 82,  area: 270467,    funFact: "Capital: Wellington" },
  Egypt:                { gdp_growth: 3.8,  capital: "Cairo",           population: 105.0, life_expectancy: 72,  area: 1001449,   funFact: "Capital: Cairo" },
  Iraq:                 { gdp_growth: 3.2,  capital: "Baghdad",         population: 42.2,  life_expectancy: 70,  area: 438317,    funFact: "Capital: Baghdad" },
  Spain:                { gdp_growth: 2.5,  capital: "Madrid",          population: 47.4,  life_expectancy: 83,  area: 505990,    funFact: "Capital: Madrid" },
  // WIGGLES
  Croatia:              { gdp_growth: 2.8,  capital: "Zagreb",          population: 3.9,   life_expectancy: 78,  area: 56594,     funFact: "Capital: Zagreb" },
  "Curaçao":            { gdp_growth: 2.1,  capital: "Willemstad",      population: 0.19,  life_expectancy: 78,  area: 444,       funFact: "Capital: Willemstad" },
  Australia:            { gdp_growth: 1.5,  capital: "Canberra",        population: 26.5,  life_expectancy: 83,  area: 7692024,   funFact: "Capital: Canberra" },
  Uzbekistan:           { gdp_growth: 6.3,  capital: "Tashkent",        population: 36.0,  life_expectancy: 72,  area: 448978,    funFact: "Capital: Tashkent" },
  Japan:                { gdp_growth: 1.9,  capital: "Tokyo",           population: 124.5, life_expectancy: 84,  area: 377915,    funFact: "Capital: Tokyo" },
  Netherlands:          { gdp_growth: 0.6,  capital: "Amsterdam",       population: 17.9,  life_expectancy: 82,  area: 41543,     funFact: "Capital: Amsterdam" },
  "Czech Republic":     { gdp_growth: 0.9,  capital: "Prague",          population: 10.9,  life_expectancy: 79,  area: 78866,     funFact: "Capital: Prague" },
  Scotland:             { gdp_growth: 0.4,  capital: "Edinburgh",       population: 5.5,   life_expectancy: 79,  area: 77933,     funFact: "Capital: Edinburgh" },
  // CHONKIE BOO
  Argentina:            { gdp_growth: 5.0,  capital: "Buenos Aires",    population: 46.2,  life_expectancy: 77,  area: 2780400,   funFact: "Capital: Buenos Aires" },
  Ghana:                { gdp_growth: 2.9,  capital: "Accra",           population: 33.5,  life_expectancy: 64,  area: 238533,    funFact: "Capital: Accra" },
  Switzerland:          { gdp_growth: 1.3,  capital: "Bern",            population: 8.7,   life_expectancy: 84,  area: 41285,     funFact: "Capital: Bern" },
  Ecuador:              { gdp_growth: 2.4,  capital: "Quito",           population: 18.0,  life_expectancy: 77,  area: 283561,    funFact: "Capital: Quito" },
  "Korea Republic":     { gdp_growth: 2.3,  capital: "Seoul",           population: 51.7,  life_expectancy: 83,  area: 100210,    funFact: "Capital: Seoul" },
  Tunisia:              { gdp_growth: 1.6,  capital: "Tunis",           population: 12.0,  life_expectancy: 76,  area: 163610,    funFact: "Capital: Tunis" },
  Panama:               { gdp_growth: 4.8,  capital: "Panama City",     population: 4.4,   life_expectancy: 79,  area: 75417,     funFact: "Capital: Panama City" },
  Sweden:               { gdp_growth: 0.5,  capital: "Stockholm",       population: 10.5,  life_expectancy: 83,  area: 450295,    funFact: "Capital: Stockholm" },
  // MEDLEY
  Jordan:               { gdp_growth: 2.6,  capital: "Amman",           population: 10.3,  life_expectancy: 75,  area: 89342,     funFact: "Capital: Amman" },
  "South Africa":       { gdp_growth: 0.6,  capital: "Pretoria",        population: 60.4,  life_expectancy: 64,  area: 1219090,   funFact: "Capital: Pretoria" },
  Portugal:             { gdp_growth: 2.3,  capital: "Lisbon",          population: 10.3,  life_expectancy: 82,  area: 92212,     funFact: "Capital: Lisbon" },
  Haiti:                { gdp_growth: -1.9, capital: "Port-au-Prince",  population: 11.7,  life_expectancy: 64,  area: 27750,     funFact: "Capital: Port-au-Prince" },
  "Bosnia & Herzegovina":{ gdp_growth: 2.7, capital: "Sarajevo",        population: 3.2,   life_expectancy: 77,  area: 51197,     funFact: "Capital: Sarajevo" },
  Belgium:              { gdp_growth: 1.4,  capital: "Brussels",        population: 11.6,  life_expectancy: 82,  area: 30528,     funFact: "Capital: Brussels" },
  Senegal:              { gdp_growth: 7.1,  capital: "Dakar",           population: 17.8,  life_expectancy: 68,  area: 196722,    funFact: "Capital: Dakar" },
  Mexico:               { gdp_growth: 1.5,  capital: "Mexico City",     population: 130.0, life_expectancy: 75,  area: 1964375,   funFact: "Capital: Mexico City" },
  // TINY CANS
  "Saudi Arabia":       { gdp_growth: 0.8,  capital: "Riyadh",          population: 36.4,  life_expectancy: 76,  area: 2149690,   funFact: "Capital: Riyadh" },
  Algeria:              { gdp_growth: 3.8,  capital: "Algiers",         population: 45.6,  life_expectancy: 77,  area: 2381741,   funFact: "Capital: Algiers" },
  Brazil:               { gdp_growth: 2.9,  capital: "Brasília",        population: 215.3, life_expectancy: 75,  area: 8515767,   funFact: "Capital: Brasília" },
  Uruguay:              { gdp_growth: 3.1,  capital: "Montevideo",      population: 3.5,   life_expectancy: 78,  area: 176215,    funFact: "Capital: Montevideo" },
  England:              { gdp_growth: 0.9,  capital: "London",          population: 57.1,  life_expectancy: 81,  area: 130279,    funFact: "Capital: London" },
  Norway:               { gdp_growth: 0.5,  capital: "Oslo",            population: 5.4,   life_expectancy: 83,  area: 385207,    funFact: "Capital: Oslo" },
  France:               { gdp_growth: 1.1,  capital: "Paris",           population: 68.0,  life_expectancy: 82,  area: 551695,    funFact: "Capital: Paris" },
  "United States":      { gdp_growth: 2.5,  capital: "Washington D.C.", population: 335.0, life_expectancy: 79,  area: 9372610,   funFact: "Capital: Washington D.C." },
  // BURGER
  "Congo DR":           { gdp_growth: 6.2,  capital: "Kinshasa",        population: 102.0, life_expectancy: 61,  area: 2344858,   funFact: "Capital: Kinshasa" },
  Paraguay:             { gdp_growth: 4.5,  capital: "Asunción",        population: 7.4,   life_expectancy: 74,  area: 406752,    funFact: "Capital: Asunción" },
  Germany:              { gdp_growth: -0.3, capital: "Berlin",          population: 84.4,  life_expectancy: 81,  area: 357114,    funFact: "Capital: Berlin" },
  Canada:               { gdp_growth: 1.1,  capital: "Ottawa",          population: 38.2,  life_expectancy: 82,  area: 9984670,   funFact: "Capital: Ottawa" },
  Iran:                 { gdp_growth: 4.5,  capital: "Tehran",          population: 88.0,  life_expectancy: 76,  area: 1648195,   funFact: "Capital: Tehran" },
  Colombia:             { gdp_growth: 1.7,  capital: "Bogotá",          population: 51.9,  life_expectancy: 77,  area: 1141748,   funFact: "Capital: Bogotá" },
  "Côte d'Ivoire":      { gdp_growth: 6.5,  capital: "Yamoussoukro",    population: 27.5,  life_expectancy: 59,  area: 322463,    funFact: "Capital: Yamoussoukro" },
  Qatar:                { gdp_growth: 2.4,  capital: "Doha",            population: 2.9,   life_expectancy: 80,  area: 11586,     funFact: "Capital: Doha" },
  // Fixture display aliases
  USA:                  { gdp_growth: 2.5,  capital: "Washington D.C.", population: 335.0, life_expectancy: 79,  area: 9372610,   funFact: "Capital: Washington D.C." },
  "Ivory Coast":        { gdp_growth: 6.5,  capital: "Yamoussoukro",    population: 27.5,  life_expectancy: 59,  area: 322463,    funFact: "Capital: Yamoussoukro" },
  "DR Congo":           { gdp_growth: 6.2,  capital: "Kinshasa",        population: 102.0, life_expectancy: 61,  area: 2344858,   funFact: "Capital: Kinshasa" },
  "Cape Verde":         { gdp_growth: 4.2,  capital: "Praia",           population: 0.6,   life_expectancy: 73,  area: 4033,      funFact: "Capital: Praia" },
  "Bosnia-Herzegovina": { gdp_growth: 2.7,  capital: "Sarajevo",        population: 3.2,   life_expectancy: 77,  area: 51197,     funFact: "Capital: Sarajevo" },
  Curacao:              { gdp_growth: 2.1,  capital: "Willemstad",      population: 0.19,  life_expectancy: 78,  area: 444,       funFact: "Capital: Willemstad" },
  "South Korea":        { gdp_growth: 2.3,  capital: "Seoul",           population: 51.7,  life_expectancy: 83,  area: 100210,    funFact: "Capital: Seoul" },
};

export function getCountryStats(teams: string[]): CountryStats {
  const result: CountryStats = {};
  for (const t of teams) {
    if (STATIC_DATA[t]) result[t] = STATIC_DATA[t];
  }
  return result;
}

export function getMatchStat(home: string, away: string): string {
  const h = STATIC_DATA[home];
  const a = STATIC_DATA[away];

  // Pick a stat type deterministically based on team names
  const hash = (home + away).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const pick = hash % 5;

  if (pick === 0 && h?.gdp_growth != null && a?.gdp_growth != null) {
    const faster = h.gdp_growth > a.gdp_growth ? home : away;
    const diff = Math.abs(h.gdp_growth - a.gdp_growth).toFixed(1);
    return `${faster} growing ${diff}% faster — on the pitch and off it.`;
  }
  if (pick === 1 && h?.population != null && a?.population != null) {
    const bigger = h.population > a.population ? home : away;
    const ratio = Math.max(h.population, a.population) / Math.min(h.population, a.population);
    return `${bigger} has ${ratio.toFixed(0)}x the population. numbers mean nothing here.`;
  }
  if (pick === 2 && h?.life_expectancy != null && a?.life_expectancy != null) {
    const longer = h.life_expectancy > a.life_expectancy ? home : away;
    const diff = Math.abs(h.life_expectancy - a.life_expectancy);
    return `People in ${longer} live ${diff} years longer on average. irrelevant but notable.`;
  }
  if (pick === 3 && h?.area != null && a?.area != null) {
    const bigger = h.area > a.area ? home : away;
    const ratio = Math.max(h.area, a.area) / Math.min(h.area, a.area);
    return `${bigger} is ${ratio.toFixed(0)}x larger by land mass. doesn't help on the pitch.`;
  }
  if (pick === 4 && h?.gdp_growth != null) {
    return `${home} GDP: ${h.gdp_growth > 0 ? "+" : ""}${h.gdp_growth.toFixed(1)}% growth. pressure's on.`;
  }
  // Fallback
  if (h?.capital && a?.capital) {
    return `${h.capital} vs ${a.capital}. two capitals, one winner.`;
  }
  return "sweepstake beef. choose your side.";
}
