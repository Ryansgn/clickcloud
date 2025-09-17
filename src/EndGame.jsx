import React from "react";
import "./style/EndGame.css";

export default function EndGame({ path, onRestart }) {
  const klass = localStorage.getItem("rpg:class") || "N/A";
  const xp = localStorage.getItem("rpg:xp") || 0;
  const coins = localStorage.getItem("rpg:coins") || 0;
  const level = localStorage.getItem("rpg:level") || 1;

  const message =
    path === "armazenamento"
      ? "Você se tornou um mestre do Armazenamento na Nuvem!"
      : "Você se tornou um mestre da Segurança da Informação!";

  return (
    <div
      className={`endgame-screen ${
        path === "armazenamento"
          ? "theme-armazenamento1"
          : "theme-seguranca1"
      }`}
    >
      <div className="endgame-container">
        <h2 className="endgame-title">🏆 FIM DA JORNADA!</h2>
        <p className="endgame-message">{message}</p>

        <div className="endgame-stats">
          <div className="stat-box">⚔ Caminho escolhido: {klass}</div>
          <div className="stat-box">⭐ Nível {level}: {xp} xp</div>
          <div className="stat-box">💰 Moedas conquistadas: {coins}</div>
        </div>

        <button onClick={onRestart} className="endgame-btn">
          ⬅ VOLTAR AO MENU
        </button>
      </div>
    </div>
  );
}
