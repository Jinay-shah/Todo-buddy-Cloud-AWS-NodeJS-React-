import React, { useState, useEffect,useCallback } from 'react';
import '../Styles/view-task.css'; 
import { useNavigate } from 'react-router-dom';
import APIs from '../constants';

function ViewTask() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  // Define state variables for tasks and filters
  const [tasks, setTasks] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('none'); 
  const [editedTask, setEditedTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "",
  });
     
  const [openEditModal, setOpenEditModal] = useState(false); 
//-----------------------------------------------------------------------------------------------------------
  useEffect(() => {
    // Define a function to fetch all tasks
    const fetchAllTasks = async () => {
      const userId = localStorage.getItem('userId');
        console.log(userId);
        try {
        const response = await fetch(`${APIs.USERTASK}?userId=${userId}`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json', 
        }
});
        if (response.ok) {
          const data = await response.json();
          setTasks(data.tasks); 
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    // Fetch all tasks only when titleFilter is empty and statusFilter is "none"
    if (titleFilter === '' && statusFilter === 'none') {
      fetchAllTasks();
    }
  }, [titleFilter, statusFilter]);
//---------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    // Fetch tasks from your API when statusFilter changes
    const fetchTasks = async () => {
      try {
        // Retrieve the userId from local storage
        const userId = localStorage.getItem('userId');
  
        const response = await fetch(`${APIs.TASKBYSTATUS}?userId=${userId}&taskstatus=${statusFilter}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          console.log('success');
          const data = await response.json();
          setTasks(data.tasks);
        } else {
          console.error('Error fetching tasks:', response.status);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    if (statusFilter !== 'none'){
    fetchTasks();
    }
  }, [statusFilter]);

  //------------------------------------------------------------------------------------------------------------------------
  const fetchTasksByTitle = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId');
      const apiEndpoint = `${APIs.TASKBYTITLE}?userId=${userId}&title=${titleFilter}`;
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', 
        },
      });

      if (response.ok) {
        console.log('Success');
        const data = await response.json();
        console.log(data);
        setTasks(data.task || []);
      } else {
        console.error('Error fetching tasks:', response.status);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [titleFilter]);

  useEffect(() => {
    if (titleFilter !== '') {
      fetchTasksByTitle();
    }
    else{
      setTasks([]);
    }
  }, [titleFilter, fetchTasksByTitle]);
//----------------------------------------------------------------------------

  const handleEditTask = (taskId) => {
    console.log(taskId);
    // Find the task to edit by taskId
    const taskToEdit = tasks.find((task) => task.taskId === taskId);
    console.log('hi')
    // Set the state with the current task details for editing
    setEditedTask({
      id: taskToEdit.taskId,
      title: taskToEdit.title,
      description: taskToEdit.description,
      dueDate: taskToEdit.dueDate,
      status: taskToEdit.status,
    });
  
    // Open the edit modal or form (you can implement this part based on your UI)
    setOpenEditModal(true);
  };
  
  // Function to handle the form submission after editing
  const handleEditTaskSubmit = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');

    // Make a PUT request to update the task with editedTask data
    fetch(`${APIs.UPDATETASK}?taskId=${editedTask.id}&userId=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedTask),
    })
      .then((response) => {
        console.log('here');
        if (response.ok) {
          console.log('Task updated successfully');
          setOpenEditModal(false); 
          window.location.reload();
        } else {
          console.error('Task update failed');
        }
      })
      .catch((error) => {
        console.error('Error updating task:', error);
      });
  };
  
  

  const handleDeleteTask = (taskId) => {
    // Confirm with the user before deleting
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
  
    if (!confirmDelete) {
      return; // User canceled the deletion
    }
    // Make a DELETE request to your API endpoint to delete the task
    fetch(`${APIs.DELETETASK}?id=${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        
      },
    })
      .then((response) => {
        if (response.ok) {
          // Task deletion was successful
          console.log('Task deleted successfully');
          window.location.reload();
        } else {
          // Task deletion failed, handle the error
          console.error('Task deletion failed');
        }
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
      });
  };
  

  const handleTitleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchTasksByTitle();
    }
  };

  const handleViewTasksClick = () => {
    navigate('/todo');
  };

  return (
    <div className="view-task-container">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <h1 className="header">View Your Tasks</h1>
      <div className="filter-options">
        <input
          type="text"
          id="searchTitle"
          placeholder="Search by title"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          onKeyDown={handleTitleSearch}
        />
        <select
          id="filterStatus"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="none">None</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.taskId}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.dueDate}</td>
              <td>{task.status}</td>
              <td>
                <button onClick={() => handleEditTask(task.taskId)}>Edit</button>
                <button onClick={() => handleDeleteTask(task.taskId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openEditModal && (
        <div className="modal">
        <h2>Edit Task</h2>
        <form onSubmit={handleEditTaskSubmit}>
          <label htmlFor="editTitle">Title:</label>
          <input
            type="text"
            id="editTitle"
            value={editedTask.title}
            onChange={(e) =>
              setEditedTask({ ...editedTask, title: e.target.value })
            }
          />
          <label htmlFor="editDescription">Description:</label>
          <textarea
            id="editDescription"
            value={editedTask.description}
            onChange={(e) =>
              setEditedTask({ ...editedTask, description: e.target.value })
            }
          ></textarea>
          <label htmlFor="editDueDate">Due Date:</label>
          <input
            type="text"
            id="editDueDate"
            value={editedTask.dueDate}
            onChange={(e) =>
              setEditedTask({ ...editedTask, dueDate: e.target.value })
            }
          />
          <label htmlFor="editStatus">Status:</label>
          <select
            id="editStatus"
            value={editedTask.status}
            onChange={(e) =>
              setEditedTask({ ...editedTask, status: e.target.value })
            }
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <button className="save-button"type="submit">Save</button>
          <button className="cancel-button" onClick={() => setOpenEditModal(false)}>Cancel</button>
        </form>
      </div>
      
      )}
      <button
        className="create-task-button"
        onClick={handleViewTasksClick}
      >
        Create task
      </button>
    </div>
  );
  }

export default ViewTask;

