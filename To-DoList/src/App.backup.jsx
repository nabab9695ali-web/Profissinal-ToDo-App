import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "http://localhost:5000/api/todos";

  const fetchTodos = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }

      const result = await response.json();

      setTodos(result.data || []);
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
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
        throw new Error("Failed to add todo");
      }

      const result = await response.json();

      setTodos((prevTodos) => [result.data, ...prevTodos]);
      setTitle("");
      setError("");
    } catch (error) {
      setError(error.message);
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
        throw new Error("Failed to update todo");
      }

      const result = await response.json();

      setTodos((prevTodos) =>
        prevTodos.map((item) =>
          item._id === todo._id ? result.data : item
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const startEdit = (todo) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) {
      return;
    }

    try {
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
        throw new Error("Failed to edit todo");
      }

      const result = await response.json();

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? result.data : todo
        )
      );

      setEditId(null);
      setEditTitle("");
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      setTodos((prevTodos) =>
        prevTodos.filter((todo) => todo._id !== id)
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const completedCount = todos.filter(
    (todo) => todo.completed
  ).length;

  return (
    <div className="todo-container">
      <h1 className="todo-title">?? Todo App</h1>

      <form className="todo-form" onSubmit={addTodo}>
        <input
          className="todo-input"
          type="text"
          placeholder="Enter your task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button className="add-btn" type="submit">
          Add Todo
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="todo-info">
        <span>Total: {todos.length}</span>
        <span>Completed: {completedCount}</span>
      </div>

      {loading && <p className="empty">Loading...</p>}

      {!loading && todos.length === 0 && (
        <p className="empty">No todos found.</p>
      )}

      <div className="todo-list">
        {todos.map((todo) => (
          <div className="todo-item" key={todo._id}>
            {editId === todo._id ? (
              <>
                <input
                  className="edit-input"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />

                <button
                  className="save-btn"
                  onClick={() => saveEdit(todo._id)}
                >
                  Save
                </button>

                <button
                  className="cancel-btn"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <input
                  className="todo-check"
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                />

                <span
                  className={`todo-text ${
                    todo.completed ? "completed" : ""
                  }`}
                >
                  {todo.title}
                </span>

                <div className="todo-actions">
                  <button
                    className="edit-btn"
                    onClick={() => startEdit(todo)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTodo(todo._id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
