import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const a_USER_ID = localStorage.getItem('a_USER_ID');
    const logoN_NAME = localStorage.getItem('logoN_NAME');
    console.log('Loaded from localStorage:', { token, a_USER_ID, logoN_NAME });

    return token && a_USER_ID && logoN_NAME
      ? { token, a_USER_ID, logoN_NAME }
      : null; // Return user object with all properties if they exist in localStorage
  });

  // Handle login process and storing data in localStorage
  const login = (token, a_USER_ID, logoN_NAME) => {
    localStorage.setItem('token', token);
    localStorage.setItem('a_USER_ID', a_USER_ID);  // Store a_USER_ID in localStorage
    localStorage.setItem('logoN_NAME', logoN_NAME);  // Store logoN_NAME in localStorage
    setUser({ token, a_USER_ID, logoN_NAME });  // Update state with user data
    console.log('User logged in:', { token, a_USER_ID, logoN_NAME });
  };

  // Handle logout process and clearing data from localStorage
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('a_USER_ID');  // Remove a_USER_ID from localStorage
    localStorage.removeItem('logoN_NAME');
    setUser(null);  // Clear user state
  };
  useEffect(() => {
    const userId = localStorage.getItem('a_USER_ID');
    console.log('UserId from localStorage:', userId);  // Ensure the correct user ID is retrieved
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
