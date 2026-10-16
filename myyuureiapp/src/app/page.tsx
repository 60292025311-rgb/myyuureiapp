"use client";

import { useState, useCallback, useRef } from "react";
import TailIndicator from "@/components/TailIndicator";
import DialogBox from "@/components/DialogBox";
import BombTimer from "@/components/BombTimer";
import {
  QUESTIONS,
  BOMB_QUIZ,
  INITIAL_STATS,
  PlayerStats,
  Choice,
  determineEnding,
  checkBombAnswer,
  BOMB_QUIZ_AFTER_QUESTION,
} from "@/lib/gameData";

// ゲームフェーズ
type Phase =
  | "TITLE"        // タイトル画面
  | "QUESTION"     // 通常質問
  | "REACTION"     // タゴサクの反応
  | "BOMB_INTRO"   // 爆弾クイズ導入
  | "BOMB_QUIZ"    // 爆弾クイズ解答
  | "BOMB_RESULT"  // 爆弾クイズ結果
  | "ENDING";      // エンディング

export default function GamePage() {
  const [phase, setPhase] = useState<Phase>("TITLE");
  const [questionIndex, setQuestionIndex] = useState(0);   // 0-based
  const [answeredCount, setAnsweredCount] = useState(0);
  const [stats, setStats] = useState<PlayerStats>(INITIAL_STATS);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [bombAnswer, setBombAnswer] = useState("");
  const [bombSuccess, setBombSuccess] = useState<boolean | null>(null);
  const [bombTimerStopped, setBombTimerStopped] = useState(false);
  const [reactionText, setReactionText] = useState("");
  const [flash, setFlash] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentQuestion = QUESTIONS[questionIndex];

  // フラッシュ演出
  const triggerFlash = useCallback(() => {
    setFlash(true);
    setTimeout(() => setFlash(false), 600);
  }, []);

  // ステータス更新
  const applyEffect = useCallback(
    (effect: Partial<PlayerStats>) => {
      setStats((prev) => ({
        ethics: Math.max(-10, Math.min(10, prev.ethics + (effect.ethics ?? 0))),
        empathy: Math.max(-10, Math.min(10, prev.empathy + (effect.empathy ?? 0))),
        logic: Math.max(-10, Math.min(10, prev.logic + (effect.logic ?? 0))),
        courage: Math.max(-10, Math.min(10, prev.courage + (effect.courage ?? 0))),
      }));
    },
    []
  );

  // ===== 選択肢クリック =====
  const handleChoice = useCallback(
    (choice: Choice) => {
      setSelectedChoice(choice);
      applyEffect(choice.effect);
      setReactionText(choice.reactionText ?? "……。");
      triggerFlash();
      setPhase("REACTION");
    },
    [applyEffect, triggerFlash]
  );

  // ===== 反応 → 次のフェーズへ =====
  const handleNextAfterReaction = useCallback(() => {
    const nextIndex = questionIndex + 1;
    setAnsweredCount((c) => c + 1);

    // 爆弾クイズのタイミング判定
    if (questionIndex === BOMB_QUIZ_AFTER_QUESTION - 1) {
      // Q5答えた後 → 爆弾クイズ導入へ
      setPhase("BOMB_INTRO");
      return;
    }

    // 全質問終了
    if (nextIndex >= QUESTIONS.length) {
      setPhase("ENDING");
      return;
    }

    setQuestionIndex(nextIndex);
    setSelectedChoice(null);
    setPhase("QUESTION");
  }, [questionIndex]);

  // ===== 爆弾クイズ導入 → クイズへ =====
  const handleBombIntroNext = useCallback(() => {
    setBombTimerStopped(false);
    setBombAnswer("");
    setPhase("BOMB_QUIZ");
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // ===== 爆弾クイズ送信 =====
  const handleBombSubmit = useCallback(() => {
    setBombTimerStopped(true);
    const correct = checkBombAnswer(bombAnswer);
    setBombSuccess(correct);
    triggerFlash();
    setPhase("BOMB_RESULT");
  }, [bombAnswer, triggerFlash]);

  // ===== タイムアップ =====
  const handleBombExpire = useCallback(() => {
    setBombTimerStopped(true);
    setBombSuccess(false);
    triggerFlash();
    setPhase("BOMB_RESULT");
  }, [triggerFlash]);

  // ===== 爆弾クイズ結果 → Q6へ =====
  const handleAfterBombResult = useCallback(() => {
    const nextIndex = BOMB_QUIZ_AFTER_QUESTION; // index 5 = Q6
    if (nextIndex >= QUESTIONS.length) {
      setPhase("ENDING");
      return;
    }
    setQuestionIndex(nextIndex);
    setSelectedChoice(null);
    setPhase("QUESTION");
  }, []);

  // ===== エンディング計算 =====
  const ending = determineEnding(stats, bombSuccess ?? false);

  // ========================================================
  //  レンダリング
  // ========================================================

  return (
    <div
      className={`scanlines min-h-screen bg-[#080808] flex flex-col items-center justify-center p-4 ${
        flash ? "flash-red" : ""
      }`}
    >
      <div className="w-full max-w-2xl space-y-6">

        {/* ===== TITLE ===== */}
        {phase === "TITLE" && (
          <TitleScreen onStart={() => setPhase("QUESTION")} />
        )}

        {/* ===== QUESTION ===== */}
        {phase === "QUESTION" && currentQuestion && (
          <>
            <TailIndicator
              total={QUESTIONS.length}
              current={questionIndex}
              answered={answeredCount}
            />
            <DialogBox text={currentQuestion.tagosakuText} speed={30} />
            <div className="space-y-2 mt-4">
              {currentQuestion.choices.map((c) => (
                <button
                  key={c.id}
                  className={`choice-btn ${selectedChoice?.id === c.id ? "choice-btn-selected" : ""}`}
                  onClick={() => handleChoice(c)}
                  disabled={selectedChoice !== null}
                >
                  <span className="text-gray-600 mr-2">▶</span>
                  {c.text}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ===== REACTION ===== */}
        {phase === "REACTION" && (
          <>
            <TailIndicator
              total={QUESTIONS.length}
              current={questionIndex}
              answered={answeredCount}
            />
            {/* 選んだ選択肢の表示 */}
            <div className="px-4 py-2 border border-gray-800 rounded text-xs text-gray-500 font-mono">
              <span className="text-gray-600">あなた：</span>
              {selectedChoice?.text}
            </div>
            <DialogBox text={reactionText} speed={40} />
            <button
              className="w-full mt-4 py-3 border border-gray-700 rounded text-gray-400 text-xs font-mono
                         hover:border-gray-500 hover:text-gray-200 transition-all"
              onClick={handleNextAfterReaction}
            >
              ▶ 続ける
            </button>
          </>
        )}

        {/* ===== BOMB_INTRO ===== */}
        {phase === "BOMB_INTRO" && (
          <>
            <div className="text-center mb-2">
              <div className="inline-block px-3 py-1 border border-red-900 rounded text-red-600 text-xs tracking-widest">
                ⚠ BOMB SEQUENCE INITIATED
              </div>
            </div>
            <DialogBox text={BOMB_QUIZ.tagosakuIntro} speed={25} />
            <button
              className="w-full mt-4 py-3 border border-red-800 rounded text-red-400 text-xs font-mono
                         hover:border-red-600 hover:text-red-200 hover:bg-red-950 transition-all"
              onClick={handleBombIntroNext}
            >
              ▶ 謎解きに挑む
            </button>
          </>
        )}

        {/* ===== BOMB_QUIZ ===== */}
        {phase === "BOMB_QUIZ" && (
          <>
            <BombTimer
              seconds={BOMB_QUIZ.timeLimitSeconds}
              onExpire={handleBombExpire}
              stopped={bombTimerStopped}
            />
            <div className="mt-2">
              <div className="px-5 py-4 border border-red-900 rounded bg-[#0d0005]
                              text-gray-300 text-xs font-mono leading-7 whitespace-pre-wrap max-h-80 overflow-y-auto">
                {BOMB_QUIZ.quizText}
              </div>
            </div>
            {/* ヒント */}
            <details className="text-xs text-gray-600 font-mono mt-1 cursor-pointer">
              <summary className="hover:text-gray-400 transition-colors">▶ ヒントを見る（倫理値 -1）</summary>
              <p className="mt-2 pl-3 text-gray-500 border-l border-gray-800">
                {BOMB_QUIZ.hintText}
              </p>
            </details>
            {/* 回答入力 */}
            <div className="flex gap-2 mt-4">
              <input
                ref={inputRef}
                type="text"
                value={bombAnswer}
                onChange={(e) => setBombAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && bombAnswer.trim() && handleBombSubmit()}
                placeholder="爆発物の場所を入力……"
                className="flex-1 px-4 py-3 bg-[#0d0d0d] border border-gray-700 rounded
                           text-gray-200 text-sm font-mono placeholder-gray-700
                           focus:outline-none focus:border-red-700 transition-colors"
              />
              <button
                onClick={handleBombSubmit}
                disabled={!bombAnswer.trim()}
                className="px-5 py-3 border border-red-800 rounded text-red-400 text-sm font-mono
                           hover:bg-red-950 hover:text-red-200 hover:border-red-600
                           disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                送信
              </button>
            </div>
          </>
        )}

        {/* ===== BOMB_RESULT ===== */}
        {phase === "BOMB_RESULT" && (
          <>
            <div className={`text-center py-3 border rounded mb-2 ${
              bombSuccess
                ? "border-green-800 bg-green-950 text-green-400"
                : "border-red-900 bg-red-950 text-red-400"
            }`}>
              <p className="text-lg font-mono font-bold tracking-widest">
                {bombSuccess ? "✓ CORRECT" : "✗ FAILED"}
              </p>
            </div>
            <DialogBox
              text={bombSuccess ? BOMB_QUIZ.successReaction : BOMB_QUIZ.failureReaction}
              speed={35}
            />
            <button
              className="w-full mt-4 py-3 border border-gray-700 rounded text-gray-400 text-xs font-mono
                         hover:border-gray-500 hover:text-gray-200 transition-all"
              onClick={handleAfterBombResult}
            >
              ▶ 続ける
            </button>
          </>
        )}

        {/* ===== ENDING ===== */}
        {phase === "ENDING" && (
          <EndingScreen
            ending={ending}
            stats={stats}
            bombSuccess={bombSuccess ?? false}
            onRestart={() => {
              setPhase("TITLE");
              setQuestionIndex(0);
              setAnsweredCount(0);
              setStats(INITIAL_STATS);
              setSelectedChoice(null);
              setBombAnswer("");
              setBombSuccess(null);
              setBombTimerStopped(false);
            }}
          />
        )}

      </div>
    </div>
  );
}

// ============================================================
//  タイトル画面コンポーネント
// ============================================================
function TitleScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center gap-8 py-12 text-center">
      {/* グリッチ装飾 */}
      <div className="space-y-1">
        <p className="text-gray-700 text-xs tracking-[0.5em] uppercase">psychological suspense</p>
        <h1 className="text-5xl font-mono font-bold text-white leading-tight"
            style={{ textShadow: "0 0 20px rgba(239,68,68,0.4), 0 0 40px rgba(239,68,68,0.1)" }}>
          爆弾
        </h1>
        <h2 className="text-2xl font-mono text-red-600 tracking-wider">
          Nine Tails
        </h2>
        <p className="text-gray-700 text-xs tracking-[0.3em]">九つの尻尾</p>
      </div>

      <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-700 to-transparent" />

      <p className="text-gray-500 text-sm font-mono leading-8 max-w-sm">
        取調室に、不気味な男が座っている。<br />
        彼はあなたに問いかける——<br />
        <span className="text-gray-400">「あなたの心の形を見せてください」</span>
      </p>

      <button
        onClick={onStart}
        className="mt-4 px-8 py-4 border border-red-800 rounded text-red-500 font-mono
                   text-sm tracking-widest uppercase
                   hover:bg-red-950 hover:text-red-200 hover:border-red-600
                   transition-all duration-300 animate-pulse_slow"
      >
        ▶ 取調室へ入る
      </button>

      <p className="text-gray-800 text-xs font-mono">
        inspired by 『爆弾』 呉勝浩
      </p>
    </div>
  );
}

// ============================================================
//  エンディング画面コンポーネント
// ============================================================
interface EndingScreenProps {
  ending: ReturnType<typeof determineEnding>;
  stats: PlayerStats;
  bombSuccess: boolean;
  onRestart: () => void;
}

function EndingScreen({ ending, stats, bombSuccess, onRestart }: EndingScreenProps) {
  const statItems: { label: string; key: keyof PlayerStats; color: string }[] = [
    { label: "倫理", key: "ethics",  color: "bg-blue-600" },
    { label: "共感", key: "empathy", color: "bg-green-600" },
    { label: "論理", key: "logic",   color: "bg-amber-600" },
    { label: "胆力", key: "courage", color: "bg-purple-600" },
  ];

  return (
    <div className="space-y-6 py-4">
      {/* ヘッダー */}
      <div className="text-center space-y-1">
        <p className="text-gray-600 text-xs tracking-widest uppercase font-mono">
          {bombSuccess ? "— BOMB DEFUSED —" : "— DETONATION —"}
        </p>
        <h2 className="text-2xl font-mono font-bold text-white leading-tight">
          {ending.title}
        </h2>
        <p className={`text-sm font-mono ${ending.color}`}>
          {ending.subtitle}
        </p>
      </div>

      <div className="w-full h-px bg-gray-800" />

      {/* エンディング本文 */}
      <div className="px-5 py-4 border border-gray-800 rounded bg-[#0d0d0d]
                      text-gray-300 text-sm font-mono leading-8 whitespace-pre-wrap">
        {ending.description}
      </div>

      {/* 心の形 診断 */}
      <div className="px-5 py-4 border border-gray-800 rounded space-y-2">
        <p className="text-gray-600 text-xs tracking-widest uppercase">心の形の診断</p>
        <p className={`text-lg font-mono font-bold ${ending.color}`}>
          {ending.mindShape}
        </p>
        <p className="text-gray-400 text-xs font-mono leading-6">
          {ending.mindShapeDesc}
        </p>
      </div>

      {/* パラメーター */}
      <div className="px-5 py-4 border border-gray-800 rounded space-y-3">
        <p className="text-gray-600 text-xs tracking-widest uppercase">パラメーター最終値</p>
        {statItems.map(({ label, key, color }) => {
          const val = stats[key];       // -10 〜 +10
          const pct = ((val + 10) / 20) * 100;
          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-gray-500">
                <span>{label}</span>
                <span className={val >= 0 ? "text-gray-300" : "text-red-400"}>
                  {val >= 0 ? `+${val}` : val}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full h-px bg-gray-800" />

      {/* リスタートボタン */}
      <button
        onClick={onRestart}
        className="w-full py-4 border border-gray-700 rounded text-gray-500 text-xs font-mono
                   tracking-widest uppercase hover:border-gray-500 hover:text-gray-200 transition-all"
      >
        ▶ もう一度 取調室へ
      </button>
    </div>
  );
}
