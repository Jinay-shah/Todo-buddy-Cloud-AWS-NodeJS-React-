import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserRegistration from './Components/userRegistration'; // Import your UserRegistration component
import UserLogin from './Components/userLogin'
import Todo from './Components/todo'
import ViewTasks from './Components/view-task';
import './app.css';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="header">
          <h1>Todo Buddy :)</h1>
        </div>
         {/* Render your UserRegistration component here */}
      </div>
      <Routes>
        <Route path="/" element={<UserRegistration />} />
        <Route path="/login" element={<UserLogin />}/>
        <Route path="/todo" element={<Todo />}/>
        <Route path="/view-task" element={<ViewTasks />}/>
        
        {/* Add other routes for your application */}
      </Routes>
    </Router>
  );
}

export default App;
