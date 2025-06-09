import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

function Navigation({ currentView, setCurrentView, theme, setTheme }) {
  // Unicode icons for sun and moon
  const sun = "☀️";
  const moon = "🌙";

  return (
    <nav
      className={`navigation-bar ${theme}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '18px 0',
        background: theme === 'dark' ? '#222' : '#f7f8fa',
        borderBottom: '1px solid #e0e0e0',
        marginBottom: '24px'
      }}
    >
      {/* App Name Left-Aligned */}
      <div style={{
        fontWeight: 700,
        fontSize: '1.5rem',
        marginRight: 'auto',
        marginLeft: '32px',
        color: theme === 'dark' ? '#fff' : '#1976d2',
        letterSpacing: '1px'
      }}>
        Care Track
      </div>

      {/* Centered Tabs */}
      <div style={{
        display: 'flex',
        gap: '24px',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
      }}>
        <button
          className={currentView === 'dashboard' ? 'nav-active' : ''}
          onClick={() => setCurrentView('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={currentView === 'patients' ? 'nav-active' : ''}
          onClick={() => setCurrentView('patients')}
        >
          Patients
        </button>
        <button
          className={currentView === 'analytics' ? 'nav-active' : ''}
          onClick={() => setCurrentView('analytics')}
        >
          Analytics
        </button>
        <button
          className={currentView === 'settings' ? 'nav-active' : ''}
          onClick={() => setCurrentView('settings')}
        >
          Settings
        </button>
       
      </div>

      {/* Theme Toggle Right-Aligned */}
      <div style={{
        marginLeft: 'auto',
        marginRight: '32px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: theme === 'dark' ? '#fff' : '#1976d2',
            transition: 'color 0.2s'
          }}
          aria-label="Toggle theme"
        >
          <FontAwesomeIcon icon={theme === 'dark' ? faMoon : faSun} />
        </button>
      </div>
    </nav>
  );
}

export default Navigation;