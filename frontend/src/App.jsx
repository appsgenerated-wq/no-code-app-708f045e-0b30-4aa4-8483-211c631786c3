import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import config from './constants.js';
import './index.css';
import { testBackendConnection, createManifestWithLogging } from './services/apiService.js';

function App() {
  const [user, setUser] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [grapeVarieties, setGrapeVarieties] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [isLoading, setIsLoading] = useState(true);
  
  const manifest = new Manifest(config.APP_ID);

  useEffect(() => {
    // Check for an active session when the app loads
    manifest.from('User').me()
      .then(userData => {
        if (userData) {
          setUser(userData);
          setCurrentScreen('dashboard');
        }
      })
      .catch(() => {
        setUser(null);
        setCurrentScreen('landing');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [])

  useEffect(() => {
    // Enhanced backend connection test with detailed logging
    const testConnection = async () => {
      console.log('🚀 [APP] Starting enhanced backend connection test...');
      console.log('🔍 [APP] Backend URL:', 'https://no-code-app-708f045e-0b30-4aa4-8483-211c631786c3.vercel.app');
      console.log('🔍 [APP] App ID:', '708f045e-0b30-4aa4-8483-211c631786c3');
      
      setConnectionStatus('Testing connection...');
      
      const result = await testBackendConnection(3);
      setBackendConnected(result.success);
      
      if (result.success) {
        console.log('✅ [APP] Backend connection successful - proceeding with app initialization');
        setConnectionStatus('Connected');
        
        // Test Manifest SDK connection
        console.log('🔍 [APP] Testing Manifest SDK connection...');
        try {
          const manifest = createManifestWithLogging('708f045e-0b30-4aa4-8483-211c631786c3');
          console.log('✅ [APP] Manifest SDK initialized successfully');
        } catch (error) {
          console.error('❌ [APP] Manifest SDK initialization failed:', error);
          setConnectionStatus('SDK Error');
        }
      } else {
        console.error('❌ [APP] Backend connection failed - app may not work properly');
        console.error('❌ [APP] Connection error:', result.error);
        setConnectionStatus('Connection Failed');
      }
    };
    
    testConnection();
  }, []);;

  const login = async (email, password) => {
    try {
      await manifest.login('User', email, password);
      const loggedInUser = await manifest.from('User').me();
      setUser(loggedInUser);
      setCurrentScreen('dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const logout = async () => {
    await manifest.logout();
    setUser(null);
    setGrapeVarieties([]);
    setCurrentScreen('landing');
  };

  const loadGrapeVarieties = async () => {
    try {
      const response = await manifest.from('GrapeVariety').find({
        include: ['owner'],
        sort: { createdAt: 'desc' }
      });
      setGrapeVarieties(response.data || []);
    } catch (error) {
      console.error('Failed to load grape varieties:', error);
    }
  };

  const createGrapeVariety = async (grapeData, file) => {
    try {
      let photoId = null;
      if (file) {
        const uploadedFile = await manifest.upload(file);
        photoId = uploadedFile.id;
      }
      
      const newGrape = await manifest.from('GrapeVariety').create({ ...grapeData, photo: photoId });
      // Manually add owner data for immediate UI update
      const newGrapeWithOwner = { ...newGrape, owner: user };
      setGrapeVarieties([newGrapeWithOwner, ...grapeVarieties]);
    } catch (error) {
      console.error('Failed to create grape variety:', error);
      alert('Creation failed. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Enhanced Backend Connection Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`px-3 py-2 rounded-lg text-xs font-medium shadow-lg ${backendConnected ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{backendConnected ? '✅ Backend Connected' : '❌ Backend Disconnected'}</span>
          </div>
          <div className="text-xs opacity-75 mt-1">{connectionStatus}</div>
        </div>
      </div>
      
        <p className="text-gray-600">Loading Application...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {currentScreen === 'landing' || !user ? (
        <LandingPage onLogin={() => login('vintner@demo.com', 'password')} />
      ) : (
        <DashboardPage
          user={user}
          grapeVarieties={grapeVarieties}
          onLogout={logout}
          onLoadGrapes={loadGrapeVarieties}
          onCreateGrape={createGrapeVariety}
        />
      )}
    </div>
  );
}

export default App;
