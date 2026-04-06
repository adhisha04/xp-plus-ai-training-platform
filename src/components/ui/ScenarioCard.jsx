import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import LevelBadge from "./LevelBadge";

const categoryIcons = {
  workplace: "💼",
  conflict_resolution: "🤝",
  communication: "💬",
  leadership: "👑",
  ethical_dilemmas: "⚖️",
  crisis_management: "🚨",
  daily_life: "🏠",
};

const categoryColors = {
  workplace: "from-blue-500 to-blue-600",
  conflict_resolution: "from-purple-500 to-purple-600",
  communication: "from-teal-500 to-teal-600",
  leadership: "from-amber-500 to-amber-600",
  ethical_dilemmas: "from-indigo-500 to-indigo-600",
  crisis_management: "from-red-500 to-red-600",
  daily_life: "from-green-500 to-green-600",
};

export default function ScenarioCard({ scenario, index = 0, completed = false }) {
  console.log("ScenarioCard rendered");
  if (!scenario) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/scenarios/${scenario.id}`}>
        <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          
          {/* Top accent bar */}
          <div
            className={`h-1.5 bg-gradient-to-r ${
              categoryColors[scenario.category] || "from-gray-400 to-gray-500"
            }`}
          />

          <div className="p-5">
            {/* Category & Level */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">
                {categoryIcons[scenario.category] || "📚"}
              </span>
              <LevelBadge level={scenario.level} size="small" />
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-[#3A7BFF] transition-colors line-clamp-2">
              {scenario.title}
            </h3>

            {/* Description */}
            <p className="text-gray-500 text-sm line-clamp-2 mb-4">
              {scenario.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#3A7BFF] font-medium text-sm">
                <Zap className="w-4 h-4" />
                <span>+{scenario.base_xp} XP</span>
              </div>

              <div className="flex items-center gap-1 text-gray-400 group-hover:text-[#3A7BFF] transition-colors">
                <span className="text-sm font-medium">
                  {completed ? "Review" : "Start"}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Completed badge */}
            {completed && (
              <div className="absolute top-4 right-4">
                <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full">
                  ✓ Completed
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}