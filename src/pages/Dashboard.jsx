import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  LogOut,
  Trash2,
  CheckCircle,
  Circle,
  Plus,
  ClipboardList,
  Search,
} from "lucide-react";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all"); // Mudamos para inglês: all
  const [isDark, setIsDark] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.data);
    } catch (error) {
      console.error("Error loading tasks", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/tasks",
        { title },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setTitle("");
      fetchTasks();
    } catch (error) {
      alert("Error creating task");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === "pendente" ? "concluido" : "pendente";
      await api.put(
        `/tasks/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchTasks();
    } catch (error) {
      alert("Error updating status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      alert("Error deleting");
    }
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.body.classList.toggle("dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    let matchesStatus = true;
    if (filter === "pending") matchesStatus = task.status === "pendente";
    if (filter === "completed") matchesStatus = task.status === "concluido";
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container">
      <header className="dashboard-header">
        <h1>My Tasks 📋</h1>
        <div className="header-actions">
          <button onClick={toggleDarkMode} className="icon-btn">
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </header>

      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button type="submit" className="add-btn">
          <Plus size={18} /> Add
        </button>
      </form>

      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div
        className="search-container"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
          padding: "10px",
          background: "var(--bg-secondary)",
          borderRadius: "8px",
        }}
      >
        <Search size={18} color="#888" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            border: "none",
            background: "transparent",
            outline: "none",
            width: "100%",
            color: "inherit",
          }}
        />
      </div>

      <div className="filter-bar">
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active" : ""}
        >
          All
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={filter === "pending" ? "active" : ""}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? "active" : ""}
        >
          Completed
        </button>
      </div>

      <ul className="task-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <li
              key={task._id}
              className={`task-item ${task.status === "concluido" ? "done" : ""}`}
            >
              <div className="task-content">
                <div
                  onClick={() => handleToggleStatus(task._id, task.status)}
                  className="status-icon"
                >
                  {task.status === "concluido" ? (
                    <CheckCircle color="#4CAF50" />
                  ) : (
                    <Circle color="#ccc" />
                  )}
                </div>
                <span className="task-title">{task.title}</span>
              </div>
              <Trash2
                size={20}
                className="delete-icon"
                onClick={() => handleDelete(task._id)}
              />
            </li>
          ))
        ) : (
          <div className="empty-state">
            <ClipboardList size={48} />
            <p>No tasks found. Start by adding one!</p>
          </div>
        )}
      </ul>
    </div>
  );
}

export default Dashboard;
