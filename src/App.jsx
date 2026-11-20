// src/App.jsx
import { useState, useEffect } from 'react';
import './App.css';

// Firebase Auth
import { onAuthStateChange } from './firebase/authService';

// Components
import Navigation from './components/Navigation/Navigation';
import AuthPage from './components/Auth/AuthPage';
import Landing from './components/Landing/Landing';
import VillaList from './components/Villas/VillaList';
import VillaDetail from './components/Villas/VillaDetail';
import UserDashboard from './components/Dashboard/UserDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import EnquiryModal from './components/Enquiry/EnquiryModal';
import SocialMediaButtons from './components/Common/SocialMediaButtons';
import Footer from './components/Footer/Footer';
import TermsOfService from './components/Legal/TermsOfService';
import PrivacyPolicy from './components/Legal/PrivacyPolicy';
import Loading from './components/Common/Loading';
import { scrollToTop } from './utils/helpers';

// Registered Admin Email Addresses
const ADMIN_EMAILS = [
  'contact@cascadevillas.in', 
  'jhaharsh878@gmail.com', 
  'cascadevillas.lonavala@gmail.com'
];

function App() {
  
  const [currentPage, setCurrentPage] = useState('home');
  const [previousPage, setPreviousPage] = useState('home');
  const [selectedVilla, setSelectedVilla] = useState(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryVilla, setEnquiryVilla] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [historyInitialized, setHistoryInitialized] = useState(false);
  const [propertiesFilters, setPropertiesFilters] = useState(null);

  // Browser History Management
  useEffect(() => {
    if (!historyInitialized) {
      const initialState = {
        page: 'home',
        villa: null
      };
      window.history.replaceState(initialState, '', window.location.pathname);
      setHistoryInitialized(true);
    }

    const handlePopState = (event) => {
      if (event.state) {
        setCurrentPage(event.state.page);
        setSelectedVilla(event.state.villa);
        setShowAuthPage(false);
        setShowEnquiryModal(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [historyInitialized]);

  const updateHistory = (page, villa = null) => {
    const state = { page, villa };
    const url = villa ? `/${page}/${villa.id}` : `/${page}`;
    window.history.pushState(state, '', url);
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      
      // Check if logged-in user is admin
      if (currentUser && currentUser.email && ADMIN_EMAILS.includes(currentUser.email.toLowerCase())) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleNavigate = (page, filterParams = null) => {
    if ((page === 'dashboard' || page === 'admin') && !user) {
      setPreviousPage(currentPage);
      setShowAuthPage(true);
      return;
    }

    if (filterParams) {
      setPropertiesFilters(filterParams);
    }

    setPreviousPage(currentPage);
    setCurrentPage(page);
    setSelectedVilla(null);
    setShowAuthPage(false);
    
    updateHistory(page);
    scrollToTop(true);
  };

  const handleVillaClick = (villa) => {
    setPreviousPage(currentPage);
    setSelectedVilla(villa);
    setCurrentPage('villa-detail');
    
    updateHistory('villa-detail', villa);
    scrollToTop(true);
  };

  const handleBackToList = () => {
    setSelectedVilla(null);
    setCurrentPage('properties');
    updateHistory('properties');
    scrollToTop(true);
  };

  const handleEnquireClick = (villa) => {
    setEnquiryVilla(villa);
    setShowEnquiryModal(true);
  };

  const handleLoginRequired = () => {
    setPreviousPage(currentPage);
    setShowEnquiryModal(false);
    setShowAuthPage(true);
  };

  const handleAuthBack = () => {
    setShowAuthPage(false);
    setCurrentPage(previousPage);
  };

  const handleAuthSuccess = () => {
    setShowAuthPage(false);
    if (currentPage === 'home' && previousPage === 'dashboard') {
      setCurrentPage('dashboard');
      updateHistory('dashboard');
    } else if (currentPage === 'home' && previousPage === 'admin') {
      setCurrentPage('admin');
      updateHistory('admin');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    setCurrentPage('home');
    updateHistory('home');
    scrollToTop(true);
  };

  const handleEnquirySuccess = () => {
    setShowEnquiryModal(false);
    setEnquiryVilla(null);
    
    if (user) {
      setCurrentPage('dashboard');
      updateHistory('dashboard');
      
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-20 left-1/2 -translate-x-1/2 glass-panel bg-emerald-500/90 text-neutral-950 font-bold px-6 py-4 rounded-2xl shadow-2xl z-50 animate-slide-down border border-emerald-400/50 backdrop-blur-xl flex items-center gap-3';
      successDiv.innerHTML = `
        <span class="text-xl">✓</span>
        <div>
          <p class="font-extrabold text-sm">Enquiry Submitted Successfully!</p>
          <p class="text-xs font-medium text-emerald-950">Track live status and dates right from your guest dashboard.</p>
        </div>
      `;
      document.body.appendChild(successDiv);
      
      setTimeout(() => {
        successDiv.remove();
      }, 5000);
    }
  };

  if (showAuthPage) {
    return <AuthPage onSuccess={handleAuthSuccess} onBack={handleAuthBack} />;
  }

  if (authLoading) {
    return <Loading fullScreen text="Loading Cascade Villas..." />;
  }

  const renderPage = () => {
    if (currentPage === 'villa-detail' && selectedVilla) {
      return (
        <VillaDetail
          villaId={selectedVilla.id}
          onEnquireClick={handleEnquireClick}
          onBack={handleBackToList}
        />
      );
    }

    switch (currentPage) {
      case 'home':
        return <Landing onVillaClick={handleVillaClick} onNavigate={handleNavigate} />;
      case 'properties':
        return (
          <VillaList 
            onVillaClick={handleVillaClick} 
            initialFilters={propertiesFilters}
            onClearInitialFilters={() => setPropertiesFilters(null)}
          />
        );
      case 'dashboard':
        return user ? (
          <UserDashboard onLogout={handleLogout} />
        ) : (
          <Landing onVillaClick={handleVillaClick} onNavigate={handleNavigate} />
        );
      case 'admin':
        return user && isAdmin ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <Landing onVillaClick={handleVillaClick} onNavigate={handleNavigate} />
        );
      case 'terms':
        return <TermsOfService onNavigate={handleNavigate} />;
      case 'privacy':
        return <PrivacyPolicy onNavigate={handleNavigate} />;
      default:
        return <Landing onVillaClick={handleVillaClick} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#07070a] text-slate-900 dark:text-neutral-100 transition-colors duration-300">
      {/* Navigation (Sidebar Desktop / Floating Mobile) */}
      <Navigation 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        user={user}
        isAdmin={isAdmin}
      />

      {/* Main Content View with Persistent Footer */}
      <main className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex-1">
          {renderPage()}
        </div>
        <Footer onNavigate={handleNavigate} />
      </main>

      {/* Enquiry Modal */}
      {showEnquiryModal && enquiryVilla && (
        <EnquiryModal
          villa={enquiryVilla}
          onClose={() => {
            setShowEnquiryModal(false);
            setEnquiryVilla(null);
          }}
          onSuccess={handleEnquirySuccess}
          onLoginRequired={handleLoginRequired}
        />
      )}

      {/* Floating Concierge Action Dock */}
      <SocialMediaButtons />
    </div>
  );
}

export default App;
