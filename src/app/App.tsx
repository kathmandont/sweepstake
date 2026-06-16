import { useState, useEffect, useRef } from "react";
import { TeamsTab } from "./components/TeamsTab";
import { PrizesTab } from "./components/PrizesTab";
import { TodayTab } from "./components/TodayTab";
import { TablesTab } from "./components/TablesTab";
import elvisImg from "../imports/image18-1.jpeg";

const TABS = [
  { id: "today", label: "TODAY'S GAMES", icon: "📡" },
  { id: "tables", label: "TABLES", icon: "📊" },
  { id: "teams", label: "THE TEAMS", icon: "⚽" },
  { id: "prizes", label: "THE PRIZES", icon: "🍔" },
];

// Scrolling ticker content
const TICKER_ITEMS = [
  "WORLD CUP 2026",
"RESPECT THE DRAW",
  "RESPECT THE FILET-O-FISH",
  "48 TEAMS • 3 NATIONS • THIS IS YOUR TIME",
  "POOCH vs WIGGLES vs CHONKIE BOO vs MEDLEY vs TINY CANS vs BURGER",
  "CASH GOES IN THE POT • DONALD'S BRINGS THE PRIZES",
  "★ ★ ★",
];

function Ticker() {
  return (
    <div
      className="overflow-hidden py-2"
      style={{ backgroundColor: "#e8ff00", borderBottom: "2px solid #000" }}
    >
      <div
        className="whitespace-nowrap"
        style={{
          display: "inline-block",
          animation: "ticker-stop 10s ease-out 1 forwards",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.85rem",
          color: "#000",
          fontWeight: 700,
        }}
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="mx-8">
            ◆ {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes elvisExit {
          0%   { transform: rotate(0deg) scale(1) translate(0, 0); opacity: 1; }
          30%  { transform: rotate(180deg) scale(1) translate(0, 0); opacity: 1; }
          55%  { transform: rotate(-90deg) scale(1) translate(0, 0); opacity: 1; }
          75%  { transform: rotate(0deg) scale(0.9) translate(0, 0); opacity: 1; }
          100% { transform: rotate(720deg) scale(0) translate(300%, -200%); opacity: 0; }
        }
        @keyframes ticker-stop {
          0% { transform: translateX(0); }
          100% { transform: translateX(-15%); }
        }
      `}</style>
    </div>
  );
}

function Scanlines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
      }}
    />
  );
}

function NoiseBg() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 opacity-[0.025]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
    />
  );
}

function ElvisHero() {
  const [state, setState] = useState<"idle" | "spinning" | "gone">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHover = () => {
    if (state !== "idle") return;
    setState("spinning");
    timerRef.current = setTimeout(() => {
      setState("gone");
      setTimeout(() => setState("idle"), 2000);
    }, 1200);
  };

  const handleClick = () => {};

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleHover}
      style={{
        position: "absolute",
        right: 0,
        bottom: 0,
        top: 0,
        width: "clamp(200px, 35%, 420px)",
        pointerEvents: "auto",
        cursor: state === "gone" ? "pointer" : "default",
        overflow: "hidden",
      }}
    >
      <img
        src={elvisImg}
        alt="Chonkie Boo"
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          height: "100%",
          width: "100%",
          objectFit: "cover",
          objectPosition: "50% 10%",
          maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.85) 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.85) 100%)",
          filter: "grayscale(100%) brightness(0.55) contrast(1.2)",
          mixBlendMode: "screen",
          transformOrigin: "center center",
          animation: state === "spinning" ? "elvisExit 1.2s ease-in forwards" : "none",
          opacity: state === "gone" ? 0 : 1,
          transition: state === "gone" ? "none" : "opacity 0.1s",
        }}
      />
    </div>
  );
}

function GlitchText({ children }: { children: string }) {
  const [glitch, setGlitch] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [tick, setTick] = useState(0);

  // Idle random glitch
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  // Rapid tick while hovered for shimmer/distort animation
  useEffect(() => {
    if (!hovered) return;
    const id = setInterval(() => setTick((t) => t + 1), 60);
    return () => clearInterval(id);
  }, [hovered]);

  const r = hovered ? Math.random() : 0;
  const skew = hovered ? (Math.sin(tick * 0.7) * 6).toFixed(1) : glitch ? "-1" : "0";
  const offsetX = hovered ? (Math.sin(tick * 1.3) * 4).toFixed(1) : glitch ? "2" : "0";
  const offsetX2 = hovered ? (Math.sin(tick * 0.9 + 2) * 5).toFixed(1) : glitch ? "-2" : "0";
  const shimmerPos = hovered ? `${((tick * 3) % 200) - 50}%` : "200%";

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "inline-block",
        cursor: "default",
        transform: `skewX(${skew}deg)`,
        textShadow: hovered
          ? `${offsetX}px 0 #ff00ff, ${offsetX2}px 0 #00ffff, 0 0 30px #ffffff88`
          : glitch
          ? "2px 0 #ff00ff, -2px 0 #00ffff"
          : "none",
        backgroundImage: hovered
          ? `linear-gradient(105deg, transparent ${shimmerPos}, rgba(255,255,255,0.85) calc(${shimmerPos} + 60px), transparent calc(${shimmerPos} + 120px))`
          : "none",
        backgroundClip: hovered ? "text" : undefined,
        WebkitBackgroundClip: hovered ? "text" : undefined,
        color: hovered ? "transparent" : "inherit",
        WebkitTextFillColor: hovered ? "transparent" : undefined,
        transition: hovered ? "none" : "transform 0.2s, text-shadow 0.2s",
        filter: hovered ? `blur(${(r * 0.4).toFixed(2)}px)` : "none",
      }}
    >
      {children}
    </span>
  );
}

function useAnalytics() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-MHP47FM03H";
    script.async = true;
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) { (window as any).dataLayer.push(args); }
    (window as any).gtag = gtag;
    gtag("js", new Date());
    gtag("config", "G-MHP47FM03H");
  }, []);
}

function useFavicon() {
  useEffect(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍔</text></svg>`;
    const url = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = url;

    document.title = "This is your time";

    const setMeta = (property: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", property); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    const setNameMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };

    setMeta("og:title", "This is your time");
    setMeta("og:description", "This is your time");
    setMeta("og:type", "website");
    setNameMeta("twitter:card", "summary");
    setNameMeta("twitter:title", "This is your time");
    setNameMeta("twitter:description", "This is your time");
    setNameMeta("description", "This is your time");
  }, []);
}

export default function App() {
  const [activeTab, setActiveTab] = useState("today");
  useAnalytics();
  useFavicon();

  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "#1c1c1e", fontFamily: "'Share Tech Mono', monospace" }}
    >
      {/* MARKER-MAKE-KIT-INVOKED */}
      <Scanlines />
      <NoiseBg />

      {/* ===== HEADER ===== */}
      <header style={{ borderBottom: "4px solid #39ff14", position: "relative", overflow: "hidden", minHeight: "160px" }}>
        {/* Neon top stripe */}
        <div style={{ height: "4px", background: "linear-gradient(90deg, #ff00ff, #00ffff, #39ff14, #e8ff00, #ff00ff)" }} />

        <div className="px-4 md:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
            {/* Logo area */}
            <div>
              <h1
                style={{
                  fontFamily: "'Black Han Sans', sans-serif",
                  fontSize: "clamp(1.8rem, 6vw, 3.5rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                }}
              >
                <GlitchText>BURGER'S WORLD CUP 2026</GlitchText>
              </h1>
              <h2
                style={{
                  fontFamily: "'Black Han Sans', sans-serif",
                  fontSize: "clamp(1.2rem, 4vw, 2.2rem)",
                  lineHeight: 1,
                  color: "#39ff14",
                  letterSpacing: "0.05em",
                }}
              >
                <GlitchText>SWEEPSTAKE</GlitchText>
              </h2>
              <div
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  color: "#555",
                  fontSize: "0.75rem",
                  marginTop: "6px",
                }}
              >
                USA · CANADA · MEXICO · JUNE–JULY 2026
              </div>
            </div>

            {/* Right panel — fun stats */}
            <div className="flex gap-3 flex-wrap">
              {[
                { val: "6", label: "PLAYERS" },
                { val: "48", label: "TEAMS" },
                { val: "8", label: "EACH" },
                { val: "∞", label: "BEEF" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="text-center px-3 py-2"
                  style={{ border: "2px solid #222", backgroundColor: "#0d0d0d", minWidth: "56px" }}
                >
                  <div
                    style={{
                      fontFamily: "'VT323', monospace",
                      color: "#e8ff00",
                      fontSize: "2rem",
                      lineHeight: 1,
                    }}
                  >
                    {s.val}
                  </div>
                  <div style={{ fontSize: "0.6rem", color: "#444", letterSpacing: "0.15em" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ElvisHero />

        {/* Ticker */}
        <Ticker />
      </header>

      {/* ===== TABS ===== */}
      <nav style={{ borderBottom: "3px solid #222", backgroundColor: "#060606", position: "sticky", top: 0, zIndex: 10 }}>
        <div className="flex overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-shrink-0 px-5 py-3 flex items-center gap-2 transition-all duration-100"
              style={{
                fontFamily: "'Black Han Sans', sans-serif",
                fontSize: "0.85rem",
                letterSpacing: "0.05em",
                border: "none",
                borderBottom: activeTab === tab.id ? "3px solid #39ff14" : "3px solid transparent",
                backgroundColor: activeTab === tab.id ? "#111" : "transparent",
                color: activeTab === tab.id ? "#39ff14" : "#555",
                cursor: "pointer",
                marginBottom: "-3px",
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ===== CONTENT ===== */}
      <main className="max-w-7xl mx-auto">
        {activeTab === "today" && <TodayTab />}
        {activeTab === "tables" && <TablesTab />}
        {activeTab === "teams" && <TeamsTab />}
        {activeTab === "prizes" && <PrizesTab />}
      </main>

      {/* ===== FOOTER ===== */}
      <footer
        className="mt-12 px-6 py-8 text-center"
        style={{
          borderTop: "3px solid #111",
          background: "linear-gradient(180deg, transparent, #050505)",
        }}
      >
        <div
          style={{
            fontFamily: "'VT323', monospace",
            color: "#222",
            fontSize: "1rem",
            lineHeight: 1.8,
          }}
        >
          <div style={{ color: "#333" }}>BURGER'S SWEEPSTAKE™ · WORLD CUP 2026 EDITION</div>
          <div>all prizes subject to availability · tap water is non-negotiable</div>
          <div style={{ color: "#1a1a1a" }}>This is your time</div>
        </div>
        <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #ff00ff44, #00ffff44, transparent)", marginTop: "24px" }} />
      </footer>
    </div>
  );
}
