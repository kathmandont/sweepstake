import { useTournamentEvents } from "../hooks/useTournamentEvents";
import { PLAYER_COLORS } from "../lib/sweepstake";

const PRIZES = [
  {
    title: "OVERALL WINNER",
    icon: "🏆",
    color: "#e8ff00",
    reward: "Cash jackpot (the whole pot, you beautiful person) + a Quarter Pounder with Cheese meal.",
    flavour: "You earned it. You are the main event. This is your moment.",
    tag: "THE BIG ONE",
  },
  {
    title: "RUNNER UP",
    icon: "🥈",
    color: "#00ffff",
    reward: "Half a McFlurry's worth of dignity + a Chicken Big Mac.",
    flavour: "You almost had it. You will be fine.",
    tag: "CONSOLATION PRIZE",
  },
  {
    title: "FIRST RED CARD",
    icon: "🟥",
    color: "#ff0033",
    reward: "A single Filet-O-Fish, served cold, no context, no ceremony.",
    flavour: "You know what you did.",
    tag: "CHAOS AWARD",
    winner: "MEDLEY",
    winnerColor: "#e8ff00",
    winnerNote: "Mexico vs South Africa",
  },
  {
    title: "FIRST OWN GOAL",
    icon: "🤦",
    color: "#ff00ff",
    reward: "A 6-piece McNuggets with the BBQ sauce specifically replaced with sweet and sour.",
    flavour: "Non-negotiable.",
    tag: "CHAOS AWARD",
    winner: "CHONKIE BOO",
    winnerColor: "#39ff14",
    winnerNote: "D. Bobadilla (Panama) 7' og",
  },
  {
    title: "FIRST PENALTY MISS",
    icon: "😬",
    color: "#ff6600",
    reward: "A plain hamburger. No extras.",
    flavour: "Just sadness on a bun.",
    tag: "SHAME PRIZE",
  },
  {
    title: "FIRST TEAM KNOCKED OUT (GROUP STAGE)",
    icon: "👋",
    color: "#888888",
    reward: "A hash brown. Not as part of a breakfast. Just a hash brown.",
    flavour: "Handed over in silence.",
    tag: "EARLY EXIT",
  },
  {
    title: "MOST YELLOW CARDS",
    icon: "🟨",
    color: "#e8ff00",
    reward: "The Cheese Melt Dip. No chips. Just the dip.",
    flavour: "Sit with that.",
    tag: "DISCIPLINARY",
  },
  {
    title: "HIGHEST SCORING GAME",
    icon: "🎉",
    color: "#39ff14",
    reward: "Large fries + a McFlurry of your choice.",
    flavour: "Rewarded. This is correct.",
    tag: "GOAT ENERGY",
  },
  {
    title: "LAST PLACE",
    icon: "💧",
    color: "#555555",
    reward: "A Filet-O-Fish and a tap water.",
    flavour: "We love you but we need you to reflect.",
    tag: "RIP",
  },
  {
    title: "DARK HORSE BONUS",
    icon: "🐴",
    color: "#ff00ff",
    reward: "An extra cash bonus from everyone + a Double Cheeseburger.",
    flavour: "You called it and none of us believed you and you were right and we are sorry.",
    tag: "LEGENDARY",
  },
  {
    title: "THE PORRIDGE PRIZE",
    icon: "🥣",
    color: "#8B4513",
    reward: "An actual McDonald's porridge. Before 10:30am. You have to go and collect it yourself.",
    flavour: "No delivery.",
    tag: "PUNISHMENT",
  },
];

function AutoWinnerBanner({ player, note, color }: { player: string; note: string; color: string }) {
  return (
    <div className="mb-2 px-3 py-2 flex items-center gap-2" style={{ backgroundColor: `${color}22`, border: `2px solid ${color}` }}>
      <span style={{ fontSize: "1.1rem" }}>🏆</span>
      <div>
        <span style={{ fontFamily: "'Black Han Sans', sans-serif", color, fontSize: "1rem" }}>{player}</span>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", color: "#555", fontSize: "0.7rem", marginLeft: "8px" }}>{note}</span>
      </div>
      <span style={{ fontFamily: "'VT323', monospace", color: "#39ff14", fontSize: "0.7rem", marginLeft: "auto" }}>AUTO-DETECTED</span>
    </div>
  );
}

export function PrizesTab() {
  const { prizes, loading } = useTournamentEvents();

  // Build auto-detected winner map keyed by prize title
  const autoWinners: Record<string, { player: string; note: string } | null> = {
    "FIRST RED CARD": prizes.firstRedCard
      ? { player: prizes.firstRedCard.player, note: `${prizes.firstRedCard.team} · ${prizes.firstRedCard.minute}' · ${prizes.firstRedCard.matchLabel}` }
      : null,
    "FIRST OWN GOAL": prizes.firstOwnGoal
      ? { player: prizes.firstOwnGoal.player, note: `${prizes.firstOwnGoal.scorer} · ${prizes.firstOwnGoal.minute}' · ${prizes.firstOwnGoal.matchLabel}` }
      : null,
    "FIRST PENALTY MISS": prizes.firstMissedPenalty
      ? { player: prizes.firstMissedPenalty.player, note: `${prizes.firstMissedPenalty.scorer} · ${prizes.firstMissedPenalty.minute}' · ${prizes.firstMissedPenalty.matchLabel}` }
      : null,
    "HIGHEST SCORING GAME": prizes.highestScoringGame
      ? { player: prizes.highestScoringGame.owners.join(" + ") || "TBC", note: `${prizes.highestScoringGame.matchLabel} · ${prizes.highestScoringGame.total} goals` }
      : null,
    "MOST YELLOW CARDS": (() => {
      const totals = prizes.yellowCardTotals;
      const leader = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
      return leader && leader[1] > 0 ? { player: leader[0], note: `${leader[1]} yellow card${leader[1] !== 1 ? "s" : ""} so far` } : null;
    })(),
  };

  return (
    <div className="p-4 md:p-8">
      <div className="text-center mb-8">
        <div
          className="inline-block border-4 px-6 py-3 mb-4"
          style={{ borderColor: "#ff00ff", color: "#ff00ff", fontFamily: "'VT323', monospace", fontSize: "1.2rem" }}
        >
          ★ THE PRIZES ★ RESPECT THE DRAW ★ RESPECT THE FILET-O-FISH ★
        </div>
        <p style={{ fontFamily: "'Share Tech Mono', monospace", color: "#888888", fontSize: "0.85rem" }}>
          cash goes in the pot. Donald's brings the prizes. this is legally binding.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PRIZES.map((prize) => (
          <div
            key={prize.title}
            className="relative overflow-hidden"
            style={{
              border: `3px solid ${prize.color}`,
              backgroundColor: "#0d0d0d",
            }}
          >
            {/* Tag */}
            <div
              className="absolute top-0 right-0 px-2 py-1"
              style={{
                backgroundColor: prize.color,
                color: "#000",
                fontFamily: "'VT323', monospace",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
              }}
            >
              {prize.tag}
            </div>

            <div className="p-4 pt-5">
              <div className="flex items-start gap-3 mb-3">
                <span style={{ fontSize: "2rem", lineHeight: 1 }}>{prize.icon}</span>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Black Han Sans', sans-serif",
                      color: prize.color,
                      fontSize: "1rem",
                      letterSpacing: "0.05em",
                      lineHeight: 1.2,
                    }}
                  >
                    {prize.title}
                  </h3>
                </div>
              </div>

              <div
                className="mb-2 px-3 py-2"
                style={{
                  borderLeft: `3px solid ${prize.color}`,
                  fontFamily: "'Share Tech Mono', monospace",
                  color: "#dddddd",
                  fontSize: "0.85rem",
                  backgroundColor: `${prize.color}0d`,
                }}
              >
                {prize.reward}
              </div>

              {(() => {
                const auto = autoWinners[prize.title];
                const manual = (prize as any).winner;
                if (auto) {
                  const col = PLAYER_COLORS[auto.player] ?? (prize as any).winnerColor ?? prize.color;
                  return <AutoWinnerBanner player={auto.player} note={auto.note} color={col} />;
                }
                if (manual) {
                  return (
                    <div className="mb-2 px-3 py-2 flex items-center gap-2" style={{ backgroundColor: `${(prize as any).winnerColor}22`, border: `2px solid ${(prize as any).winnerColor}`, fontFamily: "'Black Han Sans', sans-serif" }}>
                      <span style={{ fontSize: "1.1rem" }}>🏆</span>
                      <div>
                        <span style={{ color: (prize as any).winnerColor, fontSize: "1rem" }}>{manual}</span>
                        <span style={{ fontFamily: "'Share Tech Mono', monospace", color: "#555", fontSize: "0.7rem", marginLeft: "8px" }}>{(prize as any).winnerNote}</span>
                      </div>
                    </div>
                  );
                }
                if (loading) return <div style={{ fontFamily: "'Share Tech Mono', monospace", color: "#333", fontSize: "0.7rem", marginBottom: "8px" }}>checking live data...</div>;
                return null;
              })()}

              <p
                style={{
                  fontFamily: "'VT323', monospace",
                  color: "#666666",
                  fontSize: "1rem",
                  fontStyle: "italic",
                }}
              >
                {prize.flavour}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer manifesto */}
      <div
        className="mt-8 p-6 text-center"
        style={{
          border: "3px solid #39ff14",
          backgroundColor: "#050505",
        }}
      >
        <p style={{ fontFamily: "'VT323', monospace", color: "#39ff14", fontSize: "1.4rem", lineHeight: 1.4 }}>
          Stay safe out there. Respect the draw. Respect the Filet-O-Fish.
        </p>
      </div>
    </div>
  );
}
