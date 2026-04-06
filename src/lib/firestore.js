import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const createOrGetUser = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    console.log("🔥 Creating new user in Firestore");

    await setDoc(userRef, {
      email: user.email,
      xp: 0,
      role: "user", // ✅ IMPORTANT
      createdAt: serverTimestamp(), // ✅ better than new Date()
    });

  } else {
    console.log("✅ User already exists:", snap.data());
  }
};