import React, { useEffect, useState } from "react";
import "../style/Badges.css";
import { playSound, toggleMute, isMuted } from "../utils/sound";

const XP_PER_LEVEL = 100;

function readInt(k, fallback = 0) {
  const v = localStorage.getItem(k);
  const n = parseInt(v ?? "", 10);
  return Number.isFinite(n) ? n : fallback;
}

function getTitle(level) {
  if (level >= 10) return "Mestre do Código";
  if (level >= 7) return "Debugador Expert";
  if (level >= 4) return "Caçador de Bugs";
  return "Aprendiz de Programação";
}

export default function RPGHud({ theme }) {
  const [level, setLevel] = useState(() => readInt("rpg:level", 1));
  const [xp, setXp] = useState(() => readInt("rpg:xp", 0));
  const [coins, setCoins] = useState(() => readInt("rpg:coins", 0));
  const [klass, setKlass] = useState(() => localStorage.getItem("rpg:class") || "mago");
  const [badges, setBadges] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rpg:badges")) || []; } catch { return []; }
  });
  const [showBadges, setShowBadges] = useState(false);
  const [muted, setMuted] = useState(isMuted());
  const [xpAnim, setXpAnim] = useState(false);
  const [coinAnim, setCoinAnim] = useState(false);
  
  useEffect(() => {
    function onAddXP(ev) {
      const add = ev?.detail ?? 10;
      setXp(x => x + add);
      setCoins(c => c + Math.round(add / 2));
      setXpAnim(true);
      playSound("xp");
      setTimeout(() => setXpAnim(false), 300);
    }
    function onAddCoins(ev) {
      const add = ev?.detail ?? 5;
      setCoins(c => c + add);
      setCoinAnim(true);
      playSound("coin");
      setTimeout(() => setCoinAnim(false), 300);
    }
    function onBadge(ev) {
      const b = ev?.detail;
      if (!b) return;
      setBadges(bs => {
        if (bs.includes(b)) return bs;
        const updated = [...bs, b];
        localStorage.setItem("rpg:badges", JSON.stringify(updated));
        playSound("badge");
        return updated;
      });
    }
    window.addEventListener("xp:add", onAddXP);
    window.addEventListener("coins:add", onAddCoins);
    window.addEventListener("badge:add", onBadge);
    return () => {
      window.removeEventListener("xp:add", onAddXP);
      window.removeEventListener("coins:add", onAddCoins);
      window.removeEventListener("badge:add", onBadge);
    };
  }, []);

  useEffect(() => {
    if (xp >= XP_PER_LEVEL) {
      const times = Math.floor(xp / XP_PER_LEVEL);
      const rest = xp % XP_PER_LEVEL;
      const nextLevel = level + times;
      setLevel(nextLevel);
      setXp(rest);
      window.dispatchEvent(new CustomEvent("badge:add", { detail: `Nível ${nextLevel}` }));
    }
  }, [xp]);

  useEffect(() => {
    localStorage.setItem("rpg:level", String(level));
    localStorage.setItem("rpg:xp", String(xp));
    localStorage.setItem("rpg:coins", String(coins));
  }, [level, xp, coins]);

  const pct = Math.round((xp / XP_PER_LEVEL) * 100);

  // Cores neutras ou do tema
  const colors = !theme
    ? { bg: "#ffcfc2", text: "#ac3619", bar: "rgba(255, 255, 255, 0.5)", badgeBg: "#ffcfc2", badgeText: "#ac3619", anim: "rgba(255, 255, 255, 0.5)",   coinBg:" rgba(255, 255, 255, 0.5)"  } // neutro rosa
    : theme === "armazenamento"
    ? { bg: "#190d61", text: "#FFFFFF",  bar: "rgba(255,255,255,0.5)", badgeText: "#000000ff", anim: "#0050A0",   coinBg: "rgba(255, 255, 255, 0.5)" }
    : { bg: "#d3e7ff", text: "#000000ff", bar: "#5dadec", badgeBg: "#5dadec", badgeText: "#f5f5f5ff", anim: "#CDEEFF",   coinBg: "rgba(93, 173, 236, 0.5)" };

  return (
    <div style={{ ...styles.wrap, background: colors.bg, color: colors.text }}>
      <div style={styles.left}>
        <span
          style={{
            ...styles.classBadge,
            background: colors.bar,
            boxShadow: xpAnim ? `0 0 10px ${colors.anim}` : "none",
            transition: "box-shadow 0.3s ease"
          }}
        >
          {klass.toUpperCase()}
        </span>
        <span style={styles.level}>Lv {level}</span>
        <div style={styles.bar}>
          <div style={{ ...styles.fill, background: colors.text, width: pct + "%" }} />
        </div>
        <span style={styles.xp}>{xp} / {XP_PER_LEVEL}</span>
      </div>
      <div style={styles.right}>
        <button onClick={() => setShowBadges(true)} style={styles.iconBtn} title="Conquistas">
          🏆
        </button>
        <button
          onClick={() => { toggleMute(); setMuted(isMuted()); }}
          style={styles.iconBtn}
          title={muted ? "Som desligado" : "Som ligado"}
        >
          {muted ? "🔇" : "🔊"}
        </button>
       <span
  style={{
    ...styles.coins,
    background: colors.coinBg,
    boxShadow: coinAnim ? `0 0 10px ${colors.anim}` : "none",
    transition: "box-shadow 0.3s ease"
  }}
  title="Moedas"
>
  🪙 {coins}
</span>

      </div>

      {showBadges && (
        <div className="badges-overlay" onClick={() => setShowBadges(false)}>
          <div
            className="badges-modal"
            onClick={e => e.stopPropagation()}
            style={{ background: colors.badgeBg, color: colors.badgeText }}
          >
            <h3>Seu Cargo</h3>
            <p>🎖️ {getTitle(level)}</p>
            <button onClick={() => setShowBadges(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    position: "flex",
    top: 0,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "20px 10px",
    fontFamily: "'Press Start 2P', monospace",
    fontSize: 15,
    borderBottom: "2px solid rgba(0, 0, 0, 0.15)",
  },
  left: { display: "flex", alignItems: "center", gap: 10 },
  classBadge: {
    fontWeight: 900,
    padding: "10px 10px",
    borderRadius: 10,
    letterSpacing: 1,
  },
  level: { fontWeight: 800 },
  bar: {
    width: 160,
    height: 12,
    background: "rgba(0,0,0,.15)",
    borderRadius: 6,
    overflow: "hidden",
    boxShadow: "inset 0 2px 0 rgba(0,0,0,.4)",
  },
  fill: { height: "100%" },
  xp: { fontSize: 10, opacity: 0.85 },
  right: { display: "flex", alignItems: "center", gap: 12 },
  coins: {
    background: "rgba(255, 255, 255, 0.5)",
    padding: "7px 8px",
    borderRadius: 6,
    fontWeight: 800,
    fontSize: "16px",
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "24px",
  },
};
