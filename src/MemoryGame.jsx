import React, { useState, useEffect, useMemo } from "react";
import { playSound } from "./utils/sound";
import "./style/MemoryGame.css";

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function MemoryGame({ onComplete, onBack, path }) {
  const CARDS = useMemo(() => {
    if (path === "seguranca") {
      return [
       { id: 1, front: "VPN", back: "Rede privada virtual segura" },
        { id: 2, front: "Autenticação de dois fatores", back: "Segunda proteção ao entrar em uma conta" },
        { id: 3, front: "Criptografia", back: "Transforma dados em códigos secretos" },
        { id: 4, front: "Vírus", back: "Aplicativo malicioso que prejudica o sistema" },
        { id: 5, front: "Senha", back: " Código necessário para acessar uma conta." },
        { id: 6, front: "Firewall", back: "Barreira que protege a rede" }
      ];
    }
    return [
      { id: 1, front: "Nuvem", back: "Lugar na internet para guardar arquivos e acessá-los de qualquer dispositivo." },
      { id: 2, front: "Backup", back: "Cópia extra de arquivos em outro lugar." },
      { id: 3, front: "Pendrive", back: "Dispositivo pequeno que você conecta no computador para guardar arquivos." },
      { id: 4, front: "HD externo", back: "Dispositivo maior que o pendrive, usado para guardar muitos arquivos fora do computador." },
      { id: 5, front: "Pasta", back: "Lugar dentro do computador ou pendrive para organizar arquivos." },
      { id: 6, front: "Sincronização", back: "Quando arquivos ficam iguais em dois ou mais aparelhos." }
    ];
  }, [path]);

  const COLORS = [
    "#4caf50", // verde
    "#2196f3", // azul
    "#ff9800", // laranja
    "#9c27b0", // roxo
    "#ff76caff", // vermelho
    "#704af8ff", // teal
    "#ffeb3b", // amarelo
    "#795548", // marrom
  ];

  const [deck, setDeck] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [pairColors, setPairColors] = useState({});
  const [completed, setCompleted] = useState(false);

  // 🔥 muda o fundo do body conforme o path
  useEffect(() => {
    document.body.style.backgroundImage =
      path === "armazenamento"
        ? "url('/img/armazenamento.png')"
        : "url('/img/seguranca.png')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";

    return () => {
      document.body.style.backgroundImage = "";
    };
  }, [path]);

  const initializeDeck = () => {
    const pairs = CARDS.flatMap(c => [
      { ...c, key: c.id + "-f", content: c.front, type: "front" },
      { ...c, key: c.id + "-b", content: c.back, type: "back" }
    ]);
    setDeck(shuffle(pairs));
    setFlipped([]);
    setMatched([]);
    setPairColors({});
    setCompleted(false);
  };

  useEffect(() => {
    initializeDeck();
  }, [CARDS]);

  function flip(card) {
    if (flipped.length === 2 || flipped.includes(card.key) || matched.includes(card.id)) return;
    setFlipped([...flipped, card.key]);

    if (flipped.length === 1) {
      const firstKey = flipped[0];
      const first = deck.find(c => c.key === firstKey);
      if (first.id === card.id && first.type !== card.type) {
        playSound("xp");
        setMatched([...matched, card.id]);

        // associa cor exclusiva para este par
        setPairColors(prev => {
          if (prev[card.id]) return prev;
          const usedColors = Object.values(prev);
          const available = COLORS.find(c => !usedColors.includes(c)) || "#4caf50";
          return { ...prev, [card.id]: available };
        });

        window.dispatchEvent(new CustomEvent("xp:add", { detail: 10 }));
        window.dispatchEvent(new CustomEvent("coins:add", { detail: 2 }));
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1500);
      }
    }
  }

  useEffect(() => {
    if (matched.length === CARDS.length) {
      const badge = path === "seguranca" ? "Guardião da Segurança" : "Guardião da Nuvem";
      window.dispatchEvent(new CustomEvent("badge:add", { detail: badge }));
      setCompleted(true); // ✅ agora só marca como completo
    }
  }, [matched, CARDS.length, path]);

  return (
    <div className={`memory-wrap ${path === "armazenamento" ? "theme-armazenamento" : "theme-seguranca"}`}>
      <h2 className="memory-title">
        {path === "armazenamento"
          ? "Armazenamento - Fase 2"
          : "Segurança - Fase 2"}
      </h2>

      <p className="memory-instructions">
        Encontre os pares de cartas que se combinam! <br />
        Cada acerto revela um conceito sobre o tema. <br />
        Será que você consegue lembrar onde está a carta?
      </p>

      <div className="memory-grid">
        {deck.map(card => {
          const isFlipped = flipped.includes(card.key);
          const isMatched = matched.includes(card.id);
          const matchedColor = isMatched ? pairColors[card.id] : null;

          return (
            <div
              key={card.key}
              onClick={() => flip(card)}
              className={`memory-card ${isFlipped || isMatched ? "flipped" : ""} ${isMatched ? "matched" : ""}`}
              style={matchedColor ? { background: matchedColor, color: "#fff" } : {}}
            >
              {isFlipped || isMatched ? card.content : "?"}
            </div>
          );
        })}
      </div>

      {/* Botão Voltar */}
      <button className="memory-back" onClick={onBack}>
        ⬅️ Voltar
      </button>

      {/* Botão Próxima Fase */}
      <div className="buttons">
        {completed && (
          <button onClick={onComplete} className="complete-button">
            Próxima Fase ➡
          </button>
        )}
      </div>
    </div>
  );
}
