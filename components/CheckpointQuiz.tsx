import React, { useState, useEffect } from 'react';
import { CheckpointQuestion } from '../types';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface CheckpointQuizProps {
  questions: CheckpointQuestion[];
}

const CheckpointQuiz: React.FC<CheckpointQuizProps> = ({ questions }) => {
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setUserAnswers(new Array(questions.length).fill(null));
    setSubmitted(false);
  }, [questions]);

  const handleSelect = (qIndex: number, optionIndex: number) => {
    if (submitted) return;
    const newAnswers = [...userAnswers];
    newAnswers[qIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const calculateScore = () => {
    return userAnswers.reduce((acc, ans, idx) => {
      return ans === questions[idx].correctAnswerIndex ? (acc || 0) + 1 : (acc || 0);
    }, 0);
  };

  const handleReset = () => {
    setUserAnswers(new Array(questions.length).fill(null));
    setSubmitted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-100 mb-8">
        <h2 className="text-2xl font-bold text-emerald-900 mb-2">Knowledge Checkpoint</h2>
        <p className="text-emerald-700">Test your understanding of the current topic. Select the best answer for each question.</p>
        
        {submitted && (
          <div className="mt-4 pt-4 border-t border-emerald-200 flex items-center justify-between">
            <span className="text-xl font-bold text-emerald-800">
              Score: {calculateScore()} / {questions.length}
            </span>
            <button 
              onClick={handleReset}
              className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800"
            >
              <RefreshCw className="w-4 h-4 mr-1" /> Try Again
            </button>
          </div>
        )}
      </div>

      {questions.map((q, qIndex) => {
        const isCorrect = userAnswers[qIndex] === q.correctAnswerIndex;
        const hasAnswered = userAnswers[qIndex] !== null;
        
        return (
          <div key={qIndex} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex gap-3">
                <span className="bg-emerald-100 text-emerald-800 w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                  {qIndex + 1}
                </span>
                {q.question}
              </h3>

              <div className="space-y-3 pl-11">
                {q.options.map((option, optIndex) => {
                  let buttonStyle = "border-slate-200 hover:bg-slate-50";
                  if (submitted) {
                    if (optIndex === q.correctAnswerIndex) {
                      buttonStyle = "bg-green-100 border-green-500 text-green-900";
                    } else if (userAnswers[qIndex] === optIndex) {
                      buttonStyle = "bg-red-50 border-red-300 text-red-900";
                    } else {
                      buttonStyle = "opacity-50 border-slate-100";
                    }
                  } else if (userAnswers[qIndex] === optIndex) {
                    buttonStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500";
                  }

                  return (
                    <button
                      key={optIndex}
                      onClick={() => handleSelect(qIndex, optIndex)}
                      disabled={submitted}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${buttonStyle} flex items-center justify-between group`}
                    >
                      <span>{option}</span>
                      {submitted && optIndex === q.correctAnswerIndex && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {submitted && userAnswers[qIndex] === optIndex && optIndex !== q.correctAnswerIndex && <XCircle className="w-5 h-5 text-red-500" />}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className={`mt-6 ml-11 p-4 rounded-lg text-sm ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-900'}`}>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-1">Explanation:</span>
                      {q.explanation}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {!submitted && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setSubmitted(true)}
            disabled={userAnswers.includes(null)}
            className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-200"
          >
            Check Answers
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckpointQuiz;
