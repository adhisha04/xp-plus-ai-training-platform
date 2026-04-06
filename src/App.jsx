import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import ScenarioLibrary from "./pages/ScenarioLibrary";
import Scenario from "./pages/Scenario";
import Feedback from "./pages/Feedback";
import Dashboard from "./pages/Dashboard";
import CreateScenario from "./pages/CreateScenario";
import MyScenarios from "./pages/MyScenarios";
import EditScenario from "./pages/EditScenario";
import SharedScenarios from "./pages/SharedScenarios";

// ✅ AUTH
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ Layout Wrapper */}
        <Route element={<Layout />}>

          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* PROTECTED */}
          <Route
            path="/scenarios"
            element={
              <ProtectedRoute>
                <ScenarioLibrary />
              </ProtectedRoute>
            }
          />

          <Route
            path="/scenarios/:id"
            element={
              <ProtectedRoute>
                <Scenario />
              </ProtectedRoute>
            }
          />

          <Route
            path="/feedback"
            element={
              <ProtectedRoute>
                <Feedback />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-scenario"
            element={
              <ProtectedRoute>
                <CreateScenario />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-scenarios"
            element={
              <ProtectedRoute>
                <MyScenarios />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-scenario/:id"
            element={
              <ProtectedRoute>
                <EditScenario />
              </ProtectedRoute>
            }
          />

          <Route
            path="/shared"
            element={
              <ProtectedRoute>
                <SharedScenarios />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          

        </Route> {/* ✅ THIS WAS MISSING */}

      </Routes>
    </BrowserRouter>
  );
}