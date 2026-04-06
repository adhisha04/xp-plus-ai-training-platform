import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

// =============================
// CONSTANTS
// =============================
export const SCENARIO_CATEGORIES = [
  "workplace",
  "conflict_resolution",
  "communication",
  "leadership",
  "ethical_dilemmas",
  "crisis_management",
  "daily_life",
];

export const SCENARIO_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
];

// =============================
// VALIDATION
// =============================
export function validateScenario(data) {
  const errors = {};

  if (!data.title || data.title.length < 10) {
    errors.title = "Title must be at least 10 characters";
  }

  if (!data.description || data.description.length < 50) {
    errors.description = "Description must be at least 50 characters";
  }

  if (!SCENARIO_CATEGORIES.includes(data.category)) {
    errors.category = "Invalid category";
  }

  if (!SCENARIO_LEVELS.includes(data.level)) {
    errors.level = "Invalid level";
  }

  if (!data.base_xp || data.base_xp < 1) {
    errors.base_xp = "XP must be at least 1";
  }

  return errors;
}

//
// 🔥 FIRESTORE FUNCTIONS
//

// =============================
// CREATE SCENARIO
// =============================
export async function createScenario(data, user) {
  if (!user) {
    throw new Error("User not authenticated");
  }

  const errors = validateScenario(data);
  if (Object.keys(errors).length > 0) {
    console.error("❌ Invalid scenario:", errors);
    throw new Error("Validation failed");
  }

  const scenarioData = {
    title: data.title,
    description: data.description,
    category: data.category,
    level: data.level,
    guidance: data.guidance || "",
    base_xp: data.base_xp,
    is_public: data.is_public || false,
    cloned_from: data.cloned_from || null,

    // 🔥 CRITICAL FOR DELETE RULES
    created_by: user.uid,
    created_by_email: user.email,

    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "scenarios"), scenarioData);

  return {
    id: docRef.id,
    ...scenarioData,
  };
}

// =============================
// GET USER SCENARIOS
// =============================
export async function getUserScenarios(userId) {
  if (!userId) return [];

  const q = query(
    collection(db, "scenarios"),
    where("created_by", "==", userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// =============================
// UPDATE SCENARIO
// =============================
export async function updateScenarioFirestore(id, data) {
  if (!id) throw new Error("Scenario ID required");

  const ref = doc(db, "scenarios", id);

  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// =============================
// DELETE SCENARIO
// =============================
export async function deleteScenarioFirestore(id) {
  if (!id) throw new Error("Scenario ID required");

  const ref = doc(db, "scenarios", id);

  await deleteDoc(ref);

  console.log("🗑️ Scenario deleted:", id);
}