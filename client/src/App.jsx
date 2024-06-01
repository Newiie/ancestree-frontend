import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Nav_Home from './components/NavBar/Nav_Home';
import Home from './components/Pages/Home';
import { auth } from './firebase';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './tailwind.css'; 
import Placeholder from './components/Placeholder';
import FamilyTree from './components/FamilyTree/FamilyTree';
import Profile from './components/Profile/Profile';
import Analytics from './components/Analytics/Analytics'
import Notification from './components/Notifications/Notification';
import Relationships from './components/Relationships/Relationships';
import Records from './components/Records/Records';
import Gallery from './components/Gallery/Gallery';
import Help from './components/Help/Help';
import Setting from './components/Settings/Setting';



function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <Router>
      <div>
        
        <Routes>
          <Route
            path="/"
            element={
              user ? <Navigate to="/dashboard" /> : <Home />
            }
          />
          <Route path="/login" 
                 element={<Login />} />
          <Route path="/register" 
                 element={<Register />} />
          <Route path="/dashboard" 
                 element={<Dashboard />} />
          <Route path="/analytics" 
                 element={<Analytics />} />
          <Route path="/profile" 
                 element={<Profile />} />
          <Route path="/family_tree" 
                 element={<FamilyTree />} />
          <Route path="/relationships" 
                 element={<Relationships />} />
          <Route path="/notifications" 
                 element={<Notification />} />
          <Route path="/my_records" 
                 element={<Records />} />   
          <Route path="/memories" 
                 element={<Gallery />} /> 
          <Route path="/user_settings" 
                 element={<Setting />} />
          <Route path="/help" 
                 element={<Help />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
