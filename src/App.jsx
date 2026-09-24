import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';

import { getMembers, getContributions } from './services/store';

export default function App() {
  const [activePage, setActivePage] = useState('home'); // 'home', 'about', 'contact', 'login', 'dashboard', 'admin'
  const [currentUser, setCurrentUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Live state from store
  const [members, setMembers] = useState([]);
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    setMembers(getMembers());
    setContributions(getContributions());
  }, []);

  // Update root dark class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        activePage={activePage}
        setActivePage={setActivePage}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <main style={{ flex: 1 }}>
        {activePage === 'home' && (
          <HomePage 
            setActivePage={setActivePage} 
            membersCount={members.length} 
            contributionsCount={contributions.length} 
          />
        )}

        {activePage === 'about' && (
          <AboutPage setActivePage={setActivePage} />
        )}

        {activePage === 'contact' && (
          <ContactPage />
        )}

        {activePage === 'login' && (
          <LoginPage 
            members={members}
            setCurrentUser={setCurrentUser}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'dashboard' && (
          currentUser ? (
            <DashboardPage 
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              members={members}
              setMembers={setMembers}
              contributions={contributions}
              setActivePage={setActivePage}
            />
          ) : (
            <LoginPage 
              members={members}
              setCurrentUser={setCurrentUser}
              setActivePage={setActivePage}
            />
          )
        )}

        {activePage === 'admin' && (
          currentUser?.role === 'admin' ? (
            <AdminPage 
              currentUser={currentUser}
              members={members}
              contributions={contributions}
              setContributions={setContributions}
              setActivePage={setActivePage}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
              <h2>Access Restricted</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You must log in as an Executive Administrator to view the Admin Console.</p>
              <button onClick={() => setActivePage('login')} className="btn btn-primary">
                Log In as Executive Admin (Alex Ackah, Osei Kwame, etc.)
              </button>
            </div>
          )
        )}
      </main>

      <Footer setActivePage={setActivePage} />
    </div>
  );
}
