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
import MemberRegistrationModal from './components/MemberRegistrationModal';

import { getMembers, getContributions } from './services/store';

export default function App() {
  const [activePage, setActivePage] = useState(() => {
    try {
      return localStorage.getItem('ony_active_page') || 'home';
    } catch {
      return 'home';
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ony_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        const membersList = getMembers();
        const matched = membersList.find(m => m.id === parsed.id || m.excel_member_id === parsed.excel_member_id);
        return matched ? { ...parsed, ...matched } : parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('ony_dark_mode') === 'true';
    } catch {
      return false;
    }
  });
  
  // Executive Re-Authentication State
  const [showExecutiveAuthModal, setShowExecutiveAuthModal] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('ony_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Public Self-Registration Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Live state from store
  const [members, setMembers] = useState([]);
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    setMembers(getMembers());
    setContributions(getContributions());
  }, []);

  // Keep currentUser automatically synchronized with members list updates (including photos & ledgers)
  useEffect(() => {
    if (currentUser && members && members.length > 0) {
      const liveUser = members.find(m => m.id === currentUser.id || m.excel_member_id === currentUser.excel_member_id);
      if (liveUser) {
        if (
          liveUser.profile_picture !== currentUser.profile_picture ||
          liveUser.dues_paid !== currentUser.dues_paid || 
          liveUser.shares_value !== currentUser.shares_value ||
          liveUser.balance_owed !== currentUser.balance_owed ||
          liveUser.total_payments !== currentUser.total_payments ||
          liveUser.shares_holding !== currentUser.shares_holding
        ) {
          setCurrentUser(liveUser);
        }
      }
    }
  }, [members]);

  // Save auth & page state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ony_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ony_current_user');
      sessionStorage.removeItem('ony_admin_auth');
      setIsAdminAuthenticated(false);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ony_active_page', activePage);
  }, [activePage]);

  useEffect(() => {
    localStorage.setItem('ony_dark_mode', isDarkMode ? 'true' : 'false');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    sessionStorage.setItem('ony_admin_auth', isAdminAuthenticated ? 'true' : 'false');
  }, [isAdminAuthenticated]);

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
    sessionStorage.setItem('ony_admin_auth', 'true');
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
        onOpenRegister={() => setIsRegisterModalOpen(true)}
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
              setMembers={setMembers}
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

      <Footer 
        setActivePage={handleNavigate} 
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />

      {/* Executive Re-Authentication Password Security Modal */}
      <ExecutiveAuthModal 
        isOpen={showExecutiveAuthModal}
        onClose={() => setShowExecutiveAuthModal(false)}
        onSuccess={handleExecutiveAuthSuccess}
        currentUser={currentUser}
      />

      {/* Public Self-Registration Modal */}
      <MemberRegistrationModal 
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
}
