import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './modules/broker/context/AuthContext';
import useFCM from './hooks/useFCM';

function AppContent() {
  const { isAuthenticated } = useAuth();
  
  // Initialize FCM — requests permission and listens for foreground messages when authenticated
  useFCM(isAuthenticated);

  return <AppRoutes />;
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
