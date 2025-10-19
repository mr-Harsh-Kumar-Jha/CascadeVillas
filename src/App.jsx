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
import WhatsAppButton from './components/Common/WhatsAppButton';
import Loading from './components/Common/Loading';

function App() {
  // ⚠️ IMPORTANT: Add your admin email addresses here
  const ADMIN_EMAILS = ['contact@cascadevillas.in', 'jhaharsh878@gmail.com', "cascadevillas.lonavala@gmail.com"];
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedVilla, setSelectedVilla] = useState(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryVilla, setEnquiryVilla] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      
      // Check if user is admin
      if (currentUser && ADMIN_EMAILS.includes(currentUser.email)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleNavigate = (page) => {
    // If trying to access dashboard or admin without login
    if ((page === 'dashboard' || page === 'admin') && !user) {
      setShowAuthPage(true);
      return;
    }

    setCurrentPage(page);
    setSelectedVilla(null);
    setShowAuthPage(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVillaClick = (villa) => {
    setSelectedVilla(villa);
    setCurrentPage('villa-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedVilla(null);
    setCurrentPage('properties');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnquireClick = (villa) => {
    // Check if user is logged in
    if (!user) {
      setShowAuthPage(true);
      return;
    }

    setEnquiryVilla(villa);
    setShowEnquiryModal(true);
  };

  const handleLoginRequired = () => {
    setShowEnquiryModal(false);
    setShowAuthPage(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthPage(false);
    // If they were trying to access dashboard, go there
    if (currentPage === 'home') {
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnquirySuccess = () => {
    setShowEnquiryModal(false);
    setEnquiryVilla(null);
    
    // Navigate to dashboard to see the new enquiry
    setCurrentPage('dashboard');
    
    // Show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slide-down';
    successDiv.innerHTML = `
      <div class="flex items-center gap-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <p class="font-semibold">Enquiry Submitted!</p>
          <p class="text-sm">Check your dashboard to track status.</p>
        </div>
      </div>
    `;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.remove();
    }, 5000);
  };

  // Show auth page
  if (showAuthPage) {
    return <AuthPage onSuccess={handleAuthSuccess} />;
  }

  // Show loading while checking auth
  if (authLoading) {
    return <Loading fullScreen text="Loading..." />;
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
        return <VillaList onVillaClick={handleVillaClick} />;
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
      default:
        return <Landing onVillaClick={handleVillaClick} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Navigation */}
      <Navigation 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        user={user}
        isAdmin={isAdmin}
      />

      {/* Main Content */}
      <main className="flex-1">
        {renderPage()}
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

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
}

export default App;