import React, { useState, useEffect } from 'react';
import { auth } from "./firebase";
import Navigation from './components/Navigation';
import Dashboard from './views/dashboard';
import Patients from './views/Patients';
import Analytics from './views/Analytics';
import Settings from './views/Settings';
import AccountSettings from './components/AccountSettings';
import axios from 'axios';
import './App.css';

const App = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [currentView, setCurrentView] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) setCurrentView('dashboard');
    });
    return () => unsubscribe();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients');
      setPatients(res.data);
    } catch (err) {
      console.error('Failed to fetch patients', err);
      setPatients([]);
    }
  };

  useEffect(() => {
    document.documentElement.className = theme;
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user) fetchPatients();
  }, [user]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard patients={patients} fetchPatients={fetchPatients} />;
      case 'patients':
        return <Patients patients={patients} setPatients={setPatients} fetchPatients={fetchPatients} />;
      case 'analytics':
        return <Analytics patients={patients} />;
      case 'settings':
        return <Settings theme={theme} setTheme={setTheme} user={user} />; // Pass user to Settings
      // Remove the 'account' case entirely
      default:
        return <Dashboard patients={patients} fetchPatients={fetchPatients} />;
    }
  };

  // If not signed in, show only AccountSettings (login)
  if (!user) {
    return (
      <div>
        <AccountSettings />
      </div>
    );
  }

  // If signed in, show the rest of the app
  return (
    <>
      <Navigation
        currentView={currentView}
        setCurrentView={setCurrentView}
        theme={theme}
        setTheme={setTheme}
        user={user}
      />
      <main className="container my-4">{renderView()}</main>
    </>
  );
};

export default App;