import React, { useEffect, useRef, useState } from "react";
import virusAr1 from "/img/virusar1.png";
import virusAr2 from "/img/virusar2.png";
import virusSg1 from "/img/virussg1.png";
import virusSg2 from "/img/virussg2.png";
import "./style/MataMosca.css";

export default function MataMosca({ path, onComplete, onBack, backButtonStyle }) {
  const [moscas, setMoscas] = useState([]);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(true);
  const useAltImgRef = useRef(false);

  const spawnRef = useRef(null);
  const timerRef = useRef(null);
  const areaRef = useRef(null);
  const idCounter = useRef(0);

  const GAME_TIME = 30;
  const SPAWN_INTERVAL = 1100;
  const MAX_MOSCAS = 1;

  // retorna as imagens corretas conforme o caminho
  const getVirusImgs = () => {
    if (path === "seguranca") {
      return [virusSg1, virusSg2];
    }
    return [virusAr1, virusAr2];
  };

  const startGame = () => {
    clearInterval(spawnRef.current);
    clearInterval(timerRef.current);

    idCounter.current = 0;
    setTimeLeft(GAME_TIME);
    setLives(3);
    setScore(0);
    setMoscas([]);
    setRunning(true);

    // Timer ⏱️
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setTimeLeft(0); // garante renderização no fim
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    // Spawn de vírus
    spawnRef.current = setInterval(() => {
      setMoscas((cur) => {
        if (!areaRef.current) return cur;
        if (cur.length >= MAX_MOSCAS) return cur;

        const rect = areaRef.current.getBoundingClientRect();
        const margin = 40;
        const bottomLimit = 150; // distância da parte inferior onde NÃO pode nascer

        const x = Math.max(margin, Math.random() * (rect.width - margin * 2));
        const y = Math.max(
          margin,
          Math.random() * (rect.height - margin - bottomLimit)
        );

        idCounter.current += 1;
        const size = 36 + Math.floor(Math.random() * 36);

        // escolhe imagem conforme caminho + alternância
        const [img1, img2] = getVirusImgs();
        const img = useAltImgRef.current ? img2 : img1;

        return [
          {
            id: "m" + idCounter.current,
            x,
            y,
            size,
            img,
          },
        ];
      });
    }, SPAWN_INTERVAL);
  };

  useEffect(() => {
    startGame();
    return () => {
      clearInterval(spawnRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

  // Se o vírus não for clicado → perde vida
  useEffect(() => {
    if (!running || moscas.length === 0) return;

    const t = setTimeout(() => {
      setMoscas([]);
      setLives((lv) => {
        const n = lv - 1;
        if (n <= 0) stopGame(false);
        return n;
      });
    }, 2000);

    return () => clearTimeout(t);
  }, [moscas, running]);

  const stopGame = (win) => {
    setRunning(false);
    clearInterval(spawnRef.current);
    clearInterval(timerRef.current);

    if (win) {
      window.dispatchEvent(new CustomEvent("xp:add", { detail: 50 }));
      window.dispatchEvent(new CustomEvent("coins:add", { detail: 20 }));
      window.dispatchEvent(new CustomEvent("badge:add", { detail: "Caçador de Moscas" }));
      setTimeout(() => onComplete && onComplete(), 600);
    }
  };

  const killMosca = (id) => {
    setScore((s) => {
      const newScore = s + 1;
      if (newScore >= 12) stopGame(true);
      return newScore;
    });
    setMoscas([]);
    useAltImgRef.current = !useAltImgRef.current; // alterna ref
  };

  const resetGame = () => {
    idCounter.current = 0;
    startGame();
  };

  return (
  <div
  ref={areaRef}
  className={`mata-mosca-container ${
    path === "armazenamento" ? "theme-armazenamento" : "theme-seguranca"
  }`}
>
 {/* Header da fase */}
<div className="game-header">
  <h1>
    {path === "armazenamento"
      ? "Armazenamento - Fase 4"
      : "Segurança - Fase 4"}
  </h1>

  {/* Texto só aparece enquanto o jogo está rodando */}
  {running && (
    <p>
      Cuidado! Vírus estão aparecendo na tela. Toque rápido neles para eliminar
      a ameaça e proteger sua nuvem. Não deixe nenhum escapar!
    </p>
  )}
</div>



      {/* HUD */}
      <div className="hud">
     <div className="hud-info">
  {running && (
    <>
      <span className="hud-time">⏱ {timeLeft}s</span>
      <span className="hud-score">💥 {score}</span>
    </>
  )}
  <div className="hud-lives" aria-label={`Vidas: ${lives}`}>
      {Array.from({ length: 3 }).map((_, idx) =>
        idx < lives ? (
          <img
            key={idx}
            src="/img/heart.png"
            alt="Vida"
            className="heart-icon"
          />
        ) : null
      )}
    </div>
</div>

      </div>

      {/* Área de jogo */}
      <div className="game-area">
        {moscas.map((m) => (
          <img
            key={m.id}
            src={m.img}
            alt="mosca"
            onClick={() => killMosca(m.id)}
            className="mosca"
            style={{ left: m.x, top: m.y, width: m.size, height: m.size }}
          />
        ))}

        {!running && lives <= 0 && (
  <div className="mosca-eliminated">
    <img src="../img/caveira.png" alt="Eliminado" className="mosca-icon" />
    <h2> Game Over</h2>
    <p>
      Você deixou muitos vírus escaparem...<br />
      A nuvem ficou vulnerável!
    </p>
    <button className="mosca-cta" onClick={resetGame}>
      Tentar novamente 🔄
    </button>
    <button className="mosca-cta" onClick={onBack}>
      Voltar ao início ⬅️
    </button>
  </div>
)}{/* Tempo esgotado */}
{!running && timeLeft === 0 && (
  <div className="mosca-eliminated">
    <img src="../img/erro.png" alt="Tempo Esgotado" className="mosca-icon" />
    <h2>⏰ Tempo esgotado</h2>
    <p>
      O tempo acabou antes de você derrotar os vírus.<br />
      Que tal tentar de novo mais rápido?
    </p>
    <button className="mosca-cta" onClick={resetGame}>
      Jogar novamente 🔄
    </button>
    <button className="mosca-cta" onClick={onBack}>
      Voltar ao início ⬅️
    </button>
  </div>
        )}
      </div>
    </div>
  );
}
