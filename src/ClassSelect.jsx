import React, { useState, useEffect } from "react";
import "./style/ClassSelect.css";

// Importa as fontes via link (opção mais simples)
const FONT_LINK = document.createElement("link");
FONT_LINK.href =
  "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Disket+Mono&display=swap";
FONT_LINK.rel = "stylesheet";
document.head.appendChild(FONT_LINK);

const CLASSES = [
  { id: "mago", name: "Mago da Nuvem", emoji: "🧙‍♂️", desc: "Controla backups e tempestades de dados." },
  { id: "arqueiro", name: "Arqueiro do Backup", emoji: "🏹", desc: "Velocidade e precisão para salvar arquivos." },
  { id: "cavaleira", name: "Cavaleira do Firewall", emoji: "🛡️", desc: "Protege o reino contra bugs e invasores." }
];
export default function ClassSelect({ onSelect, onBack }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("rpg:class");
    if (saved) setSelected(saved);
  }, []);

  const handleConfirm = () => {
    if (!selected) return;
    localStorage.setItem("rpg:class", selected);
    if (!localStorage.getItem("rpg:xp")) {
      localStorage.setItem("rpg:xp", "0");
      localStorage.setItem("rpg:coins", "0");
      localStorage.setItem("rpg:level", "1");
    }
    onSelect();
  };

  return (
    <div className="class-screen">
      <div className="class-container">
        <h2 className="class-title">Escolha sua Classe</h2>

        <div className="class-options">
          {CLASSES.map((c) => (
            <div
              key={c.id}
              className={`class-card ${selected === c.id ? "selected" : ""}`}
              onClick={() => setSelected(c.id)}
            >
              <span className="emoji">{c.emoji}</span>
              <div className="name">{c.name}</div>
              <p className="desc">{c.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="class-btn-confirm" onClick={onBack}>
             ⬅ VOLTAR
          </button>
          <button className="class-btn-confirm" onClick={handleConfirm}>
             CONFIRMAR CLASSE
          </button>
        </div>
      </div>
    </div>
  );
}
