import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './components/Login/Login';
import Home from './components/Home/home';
import Users from './components/Users/Users';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated (e.g., check localStorage or session)
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log(credentials);
      console.log('calling api');
      // Add your authentication API call here
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {/* <Home/> */}
      <BrowserRouter>
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated 
                ? <Navigate to="/" /> 
                : <LoginPage onLogin={handleLogin} error={error} setIsAuthenticated={setIsAuthenticated} />
            } 
          />
          <Route 
            path="/" 
            element={
              isAuthenticated 
                ? <Home onLogout={handleLogout} /> 
                : <Navigate to="/login" />
            } 
          />
          <Route path="/test-users" element={<Users />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
