import { useState } from "react";
import "../App.css";

const ToDo = () => {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);

  // Add Todo
  const add = (e) => {
    e.preventDefault();

    if (newTodo.trim() !== "") {
      setTodos([
        ...todos,
        {
          text: newTodo,
          completed: false,
        },
      ]);

      setNewTodo("");
    }
  };

  // Delete Todo
  const Delete = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="todo-container">
      <h1>To-Do List</h1>

      <form onSubmit={add} className="todo-form">
        <input
          type="text"
          placeholder="Add new Todo"
          value={newTodo}
          onChange={(event) => setNewTodo(event.target.value)}
        />

        <button type="submit">Add Todo</button>
      </form>

      <ul className="todo-list">
        {todos.map((todo, index) => (
          <li key={index} className="todo-item">
            <span>{todo.text}</span>

            <button
              type="button"
              onClick={() => Delete(index)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDo;