import { useEffect, useState } from "react";
import API from "../api/axios";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const fetchTasks = async () => {
    const { data } = await API.get(
      `/tasks?page=${page}&keyword=${search}&status=${status}&priority=${priority}`,
    );
    setTasks(data.tasks);
    setPages(data.pages);
  };

  const fetchStats = async () => {
    const { data } = await API.get("/tasks/dashboard");
    setStats(data);
  };

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [page, search, status, priority]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editTaskId) {
      await API.put(`/tasks/${editTaskId}`, formData);
    } else {
      await API.post("/tasks", formData);
    }

    setShowModal(false);
    setEditTaskId(null);
    setFormData({ title: "", description: "", priority: "medium" });

    fetchTasks();
    fetchStats();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
    fetchStats();
  };

  const updateStatus = async (id, status) => {
    await API.put(`/tasks/${id}`, { status });
    fetchTasks();
    fetchStats();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow"
        >
          + New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          color="from-indigo-500 to-purple-500"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          color="from-yellow-400 to-orange-500"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          color="from-blue-400 to-cyan-500"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          color="from-green-400 to-emerald-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          placeholder="Search tasks..."
          className="border p-2 rounded-lg flex-1 min-w-[200px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded-lg"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          className="border p-2 rounded-lg"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Task Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm table-fixed border-collapse">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr className="border-t hover:bg-gray-50 transition">
              <th className="p-4 text-left w-2/5">Title</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Priority</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 ? (
              <tr className="border-t hover:bg-gray-50 transition">
                <td colSpan="4" className="text-center p-8 text-gray-400">
                  No tasks found.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4">
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <div className="text-xs text-gray-500 mt-1 break-words whitespace-pre-wrap max-w-md line-clamp-2">
                        {task.description}
                      </div>
                    )}
                  </td>

                  <td className="p-4 text-left">
                    <select
                      value={task.status}
                      onChange={(e) => updateStatus(task._id, e.target.value)}
                      className="border p-1 rounded text-sm bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>

                  <td className="p-4 capitalize text-left">{task.priority}</td>

                  <td className="p-4 space-x-3 text-left">
                    <button
                      onClick={() => {
                        setEditTaskId(task._id);
                        setFormData({
                          title: task.title,
                          description: task.description || "",
                          priority: task.priority,
                        });
                        setShowModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteTask(task._id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-3 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-2">
          Page {page} of {pages}
        </span>

        <button
          disabled={page === pages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl w-96 shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4">
              {editTaskId ? "Edit Task" : "Create Task"}
            </h2>

            <input
              placeholder="Task title"
              className="border p-2 w-full mb-4 rounded"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Task description"
              className="border p-2 w-full mb-4 rounded resize-none"
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <select
              className="border p-2 w-full mb-4 rounded"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditTaskId(null);
                  setFormData({
                    title: "",
                    description: "",
                    priority: "medium",
                  });
                }}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button className="px-4 py-2 bg-indigo-600 text-white rounded">
                {editTaskId ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className={`bg-gradient-to-r ${color} text-white rounded-xl p-6 shadow`}>
    <h3 className="text-sm opacity-80">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value || 0}</p>
  </div>
);

export default Dashboard;
