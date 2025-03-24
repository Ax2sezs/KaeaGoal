import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // กำหนด state user จากข้อมูลใน localStorage (ถ้ามี)
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const a_USER_ID = localStorage.getItem('a_USER_ID');
    const logoN_NAME = localStorage.getItem('logoN_NAME');
    console.log('Loaded from localStorage:', { token, a_USER_ID, logoN_NAME });

    return token && a_USER_ID && logoN_NAME
      ? { token, a_USER_ID, logoN_NAME }
      : null;
  });

  // ฟังก์ชัน login
  const login = (token, a_USER_ID, logoN_NAME) => {
    localStorage.setItem('token', token);
    localStorage.setItem('a_USER_ID', a_USER_ID);  // Store a_USER_ID in localStorage
    localStorage.setItem('logoN_NAME', logoN_NAME);  // Store logoN_NAME in localStorage
    setUser({ token, a_USER_ID, logoN_NAME });  // Update state with user data
    console.log('User logged in:', { token, a_USER_ID, logoN_NAME });
  };

  // ฟังก์ชัน logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('a_USER_ID');  // Remove a_USER_ID from localStorage
    localStorage.removeItem('logoN_NAME');
    setUser(null);  // Clear user state
  };

  // ตรวจสอบเมื่อข้อมูลใน localStorage หรือ state user เปลี่ยนแปลง
  useEffect(() => {
    // โหลดข้อมูลจาก localStorage เมื่อ component ถูก mount
    const token = localStorage.getItem('token');
    const a_USER_ID = localStorage.getItem('a_USER_ID');
    const logoN_NAME = localStorage.getItem('logoN_NAME');

    if (token && a_USER_ID && logoN_NAME) {
      setUser({ token, a_USER_ID, logoN_NAME });
      console.log('User data loaded from localStorage inside useEffect:', { token, a_USER_ID, logoN_NAME });
    }
  }, []); // ใช้ empty dependency array เพื่อให้มันทำงานแค่ครั้งเดียวเมื่อ component mount

  useEffect(() => {
    if (user) {
      console.log('User state has been updated:', user); // ตรวจสอบเมื่อ state user ถูกอัปเดต
    }
  }, [user]); // จะทำงานทุกครั้งที่ state user เปลี่ยนแปลง

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
