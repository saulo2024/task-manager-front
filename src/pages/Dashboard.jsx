import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, LogOut, Trash2, CheckCircle, Circle, Plus } from "lucide-react";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("todas");
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  // --- LÓGICA DE DADOS ---
  
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.data);
    } catch (error) {
      console.error("Erro ao carregar tarefas", error);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.post("/tasks", { title }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTitle("");
      fetchTasks();
    } catch (error) { alert("Erro ao criar tarefa"); }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === "pendente" ? "concluido" : "pendente";
      await api.put(`/tasks/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) { alert("Erro ao atualizar status"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Excluir tarefa?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) { alert("Erro ao deletar"); }
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.body.classList.toggle("dark");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // --- ZONA DE DADOS FILTRADOS ---
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "concluido").length;

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pendente") return task.status === "pendente";
    if (filter === "concluido") return task.status === "concluido";
    return true;
  });

  // --- ZONA VISUAL ÚNICA ---
  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Minhas Tarefas 📋</h1>
        
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={toggleDarkMode} style={{ background: "transparent", border: "none", cursor: "pointer", color: "inherit" }}>
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", cursor: "pointer" }}>
            <LogOut size={18} /> Sair
          </button>
        </div>
      </div>

      <form onSubmit={handleAddTask} style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Nova tarefa..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: "8px", flex: 1 }}
        />
        <button type="submit" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Plus size={18} /> Add
        </button>
      </form>

      <div style={{ marginBottom: "20px", fontSize: "14px" }}>
        <p>Total: <strong>{totalTasks}</strong> | Concluídas: <strong>{completedTasks}</strong></p>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button onClick={() => setFilter("todas")} style={{ opacity: filter === "todas" ? 1 : 0.5 }}>Todas</button>
          <button onClick={() => setFilter("pendente")} style={{ opacity: filter === "pendente" ? 1 : 0.5 }}>Pendentes</button>
          <button onClick={() => setFilter("concluido")} style={{ opacity: filter === "concluido" ? 1 : 0.5 }}>Concluídas</button>
        </div>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredTasks.map((task) => (
          <li key={task._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div onClick={() => handleToggleStatus(task._id, task.status)} style={{ cursor: "pointer" }}>
                {task.status === "concluido" ? <CheckCircle color="#4CAF50" /> : <Circle color="#ccc" />}
              </div>
              <span style={{ textDecoration: task.status === "concluido" ? "line-through" : "none", color: task.status === "concluido" ? "#888" : "inherit" }}>
                {task.title}
              </span>
            </div>
            <Trash2 size={20} color="#ff4d4d" onClick={() => handleDelete(task._id)} style={{ cursor: "pointer" }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;