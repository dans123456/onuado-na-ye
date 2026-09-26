import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ExecutiveAuthModal from './components/ExecutiveAuthModal';

import { getMembers, getContributions } from './services/store';

export default function App() {
  const [activePage, setActivePage] = useState('home'); // 'home', 'about', 'contact', 'login', 'dashboard', 'admin'
  const [currentUser, setCurrentUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Executive Re-Authentication State
  const [showExecutiveAuthModal, setShowExecutiveAuthModal] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Live state from store
  const [members, setMembers] = useState([]);
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    setMembers(getMembers());
    setContributions(getContributions());
  }, []);

  // Reset admin session authentication when user logs out or changes
  useEffect(() => {
    setIsAdminAuthenticated(false);
  }, [currentUser]);

  // Update root dark class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Guarded Navigation Handler
  const handleNavigate = (page) => {
    if (page === 'admin' && currentUser?.role === 'admin' && !isAdminAuthenticated) {
      setShowExecutiveAuthModal(true);
    } else {
      setActivePage(page);
    }
  };

  const handleExecutiveAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    setShowExecutiveAuthModal(false);
    setActivePage('admin');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        activePage={activePage}
        setActivePage={handleNavigate}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <main style={{ flex: 1 }}>
        {activePage === 'home' && (
          <HomePage 
            setActivePage={handleNavigate} 
            membersCount={members.length} 
            contributionsCount={contributions.length} 
          />
        )}

        {activePage === 'about' && (
          <AboutPage setActivePage={handleNavigate} />
        )}

        {activePage === 'contact' && (
          <ContactPage 
            setActivePage={handleNavigate} 
            currentUser={currentUser} 
            setContributions={setContributions}
            setMembers={setMembers}
          />
        )}

        {activePage === 'login' && (
          <LoginPage 
            members={members}
            setCurrentUser={setCurrentUser}
            setActivePage={handleNavigate}
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
              setContributions={setContributions}
              setActivePage={handleNavigate}
            />
          ) : (
            <LoginPage 
              members={members}
              setCurrentUser={setCurrentUser}
              setActivePage={handleNavigate}
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
              setActivePage={handleNavigate}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
              <h2>Access Restricted</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You must log in as an Executive Administrator to view the Admin Console.</p>
              <button onClick={() => handleNavigate('login')} className="btn btn-primary">
                Log In as Executive Admin (Alex Ackah, Osei Kwame, etc.)
              </button>
            </div>
          )
        )}
      </main>

      <Footer setActivePage={handleNavigate} />

      {/* Executive Re-Authentication Password Security Modal */}
      <ExecutiveAuthModal 
        isOpen={showExecutiveAuthModal}
        onClose={() => setShowExecutiveAuthModal(false)}
        onSuccess={handleExecutiveAuthSuccess}
        currentUser={currentUser}
      />
    </div>
  );
}
