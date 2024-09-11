import { useState, useEffect } from 'react';
import { getTodosByUserId, addTodo, deleteTodo } from '../api'; // import deleteTodo from the API

function TodoList({ userId }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // Fetch todos for the user when the component is mounted or userId changes
  useEffect(() => {
    getTodosByUserId(userId).then(data => setTodos(data));
  }, [userId]);

  // Handle adding a new todo task
  const handleAddTodo = () => {
    const todo = {
      description: newTodo,
      completed: false,
      userId: userId
    };

    addTodo(todo).then(newTodo => setTodos([...todos, newTodo]));
    setNewTodo('');
  };

  // Handle deleting a todo
  const handleDeleteTodo = (id) => {
    deleteTodo(id).then(() => {
      // After successfully deleting the task, filter it out from the state
      setTodos(todos.filter(todo => todo.id !== id));
    });
  };

  return (
    <div className="todo">
      <div className="notes"> 
        <ul>
          {todos.map(todo => (
            // Ensure that only tasks created by this user are displayed
            todo.user.id === userId && (
              <li className="task"key={todo.id}>
                {todo.description} {todo.completed ? "(Completed)" : ""}
                <button 
                  className="btn btn-danger btn-sm" 
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  Delete
                </button>
              </li>
            )
          ))}
        </ul>
      </div>
      <div className="add-task"> 
        <input 
          type="text" 
          value={newTodo} 
          onChange={(e) => setNewTodo(e.target.value)} 
          placeholder="Add new task"
          className="form-control add-task-input"
        />
        <button className="btn btn-primary add-task-button" onClick={handleAddTodo}>
          Add Task
        </button>
      </div>

      
    </div>
  );
}

export default TodoList;