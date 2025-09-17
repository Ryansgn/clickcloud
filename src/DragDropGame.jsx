import React, { useState, useEffect } from "react";
import "./style/DragDropGame.css";

export default function DragDropGame({ onBack, theme, onComplete, backButtonStyle }) {
  const [message, setMessage] = useState("");
  const [items, setItems] = useState([]);
  const [droppedItems, setDroppedItems] = useState({});
  const [completed, setCompleted] = useState(false);
  const [errorCompartment, setErrorCompartment] = useState(null);
  const [successCompartment, setSuccessCompartment] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const baseItemsByTheme = (t) =>
    t === "armazenamento"
      ? [
        { name: "🧾 Nota Fiscal", type: "privada" },
          { name: "🗄️ Backup", type: "privada" },
          { name: "🗂️ Arquivo Pessoal", type: "privada" },
          { name: "💽 HD Externo", type: "privada" },
          { name: "🏦 Comprovante Bancário", type: "privada" },
          { name: "📷 Foto", type: "publica" },
          { name: "🎵 Música", type: "publica" },
          { name: "🎬 Vídeo", type: "publica" },
          { name: "📝 Anotações", type: "publica" },
          { name: "🎮 Jogo", type: "publica" },
        ]
      : [
       { name: "🔑 Senha Forte", type: "seguranca" },
          { name: "👤 Autenticação", type: "seguranca" },
          { name: "🔏 VPN", type: "seguranca" },
          { name: "🛡️ Firewall", type: "seguranca" },
          { name: "💾 Criptografia", type: "seguranca" },
          { name: "🔗 Link Malicioso", type: "ameaca" },
          { name: "🐞 Vírus", type: "ameaca" },
          { name: "💀 Malware", type: "ameaca" },
          { name: "🏴‍☠️ Pirataria", type: "ameaca" },
          { name: "🐴 Trojan", type: "ameaca" },
        ];

  const compartments =
    theme === "armazenamento"
      ? { privada: "☁️ Nuvem Privada", publica: "🌐 Nuvem Pública" }
      : { seguranca: "🛡️ Segurança", ameaca: "💀 Ameaças" };

  useEffect(() => {
    const base = baseItemsByTheme(theme);
    setItems(shuffleArray(base));
    setDroppedItems({});
    setMessage("");
    setCompleted(false);
  }, [theme, resetKey]);

  const handleDrop = (e, compartmentType) => {
    e.preventDefault();
    const itemName = e.dataTransfer.getData("text/plain") || e.dataTransfer.getData("text");
    const item = items.find((it) => it.name === itemName);
    if (!item) return;

    if (item.type === compartmentType) {
      if (!droppedItems[itemName]) {
        const updated = { ...droppedItems, [itemName]: compartmentType };
        setDroppedItems(updated);
        setMessage(`✅ Você guardou ${itemName} em ${compartments[compartmentType]}!`);
        setSuccessCompartment(compartmentType);
setTimeout(() => setSuccessCompartment(null), 700);

        if (Object.keys(updated).length === items.length) {
          setCompleted(true);
          window.dispatchEvent(new CustomEvent("xp:add", { detail: 40 }));
          window.dispatchEvent(new CustomEvent("coins:add", { detail: 15 }));
          window.dispatchEvent(new CustomEvent("badge:add", { detail: "Guardião Digital" }));
        }
      } else {
        setMessage(`⚠️ O item ${itemName} já foi guardado!`);
      }
    } else {
      setMessage(`❌ ${itemName} não pertence a ${compartments[compartmentType]}!`);
      setErrorCompartment(compartmentType);
      setTimeout(() => setErrorCompartment(null), 700);
    }
  };

  const allowDrop = (e) => e.preventDefault();
  const handleReset = () => setResetKey((k) => k + 1);

  const progressCount = Object.keys(droppedItems).length;
  const totalCount = items.length || 0;
return (
  <div
    className={`drag-drop-layout ${
      theme === "armazenamento" ? "theme-armazenamento" : "theme-seguranca"
    }`}
    style={{
      backgroundImage:
        theme === "armazenamento"
          ? "url('/img/armazenamento.png')"
          : "url('/img/seguranca.png')",
    }}
  >

  
  <div className="drag-drop-container">
    {/* 🔹 TÍTULO */}
    <h1 className="drag-drop-title">
  {theme === "armazenamento"
    ? "Armazenamento - Fase 1"
    : "Segurança - Fase 1"}
</h1>

<p className="drag-drop-description">
  {theme === "armazenamento"
    ? "A Nuvem pública funciona como uma biblioteca aberta.\nA nuvem privada, só você tem controle.\nGuarde cada item no lugar certo para proteger suas coisas!"
    : "Segurança é como brincar de separar o que é do bem e o que é do mal.\nColoque cada coisa no lugar certo para deixar seu espaço protegido!"}
</p>


    <div className="draggables">
      {items.map((it) => {
        const dropped = !!droppedItems[it.name];
        return (
          <div
            key={it.name}
            draggable={!dropped}
            onDragStart={(e) => e.dataTransfer.setData("text/plain", it.name)}
            className={`draggable ${dropped ? "dropped" : ""}`}
          >
            {it.name}
          </div>
        );
      })}
    </div>
    
        <div className="compartments">
          {Object.entries(compartments).map(([type, label]) => (
     <div
  key={type}
  onDrop={(e) => handleDrop(e, type)}
  onDragOver={allowDrop}
  className={`compartment ${errorCompartment === type ? "error" : ""} ${successCompartment === type ? "success" : ""}`}
>
  <div>Arraste até aqui →</div>
  <div style={{ marginTop: 8, fontWeight: 800 }}>{label}</div>
</div>

          ))}
        </div>

        <div className="progress">
          Progresso: {progressCount}/{totalCount} itens organizados
        </div>

        {message && <p className="feedback-message">{message}</p>}

        <div className="buttons">
          {completed && (
            <button onClick={onComplete} className="complete-button">
              Próxima Fase ➡
            </button>
          )}
        </div>

        <button
         onClick={onBack} className="back-button">
  ⬅ Voltar
</button>

      </div>
    </div>
  );
}
