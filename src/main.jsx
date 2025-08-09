// client/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'react-confirm-alert/src/react-confirm-alert.css';

// Import all necessary CSS files
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

// Import Context Providers
import AuthContextProvider from './context/AuthContext.jsx';
import ThemeContextProvider from './context/ThemeContext.jsx';

// Import Layout and Page Components
import App from './App.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TripDetail from './pages/TripDetail.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// This is where we define all our application's routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App is the main layout component (with Header, etc.)
    children: [
      // Public routes
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      
      // This is our protected section
      {
        element: <ProtectedRoute />, // The guard component
        children: [
          // Any page inside here can only be accessed by logged-in users
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/trip/:tripId', element: <TripDetail /> },
        ],
      },
    ],
  },
]);

// This renders the entire application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>
);