import React, { useState } from "react";
import DragDropGame from "./DragDropGame";
import StartScreen from "./StartScreen";
import RPGHud from "./components/RPGHud";
import CloudQuiz from "./CloudQuiz";
import MemoryGame from "./MemoryGame";
import MataMosca from "./MataMosca";
import ClassSelect from "./ClassSelect"; 
import EndGame from "./Endgame";
import "./style/App.css";

export default function App() {
  const [started, setStarted] = useState(false);
  const [classChosen, setClassChosen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [path, setPath] = useState(null);
  const [phase, setPhase] = useState(1);
  const [screen, setScreen] = useState("start");

  const nextPhase = () => {
    setPhase((p) => p + 1);
    window.dispatchEvent(new CustomEvent("xp:add", { detail: 20 }));
  };

  /* ---------------- 🔹 TELA INICIAL ---------------- */
  if (screen === "start") {
    return (
      <StartScreen
        onStart={() => {
          setStarted(true);
          setScreen("class");
        }}
        onRules={() => setScreen("rules")}
        onAbout={() => setScreen("about")}
      />
    );
  }

  /* ---------------- 🔹 REGRAS ---------------- */
  if (screen === "rules") {
    return (
      <div className="rules-screen">
        <div className="rules-container">
          <h2 className="rules-title">REGRAS DO JOGO</h2>
          <ol className="rules-list">
            <li>ESCOLHA SUA CLASSE PARA INICIAR A JORNADA.</li>
            <li>COMPLETE OS DESAFIOS PARA GANHAR XP E MOEDAS.</li>
            <li>USE SUA ESTRATÉGIA PARA AVANÇAR PELOS CAMINHOS.</li>
            <li>VENÇA OS MINIGAMES PARA CONCLUIR A AVENTURA!</li>
          </ol>

          <button onClick={() => setScreen("start")} style={backBtn}>
            ⬅ VOLTAR AO MENU
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- 🔹 SOBRE ---------------- */
  if (screen === "about") {
    return (
      <div className="about-screen">
        <div className="about-container">
          <h2 className="about-title">SOBRE NÓS</h2>
          <img src="/img/logo2.png" alt="Logo Borboleta" className="about-logo" />
          <p className="about-text">
            OLÁ, SOMOS O <b>ASACLICK</b>, EMPRESA FICTÍCIA DE INFORMÁTICA FORMADA
            POR ALUNOS DA <b>ETEC HELIÓPOLIS - ARQUITETO RUY OHTAKE</b> DO CURSO
            DE <b>INFORMÁTICA PARA INTERNET</b>.
          </p>
          <p className="about-text">
            CRIAMOS ESTE JOGO COMO PARTE DE NOSSOS ESTUDOS DA MATÉRIA DE{" "}
            <b>DESENVOLVIMENTO PARA DISPOSITIVOS MÓVEIS</b> JUNTAMENTE COM{" "}
            <b>COMPUTAÇÃO EM NUVEM</b>, UNINDO TECNOLOGIA E CRIATIVIDADE PARA
            ENSINAR CONCEITOS DE COMPUTAÇÃO EM NUVEM E SEGURANÇA DA INFORMAÇÃO DE
            FORMA DIVERTIDA E ACESSÍVEL.
          </p>

          <button onClick={() => setScreen("start")} style={backBtn}>
            ⬅ VOLTAR AO MENU
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- 🔹 ESCOLHA DE CLASSE ---------------- */
  if (screen === "class" && !classChosen) {
    return (
      <ClassSelect
        onSelect={() => {
          setClassChosen(true);
          setScreen("path");
        }}
        onBack={() => setScreen("start")}
      />
    );
  }

  /* ---------------- 🔹 ESCOLHA DE CAMINHO ---------------- */
  if (screen === "path" && !path) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundImage: "url('/img/caminhos.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Press Start 2P', monospace",
        }}
      >
        {/* HUD neutro antes da escolha */}
        <RPGHud theme={path} />

        <div style={{ display: "grid", placeItems: "center", padding: 24, flex: 1 }}>
          <h2
            style={{
              margin: "12px 0 30px",
              fontSize: 32,
              fontWeight: 900,
              color: "#000000ff",
              textShadow: "0 2px 0 #fff",
              textAlign: "center",
            }}
          >
            Escolha seu caminho
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 28,
              width: "min(960px,92vw)",
              marginBottom: 24,
              marginTop: -30,
            }}
          >
            <button 
              onClick={() => setPath("armazenamento")} 
              className="door-btn door-blue"
            >
              <div style={doorTitle}>Estrada do Armazenamento</div>
              <div style={doorDesc}>
                EXERCÍCIOS DE COMPUTAÇÃO<br />EM NUVEM.
              </div>
            </button>

            <button 
              onClick={() => setPath("seguranca")} 
              className="door-btn door-lightblue"
            >
              <div style={doorTitle}>Trilha da Segurança</div>
              <div style={doorDesc}>
                EXERCÍCIOS DE SEGURANÇA<br />DA INFORMAÇÃO.
              </div>
            </button>
          </div>

          <div style={{ marginTop: 48 }}>
            <button
              onClick={() => {
                setStarted(false);
                setClassChosen(false);
                setSelectedClass(null);
                setPath(null);
                setPhase(1);
                setScreen("class");
              }}
              style={backBtn}
            >
              ⬅ VOLTAR
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- 🔹 MINIGAMES ---------------- */
  if (screen === "path" && path) {
    return (
      <>
        {/* HUD muda conforme o caminho escolhido */}
        <RPGHud theme={path} />

        <div style={{ textAlign: "center", padding: "0px" }}>
          {phase === 1 && (
            <DragDropGame
              theme={path}
              onComplete={() => setPhase(2)}
              onBack={() => { setPath(null); setScreen("path"); }}
              backButtonStyle={backButtonStyle}
            />
          )}

          {phase === 2 && (
            <CloudQuiz
              path={path}
              onComplete={() => setPhase(3)}
              onBack={() => setPhase(1)}
            />
          )}

          {phase === 3 && (
            <MemoryGame
              path={path}
              onComplete={() => setPhase(4)}
              onBack={() => setPhase(2)}
            />
          )}

          {phase === 4 && (
            <MataMosca
              path={path}
              onComplete={() => setScreen("endgame")}
              onBack={() => setPhase(3)}
              backButtonStyle={backButtonStyle}
            />
          )}
        </div>
      </>
    );
  }

  /* ---------------- 🔹 ENDGAME ---------------- */
  if (screen === "endgame") {
    return (
      <EndGame
        path={path}
        onRestart={() => {
          setStarted(false);
          setClassChosen(false);
          setSelectedClass(null);
          setPath(null);
          setPhase(1);
          setScreen("start");
        }}
      />
    );
  }
}

/* ---------------- 🔹 ESTILOS ---------------- */
const doorBase = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "30px 20px",
  borderRadius: 18,
  cursor: "pointer",
  transition: "transform .25s ease",
  fontWeight: 600,
  border: "2px solid rgba(0,0,0,.15)",
  textAlign: "center",
};

const doorTitle = {
  fontSize: 14,
  fontWeight: 900,
  marginBottom: 16,
  textTransform: "uppercase",
};

const doorDesc = {
  fontFamily: "'Disket Mono', monospace",
  fontSize: 20,
  lineHeight: 1.4,
};

const backBtn = {
  background: "#f47c57",
  border: "2px solid #e97b62",
  color: "#000000ff",
  padding: "12px 24px",
  borderRadius: 12,
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 14,
  fontFamily: "'Press Start 2P', monospace",
  boxShadow: "0 3px 0 #e97b62",
  transition: "all .2s ease",
};

const backButtonStyle = {
  padding: "10px 18px",
  fontSize: 15,
  borderRadius: 12,
  background: "linear-gradient(180deg, rgba(255,255,255,.1), rgba(255,255,255,.03))",
  border: "1px solid rgba(255,255,255,.2)",
  color: "#fff",
  cursor: "pointer",
  transition: "transform .15s ease, box-shadow .15s ease",
  boxShadow: "0 6px 14px rgba(0,0,0,.25)",
};
