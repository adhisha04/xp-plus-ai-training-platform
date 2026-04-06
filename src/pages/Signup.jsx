import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { doc, setDoc } from "firebase/firestore";
import { createOrGetUser } from "@/lib/firestore";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ SAVE USER TO FIRESTORE (important for future features)
  const saveUser = async (user) => {
    await setDoc(
      doc(db, "users", user.uid),
      {
        email: user.email,
        createdAt: new Date(),
      },
      { merge: true }
    );
  };

  // 🔹 EMAIL SIGNUP
  const handleSignup = async () => {
  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  try {
    const result = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await createOrGetUser(result.user);

    navigate("/scenarios");

  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      alert("Account already exists. Please login.");
      navigate("/login");
    } else {
      alert(err.message);
    }
  }
};

  // 🔹 GOOGLE SIGNUP
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      await saveUser(result.user);

      navigate("/scenarios");
    } catch (err) {
      alert("Google sign-up failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3A7BFF] to-[#23C4C7] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          Create Account 🚀
        </h1>

        {/* 🔥 GOOGLE BUTTON */}
        <button
          onClick={handleGoogleSignup}
          className="w-full border border-gray-200 rounded-xl py-3 mb-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="text-center text-gray-400 text-sm mb-4">
          OR
        </div>

        {/* EMAIL INPUT */}
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-200 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* PASSWORD INPUT */}
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-200 rounded-xl p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* EMAIL SIGNUP BUTTON */}
        <button
          onClick={handleSignup}
          className="w-full bg-[#3A7BFF] hover:bg-[#2a6ae8] text-white font-semibold py-3 rounded-xl transition"
        >
          Sign Up
        </button>

        <p className="text-sm text-gray-500 text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 font-medium">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}