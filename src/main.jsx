import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Wrap your app in BrowserRouter here
import './index.css'; // Your global styles
import App from './App.jsx'; // Import App.js which contains your routes
import { AuthProvider } from './Components/APIManage/AuthContext'; // Ensure the correct path


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
