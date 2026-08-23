import { useEffect, useMemo, useState } from "react";
import SummaryModal from "./SummaryModal";
import "./App.css";

const API_URL = "http://localhost:5000/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [summaryType, setSummaryType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load todos");
      }

      const result = await response.json();
      setTodos(result.data || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter a task.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to add todo");
      }

      const result = await response.json();

      setTodos((current) => [result.data, ...current]);
      setTitle("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      const response = await fetch(`${API_URL}/${todo._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update todo");
      }

      const result = await response.json();

      setTodos((current) =>
        current.map((item) =>
          item._id === todo._id ? result.data : item
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (todo) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
    setError("");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) {
      setError("Todo title cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to edit todo");
      }

      const result = await response.json();

      setTodos((current) =>
        current.map((todo) =>
          todo._id === id ? result.data : todo
        )
      );

      cancelEdit();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteTodo = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete todo");
      }

      setTodos((current) =>
        current.filter((todo) => todo._id !== id)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const completedCount = todos.filter(
    (todo) => todo.completed
  ).length;

  const pendingCount = todos.length - completedCount;

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch = todo.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "active" && !todo.completed) ||
        (filter === "completed" && todo.completed);

      return matchesSearch && matchesFilter;
    });
  }, [todos, search, filter]);

  return (
    <div className="app">
      <div className="background-glow glow-one"></div>
      <div className="background-glow glow-two"></div>

      <main className="dashboard">

        <header className="topbar">
          <div className="brand">
            <div className="brand-icon">?</div>

            <div>
              <h1>TaskFlow</h1>
              <p>Stay organized. Get things done.</p>
            </div>
          </div>

          <div className="date-badge">
            <span>Today</span>
            <strong>
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </strong>
          </div>
        </header>

        <section className="hero">
          <div>
            <p className="eyebrow">YOUR PRODUCTIVITY SPACE</p>

            <h2>
              Turn your plans
              <br />
              into <span>progress.</span>
            </h2>

            <p className="hero-text">
              Manage your daily tasks, track your progress,
              and keep everything under control.
            </p>
          </div>

          <div className="progress-card">
            <div className="progress-top">
              <span>Completion</span>
              <strong>
                {todos.length
                  ? Math.round(
                      (completedCount / todos.length) * 100
                    )
                  : 0}
                %
              </strong>
            </div>

            <div className="progress-bar">
              <div
                style={{
                  width: `${
                    todos.length
                      ? (completedCount / todos.length) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>

            <p>
              {completedCount} of {todos.length} tasks completed
            </p>
          </div>
        </section>

        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon total-icon">T</div>

            <div>
              <span>Total Tasks</span><button type="button" className="summary-link" onClick={() => setSummaryType("total")}>View summary</button>
              <strong>{todos.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending-icon">P</div>

            <div>
              <span>Pending</span><button type="button" className="summary-link" onClick={() => setSummaryType("pending")}>View summary</button>
              <strong>{pendingCount}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed-icon">?</div>

            <div>
              <span>Completed</span><button type="button" className="summary-link" onClick={() => setSummaryType("completed")}>View summary</button>
              <strong>{completedCount}</strong>
            </div>
          </div>
        </section>

        <section className="task-panel">

          <div className="panel-header">
            <div>
              <h3>My Tasks</h3>
              <p>Manage everything you need to accomplish.</p>
            </div>

            <span className="task-count">
              {filteredTodos.length} tasks
            </span>
          </div>

          <form className="add-form" onSubmit={addTodo}>
            <div className="input-wrapper">
              <span className="plus">+</span>

              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="What needs to be done?"
              />
            </div>

            <button
              className="add-button"
              type="submit"
              disabled={saving}
            >
              {saving ? "Adding..." : "Add Task"}
            </button>
          </form>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="toolbar">
            <div className="filters">
              <button
                className={filter === "all" ? "filter active" : "filter"}
                onClick={() => setFilter("all")}
              >
                All
              </button>

              <button
                className={
                  filter === "active"
                    ? "filter active"
                    : "filter"
                }
                onClick={() => setFilter("active")}
              >
                Active
              </button>

              <button
                className={
                  filter === "completed"
                    ? "filter active"
                    : "filter"
                }
                onClick={() => setFilter("completed")}
              >
                Completed
              </button>
            </div>

            <div className="search-wrapper">
              <span>?</span>

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks..."
              />
            </div>
          </div>

          <div className="task-list">

            {loading ? (
              <div className="empty-state">
                <div className="loader"></div>
                <p>Loading your tasks...</p>
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">?</div>

                <h4>
                  {search
                    ? "No matching tasks"
                    : "You're all clear!"}
                </h4>

                <p>
                  {search
                    ? "Try searching for something else."
                    : "Add a new task to get started."}
                </p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <div
                  className={
                    todo.completed
                      ? "task completed-task"
                      : "task"
                  }
                  key={todo._id}
                >

                  <button
                    className={
                      todo.completed
                        ? "check completed-check"
                        : "check"
                    }
                    onClick={() => toggleTodo(todo)}
                    aria-label="Toggle task"
                  >
                    {todo.completed ? "?" : ""}
                  </button>

                  {editId === todo._id ? (
                    <div className="edit-area">
                      <input
                        className="edit-input"
                        value={editTitle}
                        onChange={(event) =>
                          setEditTitle(event.target.value)
                        }
                        autoFocus
                      />

                      <div className="edit-actions">
                        <button
                          className="save-button"
                          onClick={() => saveEdit(todo._id)}
                        >
                          Save
                        </button>

                        <button
                          className="cancel-button"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="task-content">
                        <h4>{todo.title}</h4>

                        <span>
                          {todo.completed
                            ? "Completed"
                            : "In progress"}
                        </span>
                      </div>

                      <div className="task-actions">
                        <button className="action-button edit" onClick={() => startEdit(todo)}>Edit</button>

                        <button
                          className="action-button delete"
                          onClick={() => deleteTodo(todo._id)}
                          title="Delete"
                        >Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}

          </div>
        </section>

        <footer>
          <span>TaskFlow</span>
          <span>Built with React + Node.js + MongoDB</span>
        </footer>

  `r`n      <SummaryModal type={summaryType} todos={todos} pendingCount={pendingCount} completedCount={completedCount} onClose={() => setSummaryType(null)} />`r`n    </main>
    </div>
  );
}

export default App;








