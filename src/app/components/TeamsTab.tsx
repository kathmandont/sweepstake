import { useState, useEffect, useRef } from "react";
import { getCountryStats } from "../hooks/useCountryStats";
import flashImg from "../../imports/1.jpg";
import chonkieFlashImg from "../../imports/5.jpg";
import medleyFlashImg from "../../imports/3.jpg";
import wigglesFlashImg from "../../imports/2.jpg";
import burgerFlashImg from "../../imports/7.jpg";
import tinyCansFlashImg from "../../imports/99.jpg";
import image3 from "../../imports/image3.jpg";
import image4 from "../../imports/image4.jpg";
import image5 from "../../imports/image5.jpg";
import image12 from "../../imports/image12.jpg";
import image18 from "../../imports/image18.jpeg";

const PLAYERS = [
  {
    name: "POOCH",
    color: "#ff00ff",
    teams: ["Morocco", "Turkey", "Austria", "Cape Verde Islands", "New Zealand", "Egypt", "Iraq", "Spain"],
    emoji: "🐶",
    photo: image5,
    photoStyle: { objectPosition: "60% 15%" },
  },
  {
    name: "WIGGLES",
    color: "#00ffff",
    teams: ["Croatia", "Curaçao", "Australia", "Uzbekistan", "Japan", "Netherlands", "Czech Republic", "Scotland"],
    emoji: "🐛",
    photo: image12,
    photoStyle: { objectPosition: "22% 15%" },
  },
  {
    name: "CHONKIE BOO",
    color: "#39ff14",
    teams: ["Argentina", "Ghana", "Switzerland", "Ecuador", "Korea Republic", "Tunisia", "Panama", "Sweden"],
    emoji: "👻",
    photo: image18,
    photoStyle: { objectPosition: "50% 15%" },
  },
  {
    name: "MEDLEY",
    color: "#e8ff00",
    teams: ["Jordan", "South Africa", "Portugal", "Haiti", "Bosnia & Herzegovina", "Belgium", "Senegal", "Mexico"],
    emoji: "🎵",
    photo: image3,
    photoStyle: { objectPosition: "75% 20%" },
  },
  {
    name: "TINY CANS",
    color: "#ff6600",
    teams: ["Saudi Arabia", "Algeria", "Brazil", "Uruguay", "England", "Norway", "France", "United States"],
    emoji: "🥫",
    photo: image4,
    photoStyle: { objectPosition: "78% 15%" },
  },
  {
    name: "BURGER",
    color: "#ff0088",
    teams: ["Congo DR", "Paraguay", "Germany", "Canada", "Iran", "Colombia", "Côte d'Ivoire", "Qatar"],
    emoji: "🍔",
    photo: image3,
    photoStyle: { objectPosition: "25% 20%" },
  },
];

const FLAGS: Record<string, string> = {
  Morocco: "🇲🇦", Turkey: "🇹🇷", Austria: "🇦🇹", "Cape Verde Islands": "🇨🇻", "New Zealand": "🇳🇿", Egypt: "🇪🇬", Iraq: "🇮🇶", Spain: "🇪🇸",
  Croatia: "🇭🇷", "Curaçao": "🇨🇼", Australia: "🇦🇺", Uzbekistan: "🇺🇿", Japan: "🇯🇵", Netherlands: "🇳🇱", "Czech Republic": "🇨🇿", Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  Argentina: "🇦🇷", Ghana: "🇬🇭", Switzerland: "🇨🇭", Ecuador: "🇪🇨", "Korea Republic": "🇰🇷", Tunisia: "🇹🇳", Panama: "🇵🇦", Sweden: "🇸🇪",
  Jordan: "🇯🇴", "South Africa": "🇿🇦", Portugal: "🇵🇹", Haiti: "🇭🇹", "Bosnia & Herzegovina": "🇧🇦", Belgium: "🇧🇪", Senegal: "🇸🇳", Mexico: "🇲🇽",
  "Saudi Arabia": "🇸🇦", Algeria: "🇩🇿", Brazil: "🇧🇷", Uruguay: "🇺🇾", England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Norway: "🇳🇴", France: "🇫🇷", "United States": "🇺🇸",
  "Congo DR": "🇨🇩", Paraguay: "🇵🇾", Germany: "🇩🇪", Canada: "🇨🇦", Iran: "🇮🇷", Colombia: "🇨🇴", "Côte d'Ivoire": "🇨🇮", Qatar: "🇶🇦",
};

const FLASH_STYLES = `
  @keyframes flash-pulsate {
    0%   { transform: scale(1); }
    20%  { transform: scale(1.06) skewX(-1deg); }
    40%  { transform: scale(0.96) skewX(1deg); }
    60%  { transform: scale(1.08) skewX(-0.5deg); }
    80%  { transform: scale(0.98); }
    100% { transform: scale(1.04); }
  }
  @keyframes flash-distort {
    0%   { transform: scale(1.04) skewX(-1deg) skewY(0deg); filter: brightness(1); }
    15%  { transform: scale(1.12) skewX(8deg) skewY(-3deg) translateX(-12px); filter: brightness(1.4) hue-rotate(40deg); }
    30%  { transform: scale(0.88) skewX(-10deg) skewY(4deg) translateX(16px); filter: brightness(0.6) hue-rotate(-60deg) saturate(3); }
    45%  { transform: scale(1.15) skewX(6deg) scaleX(1.1) translateY(-8px); filter: brightness(1.6) contrast(2); }
    60%  { transform: scale(0.82) skewX(-8deg) scaleY(1.15) translateX(-10px); filter: brightness(0.5) hue-rotate(90deg); }
    75%  { transform: scale(1.1) skewX(12deg) skewY(-5deg) translateX(8px); filter: brightness(1.3) saturate(4) hue-rotate(-30deg); }
    90%  { transform: scale(0.9) skewX(-5deg) translateY(6px); filter: brightness(0.7) contrast(1.5); }
    100% { transform: scale(1.05) skewX(3deg); filter: brightness(1); }
  }
`;

export function TeamsTab() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [flash, setFlash] = useState<"hidden" | "visible" | "distorting" | "fading">("hidden");
  const [flashPlayer, setFlashPlayer] = useState<string>("");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const allTeams = PLAYERS.flatMap(p => p.teams);
  const stats = getCountryStats(allTeams);

  function triggerFlash(playerName: string) {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setFlashPlayer(playerName);
    setFlash("visible");
    timersRef.current.push(setTimeout(() => setFlash("distorting"), 900));
    timersRef.current.push(setTimeout(() => setFlash("fading"), 1700));
    timersRef.current.push(setTimeout(() => setFlash("hidden"), 2300));
  }

  return (
    <div className="p-4 md:p-8">
      <style>{FLASH_STYLES}</style>

      {/* Flash overlay — always rendered so images stay decoded */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.9)",
          opacity: flash === "hidden" ? 0 : flash === "fading" ? 0 : 1,
          transition: flash === "fading" ? "opacity 0.55s ease-out" : flash === "hidden" ? "none" : "opacity 0.08s ease-in",
          pointerEvents: flash !== "hidden" && flash !== "fading" ? "auto" : "none",
          visibility: flash === "hidden" ? "hidden" : "visible",
        }}
        onClick={() => flash !== "hidden" && setFlash("hidden")}
      >
          <div style={{ position: "relative" }}>
            <img
              src={flashPlayer === "CHONKIE BOO" ? chonkieFlashImg : flashPlayer === "MEDLEY" ? medleyFlashImg : flashPlayer === "WIGGLES" ? wigglesFlashImg : flashPlayer === "BURGER" ? burgerFlashImg : flashPlayer === "TINY CANS" ? tinyCansFlashImg : flashImg}
              alt=""
              style={{
                maxHeight: "85vh",
                maxWidth: "85vw",
                objectFit: "contain",
                filter: flashPlayer === "MEDLEY"
                  ? "contrast(2.2) brightness(0.7) saturate(4) hue-rotate(260deg) blur(0.4px)"
                  : flashPlayer === "WIGGLES"
                  ? "contrast(2.5) brightness(0.6) saturate(5) hue-rotate(180deg) blur(0.6px)"
                  : "contrast(1.3) brightness(0.85) saturate(0.6)",
                imageRendering: "pixelated",
                boxShadow: flashPlayer === "MEDLEY"
                  ? "0 0 60px #ff00ff88, 0 0 120px #00ffff44"
                  : flashPlayer === "WIGGLES"
                  ? "0 0 60px #00ffff88, 0 0 120px #ff00ff44"
                  : "0 0 80px #39ff1422",
                animation: flash === "visible"
                  ? "flash-pulsate 0.9s ease-in-out"
                  : flash === "distorting"
                  ? "flash-distort 0.8s ease-in-out"
                  : "none",
              }}
            />
            {/* Chromatic aberration layers */}
            <img
              src={flashPlayer === "CHONKIE BOO" ? chonkieFlashImg : flashPlayer === "MEDLEY" ? medleyFlashImg : flashPlayer === "WIGGLES" ? wigglesFlashImg : flashPlayer === "BURGER" ? burgerFlashImg : flashPlayer === "TINY CANS" ? tinyCansFlashImg : flashImg}
              alt=""
              style={{
                position: "absolute", inset: 0,
                maxHeight: "85vh", maxWidth: "85vw",
                objectFit: "contain",
                filter: flashPlayer === "MEDLEY"
                  ? "contrast(2) brightness(0.5) saturate(6) hue-rotate(180deg)"
                  : "contrast(1.3) brightness(0.7) saturate(0)",
                transform: flashPlayer === "MEDLEY"
                  ? "skewX(-2deg) scaleX(0.95) translate(6px, -3px)"
                  : "skewX(-1.5deg) scaleX(0.97) translate(4px, -2px)",
                mixBlendMode: "screen",
                opacity: flashPlayer === "MEDLEY" ? 0.6 : 0.4,
              }}
            />
            {/* Scanlines */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.35) 3px, rgba(0,0,0,0.35) 4px)",
              pointerEvents: "none",
            }} />
            {/* Noise overlay */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: "150px 150px",
              opacity: 0.12,
              mixBlendMode: "overlay",
              pointerEvents: "none",
            }} />
            {/* Vaporwave grid — Medley only */}
            {(flashPlayer === "MEDLEY" || flashPlayer === "WIGGLES") && (
              <div style={{
                position: "absolute", inset: 0,
                backgroundImage: `
                  linear-gradient(0deg, #ff00ff22 1px, transparent 1px),
                  linear-gradient(90deg, #00ffff22 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
                mixBlendMode: "screen",
                pointerEvents: "none",
              }} />
            )}
            {/* Glitch bar */}
            <div style={{
              position: "absolute",
              top: `${30 + Math.random() * 40}%`,
              left: 0, right: 0,
              height: "6px",
              backgroundColor: "#00ffff",
              opacity: 0.15,
              transform: `translateX(${Math.random() > 0.5 ? 8 : -8}px)`,
              pointerEvents: "none",
            }} />
          </div>
        </div>

      <div className="text-center mb-8">
        <div
          className="inline-block border-4 px-6 py-3 mb-4"
          style={{ borderColor: "#39ff14", color: "#39ff14", fontFamily: "'VT323', monospace", fontSize: "1.2rem" }}
        >
          ★ WHO HAS WHAT ★ THE TEAMS ★ WHO HAS WHAT ★
        </div>
        <p style={{ fontFamily: "'Share Tech Mono', monospace", color: "#888888", fontSize: "0.85rem" }}>
          click a player to expand their squad. choose wisely. or don't. it's already done.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {PLAYERS.map((player, idx) => (
          <div
            key={player.name}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => triggerFlash(player.name)}
            className="cursor-pointer transition-all duration-150"
            style={{
              border: `3px solid ${player.color}`,
              backgroundColor: hovered === idx ? "#1a1a1a" : "#0d0d0d",
              boxShadow: hovered === idx ? `0 0 20px ${player.color}66, inset 0 0 10px ${player.color}11` : "none",
              transform: hovered === idx ? "translateY(-2px)" : "none",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-0"
              style={{ backgroundColor: player.color, color: "#000000" }}
            >
              {player.photo && (
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    flexShrink: 0,
                    overflow: "hidden",
                    borderRight: `3px solid rgba(0,0,0,0.3)`,
                  }}
                >
                  <img
                    src={player.photo}
                    alt={player.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      ...player.photoStyle,
                      filter: "contrast(1.1) saturate(0.9)",
                    }}
                  />
                </div>
              )}
              <div className="px-4 py-3 flex items-center gap-3">
                {!player.photo && <span style={{ fontSize: "1.8rem" }}>{player.emoji}</span>}
                <span style={{ fontFamily: "'Black Han Sans', sans-serif", fontSize: "1.5rem", letterSpacing: "0.05em" }}>
                  {player.name}
                </span>
              </div>
            </div>

            {/* Teams */}
            <div className="p-3 grid grid-cols-2 gap-1">
              {player.teams.map((team) => {
                const stat = stats[team];
                const gdp = stat?.gdp_growth;
                const gdpColor = gdp == null ? "#444" : gdp >= 0 ? "#39ff14" : "#ff4444";
                return (
                  <div
                    key={team}
                    className="flex items-center gap-2 px-2 py-1"
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.78rem",
                      color: "#cccccc",
                      borderLeft: `2px solid ${player.color}44`,
                    }}
                  >
                    <span>{FLAGS[team] || "🏳"}</span>
                    <span className="truncate flex-1">{team}</span>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      {gdp != null && (
                        <div style={{ color: gdpColor, fontSize: "0.65rem", whiteSpace: "nowrap" }}>
                          {gdp > 0 ? "+" : ""}{gdp.toFixed(1)}%
                        </div>
                      )}
                      {stat?.funFact && (
                        <div style={{ color: "#444", fontSize: "0.6rem", whiteSpace: "nowrap", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {stat.funFact}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="px-4 py-2 text-right"
              style={{ fontFamily: "'VT323', monospace", color: player.color, fontSize: "0.9rem" }}
            >
              8 teams selected ▶
            </div>
          </div>
        ))}
      </div>

      {/* Team lookup */}
      <div className="mt-10" style={{ border: "2px dashed #333" }}>
        <div className="px-6 py-3" style={{ backgroundColor: "#111", borderBottom: "2px dashed #333" }}>
          <span style={{ fontFamily: "'Black Han Sans', sans-serif", color: "#e8ff00", fontSize: "1.1rem" }}>
            ⚡ FULL TEAM INDEX
          </span>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {PLAYERS.flatMap((p) =>
            p.teams.map((team) => (
              <div
                key={`${p.name}-${team}`}
                className="flex items-center gap-2 px-2 py-1"
                style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.8rem" }}
              >
                <span>{FLAGS[team] || "🏳"}</span>
                <span style={{ color: "#aaaaaa" }} className="truncate">{team}</span>
                <span style={{ color: p.color, marginLeft: "auto", whiteSpace: "nowrap", fontSize: "0.7rem" }}>
                  {p.name}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
