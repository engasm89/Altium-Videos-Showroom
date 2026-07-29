import React, { useRef, useState } from 'react';
import { 
  HelpCircle, 
  X, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Sparkles, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { useModalA11y } from '../utils/useModalA11y';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const HARDWARE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Which keyboard shortcut in Altium Designer immediately initiates Interactive Trace Routing mode?",
    options: ["Ctrl + W", "P -> T", "D -> R", "Shift + S"],
    correctIndex: 0,
    explanation: "Ctrl + W starts Interactive Routing in the PCB editor, allowing you to route copper traces."
  },
  {
    id: 2,
    question: "What is the primary benefit of Altium Develop's ActiveBOM live data feed?",
    options: [
      "It automatically routes 4-layer PCBs without human intervention",
      "It continuously monitors supplier stock, lead times, and component obsolescence risks",
      "It renders 3D enclosures in SolidWorks without STEP files",
      "It generates Gerber files directly from schematic netlists"
    ],
    correctIndex: 1,
    explanation: "ActiveBOM connects your Bill of Materials to live distributor API feeds (Mouser, DigiKey) for real-time stock and lifecycle alerts."
  },
  {
    id: 3,
    question: "According to IPC-2221 standards, what is the target characteristic impedance for standard single-ended RF/clock traces?",
    options: ["25 Ohms", "50 Ohms", "100 Ohms", "120 Ohms"],
    correctIndex: 1,
    explanation: "50 Ohms is the industry standard characteristic impedance for single-ended high-frequency PCB microstrip and stripline signals."
  },
  {
    id: 4,
    question: "In Altium Designer, what command updates the PCB document with changes made in the schematic editor (ECO)?",
    options: ["P -> W", "D -> U", "C -> C", "T -> D"],
    correctIndex: 1,
    explanation: "Pressing D -> U executes 'Design -> Update PCB Document', pushing schematic ECO changes to the PCB layout."
  },
  {
    id: 5,
    question: "What does ECAD-MCAD CoDesigner facilitate in Altium Develop?",
    options: [
      "Bi-directional synchronized 3D board geometry and keepout exchange with SolidWorks/Creo",
      "Automated soldering oven temperature profile calculation",
      "Firmware C++ code compiling for microcontrollers",
      "SPICE analog circuit simulation"
    ],
    correctIndex: 0,
    explanation: "ECAD-MCAD CoDesigner bridges electrical CAD and mechanical CAD software so mechanical engineers can pass board shapes and enclosure constraints directly to PCB designers."
  }
];

interface QuizModalProps {
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  useModalA11y(true, dialogRef, onClose);

  const currentQ = HARDWARE_QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedIndex(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < HARDWARE_QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedIndex(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Hardware engineering quiz"
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <span>Hardware Engineering & Altium Knowledge Assessment</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isFinished ? (
          <div className="space-y-6">
            
            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Question {currentIndex + 1} of {HARDWARE_QUIZ_QUESTIONS.length}</span>
                <span>Score: {score}</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / HARDWARE_QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-2">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-blue-500';

                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                  } else if (idx === selectedIndex) {
                    btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'bg-slate-950/50 border-slate-800 text-slate-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && idx === currentQ.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && idx === selectedIndex && idx !== currentQ.correctIndex && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Note */}
            {isAnswered && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
                <div className="font-bold text-cyan-400">Engineering Explanation:</div>
                <p className="text-slate-300 leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Footer Next Button */}
            <div className="flex items-center justify-end pt-2">
              {isAnswered && (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center space-x-2 transition-colors shadow-lg"
                >
                  <span>{currentIndex === HARDWARE_QUIZ_QUESTIONS.length - 1 ? 'Finish Assessment' : 'Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        ) : (
          /* Assessment Results */
          <div className="text-center space-y-6 py-6">
            <div className="w-16 h-16 rounded-full bg-blue-950 border border-blue-800 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-white">Assessment Complete!</h3>
              <p className="text-xs text-slate-400">
                You scored <span className="text-cyan-300 font-bold font-mono text-base">{score} / {HARDWARE_QUIZ_QUESTIONS.length}</span> ({Math.round((score / HARDWARE_QUIZ_QUESTIONS.length) * 100)}%)
              </p>
            </div>

            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              {score >= 4 
                ? 'Outstanding performance! You possess strong command over Altium CAD shortcuts, design rule constraints, and supply chain management.'
                : 'Good effort! Review the Altium Designer Foundations learning path to solidify your CAD workflow knowledge.'}
            </p>

            <div className="flex items-center justify-center space-x-3 pt-4">
              <button
                onClick={handleRestart}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center space-x-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors shadow-lg"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
