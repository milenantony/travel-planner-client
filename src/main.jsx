// client/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css';
import AuthContextProvider from './context/AuthContext.jsx';
import 'react-toastify/dist/ReactToastify.css';

import App from './App.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx'; // <-- IMPORT DASHBOARD
import ProtectedRoute from './components/ProtectedRoute.jsx'; // <-- IMPORT THE GUARD
import TripDetail from './pages/TripDetail.jsx'; // <-- IMPORT TRIPDETAIL

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      {
        // This is our new protected section
        element: <ProtectedRoute />, // The guard component
        children: [
          { path: '/dashboard', element: <Dashboard /> }, // The page(s) it protects
          // You can add more protected routes here later
           { path: '/trip/:tripId', element: <TripDetail /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </React.StrictMode>
);