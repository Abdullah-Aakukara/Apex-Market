import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { decodeToken, setAccessToken, refreshAccessToken, logoutUser } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const expirationTimeoutRef = useRef(null);

  const logout = async (isExpired = false) => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout backend call failed:', err);
    } finally {
      setUser(null);
      setAccessToken('');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      if (expirationTimeoutRef.current) {
        clearTimeout(expirationTimeoutRef.current);
        expirationTimeoutRef.current = null;
      }
      if (isExpired) {
        sessionStorage.setItem('session_expired_message', 'Your login session expired, log-in again.');
      }
    }
  };

  const silentRefresh = async () => {
    try {
      const res = await refreshAccessToken();
      const token = res.newAccessToken;
      setAccessToken(token);

      const decoded = decodeToken(token);
      if (decoded) {
        let roles = decoded.userRole || [];
        if (!Array.isArray(roles)) {
          roles = [roles];
        }

        // Retrieve current stored user role if exists
        const storedUserJson = localStorage.getItem('user');
        let currentRole = null;
        if (storedUserJson) {
          try {
            currentRole = JSON.parse(storedUserJson).role;
          } catch (e) {}
        }
        const activeRole = currentRole || (roles.length === 1 ? roles[0] : null);

        const userData = {
          name: decoded.userName || decoded.userEmail.split('@')[0],
          email: decoded.userEmail,
          roles: roles,
          role: activeRole,
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('refreshToken', 'HttpOnly');
      }

      scheduleTokenExpiration(token);
      return token;
    } catch (err) {
      console.error('Silent refresh failed:', err);
      // If refresh fails, we must force a logout and cleanup
      setUser(null);
      setAccessToken('');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      if (expirationTimeoutRef.current) {
        clearTimeout(expirationTimeoutRef.current);
        expirationTimeoutRef.current = null;
      }
      sessionStorage.setItem('session_expired_message', 'Your login session expired, log-in again.');
      throw err;
    }
  };

  const scheduleTokenExpiration = (token) => {
    if (expirationTimeoutRef.current) {
      clearTimeout(expirationTimeoutRef.current);
      expirationTimeoutRef.current = null;
    }

    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return;

    // Refresh token exactly after it has expired (with a 1 second delay)
    const remainingTime = decoded.exp * 1000 - Date.now() + 1000;
    if (remainingTime <= 0) {
      silentRefresh().catch(() => {});
    } else {
      expirationTimeoutRef.current = setTimeout(() => {
        silentRefresh().catch(() => {});
      }, remainingTime);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const hasRefreshToken = localStorage.getItem('refreshToken') === 'HttpOnly';

      if (hasRefreshToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          await silentRefresh();
        } catch (error) {
          console.error('Initial silent refresh failed:', error);
          // Handled inside silentRefresh catch, but ensure loading is false
        }
      } else {
        setUser(null);
        setAccessToken('');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
      setLoading(false);
    };

    initAuth();

    const handleUnauthorized = async () => {
      const hasRefreshToken = localStorage.getItem('refreshToken') === 'HttpOnly';
      if (hasRefreshToken) {
        try {
          await silentRefresh();
          return;
        } catch (e) {}
      }
      await logout(true);
    };
    window.addEventListener('auth-unauthorized', handleUnauthorized);

    return () => {
      if (expirationTimeoutRef.current) {
        clearTimeout(expirationTimeoutRef.current);
      }
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, []);

  const login = (token, chosenRole = null) => {
    const decoded = decodeToken(token);
    if (!decoded) return;

    let roles = decoded.userRole || [];
    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    // Determine the active role
    const activeRole = chosenRole || (roles.length === 1 ? roles[0] : null);

    const userData = {
      name: decoded.userName || decoded.userEmail.split('@')[0],
      email: decoded.userEmail,
      roles: roles,
      role: activeRole,
    };

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('refreshToken', 'HttpOnly');
    setAccessToken(token);
    
    // Schedule expiration
    scheduleTokenExpiration(token);
  };

  const selectActiveRole = (role) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, role };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const updateUserFields = (fields) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...fields };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, selectActiveRole, updateUserFields }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
