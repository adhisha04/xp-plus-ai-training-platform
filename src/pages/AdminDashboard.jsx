import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  Users,
  Zap,
  BookOpen,
  Brain,
  Trash2,
  Pencil,
} from "lucide-react";
import { deleteScenarioFirestore } from "@/entities/Scenario";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [responses, setResponses] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [editing, setEditing] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);

  // 👤 USERS
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // 🧠 RESPONSES
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "responses"), (snap) => {
      setResponses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // 📚 SCENARIOS
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "scenarios"), (snap) => {
      setScenarios(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const totalXP = users.reduce((sum, u) => sum + (u.xp || 0), 0);

  // 🗑 DELETE SCENARIO
    const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this scenario?");
        if (!confirmDelete) return;

        try {
            await deleteScenarioFirestore(id);

    alert("✅ Deleted");

    // refresh state instead of reload (better UX)
    setScenarios((prev) => prev.filter((s) => s.id !== id));

  } catch (err) {
    console.error(err);
    alert("❌ Delete failed");
  }
};

  // ✏️ EDIT SAVE
  const handleEditSave = async () => {
    if (!editing) return;

    const ref = doc(db, "scenarios", editing.id);
    await updateDoc(ref, {
      title: editing.title,
      description: editing.description,
      base_xp: Number(editing.base_xp),
    });

    setEditing(null);
  };

  // 🗑 DELETE RESPONSE
  const handleDeleteResponse = async (id) => {
    if (!confirm("Delete this response?")) return;
    await deleteDoc(doc(db, "responses", id));
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard 🚀</h1>

      {/* 🔥 STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Stat icon={<Users />} label="Users" value={users.length} />
        <Stat icon={<Zap />} label="Total XP" value={totalXP} />
        <Stat icon={<BookOpen />} label="Scenarios" value={scenarios.length} />
        <Stat icon={<Brain />} label="Responses" value={responses.length} />
      </div>

      {/* 👥 USERS */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Users</h2>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th>Email</th>
              <th>Role</th>
              <th>XP</th>
              <th>Level</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td>{u.email}</td>
                <td>{u.role || "user"}</td>
                <td>{u.xp || 0}</td>
                <td>{Math.floor((u.xp || 0) / 100) + 1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🧠 RESPONSES */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">User Responses</h2>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th>User</th>
              <th>Scenario</th>
              <th>Answer</th>
              <th>XP</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {responses.map((r) => (
              <tr key={r.id} className="border-b">
                <td>{r.user_email || r.user_id || "Unknown User"}</td>

                <td>
                  {r.scenario_title ||
                    scenarios.find((s) => s.id === r.scenario_id)?.title ||
                    "Unknown Scenario"}
                </td>

                {/* ✅ FIXED ANSWER COLUMN */}
                <td className="p-3 max-w-xs">
                  <p className="truncate text-sm text-gray-700">
                    {r.user_answer?.slice(0, 80)}...
                  </p>

                  <button
                    onClick={() => setSelectedResponse(r)}
                    className="text-blue-600 text-xs mt-1 hover:underline"
                  >
                    View
                  </button>
                </td>

                <td>+{r.total_xp_earned || 0}</td>

                <td>
                  <button
                    onClick={() => handleDeleteResponse(r.id)}
                    className="text-red-500"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📚 SCENARIOS */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Manage Scenarios</h2>

        <div className="space-y-3">
          {scenarios.map((s) => (
            <div
              key={s.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">{s.title}</p>
                <p className="text-sm text-gray-500">{s.base_xp} XP</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditing(s)}
                  className="text-blue-600"
                >
                  <Pencil />
                </button>

                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-red-600"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✏️ EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">
            <h2 className="text-lg font-bold mb-4">Edit Scenario</h2>

            <input
              value={editing.title}
              onChange={(e) =>
                setEditing({ ...editing, title: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            <textarea
              value={editing.description}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  description: e.target.value,
                })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            <input
              type="number"
              value={editing.base_xp}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  base_xp: e.target.value,
                })
              }
              className="w-full border p-2 mb-3 rounded"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setEditing(null)}>Cancel</button>
              <button
                onClick={handleEditSave}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 VIEW RESPONSE MODAL */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-lg">
            <h2 className="text-lg font-bold mb-3">Full Response</h2>

            <p className="text-gray-700 whitespace-pre-wrap">
              {selectedResponse.user_answer}
            </p>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedResponse(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 📊 STAT COMPONENT
function Stat({ icon, label, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm flex gap-3 items-center">
      <div className="text-blue-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}