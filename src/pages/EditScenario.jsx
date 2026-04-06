import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

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

export default function EditScenario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});

  // ✅ LOAD FROM FIRESTORE (FIXED)
  useEffect(() => {
    const fetchScenario = async () => {
      try {
        const docRef = doc(db, "scenarios", id);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
          alert("Scenario not found");
          navigate("/my-scenarios");
          return;
        }

        setFormData({ id: snap.id, ...snap.data() });
      } catch (err) {
        console.error("Error fetching scenario:", err);
      }
    };

    fetchScenario();
  }, [id, navigate]);

  // 🔄 LOADING STATE
  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading scenario...</p>
      </div>
    );
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "level") {
      const levelData = levels.find((l) => l.value === value);
      if (levelData) {
        setFormData((prev) => ({
          ...prev,
          level: value,
          base_xp: levelData.xp,
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

  // ✅ UPDATE FIRESTORE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Not authenticated");
        return;
      }

      const docRef = doc(db, "scenarios", id);

      await updateDoc(docRef, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        level: formData.level,
        base_xp: formData.base_xp,
        guidance: formData.guidance || "",
        updatedAt: new Date(),
      });

      alert("✅ Scenario updated!");
      navigate("/my-scenarios");

    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update scenario");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/my-scenarios" className="flex items-center mb-6">
          <ArrowLeft className="mr-2" /> Back
        </Link>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold mb-6"
        >
          Edit Scenario ✏️
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* TITLE */}
          <div>
            <p className="font-medium mb-1">Title</p>
            <Input
              value={formData.title || ""}
              onChange={(e) =>
                handleChange("title", e.target.value)
              }
            />
            {errors.title && (
              <p className="text-red-500">{errors.title}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <p className="font-medium mb-1">Description</p>
            <Textarea
              value={formData.description || ""}
              onChange={(e) =>
                handleChange("description", e.target.value)
              }
            />
            {errors.description && (
              <p className="text-red-500">
                {errors.description}
              </p>
            )}
          </div>

          {/* CATEGORY */}
          <div>
            <p className="font-medium mb-1">Category</p>
            <select
              className="w-full border p-2 rounded"
              value={formData.category || ""}
              onChange={(e) =>
                handleChange("category", e.target.value)
              }
            >
              <option value="">Select</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* LEVEL */}
          <div>
            <p className="font-medium mb-1">Level</p>
            <select
              className="w-full border p-2 rounded"
              value={formData.level || ""}
              onChange={(e) =>
                handleChange("level", e.target.value)
              }
            >
              <option value="">Select</option>
              {levels.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.value} (+{l.xp} XP)
                </option>
              ))}
            </select>
          </div>

          {/* GUIDANCE */}
          <div>
            <p className="font-medium mb-1">
              Guidance (optional)
            </p>
            <Textarea
              value={formData.guidance || ""}
              onChange={(e) =>
                handleChange("guidance", e.target.value)
              }
            />
          </div>

          {/* SUBMIT */}
          <Button type="submit" className="w-full">
            <Save className="mr-2" />
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}