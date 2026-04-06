import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { getUserResponses } from "@/lib/responses";
import { motion } from "framer-motion";
import { Trophy, Zap, CheckCircle2, Flame } from "lucide-react";
import XPProgressRing, { getLevelInfo } from "@/components/ui/XPProgressRing";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [xp, setXP] = useState(0);
  const [responses, setResponses] = useState([]);

  // ✅ Get user
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // ✅ Real-time XP
  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setXP(snap.data().xp || 0);
      }
    });

    return () => unsub();
  }, [user]);

  // ✅ Fetch responses
  useEffect(() => {
    if (!user) return;

    const fetch = async () => {
      const data = await getUserResponses(user.uid);
      setResponses(data);
    };

    fetch();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  const levelInfo = getLevelInfo(xp);
  const completed = responses.length;
  const streak = completed > 0 ? Math.min(completed, 7) : 0;

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#3A7BFF] to-[#23C4C7] pt-12 pb-32 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-[#3A7BFF]">
            {user.email?.[0].toUpperCase()}
          </div>

          <h1 className="text-2xl font-bold text-white">
            {user.email}
          </h1>
          <p className="text-white/80">Your progress & achievements</p>
        </motion.div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-24">
        
        {/* XP Card */}
        <motion.div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col items-center">
            <XPProgressRing totalXP={xp} size={160} />

            <div className="mt-4 text-center">
              <div className="bg-gradient-to-r from-[#3A7BFF] to-[#23C4C7] text-white px-4 py-2 rounded-full inline-block">
                <Trophy className="inline w-4 h-4 mr-1" />
                Level {levelInfo.level}
              </div>

              <p className="text-gray-500 mt-2">
                {levelInfo.xpToNext > 0
                  ? `${levelInfo.xpToNext} XP to next level`
                  : "Max level reached"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-xl shadow">
            <Zap className="text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{xp}</p>
            <p className="text-sm text-gray-500">Total XP</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <CheckCircle2 className="text-green-500 mb-2" />
            <p className="text-2xl font-bold">{completed}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <Flame className="text-orange-500 mb-2" />
            <p className="text-2xl font-bold">{streak}</p>
            <p className="text-sm text-gray-500">Streak</p>
          </div>

        </div>
      </div>
    </div>
  );
}