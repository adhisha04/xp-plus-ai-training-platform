import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Loader2, Lightbulb, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import LevelBadge from "@/components/ui/LevelBadge";
import { scenarios } from "@/data/scenarios";

import { doc, getDoc, setDoc, increment } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { createOrGetUser } from "@/lib/firestore";
import { saveResponseToFirestore } from "@/lib/responses";

const categoryIcons = {
  workplace: "💼",
  conflict_resolution: "🤝",
  communication: "💬",
  leadership: "👑",
  ethical_dilemmas: "⚖️",
  crisis_management: "🚨",
  daily_life: "🏠",
};

export default function Scenario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(true);

  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔥 FETCH SCENARIO (Firestore + fallback)
  useEffect(() => {
    const fetchScenario = async () => {
      try {
        // 1️⃣ Try Firestore
        const ref = doc(db, "scenarios", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setScenario({ id: snap.id, ...snap.data() });
        } else {
          // 2️⃣ fallback to static scenarios
          const localScenario = scenarios.find(
            (s) => String(s.id) === String(id)
          );
          setScenario(localScenario || null);
        }
      } catch (err) {
        console.error("❌ Error fetching scenario:", err);
        setScenario(null);
      } finally {
        setLoading(false);
      }
    };

    fetchScenario();
  }, [id]);

  // ⏳ LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading scenario...
      </div>
    );
  }

  // ❌ NOT FOUND UI
  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">Scenario not found</h2>
      </div>
    );
  }

  // 🚀 SUBMIT HANDLER
  const handleSubmit = async () => {
    if (userAnswer.length < 50) {
      alert("Please write at least 50 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 🔥 AI CALL
      const res = await fetch("http://localhost:3001/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenario: `${scenario.title} - ${scenario.description}`,
          answer: userAnswer,
        }),
      });

      const data = await res.json();
      const earnedXP = data.xp || scenario.base_xp || 30;

      console.log("AI RESPONSE:", data);

      // 👤 USER
      const user = auth.currentUser;
      if (!user) {
        alert("User not logged in");
        setIsSubmitting(false);
        return;
      }

      // ✅ ensure user exists
      await createOrGetUser(user);

      const userRef = doc(db, "users", user.uid);

      // ✅ SAVE RESPONSE (ADMIN READY)
      await saveResponseToFirestore({
        user_id: user.uid,
        user_email: user.email,
        scenario_id: scenario.id,
        scenario_title: scenario.title,
        user_answer: userAnswer,
        ai_feedback: data,
        total_xp_earned: earnedXP,
        createdAt: new Date(),
      });

      // ✅ UPDATE XP
      await setDoc(
        userRef,
        {
          xp: increment(earnedXP),
          email: user.email,
        },
        { merge: true }
      );

      console.log("🔥 XP UPDATED:", earnedXP);

      // 🚀 NAVIGATE
      navigate("/feedback");

    } catch (error) {
      console.error("❌ Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* HEADER */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link
            to="/scenarios"
            className="flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* SCENARIO CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm mb-8 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#3A7BFF] to-[#23C4C7] px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {categoryIcons[scenario.category]}
              </span>
              <span className="text-white capitalize">
                {scenario.category.replace(/_/g, " ")}
              </span>
            </div>

            <div className="flex gap-3 items-center">
              <LevelBadge level={scenario.level} />
              <div className="flex items-center gap-1 text-white text-sm">
                <Zap className="w-4 h-4" />
                +{scenario.base_xp || 30} XP
              </div>
            </div>
          </div>

          <div className="p-6">
            <h1 className="text-xl font-bold mb-4">
              {scenario.title}
            </h1>
            <p className="text-gray-700">{scenario.description}</p>

            {scenario.guidance && (
              <div className="mt-4 bg-yellow-50 p-4 rounded-xl flex gap-2">
                <Lightbulb className="text-yellow-500" />
                <span>{scenario.guidance}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ANSWER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm"
        >
          <Textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Write your response (min 50 characters)..."
            className="min-h-[150px]"
          />

          <div className="flex justify-between items-center mt-4">
            <span
              className={`text-sm ${
                userAnswer.length < 50
                  ? "text-gray-400"
                  : "text-green-600"
              }`}
            >
              {userAnswer.length} / 50 characters
            </span>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || userAnswer.length < 50}
              className="bg-[#3A7BFF] text-white px-6 py-2 rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Evaluating...
                </>
              ) : (
                <>
                  Submit
                  <Send className="ml-2" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}