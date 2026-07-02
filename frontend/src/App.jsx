import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { AuthContext } from './context/AuthContext';
import './index.css';

/**
 * PublicRoute — wraps Login & Register.
 * If the user is already authenticated, redirect them home instead of
 * showing the auth page. This prevents back-button returning to login.
 */
const PublicRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to="/" replace /> : children;
};

/**
 * ProtectedRoute — wraps Home.
 * If the user is NOT authenticated, redirect them to login.
 */
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: 'var(--bg-surface)',
            color: 'var(--text-1)',
            border: '1px solid var(--border-2)',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontFamily: 'Inter, sans-serif',
            boxShadow: 'var(--shadow-md)',
          },
        }}
      />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;