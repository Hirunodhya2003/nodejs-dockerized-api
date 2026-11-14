import { useEffect, useState } from "react";
import "./App.css";
import Auth from "./Auth";


const API_URL = "http://localhost:3002/api/tasks";
const getSavedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
const [expandedTaskId, setExpandedTaskId] = useState(null);
const [activePage, setActivePage] = useState("Dashboard");

const [token, setToken] = useState(
  localStorage.getItem("token") || ""
);
const [user, setUser] = useState(getSavedUser);

const [showProfileMenu, setShowProfileMenu] = useState(false);

const handleLogin = (newToken, userData) => {
  localStorage.setItem("token", newToken);
  localStorage.setItem("user", JSON.stringify(userData));

  setToken(newToken);
  setUser(userData);
  setError("");
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setToken("");
  setUser(null);
  setTasks([]);
  setShowProfileMenu(false);
};

useEffect(() => {
  if (token) {
    fetchTasks();
  } else {
    setLoading(false);
  }
}, [token]);

const fetchTasks = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const result = await response.json();
    setTasks(result.data);
    setError("");
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

const handleSaveTask = async (e) => {
  e.preventDefault();

const title = e.target.elements.title.value.trim();
const description = e.target.elements.description.value.trim();
const priority = e.target.elements.priority.value;

const url = editingTask ? `${API_URL}/${editingTask.id}` : API_URL;
const method = editingTask ? "PUT" : "POST";

const body = {
  title,
  description,
  priority,
  ...(editingTask && { completed: editingTask.completed })
};
  try {
    const response = await fetch(url, {
      method,
headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`
},

      body: JSON.stringify(body)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to save task");
    }

    await fetchTasks();
    setShowModal(false);
    setEditingTask(null);
    setError("");
  } catch (err) {
    setError(err.message);
  }
};


const handleDeleteTask = async () => {
  try {
const response = await fetch(`${API_URL}/${deletingTask.id}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`
  }
});

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to delete task");
    }

    await fetchTasks();
    setDeletingTask(null);
    setError("");
  } catch (err) {
    setError(err.message);
  }
};

const handleToggleTask = async (task) => {
  try {
    const response = await fetch(`${API_URL}/${task.id}`, {
      method: "PUT",
headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`
},

body: JSON.stringify({
  title: task.title,
  description: task.description || "",
  priority: task.priority || "Medium",
  completed: !task.completed
})

    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update task");
    }

    await fetchTasks();
    setError("");
  } catch (err) {
    setError(err.message);
  }
};

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
 
const filteredTasks =
  activePage === "Completed"
    ? tasks.filter((task) => task.completed)
    : tasks;

if (!token) {
  return <Auth onLogin={handleLogin} />;
}


  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">✓</span>
          <h2>TaskFlow</h2>
        </div>

<p className="menu-label">MENU</p>

<div
  className={`menu-item ${activePage === "Dashboard" ? "active" : ""}`}
  onClick={() => setActivePage("Dashboard")}
>
  ▦ <span>Dashboard</span>
</div>

<div
  className={`menu-item ${activePage === "My Tasks" ? "active" : ""}`}
  onClick={() => setActivePage("My Tasks")}
>
  ☑ <span>My Tasks</span>
</div>

<div
  className={`menu-item ${activePage === "Completed" ? "active" : ""}`}
  onClick={() => setActivePage("Completed")}
>
  ◷ <span>Completed</span>
</div>

        <div className="sidebar-bottom">
          <p>Task Management</p>
          <small>Version 1.0.0</small>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h2>Dashboard</h2>
            <p>Welcome back! Here's your task overview.</p>
          </div>

<div className="profile-container">
  <button
    className="profile"
    onClick={() => setShowProfileMenu(!showProfileMenu)}
  >
    <div className="avatar">
      {user?.name?.charAt(0).toUpperCase() || "U"}
    </div>

    <span>{user?.name || "User"}</span>
    <span>⌄</span>
  </button>

  {showProfileMenu && (
    <div className="profile-dropdown">
      <h4>{user?.name || "User Account"}</h4>
      <p>{user?.email || ""}</p>

      <hr />

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  )}
</div>

        </header>

        <section className="welcome-section">
          <div>
            <h1>Manage your tasks efficiently.</h1>
            <p>Stay organized, focused and productive.</p>
          </div>
          <div className="welcome-icon">✓</div>
        </section>

         {activePage === "Dashboard" && (
  <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total-icon">▦</div>
            <p>Total Tasks</p>
            <h2>{tasks.length}</h2>
            <small>All your tasks</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed-icon">✓</div>
            <p>Completed</p>
            <h2>{completedTasks}</h2>
            <small>Successfully finished</small>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending-icon">◷</div>
            <p>Pending</p>
            <h2>{pendingTasks}</h2>
            <small>Waiting to be done</small>
          </div>
        </section>
      )}

        <section className="tasks-section">
          <div className="section-header">
            <div>

<h2>
  {activePage === "Completed"
    ? "Completed Tasks"
    : activePage === "Dashboard"
    ? "Recent Tasks"
    : "My Tasks"}
</h2>
              <p>Manage and track your daily activities.</p>
            </div>

            <button
              className="add-button"
              onClick={() => {
                setEditingTask(null);
                setShowModal(true);
              }}
            >
              + Add New Task
            </button>
          </div>

          {loading && <p className="message">Loading tasks...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && (
            <div className="task-list">

{filteredTasks.length === 0 && (
  <p className="message">
    {activePage === "Completed"
      ? "No completed tasks yet."
      : "No tasks available. Add your first task!"}
  </p>
)}

{filteredTasks.map((task) => (
  <div className="task-row" key={task.id}>
    <div className="task-info">
      <button
        type="button"
        className={`task-check ${task.completed ? "checked" : ""}`}
        onClick={() => handleToggleTask(task)}
        aria-label={task.completed ? "Mark as pending" : "Mark as completed"}
      >
        {task.completed ? "✓" : ""}
      </button>

      <div className="task-content">
        <button
          type="button"
          className={`task-title ${task.completed ? "task-done" : ""}`}
          onClick={() =>
            setExpandedTaskId(
              expandedTaskId === task.id ? null : task.id
            )
          }
        >
          {task.title}
          <span>{expandedTaskId === task.id ? "▲" : "▼"}</span>
        </button>

        {expandedTaskId === task.id && (
          <p className="task-description">
            {task.description || "No description available."}
          </p>
        )}

        <div className="task-meta">
          <span className={`priority priority-${(task.priority || "Medium").toLowerCase()}`}>
            {task.priority || "Medium"} Priority
          </span>

          <small>
            Created: {task.created_at
              ? new Date(task.created_at).toLocaleDateString()
              : "N/A"}
          </small>
        </div>
      </div>
    </div>

    <div className="task-actions">
      <span className={`status ${task.completed ? "completed" : "pending"}`}>
        {task.completed ? "Completed" : "Pending"}
      </span>

      <button
        className="edit-button"
        onClick={() => {
          setEditingTask(task);
          setShowModal(true);
        }}
      >
        ✎ Edit
      </button>

      <button
        className="delete-button"
        onClick={() => setDeletingTask(task)}
      >
        Delete
      </button>
    </div>
  </div>
))}

            </div>
          )}
        </section>

        <footer>
          <p>© 2026 TaskFlow. Built with React & Node.js.</p>
        </footer>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="task-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{editingTask ? "Edit Task" : "Create New Task"}</h2>
                <p>{editingTask ? "Update your task details." : "Add a new task to your list."}</p>
              </div>

              <button className="close-button" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

             <form onSubmit={handleSaveTask}>
              <label>Task Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter task title"
                defaultValue={editingTask?.title || ""}
                required
              />

<label>Description</label>
<textarea
  name="description"
  placeholder="Describe your task..."
  rows="4"
  defaultValue={editingTask?.description || ""}
/>

<label>Priority</label>
<select
  name="priority"
  defaultValue={editingTask?.priority || "Medium"}
>
  <option value="Low">Low</option>
  <option value="Medium">Medium</option>
  <option value="High">High</option>
</select>


              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTask(null);
                  }}
                >
                  Cancel
                </button>

                <button type="submit" className="save-button">
                  {editingTask ? "Save Changes" : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingTask && (
        <div className="modal-overlay" onClick={() => setDeletingTask(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">!</div>
            <h2>Delete Task?</h2>
            <p>
              Are you sure you want to delete "{deletingTask.title}"?
              This action cannot be undone.
            </p>

            <div className="modal-actions">
              <button
                className="cancel-button"
                onClick={() => setDeletingTask(null)}
              >
                Cancel
              </button>

              <button
                className="delete-confirm-button"
                onClick={handleDeleteTask}
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
