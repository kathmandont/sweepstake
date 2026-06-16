import { useTournamentEvents } from "../hooks/useTournamentEvents";
import { PLAYER_COLORS } from "../lib/sweepstake";

const PLAYERS = ["BURGER", "WIGGLES", "CHONKIE BOO", "MEDLEY", "TINY CANS", "POOCH"];

const RANK_LABELS = ["👑 THE KING", "😤 CLOSE", "🤔 TRYING", "😬 OH DEAR", "💀 TRAGIC", "🪦 STICK TO DARTS"];

const FLAVOUR: Record<string, string[]> = {
  BURGER: [
    "footwork has been questioned",
    "none of those were offsides, apparently",
    "the linesman is NOT a fan",
  ],
  WIGGLES: [
    "ahead of the game, some might say too far ahead",
    "clearly running a very advanced offside trap",
    "VAR cannot stop this",
  ],
  "CHONKIE BOO": [
    "lurking",
    "half a yard ahead, every time",
    "the ref has their number",
  ],
  MEDLEY: [
    "refusing to track back",
    "boldly going where they're not supposed to be",
    "a flag has been raised",
  ],
  "TINY CANS": [
    "the linesman is doing overtime",
    "technically correct is the worst kind of correct",
    "once more into the offside trap",
  ],
  POOCH: [
    "the ball got there first. allegedly",
    "toe was on, apparently",
    "always in the right place at the wrong time",
  ],
};

function flavour(player: string, total: number): string {
  if (total === 0) return "yet to trouble the linesman";
  const lines = FLAVOUR[player] ?? ["making moves"];
  return lines[total % lines.length];
}

export function TablesTab() {
  const { prizes, loading } = useTournamentEvents();
  const totals = prizes.offsideTotals;

  const ranked = [...PLAYERS]
    .map(p => ({ name: p, total: totals[p] ?? 0 }))
    .sort((a, b) => b.total - a.total);

  const leader = ranked[0];

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px 16px", fontFamily: "'Share Tech Mono', monospace" }}>

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{
          fontFamily: "'Black Han Sans', sans-serif",
          fontSize: "1.6rem",
          color: "#e8ff00",
          letterSpacing: "0.04em",
          lineHeight: 1.1,
        }}>
          THE LINESMAN'S
        </div>
        <div style={{
          fontFamily: "'Black Han Sans', sans-serif",
          fontSize: "1.6rem",
          color: "#ffffff",
          letterSpacing: "0.04em",
          lineHeight: 1.1,
          marginBottom: "8px",
        }}>
          LEADERBOARD
        </div>
        <div style={{ fontSize: "0.7rem", color: "#444", letterSpacing: "0.06em" }}>
          UPDATED AS MATCHES COMPLETE · FLAG RAISED = POINT SCORED
        </div>
      </div>

      {/* Leader callout */}
      {!loading && leader && leader.total > 0 && (
        <div style={{
          border: `2px solid ${PLAYER_COLORS[leader.name] ?? "#e8ff00"}`,
          backgroundColor: "#0d0d0d",
          padding: "16px",
          marginBottom: "24px",
          fontSize: "0.75rem",
          color: "#888",
          letterSpacing: "0.05em",
          lineHeight: 1.8,
        }}>
          <span style={{ color: PLAYER_COLORS[leader.name] ?? "#e8ff00", fontFamily: "'Black Han Sans', sans-serif", fontSize: "1rem" }}>
            {leader.name}
          </span>
          {" "}currently leads with{" "}
          <span style={{ color: "#ffffff" }}>{leader.total}</span>
          {" "}raised flags. {flavour(leader.name, leader.total)}.
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={{ color: "#333", fontSize: "0.75rem", letterSpacing: "0.1em", padding: "40px 0", textAlign: "center" }}>
          CHECKING WITH THE LINESMAN...
        </div>
      ) : (
        <div>
          {ranked.map((row, i) => {
            const color = PLAYER_COLORS[row.name] ?? "#ffffff";
            const isLeader = i === 0 && row.total > 0;
            return (
              <div
                key={row.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px 1fr auto",
                  alignItems: "center",
                  gap: "16px",
                  padding: "18px 16px",
                  borderBottom: "1px solid #111",
                  borderLeft: isLeader ? `4px solid ${color}` : "4px solid transparent",
                  backgroundColor: isLeader ? "#0f0f0f" : "transparent",
                }}
              >
                {/* Rank */}
                <div style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: "1.4rem",
                  color: i === 0 ? color : "#333",
                  textAlign: "center",
                }}>
                  {i + 1}
                </div>

                {/* Name + flavour */}
                <div>
                  <div style={{
                    fontFamily: "'Black Han Sans', sans-serif",
                    fontSize: "1rem",
                    color: row.total > 0 ? color : "#444",
                    marginBottom: "3px",
                  }}>
                    {row.name}
                  </div>
                  <div style={{
                    fontSize: "0.62rem",
                    color: "#333",
                    letterSpacing: "0.04em",
                  }}>
                    {RANK_LABELS[i]} · {flavour(row.name, row.total)}
                  </div>
                </div>

                {/* Score */}
                <div style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: "2.2rem",
                  color: row.total > 0 ? color : "#222",
                  textAlign: "right",
                  lineHeight: 1,
                }}>
                  {row.total}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: "24px", fontSize: "0.6rem", color: "#222", letterSpacing: "0.06em", lineHeight: 1.8 }}>
        LOWER IS NOT BETTER. HIGHER IS NOT BETTER EITHER, REALLY.
        THIS IS JUST A BIT OF FUN. THE LINESMAN IS NOT SPONSORED.
      </div>
    </div>
  );
}
