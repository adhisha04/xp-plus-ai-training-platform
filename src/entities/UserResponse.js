import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// =============================
// VALIDATION
// =============================
export function validateResponse(data) {
  const errors = {};

  if (!data.scenario_id) {
    errors.scenario_id = "Scenario ID required";
  }

  if (!data.user_answer || data.user_answer.length < 20) {
    errors.user_answer = "Answer must be at least 20 characters";
  }

  return errors;
}

// =============================
// CREATE RESPONSE OBJECT
// =============================
export function createUserResponse(data) {
  return {
    user_id: data.user_id,
    user_email: data.user_email,

    scenario_id: data.scenario_id,
    scenario_title: data.scenario_title,

    user_answer: data.user_answer,

    ai_feedback: data.ai_feedback || {},

    scores: data.scores || {
      empathy: 0,
      clarity: 0,
      logic: 0,
      emotional_intelligence: 0,
      creativity: 0,
    },

    bonus_xp: data.bonus_xp || 0,
    total_xp_earned: data.total_xp_earned || 0,

    createdAt: new Date(),
  };
}

// =============================
// SAVE RESPONSE (Firestore)
// =============================
export async function saveResponse(responseData) {
  const errors = validateResponse(responseData);

  if (Object.keys(errors).length > 0) {
    console.error("Invalid response:", errors);
    throw new Error("Validation failed");
  }

  const response = createUserResponse(responseData);

  try {
    await addDoc(collection(db, "responses"), response);
    console.log("✅ Response saved to Firestore");
  } catch (error) {
    console.error("❌ Error saving response:", error);
    throw error;
  }
}

// =============================
// GET ALL RESPONSES (Admin)
// =============================
export async function getAllResponses() {
  try {
    const snapshot = await getDocs(
      query(collection(db, "responses"), orderBy("createdAt", "desc"))
    );

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("❌ Error fetching responses:", error);
    return [];
  }
}

// =============================
// GET RESPONSES BY SCENARIO
// =============================
export async function getResponsesByScenario(scenarioId) {
  try {
    const q = query(
      collection(db, "responses"),
      where("scenario_id", "==", scenarioId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("❌ Error fetching scenario responses:", error);
    return [];
  }
}

// =============================
// DELETE RESPONSE (Admin)
// =============================
export async function deleteResponse(responseId) {
  try {
    await deleteDoc(doc(db, "responses", responseId));
    console.log("🗑️ Response deleted");
  } catch (error) {
    console.error("❌ Error deleting response:", error);
    throw error;
  }
}