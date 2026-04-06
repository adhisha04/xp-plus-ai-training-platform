import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const categories = [
  "workplace",
  "conflict_resolution",
  "communication",
  "leadership",
  "ethical_dilemmas",
  "crisis_management",
  "daily_life",
];

const levels = [
  { value: "beginner", xp: 20 },
  { value: "intermediate", xp: 35 },
  { value: "advanced", xp: 50 },
];

export default function CreateScenario() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    base_xp: 20,
    guidance: "",
    is_public: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "level") {
      const lvl = levels.find((l) => l.value === value);
      if (lvl) {
        setFormData((prev) => ({
          ...prev,
          level: value,
          base_xp: lvl.xp,
        }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title || formData.title.length < 10)
      newErrors.title = "Minimum 10 characters";

    if (!formData.description || formData.description.length < 50)
      newErrors.description = "Minimum 50 characters";

    if (!formData.category) newErrors.category = "Required";
    if (!formData.level) newErrors.level = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      // 🛡️ AI validation
      const res = await fetch("http://localhost:3001/api/validate-scenario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
        }),
      });

      const validation = await res.json();

      if (!validation.is_valid) {
        alert("Rejected: " + validation.reason);
        setLoading(false);
        return;
      }

      const user = auth.currentUser;
      if (!user) throw new Error("Not logged in");

      // ✅ SAVE TO FIRESTORE (THIS FIXES EVERYTHING)
      await addDoc(collection(db, "scenarios"), {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        level: formData.level,
        base_xp: formData.base_xp,
        guidance: formData.guidance || "",
        is_public: formData.is_public,

        created_by: user.uid,
        created_by_email: user.email,

        createdAt: serverTimestamp(),
      });

      navigate("/my-scenarios");

    } catch (err) {
      console.error(err);
      alert("Failed to create scenario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#3A7BFF] to-[#23C4C7] py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/my-scenarios" className="text-white/80 flex mb-4">
            <ArrowLeft className="mr-2" /> Back to My Scenarios
          </Link>

          <h1 className="text-3xl font-bold text-white">
            Create Custom Scenario ✨
          </h1>
          <p className="text-white/80">
            Design your own learning experience
          </p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="max-w-4xl mx-auto px-4 -mt-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow p-6 space-y-6"
        >
          {/* TITLE */}
          <div>
            <label className="font-medium">Scenario Title *</label>
            <Input
              placeholder="e.g., Handling a Difficult Customer"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          {/* CATEGORY + LEVEL */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Category *</label>
              <select
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  handleChange("category", e.target.value)
                }
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="font-medium">Difficulty Level *</label>
              <select
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  handleChange("level", e.target.value)
                }
              >
                <option value="">Select level</option>
                {levels.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.value} (+{l.xp} XP)
                  </option>
                ))}
              </select>
              {errors.level && (
                <p className="text-red-500 text-sm">{errors.level}</p>
              )}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="font-medium">Scenario Description *</label>
            <Textarea
              placeholder="Describe the situation..."
              value={formData.description}
              onChange={(e) =>
                handleChange("description", e.target.value)
              }
              className="min-h-[120px]"
            />
            <p className="text-sm text-gray-400">
              {formData.description.length} / 50 characters
            </p>
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description}
              </p>
            )}
          </div>

          {/* GUIDANCE */}
          <div>
            <label className="font-medium">
              Response Guidance (Optional)
            </label>
            <Textarea
              placeholder="Give hints..."
              value={formData.guidance}
              onChange={(e) =>
                handleChange("guidance", e.target.value)
              }
            />
          </div>

          {/* TOGGLE */}
          <div className="flex justify-between items-center bg-purple-50 p-4 rounded-xl">
            <div>
              <p className="font-medium">Share with Community</p>
              <p className="text-sm text-gray-500">
                Allow others to use your scenario
              </p>
            </div>

            <input
              type="checkbox"
              checked={formData.is_public}
              onChange={(e) =>
                handleChange("is_public", e.target.checked)
              }
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1 bg-[#3A7BFF] text-white"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Scenario"}
            </Button>

            <Link to="/my-scenarios" className="flex-1">
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}