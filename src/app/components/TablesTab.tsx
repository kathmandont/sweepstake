import { useTournamentEvents } from "../hooks/useTournamentEvents";
import { PLAYER_COLORS } from "../lib/sweepstake";

const PLAYERS = ["BURGER", "WIGGLES", "CHONKIE BOO", "MEDLEY", "TINY CANS", "POOCH"];

const SUBTITLES: Record<string, string> = {
  BURGER:       "deep in the mix",
  WIGGLES:      "making moves",
  "CHONKIE BOO":"out there doing things",
  MEDLEY:       "fully committed",
  "TINY CANS":  "showing up",
  POOCH:        "on the radar",
};

export function TablesTab() {
  const { prizes, loading } = useTournamentEvents();
  const totals = prizes.offsideTotals;

  const ranked = [...PLAYERS]
    .map(p => ({ name: p, total: totals[p] ?? 0 }))
    .sort((a, b) => b.total - a.total);

  const max = ranked[0]?.total ?? 1;

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "32px 16px" }}>

      {/* Header */}
      <div style={{ marginBottom: "40px", borderLeft: "4px solid #e8ff00", paddingLeft: "16px" }}>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          color: "#444",
          marginBottom: "8px",
          textTransform: "uppercase",
        }}>
          Burger's World Cup 2026 · Live standings
        </div>
        <div style={{
          fontFamily: "'Black Han Sans', sans-serif",
          fontSize: "2rem",
          color: "#ffffff",
          lineHeight: 1,
          letterSpacing: "0.03em",
          textTransform: "uppercase",
        }}>
          THE COUNT
        </div>
      </div>

      {loading ? (
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.7rem",
          color: "#333",
          letterSpacing: "0.12em",
          padding: "48px 0",
          textAlign: "center",
        }}>
          loading...
        </div>
      ) : (
        <div>
          {ranked.map((row, i) => {
            const color = PLAYER_COLORS[row.name] ?? "#ffffff";
            const isLeader = i === 0 && row.total > 0;
            const barWidth = max > 0 ? Math.round((row.total / max) * 100) : 0;

            return (
              <div
                key={row.name}
                style={{
                  marginBottom: "2px",
                  padding: "20px 0",
                  borderBottom: "1px solid #151515",
                }}
              >
                {/* Name row */}
                <div style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  gap: "16px",
                }}>
                  <div>
                    <div style={{
                      fontFamily: "'Black Han Sans', sans-serif",
                      fontSize: "1.25rem",
                      color: row.total > 0 ? color : "#333",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      lineHeight: 1,
                      marginBottom: "4px",
                    }}>
                      {row.name}
                    </div>
                    <div style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.6rem",
                      color: "#2a2a2a",
                      letterSpacing: "0.08em",
                    }}>
                      {SUBTITLES[row.name] ?? ""}
                    </div>
                  </div>

                  <div style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: "3rem",
                    color: row.total > 0 ? color : "#1a1a1a",
                    lineHeight: 1,
                    flexShrink: 0,
                  }}>
                    {row.total}
                  </div>
                </div>

                {/* Bar */}
                <div style={{ height: "3px", backgroundColor: "#111", width: "100%" }}>
                  {row.total > 0 && (
                    <div style={{
                      height: "100%",
                      width: `${barWidth}%`,
                      backgroundColor: isLeader ? color : "#222",
                      transition: "width 0.4s ease",
                    }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{
        marginTop: "40px",
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "0.55rem",
        color: "#1e1e1e",
        letterSpacing: "0.1em",
        lineHeight: 2,
      }}>
        UPDATES LIVE · BURGERSBALLSFOOTBALL.COM
      </div>
    </div>
  );
}
