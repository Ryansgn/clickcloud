import React from "react";
import "./style/StartScreen.css";

export default function StartScreen({ onStart, onRules, onAbout }) {
  return (
    <div className="start-screen">
      <div className="parallax">
        <div className="cloud c1" />
        <div className="cloud c2" />
        <div className="cloud c3" />
        <div className="sparkles" />
      </div>

      <div className="menu card">
        <h1 className="title"> CLICK CLOUD </h1>
        <p className="intro">
          Em um reino distante, duas estradas mágicas levam você a aventuras
          únicas. Escolha com sabedoria e prepare-se para os desafios.
        </p>

        <div className="buttons column">
          <button className="menu-btn" onClick={onStart}>
            INICIAR JORNADA
          </button>
          <button className="menu-btn" onClick={onRules}>
            REGRA DO JOGO
          </button>
          <button className="menu-btn" onClick={onAbout}>
            SOBRE NÓS
          </button>
        </div>
      </div>
    </div>
  );
}