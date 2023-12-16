import React, { useState, useEffect } from 'react';
import '../Styles/todo.css';
import { useNavigate } from 'react-router-dom';
import APIs from '../constants';

function Todo() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement your logout logic here
    navigate('/login');
  };

  // Define state variables for task input fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('pending'); // Default status is 'pending'
  const [successMessage, setSuccessMessage] = useState('');

  // Handle the form submission to create a new task
  const handleTaskSubmit = (e) => {
    e.preventDefault();

    // Fetch the user ID from local storage
    const userId = localStorage.getItem('userId');

    // Create a new task object
    const newTask = {
      userId,
      title,
      description,
      dueDate,
      status,
    };

    fetch(APIs.CREATETASK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => {
        if (response.ok) {
          // Task creation was successful, you can handle success here
          console.log('Task created successfully');
          // Clear the form fields
          setTitle('');
          setDescription('');
          setDueDate('');
          setStatus('pending'); // Reset status to 'pending'
          setSuccessMessage('Task successfully created!');
          setTimeout(() => {
            setSuccessMessage('');
          }, 5000); // Hide message after 5 seconds

        } else {
          // Task creation failed, handle the error
          console.error('Task creation failed');
        }
      })
      .catch((error) => {
        console.error('Error creating task:', error);
      });
  };

  useEffect(() => {
    // Clear the success message after 5 seconds
    const timeout = setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
    return () => clearTimeout(timeout);
  }, [successMessage]);
  
  const handleViewTasksClick = () => {
    console.log("View task button is clicked")
    navigate('/view-task');
  };

  return (
    <div className="todo-container">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <h1 className="todo-header">Create new task!</h1>
      <div className="task-form">
        <h2>Add Task</h2>
        <form onSubmit={handleTaskSubmit}>
          <div className="form-group">
            <label htmlFor="title">Task Title:</label>
            <input
              type="text"
              id="title"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Due Date:</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button type="submit">Add Task</button>
        </form>
      </div>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
        <button
          className="view-tasks-button"
          onClick={handleViewTasksClick}
        >
          View your task.
        </button>
    </div>
  );
}

export default Todo;
