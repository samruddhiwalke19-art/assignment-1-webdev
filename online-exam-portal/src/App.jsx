
import { useEffect, useState } from "react";
import "./App.css";

const questions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Transfer Machine Language",
      "Hyper Tool Multi Language",
      "Home Text Management Language",
    ],
    answer: 0,
  },
  {
    question: "Which language is used to style web pages?",
    options: ["Python", "CSS", "JavaScript", "SQL"],
    answer: 1,
  },
  {
    question: "Which library is used to build user interfaces?",
    options: ["Django", "React", "Laravel", "Flask"],
    answer: 1,
  },
  {
    question: "Which React hook manages component state?",
    options: ["useRoute", "useStyle", "useState", "usePage"],
    answer: 2,
  },
  {
    question: "Which method adds an item to the end of an array?",
    options: ["pop()", "shift()", "slice()", "push()"],
    answer: 3,
  },
];

function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">
        <span className="brand-icon">Q</span>
        <span>Quiz<span className="highlight">Master</span></span>
      </div>
      <span className="nav-label">ONLINE EXAM PORTAL</span>
    </nav>
  );
}

function Home({ onStart }) {
  return (
    <section className="hero">
      <span className="hero-tag">✦ YOUR KNOWLEDGE, YOUR SUCCESS</span>
      <h1>
        Test your skills.
        <br />
        <span>Discover your potential.</span>
      </h1>
      <p className="description">
        Challenge yourself with an interactive online examination.
        Answer questions, track your progress, and discover your score.
      </p>

      <div className="features">
        <div className="feature">
          <span className="feature-icon">◷</span>
          <div><strong>2 Minutes</strong><small>Time limit</small></div>
        </div>
        <div className="feature">
          <span className="feature-icon">▤</span>
          <div><strong>5 Questions</strong><small>Multiple choice</small></div>
        </div>
        <div className="feature">
          <span className="feature-icon">✓</span>
          <div><strong>Instant Results</strong><small>See your score</small></div>
        </div>
      </div>

      <button className="primary-button start-button" onClick={onStart}>
        Start Examination →
      </button>
      <p className="helper-text">Read each question carefully before answering.</p>
    </section>
  );
}

function Exam({
  question,
  questionIndex,
  total,
  selectedAnswer,
  onSelect,
  onNext,
  onPrevious,
  onSubmit,
  timeLeft,
}) {
  const progress = ((questionIndex + 1) / total) * 100;

  return (
    <section className="exam-card">
      <div className="exam-top">
        <div>
          <span className="eyebrow">YOUR EXAMINATION</span>
          <h2>Knowledge Assessment</h2>
        </div>
        <div className="timer">
          ◷ {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
          {String(timeLeft % 60).padStart(2, "0")}
        </div>
      </div>

      <div className="progress-info">
        <span>Question {questionIndex + 1} of {total}</span>
        <span>{Math.round(progress)}% completed</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="question-area">
        <span className="eyebrow">QUESTION {questionIndex + 1}</span>
        <h3>{question.question}</h3>

        <div className="options-list">
          {question.options.map((option, index) => (
            <button
              key={option}
              className={`option ${
                selectedAnswer === index ? "option-selected" : ""
              }`}
              onClick={() => onSelect(index)}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
              {selectedAnswer === index && (
                <span className="option-check">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="exam-footer">
        <button
          className="secondary-button"
          onClick={onPrevious}
          disabled={questionIndex === 0}
        >
          ← Previous
        </button>

        <span className="answered-count">
          {selectedAnswer === undefined ? "Not answered" : "Answer selected"}
        </span>

        {questionIndex < total - 1 ? (
          <button className="primary-button" onClick={onNext}>
            Next Question →
          </button>
        ) : (
          <button className="primary-button" onClick={onSubmit}>
            Submit Exam ✓
          </button>
        )}
      </div>
    </section>
  );
}

function Results({ score, total, onRestart }) {
  const percentage = Math.round((score / total) * 100);

  return (
    <section className="result-card">
      <div className="result-icon">{percentage >= 60 ? "🏆" : "📚"}</div>
      <span className="eyebrow">EXAMINATION COMPLETED</span>
      <h1>{percentage >= 60 ? "Excellent effort!" : "Keep learning!"}</h1>
      <p className="description">
        {percentage >= 60
          ? "Well done! You have completed your assessment successfully."
          : "Keep practicing and try again to improve your score!"}
      </p>

      <div className="score-circle">
        <strong>{percentage}%</strong>
        <span>YOUR SCORE</span>
      </div>

      <div className="result-stats">
        <div><strong>{score}/{total}</strong><span>Correct answers</span></div>
        <div><strong>{total - score}</strong><span>Incorrect answers</span></div>
      </div>

      <button className="primary-button start-button" onClick={onRestart}>
        ↻ Retake Examination
      </button>
    </section>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(120);
  useEffect(() => {
  if (screen !== "exam") return;

  const timerId = setInterval(() => {
    setTimeLeft((previous) => Math.max(0, previous - 1));
  }, 1000);

  return () => clearInterval(timerId);
}, [screen]);

useEffect(() => {
  if (screen === "exam" && timeLeft === 0) {
    setScreen("result");
  }
}, [screen, timeLeft]);

  function startExam() {
    setQuestionIndex(0);
    setAnswers({});
    setTimeLeft(120);
    setScreen("exam");
  }

  function selectAnswer(optionIndex) {
    setAnswers((previous) => ({
      ...previous,
      [questionIndex]: optionIndex,
    }));
  }

  function submitExam() {
    setScreen("result");
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-content">
        {screen === "home" && <Home onStart={startExam} />}

        {screen === "exam" && (
          <Exam
            question={questions[questionIndex]}
            questionIndex={questionIndex}
            total={questions.length}
            selectedAnswer={answers[questionIndex]}
            onSelect={selectAnswer}
            onPrevious={() =>
              setQuestionIndex((current) => Math.max(0, current - 1))
            }
            onNext={() =>
              setQuestionIndex((current) =>
                Math.min(questions.length - 1, current + 1)
              )
            }
            onSubmit={submitExam}
            timeLeft={timeLeft}
          />
        )}

        {screen === "result" && (
          <Results
            score={questions.reduce(
              (totalScore, question, index) =>
                totalScore +
                (answers[index] === question.answer ? 1 : 0),
              0
            )}
            total={questions.length}
            onRestart={startExam}
          />
        )}
      </main>

      <footer className="footer">
        <span>QuizMaster © 2026</span>
        <span>Learn • Practice • Achieve</span>
      </footer>
    </div>
  );
}
