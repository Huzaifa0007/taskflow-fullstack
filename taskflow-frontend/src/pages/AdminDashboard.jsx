import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const result = users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredUsers(result);
  }, [search, users]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const usersRes = await API.get("/users");
      const tasksRes = await API.get("/tasks/admin/all");

      setUsers(usersRes.data || []);
      setFilteredUsers(usersRes.data || []);
      setTasks(tasksRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Delete User
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await API.delete(`/users/${id}`);
    fetchData();
  };

  // 🔥 Toggle Role
  const toggleRole = async (u) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    await API.put(`/users/${u._id}/role`, { role: newRole });
    fetchData();
  };

  // 🔥 Delete Task
  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await API.delete(`/tasks/${id}`);
    fetchData();
  };

  const totalUsers = users.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* ===== Stats Cards ===== */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Users</p>
          <h2 className="text-2xl font-bold mt-2">{totalUsers}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Tasks</p>
          <h2 className="text-2xl font-bold mt-2">{totalTasks}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Completed Tasks</p>
          <h2 className="text-2xl font-bold mt-2">{completedTasks}</h2>
        </div>
      </div>

      {/* ===== USERS TABLE ===== */}
      <div className="bg-white rounded-xl shadow mb-12">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Users</h2>

          <input
            type="text"
            placeholder="Search users..."
            className="border px-3 py-2 rounded-lg text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-4">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-right pr-6">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="text-right pr-6 space-x-2">
                    {u._id !== user._id && (
                      <>
                        <button
                          onClick={() => toggleRole(u)}
                          className="text-indigo-600 hover:underline"
                        >
                          Toggle Role
                        </button>

                        <button
                          onClick={() => deleteUser(u._id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== TASKS TABLE ===== */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">All Tasks</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-4">Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created By</th>
                <th className="text-right pr-6">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">{task.title}</td>
                  <td>{task.status}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td>{task.createdBy?.name}</td>

                  <td className="text-right pr-6">
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {loading && <p className="text-center mt-6 text-gray-500">Loading...</p>}
    </div>
  );
};

export default AdminDashboard;
