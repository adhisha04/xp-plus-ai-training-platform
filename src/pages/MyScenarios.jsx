import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { deleteScenarioFirestore } from "@/entities/Scenario";

const categoryIcons = {
  workplace: "💼",
  conflict_resolution: "🤝",
  communication: "💬",
  leadership: "👑",
  ethical_dilemmas: "⚖️",
  crisis_management: "🚨",
  daily_life: "🏠",
};

export default function MyScenarios() {
  const [scenarios, setScenarios] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ LOAD FROM FIRESTORE
  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, "scenarios"),
          where("created_by", "==", user.uid)
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setScenarios(data);
      } catch (error) {
        console.error("Error fetching scenarios:", error);
      }
    };

    fetchScenarios();
  }, []);

  // ✅ DELETE FROM FIRESTORE
  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Delete this scenario?");
  if (!confirmDelete) return;

  try {
    await deleteScenarioFirestore(id);

    alert("✅ Deleted");

    // refresh state instead of reload (better UX)
    setScenarios((prev) => prev.filter((s) => s.id !== id));

  } catch (err) {
    console.error(err);
    alert("❌ Delete failed");
  }
};


  const filtered = scenarios.filter((s) =>
    s.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#3A7BFF] to-[#23C4C7] pt-12 pb-24">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">
              My Scenarios
            </h1>
            <p className="text-white/80">
              Manage your custom scenarios
            </p>
          </div>

          <Link to="/create-scenario">
            <Button className="bg-white text-[#3A7BFF]">
              <Plus className="mr-2" />
              Create Scenario
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-16 pb-12">
        {/* Search */}
        <div className="bg-white p-4 rounded-xl mb-6 shadow">
          <input
            placeholder="Search scenarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Empty */}
        {filtered.length === 0 ? (
          <div className="bg-white p-10 rounded-xl text-center">
            <h2 className="text-xl font-semibold mb-2">
              No scenarios yet
            </h2>
            <Link to="/create-scenario">
              <Button>Create Scenario</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-5 rounded-xl shadow"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-2xl">
                    {categoryIcons[s.category]}
                  </span>
                  <span className="text-sm text-gray-500 capitalize">
                    {s.level}
                  </span>
                </div>

                <h3 className="font-bold text-lg mb-2">
                  {s.title}
                </h3>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {s.description}
                </p>

                <div className="flex gap-2">
                  {/* 🔥 THIS NOW WORKS */}
                  <Link to={`/scenarios/${s.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Eye className="mr-1" /> View
                    </Button>
                  </Link>

                  <Link to={`/edit-scenario/${s.id}`}>
                    <Button variant="outline">
                      <Edit />
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    onClick={() => handleDelete(s.id)}
                    className="text-red-500"
                  >
                    <Trash2 />
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