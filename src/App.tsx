import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { LanguageProvider } from './components/LanguageProvider';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { FarmerDashboard } from './components/FarmerDashboard';
import { DistributorDashboard } from './components/DistributorDashboard';
import { RetailerDashboard } from './components/RetailerDashboard';
import { CustomerQRScanner } from './components/CustomerQRScanner';
import { ChatBot } from './components/ChatBot';
import { CropPriceNotification } from './components/CropPriceNotification';
import { onAuthChange, getUserData, signOutUser, UserData } from './services/firebaseService';

type UserRole = 'farmer' | 'distributor' | 'retailer' | 'customer';
type AppPage = 'home' | 'login' | 'signup' | 'dashboard' | 'qr-scanner';

interface AppState {
  currentPage: AppPage;
  selectedRole: UserRole | null;
  isAuthenticated: boolean;
  userData: UserData | null;
}

export default function App() {
  const [appState, setAppState] = useState({
    currentPage: 'home',
    selectedRole: null,
    isAuthenticated: false,
    userData: null
  });

  const [showPriceNotification, setShowPriceNotification] = useState(false);

  // Monitor Firebase authentication state
  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        try {
          const userData = await getUserData(user.uid);
          if (userData) {
            setAppState(prev => ({
              ...prev,
              isAuthenticated: true,
              userData,
              selectedRole: userData.role
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setAppState(prev => ({
          ...prev,
          isAuthenticated: false,
          userData: null,
          selectedRole: null
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  // Show price notification for farmers after a delay
  useEffect(() => {
    if (appState.selectedRole === 'farmer' && appState.isAuthenticated) {
      const timer = setTimeout(() => {
        setShowPriceNotification(true);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setShowPriceNotification(false);
    }
  }, [appState.selectedRole, appState.isAuthenticated]);

  const handleRoleSelect = (role: UserRole) => {
    if (role === 'customer') {
      setAppState({
        ...appState,
        selectedRole: role,
        currentPage: 'qr-scanner'
      });
    } else {
      setAppState({
        ...appState,
        selectedRole: role,
        currentPage: 'login'
      });
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      // Firebase authentication will be handled in LoginPage
      // This function will be called after successful authentication
      const userData = await getUserData(email);
      if (userData) {
        setAppState({
          ...appState,
          isAuthenticated: true,
          userData,
          currentPage: 'dashboard'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleSignup = async (formData: any) => {
    try {
      // Firebase signup will be handled in SignupPage
      // This function will be called after successful signup
      const userData = await getUserData(formData.email);
      if (userData) {
        setAppState({
          ...appState,
          isAuthenticated: true,
          userData,
          currentPage: 'dashboard'
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      setAppState({
        currentPage: 'home',
        selectedRole: null,
        isAuthenticated: false,
        userData: null
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleBackToHome = () => {
    setAppState({
      currentPage: 'home',
      selectedRole: null,
      isAuthenticated: false,
      userData: null
    });
  };

  const handleGoToSignup = () => {
    setAppState({
      ...appState,
      currentPage: 'signup'
    });
  };

  const handleGoToLogin = () => {
    setAppState({
      ...appState,
      currentPage: 'login'
    });
  };

  const renderCurrentPage = () => {
    switch (appState.currentPage) {
      case 'home':
        return <HomePage onRoleSelect={handleRoleSelect} />;
      
      case 'login':
        return (
          <LoginPage
            role={appState.selectedRole as 'farmer' | 'distributor' | 'retailer'}
            onBack={handleBackToHome}
            onLogin={handleLogin}
            onSignupRedirect={handleGoToSignup}
          />
        );
      
      case 'signup':
        return (
          <SignupPage
            role={appState.selectedRole as 'farmer' | 'distributor' | 'retailer'}
            onBack={handleBackToHome}
            onSignup={handleSignup}
            onLoginRedirect={handleGoToLogin}
          />
        );
      
      case 'dashboard':
        if (!appState.isAuthenticated) {
          return <HomePage onRoleSelect={handleRoleSelect} />;
        }
        
        switch (appState.selectedRole) {
          case 'farmer':
            return <FarmerDashboard onLogout={handleLogout} />;
          case 'distributor':
            return <DistributorDashboard onLogout={handleLogout} />;
          case 'retailer':
            return <RetailerDashboard onLogout={handleLogout} />;
          default:
            return <HomePage onRoleSelect={handleRoleSelect} />;
        }
      
      case 'qr-scanner':
        return <CustomerQRScanner onBack={handleBackToHome} />;
      
      
      default:
        return <HomePage onRoleSelect={handleRoleSelect} />;
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background text-foreground">
          {renderCurrentPage()}
          <ChatBot />
          <CropPriceNotification
            isVisible={showPriceNotification}
            onClose={() => setShowPriceNotification(false)}
          />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}