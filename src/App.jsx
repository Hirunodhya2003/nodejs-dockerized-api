import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3001/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch tasks");
        return response.json();
      })
      .then((result) => {
        setTasks(result.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  return (
    <div className="dashboard">

      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">✓</span>
          <h2>TaskFlow</h2>
        </div>

        <p className="menu-label">MENU</p>

        <div className="menu-item active">▦ <span>Dashboard</span></div>
        <div className="menu-item">☑ <span>My Tasks</span></div>
        <div className="menu-item">◷ <span>Completed</span></div>

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

          <div className="profile">
            <div className="avatar">U</div>
            <span>User</span>
          </div>
        </header>

        <section className="welcome-section">
          <div>
            <h1>Manage your tasks efficiently.</h1>
            <p>Stay organized, focused and productive.</p>
          </div>
          <div className="welcome-icon">✓</div>
        </section>

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

        <section className="tasks-section">
          <div className="section-header">
            <div>
              <h2>My Tasks</h2>
              <p>Manage and track your daily activities.</p>
            </div>

            <button className="add-button" disabled>
              + Add New Task
            </button>
          </div>

          {loading && <p className="message">Loading tasks...</p>}

          {error && <p className="error">{error}</p>}

          {!loading && !error && (
            <div className="task-list">

              {tasks.length === 0 ? (
                <p className="message">No tasks available.</p>
              ) : (
                tasks.map((task) => (
                  <div className="task-row" key={task.id}>
                    <div className="task-info">
                      <div className={`task-check ${task.completed ? "checked" : ""}`}>
                        {task.completed ? "✓" : ""}
                      </div>

                      <div>
                        <h3>{task.title}</h3>
                        <small>Task #{task.id}</small>
                      </div>
                    </div>

                    <span className={`status ${task.completed ? "completed" : "pending"}`}>
                      {task.completed ? "Completed" : "Pending"}
                    </span>
                  </div>
                ))
              )}

            </div>
          )}
        </section>

        <footer>
          <p>© 2026 TaskFlow. Built with React & Node.js.</p>
        </footer>

      </main>
    </div>
  );
}

export default App;

