import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Award,
} from 'lucide-react';
import type { QuizQuestion } from '@/data/trainerData';

interface Props {
  vulnerabilityId: string;
  questions: QuizQuestion[];
  onScoreUpdate?: (score: number, total: number) => void;
}

export function TrainerQuiz({ vulnerabilityId, questions, onScoreUpdate }: Props) {
  // Store user selections as Record<questionId, selectedOptionIndex>
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  // Reset answers when vulnerability changes
  useEffect(() => {
    setUserAnswers({});
  }, [vulnerabilityId]);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    // Prevent changing answer once selected to provide clean immediate feedback
    if (userAnswers[questionId] !== undefined) return;

    const nextAnswers = { ...userAnswers, [questionId]: optionIndex };
    setUserAnswers(nextAnswers);

    // Calculate score
    let score = 0;
    questions.forEach((q) => {
      if (nextAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    if (onScoreUpdate) {
      onScoreUpdate(score, questions.length);
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    if (onScoreUpdate) {
      onScoreUpdate(0, questions.length);
    }
  };

  // Calculate score
  const answeredCount = Object.keys(userAnswers).length;
  let correctCount = 0;
  questions.forEach((q) => {
    if (userAnswers[q.id] === q.correctAnswer) {
      correctCount++;
    }
  });

  const isCompleted = answeredCount === questions.length;
  const percentage = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="rounded-2xl border border-[var(--osa-border)] bg-gradient-to-b from-[#0d1525] to-[#080d16] p-5 shadow-2xl">
      {/* Quiz Header & Live Score Card */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--osa-border)]/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-cyan-400">
              <Sparkles className="size-3.5" />
              Interactive Knowledge Quiz
            </span>
            <span className="text-xs text-[var(--osa-muted)]">
              {questions.length} Scenario Questions
            </span>
          </div>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-white">
            Test Your Vulnerability Comprehension
          </h3>
        </div>

        {/* Live Score Counter & Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-[var(--osa-border)] bg-[#070b14] px-3.5 py-1.5 font-mono text-xs">
            <Award className="size-4 text-emerald-400" />
            <span className="text-slate-400">Score:</span>
            <span className="font-bold text-white">
              {correctCount} / {questions.length}
            </span>
            {isCompleted && (
              <span
                className={`ml-1 rounded px-1.5 py-0.2 text-[10px] font-bold ${
                  percentage >= 70
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}
              >
                {percentage}%
              </span>
            )}
          </div>

          {answeredCount > 0 && (
            <button
              type="button"
              onClick={handleResetQuiz}
              className="flex items-center gap-1.5 rounded-xl border border-[var(--osa-border)] bg-[#0a1120] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-[var(--osa-hover)] hover:text-white"
            >
              <RotateCcw className="size-3.5 text-slate-400" />
              <span>Reset Quiz</span>
            </button>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const selectedOption = userAnswers[q.id];
          const isAnswered = selectedOption !== undefined;
          const isCorrect = isAnswered && selectedOption === q.correctAnswer;

          return (
            <div
              key={q.id}
              className="rounded-xl border border-[var(--osa-border)]/80 bg-[#060a13] p-4 transition-all"
            >
              {/* Question Statement */}
              <div className="flex items-start gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/40 text-xs font-bold font-mono text-cyan-300">
                  {qIndex + 1}
                </span>
                <p className="text-sm font-semibold leading-snug text-slate-100 sm:text-base">
                  {q.question}
                </p>
              </div>

              {/* Multiple Choice Options */}
              <div className="mt-4 grid grid-cols-1 gap-2.5">
                {q.options.map((option, optIndex) => {
                  const isThisSelected = selectedOption === optIndex;
                  const isThisCorrect = optIndex === q.correctAnswer;

                  // Immediate Visual Feedback Styling:
                  // 1. Correct Option -> Highlight GREEN with success checkmark
                  // 2. Incorrect Option clicked -> Highlight RED with error indicator
                  // 3. If user clicked incorrect, the actual correct option is ALSO highlighted in green

                  let optionStyle =
                    'border-[var(--osa-border)] bg-[#0a101d] text-slate-300 hover:border-slate-500 hover:bg-[#10192e]';
                  let iconElement = (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-[10px] font-mono text-slate-400">
                      {String.fromCharCode(65 + optIndex)}
                    </span>
                  );

                  if (isAnswered) {
                    if (isThisCorrect) {
                      // Highlight GREEN
                      optionStyle =
                        'border-emerald-500 bg-emerald-950/40 text-emerald-200 shadow-sm shadow-emerald-950';
                      iconElement = (
                        <CheckCircle2 className="size-5 shrink-0 text-emerald-400 animate-in zoom-in-50 duration-200" />
                      );
                    } else if (isThisSelected && !isThisCorrect) {
                      // Highlight RED
                      optionStyle =
                        'border-rose-500 bg-rose-950/40 text-rose-200 shadow-sm shadow-rose-950';
                      iconElement = (
                        <XCircle className="size-5 shrink-0 text-rose-400 animate-in zoom-in-50 duration-200" />
                      );
                    } else {
                      // Neutral unselected after answer
                      optionStyle = 'border-slate-800 bg-[#070b14] text-slate-500 opacity-60';
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
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-xs sm:text-sm font-medium transition-all ${optionStyle} ${
                        !isAnswered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
                      }`}
                    >
                      {iconElement}
                      <span className="flex-1">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback & Detailed Explanation */}
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
                  <p className="mt-1.5 text-slate-300 text-xs sm:text-[13px]">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 to-[#0e192c] p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Award className="size-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base">
                {percentage === 100
                  ? 'Mastery Achieved! 🎯'
                  : percentage >= 60
                    ? 'Well Done! Knowledge Verified 👍'
                    : 'Review the Concepts & Try Again 🔄'}
              </h4>
              <p className="text-xs text-slate-300">
                You answered {correctCount} of {questions.length} questions correctly ({percentage}%).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetQuiz}
            className="rounded-lg border border-[var(--osa-border)] bg-[#101b30] px-4 py-2 text-xs font-semibold text-cyan-300 transition-colors hover:bg-cyan-500/20 hover:text-white"
          >
            Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
}
