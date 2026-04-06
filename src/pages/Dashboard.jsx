import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Flame,
  CheckCircle2,
  Trophy,
  Calendar,
  Target,
} from "lucide-react";
import XPProgressRing, { getLevelInfo } from "@/components/ui/XPProgressRing";
import ScenarioCard from "@/components/ui/ScenarioCard";
import { scenarios } from "@/data/scenarios";
import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { getUserResponses } from "@/lib/responses";

export default function Dashboard() {
  const isRegistered = true;
  if (!isRegistered) return <UserNotRegisteredError />;

  const [totalXP, setTotalXP] = useState(0);
  const [responses, setResponses] = useState([]);
  const [completedScenarios, setCompletedScenarios] = useState([]);

  // ✅ REAL-TIME XP FROM FIRESTORE
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setTotalXP(snap.data().xp || 0);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ FETCH RESPONSES FROM FIRESTORE
  useEffect(() => {
    const fetchResponses = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const data = await getUserResponses(user.uid);

      setResponses(data);

      const completedIds = data.map((r) => r.scenario_id);
      setCompletedScenarios(completedIds);
    };

    fetchResponses();
  }, []);

  const levelInfo = getLevelInfo(totalXP);

  const streak = responses.length > 0 ? Math.min(responses.length, 7) : 0;

  const suggestedScenarios = scenarios
    .filter((s) => !completedScenarios.includes(s.id))
    .slice(0, 3);

  const recentCompleted = [...responses].slice(-5).reverse();

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#3A7BFF] to-[#23C4C7] pt-12 pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back! 👋
            </h1>
            <p className="text-white/80">
              Track your progress and grow your skills
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-24">
        {/* Stats Card */}
        <motion.div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
            
            {/* XP Ring */}
            <div className="flex flex-col items-center">
              <XPProgressRing totalXP={totalXP} size={180} />
              <div className="mt-4 text-center">
                <div className="bg-gradient-to-r from-[#3A7BFF] to-[#23C4C7] text-white px-4 py-2 rounded-full">
                  <Trophy className="inline w-4 h-4 mr-1" />
                  Level {levelInfo.level}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {levelInfo.xpToNext > 0
                    ? `${levelInfo.xpToNext} XP to next level`
                    : "Max level reached"}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-orange-100 p-5 rounded-xl">
                <Flame className="text-orange-500 mb-2" />
                <p className="text-3xl font-bold">{streak}</p>
                <p className="text-sm">days streak</p>
              </div>

              <div className="bg-green-100 p-5 rounded-xl">
                <CheckCircle2 className="text-green-500 mb-2" />
                <p className="text-3xl font-bold">
                  {completedScenarios.length}
                </p>
                <p className="text-sm">completed</p>
              </div>

              <div className="bg-blue-100 p-5 rounded-xl">
                <Zap className="text-blue-500 mb-2" />
                <p className="text-3xl font-bold">{totalXP}</p>
                <p className="text-sm">XP</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Suggested */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#3A7BFF]" />
            Suggested for You
          </h2>

          {suggestedScenarios.length === 0 ? (
            <div className="bg-white p-6 rounded-xl text-center">
              🎉 You've completed all scenarios!
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {suggestedScenarios.map((scenario, index) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {recentCompleted.length > 0 && (
          <div className="bg-white rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#3A7BFF]" />
              Recent Activity
            </h2>

            {recentCompleted.map((res, i) => {
              const scenario = scenarios.find(
                (s) => s.id === res.scenario_id
              );

              return (
                <div
                  key={i}
                  className="flex justify-between p-3 bg-gray-50 rounded-lg mb-2"
                >
                  <span>{scenario?.title || "Scenario"}</span>
                  <span>+{res.xp_earned || 30} XP</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}