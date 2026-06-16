const FLAGS: Record<string, string> = {
  Morocco: "🇲🇦", Turkey: "🇹🇷", Austria: "🇦🇹", "Cape Verde": "🇨🇻",
  "New Zealand": "🇳🇿", Egypt: "🇪🇬", Iraq: "🇮🇶", Spain: "🇪🇸",
  Croatia: "🇭🇷", Curacao: "🇨🇼", Australia: "🇦🇺", Uzbekistan: "🇺🇿",
  Japan: "🇯🇵", Netherlands: "🇳🇱", "Czech Republic": "🇨🇿", Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  Argentina: "🇦🇷", Ghana: "🇬🇭", Switzerland: "🇨🇭", Ecuador: "🇪🇨",
  "South Korea": "🇰🇷", Tunisia: "🇹🇳", Panama: "🇵🇦", Sweden: "🇸🇪",
  Jordan: "🇯🇴", "South Africa": "🇿🇦", Portugal: "🇵🇹", Haiti: "🇭🇹",
  "Bosnia-Herzegovina": "🇧🇦", Belgium: "🇧🇪", Senegal: "🇸🇳", Mexico: "🇲🇽",
  "Saudi Arabia": "🇸🇦", Algeria: "🇩🇿", Brazil: "🇧🇷", Uruguay: "🇺🇾",
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Norway: "🇳🇴", France: "🇫🇷", USA: "🇺🇸",
  "DR Congo": "🇨🇩", Paraguay: "🇵🇾", Germany: "🇩🇪",
  Canada: "🇨🇦", Iran: "🇮🇷", Colombia: "🇨🇴", "Ivory Coast": "🇨🇮", Qatar: "🇶🇦",
};

type Fixture = {
  date: string; home: string; away: string; time: string; timeAEST: string;
  stage: string; tv: string; score?: string; winner?: string;
};

const FIXTURES: Fixture[] = [
  { date: "2026-06-11", home: "Mexico", away: "South Africa", time: "FT", timeAEST: "FT", stage: "Group A", tv: "", score: "2 - 0", winner: "Mexico" },
  { date: "2026-06-12", home: "South Korea", away: "Czech Republic", time: "FT", timeAEST: "FT", stage: "Group A", tv: "", score: "2 - 1", winner: "South Korea" },
  { date: "2026-06-12", home: "Canada", away: "Bosnia-Herzegovina", time: "FT", timeAEST: "FT", stage: "Group B", tv: "BBC", score: "1 - 1", winner: "DRAW" },
  { date: "2026-06-13", home: "USA", away: "Paraguay", time: "FT", timeAEST: "FT", stage: "Group D", tv: "BBC", score: "4 - 1", winner: "USA" },
  { date: "2026-06-13", home: "Qatar", away: "Switzerland", time: "FT", timeAEST: "FT", stage: "Group B", tv: "ITV", score: "1 - 1", winner: "DRAW" },
  { date: "2026-06-13", home: "Brazil", away: "Morocco", time: "FT", timeAEST: "FT", stage: "Group C", tv: "BBC", score: "1 - 1", winner: "DRAW" },
  { date: "2026-06-14", home: "Haiti", away: "Scotland", time: "FT", timeAEST: "FT", stage: "Group C", tv: "BBC", score: "0 - 1", winner: "Scotland" },
  { date: "2026-06-14", home: "Australia", away: "Turkey", time: "FT", timeAEST: "FT", stage: "Group D", tv: "ITV", score: "2 - 0", winner: "Australia" },
  { date: "2026-06-14", home: "Germany", away: "Curacao", time: "FT", timeAEST: "FT", stage: "Group E", tv: "ITV", score: "7 - 1", winner: "Germany" },
  { date: "2026-06-14", home: "Netherlands", away: "Japan", time: "FT", timeAEST: "FT", stage: "Group F", tv: "ITV", score: "2 - 2", winner: "DRAW" },
  { date: "2026-06-15", home: "Ivory Coast", away: "Ecuador", time: "FT", timeAEST: "FT", stage: "Group E", tv: "BBC", score: "1 - 0", winner: "Ivory Coast" },
  { date: "2026-06-15", home: "Sweden", away: "Tunisia", time: "FT", timeAEST: "FT", stage: "Group F", tv: "ITV", score: "5 - 1", winner: "Sweden" },
  { date: "2026-06-15", home: "Spain", away: "Cape Verde", time: "5:00pm", timeAEST: "2:00am (+1)", stage: "Group H", tv: "ITV" },
  { date: "2026-06-15", home: "Belgium", away: "Egypt", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Group G", tv: "BBC" },
  { date: "2026-06-15", home: "Saudi Arabia", away: "Uruguay", time: "11:00pm", timeAEST: "8:00am (+1)", stage: "Group H", tv: "ITV" },
  { date: "2026-06-16", home: "Iran", away: "New Zealand", time: "2:00am", timeAEST: "11:00am", stage: "Group G", tv: "BBC" },
  { date: "2026-06-16", home: "France", away: "Senegal", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Group I", tv: "BBC" },
  { date: "2026-06-16", home: "Iraq", away: "Norway", time: "11:00pm", timeAEST: "8:00am (+1)", stage: "Group I", tv: "BBC" },
  { date: "2026-06-17", home: "Argentina", away: "Algeria", time: "2:00am", timeAEST: "11:00am", stage: "Group J", tv: "ITV" },
  { date: "2026-06-17", home: "Austria", away: "Jordan", time: "5:00am", timeAEST: "2:00pm", stage: "Group J", tv: "BBC" },
  { date: "2026-06-17", home: "Portugal", away: "DR Congo", time: "6:00pm", timeAEST: "3:00am (+1)", stage: "Group K", tv: "BBC" },
  { date: "2026-06-17", home: "England", away: "Croatia", time: "9:00pm", timeAEST: "6:00am (+1)", stage: "Group L", tv: "ITV" },
  { date: "2026-06-18", home: "Ghana", away: "Panama", time: "12:00am", timeAEST: "9:00am", stage: "Group L", tv: "ITV" },
  { date: "2026-06-18", home: "Uzbekistan", away: "Colombia", time: "3:00am", timeAEST: "12:00pm", stage: "Group K", tv: "BBC" },
  { date: "2026-06-18", home: "Czech Republic", away: "South Africa", time: "5:00pm", timeAEST: "2:00am (+1)", stage: "Group A", tv: "BBC" },
  { date: "2026-06-18", home: "Switzerland", away: "Bosnia-Herzegovina", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Group B", tv: "ITV" },
  { date: "2026-06-18", home: "Canada", away: "Qatar", time: "11:00pm", timeAEST: "8:00am (+1)", stage: "Group B", tv: "ITV" },
  { date: "2026-06-19", home: "Mexico", away: "South Korea", time: "2:00am", timeAEST: "11:00am", stage: "Group A", tv: "BBC" },
  { date: "2026-06-19", home: "USA", away: "Australia", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Group D", tv: "BBC" },
  { date: "2026-06-19", home: "Scotland", away: "Morocco", time: "11:00pm", timeAEST: "8:00am (+1)", stage: "Group C", tv: "ITV" },
  { date: "2026-06-20", home: "Brazil", away: "Haiti", time: "2:00am", timeAEST: "11:00am", stage: "Group C", tv: "ITV" },
  { date: "2026-06-20", home: "Turkey", away: "Paraguay", time: "5:00am", timeAEST: "2:00pm", stage: "Group D", tv: "ITV" },
  { date: "2026-06-20", home: "Netherlands", away: "Sweden", time: "6:00pm", timeAEST: "3:00am (+1)", stage: "Group F", tv: "BBC" },
  { date: "2026-06-20", home: "Germany", away: "Ivory Coast", time: "9:00pm", timeAEST: "6:00am (+1)", stage: "Group E", tv: "ITV" },
  { date: "2026-06-21", home: "Ecuador", away: "Curacao", time: "1:00am", timeAEST: "10:00am", stage: "Group E", tv: "BBC" },
  { date: "2026-06-21", home: "Tunisia", away: "Japan", time: "5:00am", timeAEST: "2:00pm", stage: "Group F", tv: "BBC" },
  { date: "2026-06-21", home: "Spain", away: "Saudi Arabia", time: "5:00pm", timeAEST: "2:00am (+1)", stage: "Group H", tv: "BBC" },
  { date: "2026-06-21", home: "Belgium", away: "Iran", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Group G", tv: "ITV" },
  { date: "2026-06-21", home: "Uruguay", away: "Cape Verde", time: "11:00pm", timeAEST: "8:00am (+1)", stage: "Group H", tv: "BBC" },
  { date: "2026-06-22", home: "New Zealand", away: "Egypt", time: "2:00am", timeAEST: "11:00am", stage: "Group G", tv: "ITV" },
  { date: "2026-06-22", home: "Argentina", away: "Austria", time: "6:00pm", timeAEST: "3:00am (+1)", stage: "Group J", tv: "BBC" },
  { date: "2026-06-22", home: "France", away: "Iraq", time: "10:00pm", timeAEST: "7:00am (+1)", stage: "Group I", tv: "BBC" },
  { date: "2026-06-23", home: "Norway", away: "Senegal", time: "1:00am", timeAEST: "10:00am", stage: "Group I", tv: "ITV" },
  { date: "2026-06-23", home: "Jordan", away: "Algeria", time: "4:00am", timeAEST: "1:00pm", stage: "Group J", tv: "ITV" },
  { date: "2026-06-23", home: "Portugal", away: "Uzbekistan", time: "6:00pm", timeAEST: "3:00am (+1)", stage: "Group K", tv: "ITV" },
  { date: "2026-06-23", home: "England", away: "Ghana", time: "9:00pm", timeAEST: "6:00am (+1)", stage: "Group L", tv: "BBC" },
  { date: "2026-06-24", home: "Panama", away: "Croatia", time: "12:00am", timeAEST: "9:00am", stage: "Group L", tv: "BBC" },
  { date: "2026-06-24", home: "Colombia", away: "DR Congo", time: "3:00am", timeAEST: "12:00pm", stage: "Group K", tv: "ITV" },
  { date: "2026-06-24", home: "Bosnia-Herzegovina", away: "Qatar", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Group B", tv: "ITV" },
  { date: "2026-06-24", home: "Switzerland", away: "Canada", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Group B", tv: "ITV" },
  { date: "2026-06-24", home: "Morocco", away: "Haiti", time: "11:00pm", timeAEST: "8:00am (+1)", stage: "Group C", tv: "BBC" },
  { date: "2026-06-24", home: "Scotland", away: "Brazil", time: "11:00pm", timeAEST: "8:00am (+1)", stage: "Group C", tv: "BBC" },
  { date: "2026-06-25", home: "Czech Republic", away: "Mexico", time: "2:00am", timeAEST: "11:00am", stage: "Group A", tv: "BBC" },
  { date: "2026-06-25", home: "South Africa", away: "South Korea", time: "2:00am", timeAEST: "11:00am", stage: "Group A", tv: "BBC" },
  { date: "2026-06-25", home: "Curacao", away: "Ivory Coast", time: "9:00pm", timeAEST: "6:00am (+1)", stage: "Group E", tv: "BBC" },
  { date: "2026-06-25", home: "Ecuador", away: "Germany", time: "9:00pm", timeAEST: "6:00am (+1)", stage: "Group E", tv: "BBC" },
  { date: "2026-06-26", home: "Japan", away: "Sweden", time: "12:00am", timeAEST: "9:00am", stage: "Group F", tv: "BBC" },
  { date: "2026-06-26", home: "Tunisia", away: "Netherlands", time: "12:00am", timeAEST: "9:00am", stage: "Group F", tv: "BBC" },
  { date: "2026-06-26", home: "Paraguay", away: "Australia", time: "3:00am", timeAEST: "12:00pm", stage: "Group D", tv: "ITV" },
  { date: "2026-06-26", home: "Turkey", away: "USA", time: "3:00am", timeAEST: "12:00pm", stage: "Group D", tv: "ITV" },
  { date: "2026-06-26", home: "Norway", away: "France", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Group I", tv: "ITV" },
  { date: "2026-06-26", home: "Senegal", away: "Iraq", time: "8:00pm", timeAEST: "5:00am (+1)", stage: "Group I", tv: "ITV" },
  { date: "2026-06-27", home: "Cape Verde", away: "Saudi Arabia", time: "1:00am", timeAEST: "10:00am", stage: "Group H", tv: "ITV" },
  { date: "2026-06-27", home: "Uruguay", away: "Spain", time: "1:00am", timeAEST: "10:00am", stage: "Group H", tv: "ITV" },
  { date: "2026-06-27", home: "Egypt", away: "Iran", time: "4:00am", timeAEST: "1:00pm", stage: "Group G", tv: "BBC" },
  { date: "2026-06-27", home: "New Zealand", away: "Belgium", time: "4:00am", timeAEST: "1:00pm", stage: "Group G", tv: "BBC" },
  { date: "2026-06-27", home: "Croatia", away: "Ghana", time: "10:00pm", timeAEST: "7:00am (+1)", stage: "Group L", tv: "ITV" },
  { date: "2026-06-27", home: "Panama", away: "England", time: "10:00pm", timeAEST: "7:00am (+1)", stage: "Group L", tv: "ITV" },
  { date: "2026-06-28", home: "Colombia", away: "Portugal", time: "12:30am", timeAEST: "9:30am", stage: "Group K", tv: "BBC" },
  { date: "2026-06-28", home: "DR Congo", away: "Uzbekistan", time: "12:30am", timeAEST: "9:30am", stage: "Group K", tv: "BBC" },
  { date: "2026-06-28", home: "Algeria", away: "Austria", time: "3:00am", timeAEST: "12:00pm", stage: "Group J", tv: "BBC" },
  { date: "2026-06-28", home: "Jordan", away: "Argentina", time: "3:00am", timeAEST: "12:00pm", stage: "Group J", tv: "BBC" },
];

type TeamStat = {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
};

function computeStandings(group: string): TeamStat[] {
  const stats: Record<string, TeamStat> = {};

  const groupFixtures = FIXTURES.filter(f => f.stage === group && f.score);

  for (const f of groupFixtures) {
    const [hs, as] = f.score!.split(" - ").map(Number);
    for (const team of [f.home, f.away]) {
      if (!stats[team]) stats[team] = { team, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 };
    }
    const home = stats[f.home];
    const away = stats[f.away];
    home.played++; away.played++;
    home.gf += hs; home.ga += as;
    away.gf += as; away.ga += hs;
    if (f.winner === "DRAW") {
      home.drawn++; away.drawn++;
      home.points++; away.points++;
    } else if (f.winner === f.home) {
      home.won++; away.lost++;
      home.points += 3;
    } else {
      away.won++; home.lost++;
      away.points += 3;
    }
  }

  // Add teams with no played games yet
  const allTeams = [...new Set(FIXTURES.filter(f => f.stage === group).flatMap(f => [f.home, f.away]))];
  for (const team of allTeams) {
    if (!stats[team]) stats[team] = { team, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 };
  }

  return Object.values(stats).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const gdB = b.gf - b.ga;
    const gdA = a.gf - a.ga;
    if (gdB !== gdA) return gdB - gdA;
    return b.gf - a.gf;
  });
}

const GROUPS = ["Group A", "Group B", "Group C", "Group D", "Group E", "Group F", "Group G", "Group H", "Group I", "Group J", "Group K", "Group L"];

function GroupTable({ group }: { group: string }) {
  const rows = computeStandings(group);

  return (
    <div style={{ backgroundColor: "#0d0d0d", border: "2px solid #222", marginBottom: "1px" }}>
      <div style={{
        backgroundColor: "#111",
        borderBottom: "2px solid #222",
        padding: "8px 12px",
        fontFamily: "'Black Han Sans', sans-serif",
        fontSize: "0.8rem",
        letterSpacing: "0.08em",
        color: "#e8ff00",
      }}>
        {group.toUpperCase()}
      </div>

      {/* Header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "28px 1fr 32px 32px",
        padding: "4px 12px",
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "0.6rem",
        color: "#444",
        letterSpacing: "0.06em",
        borderBottom: "1px solid #1a1a1a",
      }}>
        <span></span>
        <span></span>
        <span style={{ textAlign: "center" }}>P</span>
        <span style={{ textAlign: "center", color: "#e8ff00" }}>PTS</span>
      </div>

      {rows.map((row, i) => {
        const isQualified = i < 2;
        const gd = row.gf - row.ga;
        return (
          <div
            key={row.team}
            style={{
              display: "grid",
              gridTemplateColumns: "28px 1fr 32px 32px",
              alignItems: "center",
              padding: "7px 12px",
              borderBottom: i < rows.length - 1 ? "1px solid #111" : "none",
              borderLeft: isQualified ? "3px solid #39ff14" : "3px solid transparent",
            }}
          >
            <span style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.7rem",
              color: isQualified ? "#39ff14" : "#444",
            }}>
              {i + 1}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>{FLAGS[row.team] || "🏳"}</span>
              <span style={{
                fontFamily: "'Black Han Sans', sans-serif",
                fontSize: "0.8rem",
                color: isQualified ? "#ffffff" : "#666",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {row.team}
              </span>
              {row.played > 0 && (
                <span style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.55rem",
                  color: "#333",
                  marginLeft: "auto",
                  paddingRight: "4px",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}>
                  {row.won}W {row.drawn}D {row.lost}L{" "}
                  <span style={{ color: gd > 0 ? "#39ff14" : gd < 0 ? "#ff4444" : "#555" }}>
                    {gd > 0 ? "+" : ""}{gd}
                  </span>
                </span>
              )}
            </div>
            <span style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.7rem",
              color: "#555",
              textAlign: "center",
            }}>
              {row.played}
            </span>
            <span style={{
              fontFamily: "'VT323', monospace",
              fontSize: "1.2rem",
              color: isQualified ? "#e8ff00" : "#555",
              textAlign: "center",
            }}>
              {row.points}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function TablesTab() {
  return (
    <div className="p-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{
        fontFamily: "'Black Han Sans', sans-serif",
        fontSize: "0.65rem",
        letterSpacing: "0.08em",
        color: "#333",
        marginBottom: "16px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <span style={{ width: "12px", height: "12px", borderLeft: "3px solid #39ff14", display: "inline-block" }}></span>
        TOP 2 QUALIFY
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px" }}>
        {GROUPS.map(g => <GroupTable key={g} group={g} />)}
      </div>
    </div>
  );
}
