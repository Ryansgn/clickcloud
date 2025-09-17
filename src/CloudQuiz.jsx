import React, { useEffect, useState } from "react";
import { playSound } from "./utils/sound";
import "./style/Cloudquiz.css";

export default function CloudQuiz({ onBack, path, onComplete }) {
const armazenamento = [
  {
    context: "Às vezes guardamos nossos desenhos ou fotos na internet. Isso permite que você abra esses arquivos não só no computador da escola, mas também no celular ou tablet em casa.",
    q: "Qual destas situações é um exemplo de uso da nuvem?",
    a: [
      "Salvar um trabalho apenas no pendrive para levar para casa.",
      "Mandar um desenho por e-mail e guardar na caixa de entrada.",
      "Salvar uma foto no Google Drive e abrir depois em outro computador.",
      "Copiar o arquivo para a área de trabalho do computador.",
    ],
    correct: 2,
    tip: "Pense em arquivos que você consegue abrir de vários lugares.",
  },
  {
    context: "Guardar algo no computador significa que ele fica só naquele aparelho. Mas se você quiser acessar o mesmo arquivo em outro lugar, precisa de um jeito diferente de guardar.",
    q: "Qual opção mostra melhor a diferença entre salvar na nuvem e salvar no computador?",
    a: [
      "Na nuvem, só o professor consegue acessar; no computador, todos podem acessar.",
      "Na nuvem, os arquivos ficam guardados online; no computador, ficam guardados no próprio aparelho.",
      "Na nuvem, os arquivos somem rápido; no computador, ficam para sempre.",
      "Na nuvem, é preciso usar pendrive; no computador, não.",
    ],
    correct: 1,
    tip: "Um arquivo fica sempre no mesmo lugar, o outro não.",
  },
  {
    context: "Alguns arquivos ficam apenas em um lugar, como dentro do computador da escola. Outros podem ser vistos de vários aparelhos diferentes.",
    q: "Qual situação NÃO representa o uso da nuvem?",
    a: [
      "Abrir uma música no Spotify em dois aparelhos diferentes.",
      "Salvar fotos no OneDrive e ver no celular.",
      "Escrever no Google Docs e acessar de casa.",
      "Guardar arquivos só no computador.",
    ],
    correct: 3,
    tip: "Veja qual arquivo não pode ser acessado de outro aparelho.",
  },
  {
    context: "Às vezes é bom guardar mais de uma cópia dos arquivos importantes. Assim, se algo acontecer com um lugar onde eles estão salvos, ainda existe outra forma de recuperá-los.",
    q: "Qual das opções mostra o uso de backup (cópia de segurança)?",
    a: [
      "Salvar um trabalho só no computador da escola.",
      "Salvar a mesma foto no celular e também na nuvem.",
      "Escrever no caderno e não guardar em mais nenhum lugar.",
      "Imprimir um texto e jogar fora o arquivo.",
    ],
    correct: 1,
    tip: "Quando se guarda uma cópia extra de algo importante.",
  },
  {
    context: "Guardar arquivos na internet permite abri-los mesmo quando você está longe do computador onde eles foram criados.",
    q: "Qual a principal vantagem de guardar dados na nuvem?",
    a: [
      "Porque a nuvem funciona sem energia elétrica.",
      "Porque é possível acessar os arquivos em qualquer lugar com internet.",
      "Porque os arquivos ficam dentro do celular.",
      "Porque é sempre gratuita e ilimitada.",
    ],
    correct: 1,
    tip: "Considere o que ajuda quando você está longe do computador.",
  },
];

const seguranca = [
  {
    context: "Uma senha forte é difícil de adivinhar e mistura letras, números e símbolos. Isso ajuda a proteger suas contas e arquivos de pessoas que não devem acessá-los.",
    q: "Qual dessas senhas é a mais segura?",
    a: ["123456", "ana2024", "Cachorro#18", "senha"],
    correct: 2,
    tip: "Mais difícil de adivinhar geralmente é melhor.",
  },
  {
    context: "Às vezes, só a senha não é suficiente para entrar em uma conta. Um código que chega no celular ou outro passo extra ajuda a garantir que é mesmo você.",
    q: "Qual é um exemplo de Autenticação de Dois Fatores?",
    a: [
      "Digitar a senha e depois receber um código no celular.",
      "Usar só a senha de sempre.",
      "Clicar em “esqueci minha senha”.",
      "Entrar em uma conta sem senha.",
    ],
    correct: 0,
    tip: "É algo a mais além da senha para confirmar sua identidade.",
  },
  {
    context: "O segundo fator de autenticação pode ser um código enviado por SMS, uma impressão digital ou reconhecimento facial.",
    q: "Qual destes NÃO é um tipo comum de segundo fator de autenticação?",
    a: [
      "Código enviado por SMS ou app authenticator",
      "Impressão digital",
      "Reconhecimento facial",
      "Nome de usuário",
    ],
    correct: 3,
    tip: "Observe o que não acrescenta uma camada extra de segurança.",
  },
  {
    context: "Usar a mesma senha em vários lugares facilita que alguém consiga acessar mais de uma conta se descobrir uma delas.",
    q: "Qual dessas situações representa um risco para a segurança dos seus dados?",
    a: [
      "Usar uma senha única para várias contas.",
      "Trocar a senha regularmente.",
      "Fazer backup em um HD externo.",
      "Ativar autenticação de dois fatores.",
    ],
    correct: 0,
    tip: "Pense no que facilitaria a entrada de estranhos em suas contas.",
  },
  {
    context: "Alguns programas e cuidados ajudam a impedir que arquivos sejam apagados ou roubados. Já clicar em coisas desconhecidas pode causar problemas.",
    q: "Qual destas práticas ajuda a proteger arquivos importantes de um ataque de vírus?",
    a: [
      "Usar antivírus e manter o sistema atualizado.",
      "Abrir qualquer anexo recebido por e-mail.",
      "Baixar programas de sites desconhecidos.",
      "Desligar o computador sem salvar os arquivos.",
    ],
    correct: 0,
    tip: "Reflita sobre cuidados que ajudam a manter os arquivos seguros.",
  },
];


  const QUESTIONS = path === "seguranca" ? seguranca : armazenamento;

  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [i, setI] = useState(0);
  const [lives, setLives] = useState(3);
  const [answered, setAnswered] = useState(false);
  const [choice, setChoice] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [eliminated, setEliminated] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [usedHints, setUsedHints] = useState(0);
  const [hintShown, setHintShown] = useState(false);
  const [questionHints, setQuestionHints] = useState({});

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  useEffect(() => {
    const copy = shuffleArray(QUESTIONS);
    setShuffledQuestions(copy);
    setI(0);
    setLives(3);
    setAnswered(false);
    setChoice(null);
    setCorrectCount(0);
    setFinished(false);
    setEliminated(false);
    setUsedHints(0);
    setHintShown(false);
    setQuestionHints({});
  }, [path]);

  useEffect(() => {
    if (shuffledQuestions[i]) {
      const q = shuffledQuestions[i];
      const shuffled = shuffleArray(q.a);
      const newCorrect = shuffled.findIndex((opt) => opt === q.a[q.correct]);
      setCurrentOptions(shuffled);
      shuffledQuestions[i].correct = newCorrect;
      setHintShown(false);
    }
  }, [i, shuffledQuestions]);

  const total = shuffledQuestions.length;
  const q = shuffledQuestions[i] || {};
  const pct = Math.round((i / total) * 100);

  function giveXP(n) {
    window.dispatchEvent(new CustomEvent("xp:add", { detail: n }));
  }
  function giveCoins(n) {
    window.dispatchEvent(new CustomEvent("coins:add", { detail: n }));
  }
  function giveBadge(name) {
    window.dispatchEvent(new CustomEvent("badge:add", { detail: name }));
  }

  function onSelect(idx) {
    if (answered) return;
    setChoice(idx);
    const isRight = idx === q.correct;

    if (isRight) {
      playSound("xp");
      setCorrectCount((c) => c + 1);
      giveXP(10);
      giveCoins(2);
    } else {
      playSound("coin");
      setLives((v) => {
        const newLives = Math.max(0, v - 1);
        if (newLives === 0) {
          setEliminated(true);
        }
        return newLives;
      });
    }
    setAnswered(true);
  }

  function next() {
    if (i + 1 >= total) {
      const score = Math.round((correctCount / total) * 100);
      if (score === 100) {
        giveBadge(path === "seguranca" ? "Mestre da Segurança" : "Mestre da Nuvem");
        giveCoins(20);
      } else if (score >= 80) {
        giveBadge(path === "seguranca" ? "Guardião Digital" : "Sábio da Nuvem I");
        giveCoins(12);
      } else if (score >= 50) {
        giveBadge(path === "seguranca" ? "Aprendiz de Segurança" : "Aprendiz da Nuvem");
        giveCoins(6);
      }
      setFinished(true);
      return;
    }
    setI(i + 1);
    setAnswered(false);
    setChoice(null);
  }

  function handleHint() {
    if (questionHints[i]) return;
    if (usedHints >= 2) return;
    setHintShown(true);
    setUsedHints(usedHints + 1);
    setQuestionHints({ ...questionHints, [i]: true });
  }

  function resetQuiz() {
    const copy = shuffleArray(QUESTIONS);
    setShuffledQuestions(copy);
    setI(0);
    setLives(3);
    setAnswered(false);
    setChoice(null);
    setCorrectCount(0);
    setFinished(false);
    setEliminated(false);
    setUsedHints(0);
    setHintShown(false);
    setQuestionHints({});
  }

  if (eliminated) {
    return (
      <div
        className={`quiz-wrap ${path === "armazenamento" ? "theme-armazenamento" : "theme-seguranca"}`}
        style={{
          backgroundImage:
            path === "armazenamento"
              ? "url('/img/armazenamento.png')"
              : "url('/img/seguranca.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
     <div className="quiz-eliminated">
  <img src="../img/erro.png" alt="Eliminado" className="eliminated-icon" />
  <h2>Você errou 3 perguntas</h2>
  <p>
    Que tal tentar de novo com mais atenção?<br />
    Lembre-se: cada erro é uma chance de aprender!
  </p>
  <button className="quiz-cta" onClick={resetQuiz}>
    Tentar novamente 🔄
  </button>
</div>

      </div>
    );
  }

  if (finished) {
    const score = Math.round((correctCount / total) * 100);

    return (
      <div
        className={`quiz-wrap ${path === "armazenamento" ? "theme-armazenamento" : "theme-seguranca"}`}
        style={{
          backgroundImage:
            path === "armazenamento"
              ? "url('/img/armazenamento.png')"
              : "url('/img/seguranca.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="quiz-finished">
  <img src="/img/certo.png" alt="Concluído" className="finished-icon" />
  <h2>Parabéns, você concluiu o quiz!</h2>
  <p>
    Você acertou <strong>{correctCount}</strong> de <strong>{total}</strong> perguntas (
    <strong>{score}%</strong> concluído)
  </p>
  <button className="quiz-cta" onClick={onComplete}>
    Próxima fase ➡️
  </button>
</div>
      </div>
    );
  }
return (
<div
 
  className={`quiz-wrap ${
    path === "armazenamento" ? "theme-armazenamento" : "theme-seguranca"
  }`}
  style={{
    backgroundImage:
      path === "armazenamento"
        ? "url('/img/armazenamento.png')"
        : "url('/img/seguranca.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>


    {/* ✅ Título centralizado */}
    <h2 className="quiz-title">
      {path === "armazenamento"
        ? "Armazenamento - Fase 2"
        : "Segurança - Fase 2"}
    </h2>

   
{/* ✅ Contexto da questão atual */}
{q.context && (
  <p className="quiz-context">{q.context}</p>
)}
    

    {/* ✅ Depois corações + barra */}
    <div className="quiz-status">

      <div className="quiz-progress">
        <div className="quiz-progress-bar" style={{ width: `${pct}%` }} />
      </div>
     

      <div className="quiz-hearts" aria-label={`Vidas: ${lives}`}>
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

    {/* ✅ Pergunta e opções */}
    <div key={i} className="quiz-card">
      <div className="quiz-question">
        {i + 1}. {q.q}
      </div>
      <div className="quiz-grid">
        {currentOptions.map((opt, idx) => {
          const isRight = idx === q.correct;
          const isChosen = choice === idx;
          let cls = "quiz-option";
          if (answered && isChosen && isRight) cls += " correct";
          else if (answered && isChosen && !isRight) cls += " wrong";
          return (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              disabled={answered}
              className={cls}
            >
              {opt}
            </button>
          );
        })}
      </div>
  <div className="quiz-actions">
  {!hintShown && !questionHints[i] && usedHints < 2 && (
    <button onClick={handleHint} className="quiz-cta hint-btn">
      Dica
    </button>
  )}

  {answered && (
    <button onClick={next} className="quiz-cta continue-btn">
      Continuar ➜
    </button>
  )}
</div>


{/* Exibir texto da dica */}
{(hintShown || questionHints[i]) && (
  <div className="quiz-hint">
    💡 {q.tip}
  </div>
)}

<div className="quiz-tip">Dicas usadas: {usedHints}/2</div>
    </div>

    <button onClick={onBack} className="quiz-back">
      ⬅ Voltar
    </button>
  </div>
);
}