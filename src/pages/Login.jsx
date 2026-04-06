import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { createOrGetUser } from "@/lib/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Email login
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/scenarios");
    } catch (err) {
  if (err.code === "auth/user-not-found") {
    alert("No account found. Please sign up.");
  } else if (err.code === "auth/wrong-password") {
    alert("Incorrect password.");
  } else if (err.code === "auth/invalid-credential") {
    alert("Use Google login for this account.");
  } else {
    alert(err.message);
  }
}
  };

  // ✅ Google login
  const provider = new GoogleAuthProvider();

const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);

    // create user in firestore
    await createOrGetUser(result.user);

    console.log("Logged in:", result.user);

    navigate("/scenarios");

  } catch (error) {
    console.error("GOOGLE ERROR:", error);
    alert(error.message); // show actual error
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
          Welcome Back 👋
        </h1>

        {/* GOOGLE */}
        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-200 rounded-xl py-3 mb-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-200 rounded-xl p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-200 rounded-xl p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Login */}
        <button
          onClick={handleLogin}
          className="w-full bg-[#3A7BFF] hover:bg-[#2a6ae8] text-white font-semibold py-3 rounded-xl transition"
        >
          Login
        </button>

        {/* Signup */}
        <p className="text-sm text-gray-500 text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 font-medium">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}