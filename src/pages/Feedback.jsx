import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  CheckCircle2,
  Lightbulb,
  Brain,
  Trophy,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const scoreLabels = {
  empathy: { label: "Empathy", icon: "❤️" },
  clarity: { label: "Clarity", icon: "💎" },
  logic: { label: "Logic", icon: "🧠" },
  emotional_intelligence: { label: "EQ", icon: "🎯" },
  creativity: { label: "Creativity", icon: "✨" },
};

export default function Feedback() {
  const [animatedXP, setAnimatedXP] = useState(0);

  // ✅ safer parsing
  let feedback = null;
  try {
    feedback = JSON.parse(localStorage.getItem("aiFeedback"));
  } catch {
    feedback = null;
  }

  if (!feedback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No feedback found</p>
      </div>
    );
  }

  const scores = feedback.scores || {};
  const totalXP = feedback.xp || 30;

  // ✅ XP animation
  useEffect(() => {
    let current = 0;
    const steps = 20;
    const inc = totalXP / steps;

    const timer = setInterval(() => {
      current += inc;
      if (current >= totalXP) {
        setAnimatedXP(totalXP);
        clearInterval(timer);
      } else {
        setAnimatedXP(Math.floor(current));
      }
    }, 40);

    return () => clearInterval(timer);
  }, [totalXP]);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#3A7BFF] to-[#23C4C7] pt-12 pb-24 text-center">
        <Trophy className="w-10 h-10 text-white mx-auto mb-4" />

        <h1 className="text-3xl font-bold text-white mb-4">
          Great Job! 🎉
        </h1>

        <div className="inline-flex items-center gap-3 bg-white/20 px-8 py-4 rounded-2xl">
          <Zap className="w-6 h-6 text-yellow-300" />
          <span className="text-4xl font-bold text-white">
            +{animatedXP}
          </span>
          <span className="text-white/80">XP</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-12 pb-12">

        {/* SCORES */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6 flex gap-2 items-center">
            <Star className="w-5 h-5 text-amber-500" />
            Your Scores
          </h2>

          <div className="space-y-4">
            {Object.entries(scoreLabels).map(([key, val]) => {
              const score = scores[key] || 0;

              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>
                      {val.icon} {val.label}
                    </span>
                    <span>{score}/5</span>
                  </div>

                  {/* 🔥 Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#3A7BFF] h-2 rounded-full"
                      style={{ width: `${(score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h2 className="font-semibold flex gap-2 items-center mb-2">
            <Brain className="w-5 h-5 text-blue-500" />
            Summary
          </h2>
          <p className="text-gray-700">
            {feedback.summary || "No summary available"}
          </p>
        </div>

        {/* STRENGTHS */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h3 className="font-semibold mb-3 flex gap-2 items-center">
            <CheckCircle2 className="text-green-500" />
            Strengths
          </h3>

          {feedback.strengths?.length ? (
            feedback.strengths.map((s, i) => (
              <p key={i}>• {s}</p>
            ))
          ) : (
            <p className="text-gray-500">No strengths available</p>
          )}
        </div>

        {/* IMPROVEMENTS */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h3 className="font-semibold mb-3 flex gap-2 items-center">
            <Lightbulb className="text-yellow-500" />
            Improvements
          </h3>

          {feedback.improvements?.length ? (
            feedback.improvements.map((i, idx) => (
              <p key={idx}>• {i}</p>
            ))
          ) : (
            <p className="text-gray-500">No improvements available</p>
          )}
        </div>

        {/* BUTTON */}
        <div className="flex gap-4">
          <Link to="/scenarios" className="flex-1">
            <Button className="w-full">
              Next Scenario
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}