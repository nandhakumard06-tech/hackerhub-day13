import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  GraduationCap,
  RotateCcw,
  Award,
  ChevronRight,
  Check,
} from 'lucide-react';
import { DEDICATED_QUIZZES } from '@/data/dedicatedQuizzes';

export function DedicatedQuizSection() {
  // Currently selected quiz (default 'A01')
  const [selectedQuizId, setSelectedQuizId] = useState<string>('A01');

  // Answers store: Record<quizId, Record<questionId, selectedOptionIndex>>
  const [allAnswers, setAllAnswers] = useState<Record<string, Record<string, number>>>({});

  const currentQuiz =
    DEDICATED_QUIZZES.find((quiz) => quiz.id === selectedQuizId) ||
    DEDICATED_QUIZZES[0];

  const currentQuestions = currentQuiz.questions;
  const quizAnswers = allAnswers[selectedQuizId] || {};

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    // Prevent changing answer if already answered
    if (quizAnswers[questionId] !== undefined) return;

    setAllAnswers((prev) => ({
      ...prev,
      [selectedQuizId]: {
        ...(prev[selectedQuizId] || {}),
        [questionId]: optionIndex,
      },
    }));
  };

  const handleResetCurrentQuiz = () => {
    setAllAnswers((prev) => {
      const next = { ...prev };
      delete next[selectedQuizId];
      return next;
    });
  };

  // Calculate scores
  let totalScore = 0;
  let totalAnswered = 0;
  const totalQuestions = DEDICATED_QUIZZES.reduce(
    (total, quiz) => total + quiz.questions.length,
    0,
  );

  DEDICATED_QUIZZES.forEach((quiz) => {
    const answers = allAnswers[quiz.id] || {};
    quiz.questions.forEach((q) => {
      if (answers[q.id] !== undefined) {
        totalAnswered++;
        if (answers[q.id] === q.correctAnswer) {
          totalScore++;
        }
      }
    });
  });

  // Score for currently selected quiz
  let currentCorrectCount = 0;
  currentQuestions.forEach((q) => {
    if (quizAnswers[q.id] === q.correctAnswer) {
      currentCorrectCount++;
    }
  });

  const currentIndex = DEDICATED_QUIZZES.findIndex((quiz) => quiz.id === selectedQuizId);
  const nextQuiz =
    currentIndex < DEDICATED_QUIZZES.length - 1
      ? DEDICATED_QUIZZES[currentIndex + 1]
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Top Header & Overall Mastery Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--osa-border)]/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-purple-300">
              <GraduationCap className="size-3.5 text-purple-400" />
              Dedicated Knowledge Center
            </span>
            <span className="text-xs text-[var(--osa-muted)]">
              All 10 Categories • 2 Questions Each
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            OWASP Top 10 Quizzes
          </h1>
          <p className="mt-1 text-sm text-[var(--osa-muted)]">
            Select any category to test your security knowledge with instant visual feedback.
          </p>
        </div>

        {/* Global Score Counter */}
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--osa-border)] bg-[#091120] px-4 py-2.5 shadow-lg">
          <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Award className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-[var(--osa-muted)]">Total Completed</span>
            <span className="font-mono text-sm font-bold text-white">
              {totalScore} / {totalAnswered} Correct ({totalAnswered}/{totalQuestions} attempted)
            </span>
          </div>
        </div>
      </div>

      {/* Quiz Category Selector Pills */}
      <div>
        <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          Select a Category Quiz:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {DEDICATED_QUIZZES.map((quiz) => {
            const isSelected = quiz.id === selectedQuizId;
            const answers = allAnswers[quiz.id] || {};
            const questions = quiz.questions;
            const isComplete = questions.every((q) => answers[q.id] !== undefined);
            let score = 0;
            questions.forEach((q) => {
              if (answers[q.id] === q.correctAnswer) score++;
            });

            return (
              <button
                key={quiz.id}
                type="button"
                onClick={() => setSelectedQuizId(quiz.id)}
                className={`flex flex-col items-start rounded-xl border p-2.5 text-left transition-all ${
                  isSelected
                    ? 'border-purple-500/70 bg-purple-950/40 text-purple-200 shadow-md shadow-purple-950/50'
                    : 'border-[var(--osa-border)] bg-[#0a101d] text-slate-300 hover:border-slate-600 hover:bg-[#0e172a]'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {quiz.code}
                  </span>
                  {isComplete && (
                    <span
                      className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.2 text-[10px] font-bold ${
                        score === questions.length
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      <Check className="size-3" />
                      {score}/{questions.length}
                    </span>
                  )}
                </div>
                <span className="mt-1 text-xs font-semibold text-slate-200 truncate w-full">
                  {quiz.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Category Quiz Card */}
      <div className="rounded-2xl border border-[var(--osa-border)] bg-gradient-to-b from-[#0c1527] to-[#070c16] p-5 sm:p-6 shadow-2xl">
        {/* Quiz Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--osa-border)]/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-purple-400">
                {currentQuiz.code} Quiz
              </span>
              <span className="text-xs text-[var(--osa-muted)]">• 2 Simple Base-Variant Questions</span>
            </div>
            <h2 className="mt-1 text-lg sm:text-xl font-bold text-white">
              {currentQuiz.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-[var(--osa-border)] bg-[#070b14] px-3 py-1 font-mono text-xs text-slate-300">
              Score:{' '}
              <strong className="text-white">
                {currentCorrectCount} / {currentQuestions.length}
              </strong>
            </span>

            {Object.keys(quizAnswers).length > 0 && (
              <button
                type="button"
                onClick={handleResetCurrentQuiz}
                className="flex items-center gap-1.5 rounded-xl border border-[var(--osa-border)] bg-[#0d1626] px-3 py-1 text-xs font-medium text-slate-300 hover:bg-[var(--osa-hover)] hover:text-white"
              >
                <RotateCcw className="size-3.5 text-slate-400" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* 2 Questions */}
        <div className="mt-5 space-y-6">
          {currentQuestions.map((q) => {
            const selectedOption = quizAnswers[q.id];
            const isAnswered = selectedOption !== undefined;
            const isCorrect = isAnswered && selectedOption === q.correctAnswer;

            return (
              <div
                key={q.id}
                className="rounded-xl border border-[var(--osa-border)]/70 bg-[#060a13] p-4 sm:p-5"
              >
                {/* Question Statement */}
                <div className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-950/40 text-xs font-bold font-mono text-purple-300">
                    Q{q.number}
                  </span>
                  <p className="text-sm font-semibold leading-relaxed text-slate-100 sm:text-base">
                    {q.question}
                  </p>
                </div>

                {/* Multiple Choice Options */}
                <div className="mt-4 grid grid-cols-1 gap-2.5">
                  {q.options.map((option, optIndex) => {
                    const isThisSelected = selectedOption === optIndex;
                    const isThisCorrect = optIndex === q.correctAnswer;

                    // Immediate Visual Feedback Styling:
                    // Correct Option Clicked -> Highlight option in bright GREEN with checkmark
                    // Incorrect Option Clicked -> Highlight in RED with cross icon, AND highlight CORRECT option in GREEN
                    let optionStyle =
                      'border-[var(--osa-border)] bg-[#0a1120] text-slate-300 hover:border-slate-600 hover:bg-[#0f1a30]';
                    let iconElement = (
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-[10px] font-mono text-slate-400">
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                    );

                    if (isAnswered) {
                      if (isThisCorrect) {
                        // Highlight in Bright GREEN
                        optionStyle =
                          'border-emerald-500 bg-emerald-950/60 text-emerald-100 shadow-md shadow-emerald-950/60 font-medium ring-1 ring-emerald-500/40';
                        iconElement = (
                          <CheckCircle2 className="size-5 shrink-0 text-emerald-400 animate-in zoom-in-50 duration-200" />
                        );
                      } else if (isThisSelected && !isThisCorrect) {
                        // Highlight in RED
                        optionStyle =
                          'border-rose-500 bg-rose-950/60 text-rose-100 shadow-md shadow-rose-950/60 font-medium ring-1 ring-rose-500/40';
                        iconElement = (
                          <XCircle className="size-5 shrink-0 text-rose-400 animate-in zoom-in-50 duration-200" />
                        );
                      } else {
                        // Unselected after answer
                        optionStyle =
                          'border-slate-800 bg-[#070c16] text-slate-500 opacity-60';
                        iconElement = (
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-slate-800 text-[10px] font-mono text-slate-600">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                        );
                      }
                    }

                    return (
                      <button
                        key={optIndex}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(q.id, optIndex)}
                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-xs sm:text-sm transition-all ${optionStyle} ${
                          !isAnswered
                            ? 'cursor-pointer active:scale-[0.99]'
                            : 'cursor-default'
                        }`}
                      >
                        {iconElement}
                        <span className="flex-1 leading-snug">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Banner */}
                {isAnswered && (
                  <div
                    className={`mt-3.5 rounded-xl border p-3.5 text-xs sm:text-sm leading-relaxed animate-in fade-in-50 duration-300 ${
                      isCorrect
                        ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
                        : 'border-rose-500/40 bg-rose-950/30 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                          <span className="text-emerald-300">Correct Answer!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="size-4 text-rose-400 shrink-0" />
                          <span className="text-rose-300">Incorrect Choice</span>
                        </>
                      )}
                    </div>
                    <p className="mt-1 text-slate-300 text-xs sm:text-[13px]">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Next Category Shortcut */}
        {nextQuiz && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setSelectedQuizId(nextQuiz.id)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-md shadow-purple-500/20 transition-all hover:opacity-95"
            >
              <span>Next Quiz: {nextQuiz.code} ({nextQuiz.title})</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
