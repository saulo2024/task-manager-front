import { useEffect, useState } from "react";
import "./Dashboard.css";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
  Loader2
} from "lucide-react";

function Dashboard() {
  // 1. ESTADOS (STATES)
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [isDark, setIsDark] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Estado para o Spinner
  const navigate = useNavigate();

  // 2. CONFIGURAÇÃO DE SEGURANÇA (TOKEN)
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // 3. BUSCA DE DADOS (API)
  const fetchTasks = async () => {
    setLoading(true); // Ativa o spinner
    try {
      const response = await api.get("/tasks");
      // Aceita tanto response.data canto response.data.data dependendo da API
      setTasks(response.data.data || response.data); 
    } catch (error) {
      console.error("Erro ao carregar:", error);
      toast.error("Não foi possível carregar as tarefas.");
    } finally {
      setLoading(false); // Desativa o spinner
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 4. FUNÇÕES DE MANIPULAÇÃO (HANDLERS)
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tasks", { title });
      toast.success("Tarefa adicionada!");
      setTitle("");
      fetchTasks(); // Atualiza a lista
    } catch (error) {
      toast.error("Erro ao adicionar tarefa.");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "pendente" ? "concluido" : "pendente";
      await api.put(`/tasks/${id}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      toast.error("Erro ao atualizar status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta tarefa?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Tarefa removida.");
      fetchTasks();
    } catch (error) {
      toast.error("Erro ao excluir tarefa.");
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

  // 5. LÓGICA DE FILTRAGEM
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = (task.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    if (filter === "pending") return matchesSearch && task.status === "pendente";
    if (filter === "completed") return matchesSearch && task.status === "concluido";
    return matchesSearch;
  });

  // 6. RENDERIZAÇÃO (INTERFACE)
  return (
    <div className="container">
      <header className="dashboard-header">
        <h1>Minhas Tarefas 📋</h1>
        <div className="header-actions">
          <button onClick={toggleDarkMode} className="icon-btn">
            {isDark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} /> Sair
          </button>
        </div>
      </header>

      {/* Formulário de Adição */}
      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          placeholder="O que precisa ser feito?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button type="submit" className="add-btn">
          <Plus size={18} /> Add
        </button>
      </form>

      {/* Barra de Busca */}
      <div className="search-container">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar tarefas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Barra de Filtros */}
      <div className="filter-bar">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>Todas</button>
        <button onClick={() => setFilter("pending")} className={filter === "pending" ? "active" : ""}>Pendentes</button>
        <button onClick={() => setFilter("completed")} className={filter === "completed" ? "active" : ""}>Concluídas</button>
      </div>

      {/* Lista de Tarefas / Loading / Estado Vazio */}
      <ul className="task-list">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div> {/* Usa o spinner do seu CSS */}
            <p>Carregando tarefas...</p>
          </div>
        ) : filteredTasks.length > 0 ? (
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
            <p>Nenhuma tarefa encontrada.</p>
          </div>
        )}
      </ul>
    </div>
  );
}

export default Dashboard;
