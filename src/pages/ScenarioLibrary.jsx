import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import ScenarioCard from "@/components/ui/ScenarioCard";
import { scenarios as scenariosData } from "@/data/scenarios";

const categories = [
  { id: "all", name: "All", icon: "📚" },
  { id: "workplace", name: "Workplace", icon: "💼" },
  { id: "conflict_resolution", name: "Conflict Resolution", icon: "🤝" },
  { id: "communication", name: "Communication", icon: "💬" },
  { id: "leadership", name: "Leadership", icon: "👑" },
  { id: "ethical_dilemmas", name: "Ethical Dilemmas", icon: "⚖️" },
  { id: "crisis_management", name: "Crisis Management", icon: "🚨" },
  { id: "daily_life", name: "Daily Life", icon: "🏠" },
];

const levels = ["all", "beginner", "intermediate", "advanced"];

export default function ScenarioLibrary() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [completedScenarios, setCompletedScenarios] = useState([]);

  // ✅ Load completed scenarios safely
  useEffect(() => {
    try {
      const completed =
        JSON.parse(localStorage.getItem("completedScenarios")) || [];
      setCompletedScenarios(completed);
    } catch {
      setCompletedScenarios([]);
    }
  }, []);

  // ✅ Ensure scenariosData is always an array
  const safeScenarios = Array.isArray(scenariosData)
    ? scenariosData
    : [];

  const filteredScenarios = useMemo(() => {
    return safeScenarios.filter((scenario) => {
      if (!scenario) return false;

      const title = scenario.title || "";
      const description = scenario.description || "";

      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        scenario.category === selectedCategory;

      const matchesLevel =
        selectedLevel === "all" ||
        scenario.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [searchQuery, selectedCategory, selectedLevel, safeScenarios]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLevel("all");
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || selectedLevel !== "all";

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#3A7BFF] to-[#23C4C7] pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
          >
            Scenario Library
          </motion.h1>
          <p className="text-lg text-white/80">
            Choose a scenario to practice and build real-world skills
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search scenarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  selectedCategory === category.id
                    ? "bg-[#3A7BFF] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>

          {/* Levels */}
          <div className="flex flex-wrap items-center gap-2">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2 rounded-xl text-sm capitalize transition ${
                  selectedLevel === level
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {level === "all" ? "All Levels" : level}
              </button>
            ))}

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <p className="mb-6 text-gray-600">
          <strong>{filteredScenarios.length}</strong> scenarios found
        </p>

        {/* Cards */}
        {filteredScenarios.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center">
            <p className="text-gray-600 mb-2">
              No scenarios match your filters
            </p>
            <button
              onClick={clearFilters}
              className="text-[#3A7BFF] font-medium"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {filteredScenarios.map((scenario, index) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                index={index}
                completed={completedScenarios.includes(scenario.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}