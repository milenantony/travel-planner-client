// client/src/App.jsx

import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import { ThemeContext } from './context/ThemeContext';
import './App.css';

function App() {
  // Get the current theme ('light' or 'dark') from our ThemeContext
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <Header />
      
      {/* This wrapper div adds some space at the top so the page content
          doesn't start hidden behind our sticky/glass header */}
      <div style={{ paddingTop: '1rem' }}>
        <main>
          {/* Outlet is the placeholder from react-router-dom.
              It will render the correct page component based on the URL. */}
          <Outlet />
        </main>
      </div>

      {/* This is the container that will launch all our toast notifications.
          We pass the current theme to it so the toasts match the UI. */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
    </>
  );
}

export default App;