import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ChevronRight, ChevronLeft } from "lucide-react";

const ghq12Questions = [
  { question: "Have you recently been able to concentrate on your work?" },
  { question: "Have you recently lost much sleep over worry?" },
  { question: "Have you recently felt that you were playing a useful part in things?" },
  { question: "Have you recently felt capable of making decisions about things?" },
  { question: "Have you recently felt constantly under strain?" },
  { question: "Have you recently felt that you couldn’t overcome your difficulties?" },
  { question: "Have you recently been able to enjoy your normal day-to-day activities?" },
  { question: "Have you recently been able to face up to your problems?" },
  { question: "Have you recently been feeling unhappy or depressed?" },
  { question: "Have you recently been losing confidence in yourself?" },
  { question: "Have you recently been thinking of yourself as a worthless person?" },
  { question: "Have you recently been feeling reasonably happy, all things considered?" },
];

const scoreOptionsGHQ = [
  { label: "Better than usual", value: 0 },
  { label: "Same as usual", value: 0 },
  { label: "Less than usual", value: 1 },
  { label: "Much less than usual", value: 1 },
];

const getScoreInterpretationGHQ = (score: number) => {
  if (score >= 4) return "Possible minor psychiatric disorder";
  return "Unlikely to have a minor psychiatric disorder";
};

export default function GHQ12Test() {
  const [answers, setAnswers] = useState(new Array(ghq12Questions.length).fill(null));
  const [step, setStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const totalScore = answers.reduce((acc, val) => acc + (val || 0), 0);
  const scoreInterpretation = getScoreInterpretationGHQ(totalScore);

  const handleAnswerChange = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[step] = value;
    setAnswers(newAnswers);
  };

  const handleNextStep = () => {
    if (step < ghq12Questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePreviousStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleRetakeTest = () => {
    setAnswers(new Array(ghq12Questions.length).fill(null));
    setStep(0);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 flex items-center justify-center">
        <div className="bg-card p-8 sm:p-12 rounded-2xl shadow-xl w-full max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-6">GHQ-12 General Health Test</h2>
          <p className="text-center text-muted-foreground mb-8 text-sm sm:text-base">
            How have you been feeling over the last few weeks?
          </p>

          {!showResults ? (
            <>
              <div className="mb-6 space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="font-semibold text-lg text-foreground">
                    {step + 1}. {ghq12Questions[step].question}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {scoreOptionsGHQ.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswerChange(option.value)}
                      className={`py-3 px-4 rounded-lg text-center transition-all duration-200
                        ${answers[step] === option.value
                          ? "bg-blue-600 text-white shadow-md border-2 border-blue-700 scale-105"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={handlePreviousStep}
                  disabled={step === 0}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>
                <span className="text-sm text-muted-foreground">
                  Question {step + 1} of {ghq12Questions.length}
                </span>
                <button
                  onClick={handleNextStep}
                  disabled={answers[step] === null}
                  className="flex items-center gap-2 bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-400 transition-colors"
                >
                  {step < ghq12Questions.length - 1 ? "Next" : "Finish"}
                  <ChevronRight size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Your Results</h3>
              <p className="text-5xl font-extrabold text-blue-600 mb-2">{totalScore}</p>
              <p className="text-lg text-muted-foreground mb-6">{scoreInterpretation}</p>
              <button
                onClick={handleRetakeTest}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Retake Test
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
