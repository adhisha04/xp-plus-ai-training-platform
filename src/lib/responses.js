import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

// ✅ Save response
export const saveResponseToFirestore = async (response) => {
  await addDoc(collection(db, "responses"), {
    ...response,
    createdAt: new Date(),
  });
};

// ✅ Get user responses
export const getUserResponses = async (userId) => {
  const q = query(
    collection(db, "responses"),
    where("userId", "==", userId)
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};