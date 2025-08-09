// client/src/context/AuthContext.jsx

import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

export default function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // <-- NEW: Start in a loading state

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
        } else {
          setAuthToken(token);
          setUser(decodedToken.user);
        }
      }
    } catch (error) {
      console.error("Error processing token on initial load", error);
      // Clear out any invalid state
      setAuthToken(null);
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false); // <-- NEW: We are done loading, whether we found a token or not
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedToken = jwtDecode(token);
    setAuthToken(token);
    setUser(decodedToken.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
  };

  // <-- NEW: Export isLoading
  const value = { authToken, user, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}