import squirrelImg from "../../imports/squirrel.png";
import { PLAYER_COLORS } from "../lib/sweepstake";

const PLAYERS = ["BURGER", "WIGGLES", "CHONKIE BOO", "MEDLEY", "TINY CANS", "POOCH"];

// UPDATE THESE SCORES
const SCORES: Record<string, number> = {
  BURGER: 0,
  WIGGLES: 0,
  "CHONKIE BOO": 0,
  MEDLEY: 0,
  "TINY CANS": 0,
  POOCH: 0,
};

const LINES: Record<string, string> = {
  BURGER:       "steady hands, committed jaw",
  WIGGLES:      "no sauce. no apology.",
  "CHONKIE BOO":"technique under review",
  MEDLEY:       "the bone has been addressed",
  "TINY CANS":  "consistent. relentless.",
  POOCH:        "still going",
};

export function TablesTab() {
  const ranked = [...PLAYERS]
    .map(p => ({ name: p, score: SCORES[p] ?? 0 }))
    .sort((a, b) => b.score - a.score);

  const max = Math.max(...ranked.map(r => r.score), 1);
  const leader = ranked[0];

  return (
    <div style={{ maxWidth: "580px", margin: "0 auto", padding: "32px 16px", position: "relative" }}>

      {/* Squirrel — top right */}
      <img
        src={squirrelImg}
        alt=""
        style={{
          position: "absolute",
          top: "-10px",
          right: "-10px",
          width: "130px",
          opacity: 0.92,
          pointerEvents: "none",
          transform: "scaleX(-1)",
          zIndex: 2,
        }}
      />

      {/* Header */}
      <div style={{ marginBottom: "36px", paddingRight: "100px" }}>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.18em",
          color: "#333",
          marginBottom: "6px",
          textTransform: "uppercase",
        }}>
          Burger's World Cup 2026 · official standings
        </div>
        <div style={{
          fontFamily: "'Black Han Sans', sans-serif",
          fontSize: "2.2rem",
          color: "#ffffff",
          lineHeight: 1,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}>
          ALAN JACKSON'S COUNT
        </div>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.7rem",
          color: "#e8ff00",
          marginTop: "8px",
          letterSpacing: "0.06em",
        }}>
          alan is watching you. judging your chicken stripping skills.
        </div>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.58rem",
          color: "#333",
          marginTop: "4px",
          letterSpacing: "0.08em",
        }}>
          🍗 self-reported · honour system · no appeals
        </div>
      </div>

      {/* Leader callout */}
      {leader.score > 0 && (
        <div style={{
          border: `2px solid ${PLAYER_COLORS[leader.name] ?? "#e8ff00"}`,
          padding: "12px 16px",
          marginBottom: "28px",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.7rem",
          color: "#555",
          letterSpacing: "0.05em",
          lineHeight: 1.8,
        }}>
          <span style={{
            fontFamily: "'Black Han Sans', sans-serif",
            fontSize: "0.95rem",
            color: PLAYER_COLORS[leader.name] ?? "#e8ff00",
          }}>
            {leader.name}
          </span>
          {" "}leads with {leader.score} piece{leader.score !== 1 ? "s" : ""}. {LINES[leader.name]}.
        </div>
      )}

      {/* Rows */}
      <div>
        {ranked.map((row, i) => {
          const color = PLAYER_COLORS[row.name] ?? "#ffffff";
          const barPct = max > 0 ? Math.round((row.score / max) * 100) : 0;
          const isFirst = i === 0 && row.score > 0;

          return (
            <div key={row.name} style={{
              padding: "18px 0",
              borderBottom: "1px solid #111",
            }}>
              <div style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: "12px",
                marginBottom: "10px",
              }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
                  <span style={{
                    fontFamily: "'VT323', monospace",
                    fontSize: "1.1rem",
                    color: isFirst ? color : "#2a2a2a",
                    minWidth: "18px",
                  }}>
                    {i + 1}
                  </span>
                  <div>
                    <div style={{
                      fontFamily: "'Black Han Sans', sans-serif",
                      fontSize: "1.15rem",
                      color: color,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      lineHeight: 1,
                      marginBottom: "3px",
                    }}>
                      {row.name}
                    </div>
                    <div style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.58rem",
                      color: "#444",
                      letterSpacing: "0.06em",
                    }}>
                      {LINES[row.name]}
                    </div>
                  </div>
                </div>

                <div style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: "3rem",
                  color: row.score > 0 ? color : "#333",
                  lineHeight: 1,
                  flexShrink: 0,
                }}>
                  {row.score}
                </div>
              </div>

              {/* Bar */}
              <div style={{ height: "2px", backgroundColor: "#111" }}>
                {row.score > 0 && (
                  <div style={{
                    height: "100%",
                    width: `${barPct}%`,
                    backgroundColor: isFirst ? color : "#1e1e1e",
                  }} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: "32px",
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "0.55rem",
        color: "#1a1a1a",
        letterSpacing: "0.1em",
        lineHeight: 2,
      }}>
        SELF REPORTED · HONOUR SYSTEM · NO APPEALS
      </div>
    </div>
  );
}
