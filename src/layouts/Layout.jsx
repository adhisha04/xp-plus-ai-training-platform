import { Outlet, useLocation, Link } from "react-router-dom";
import {
  Home,
  BookOpen,
  LayoutDashboard,
  Users,
  Sparkles,
  Zap,
  LogOut,
  Trophy,
} from "lucide-react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

const navigation = [
  { name: "Home", path: "/", icon: Home },
  { name: "Scenarios", path: "/scenarios", icon: BookOpen },
  { name: "Shared", path: "/shared", icon: Users },
  { name: "My Scenarios", path: "/my-scenarios", icon: Sparkles },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", path: "/profile", icon: Trophy },
];

export default function Layout() {
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [userXP, setUserXP] = useState(0);

  // ✅ Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);

      if (u) {
        // 🔥 listen to XP from Firestore
        const ref = doc(db, "users", u.uid);
        const unsubXP = onSnapshot(ref, (snap) => {
          if (snap.exists()) {
            setUserXP(snap.data().xp || 0);
          }
        });

        return () => unsubXP();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  // ✅ Hide navbar on login/signup OR if not logged in
  const hideNavbar =
    !user ||
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      
      {/* ✅ NAVBAR (conditionally rendered) */}
      {!hideNavbar && (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-[#3A7BFF] to-[#23C4C7] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">XP</span>
              </div>
              <span className="font-bold text-xl text-gray-900">XP PLUS</span>
            </Link>

            {/* Navigation */}
            <div className="flex gap-2">
              {navigation.map((item) => {
                const isActive =
                  item.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              
              {/* XP */}
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-gray-900">
                  {userXP} XP
                </span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* MAIN */}
      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </div>
  );
}