import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Copy, Eye, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { db, auth } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const categoryIcons = {
  workplace: "💼",
  conflict_resolution: "🤝",
  communication: "💬",
  leadership: "👑",
  ethical_dilemmas: "⚖️",
  crisis_management: "🚨",
  daily_life: "🏠",
};

export default function SharedScenarios() {
  const [scenarios, setScenarios] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ LOAD FROM FIRESTORE (FIXED)
  useEffect(() => {
    const fetchShared = async () => {
      try {
        const q = query(
          collection(db, "scenarios"),
          where("is_public", "==", true)
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setScenarios(data);
      } catch (err) {
        console.error("Error loading shared scenarios:", err);
      }
    };

    fetchShared();
  }, []);

  // ✅ CLONE INTO USER'S COLLECTION
  const handleClone = async (scenario) => {
    try {
      const user = auth.currentUser;
      if (!user) return alert("Login required");

      await addDoc(collection(db, "scenarios"), {
        ...scenario,
        created_by: user.uid,
        created_by_email: user.email,
        is_public: false, // cloned privately
        createdAt: serverTimestamp(),
      });

      alert("✅ Scenario cloned!");
    } catch (err) {
      console.error(err);
      alert("Failed to clone");
    }
  };

  const filtered = scenarios.filter(
    (s) =>
      s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#3A7BFF] to-[#23C4C7] pt-12 pb-24">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">
            Shared Scenarios 🌍
          </h1>
          <p className="text-white/80">
            Explore scenarios created by others
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-16 pb-12">
        {/* SEARCH */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search scenarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* RESULTS */}
        {filtered.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-xl">
            <Users className="mx-auto mb-3" size={40} />
            <p>No shared scenarios found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-5 rounded-xl shadow"
              >
                <div className="text-2xl mb-2">
                  {categoryIcons[s.category] || "📚"}
                </div>

                <h3 className="font-bold mb-2">{s.title}</h3>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {s.description}
                </p>

                <div className="flex gap-2">
                  <Link
                    to={`/scenarios/${s.id}`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
                      <Eye size={16} className="mr-1" />
                      View
                    </Button>
                  </Link>

                  <Button
                    onClick={() => handleClone(s)}
                    className="flex-1"
                  >
                    <Copy size={16} className="mr-1" />
                    Clone
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}