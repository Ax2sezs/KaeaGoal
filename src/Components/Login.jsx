import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchData from './APIManage/useFetchData'; // Import the custom hook

function Login() {
  const [logoN_NAME, setLogoN_NAME] = useState('');
  const [useR_PASSWORD, setUseR_PASSWORD] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useFetchData(null);

  const handleLogin = async () => {
    if (!logoN_NAME || !useR_PASSWORD) {
      setError('Username and password are required');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await login(logoN_NAME, useR_PASSWORD);
      setSuccess('Login successful!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin();
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{
        backgroundImage: "url('./wallpaper001.jpg')",
        backgroundSize: "cover",  // ครอบคลุมทั้งพื้นหลัง
        backgroundPosition: "center",  // จัดให้อยู่กลาง
        backgroundAttachment: "fixed"  // ภาพจะไม่เลื่อนเมื่อเลื่อนหน้าจอ
      }}
    >
      {/* Logo */}
      {/* <div className="absolute top-5 left-0 right-0 flex justify-center z-10">
        <img
          src="./Sheep2.png"
          alt="Logo"
          className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
        />
      </div> */}

      {/* Login Form */}
      <div
        className="p-6 border-heavy-color bg-layer-item border-8 shadow-lg rounded-badge z-20 mb-16"
        style={{ backgroundImage: "url('./6654537.jpg')", backgroundSize: "cover" }}
      >
        <h2 className="text-2xl font-bold text-center text-white mb-6">Welcome</h2>

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-white">Username</label>
            <input
              type="text"
              id="username"
              className="mt-2 p-3 w-full border-2 border-bg rounded-badge bg-transparent focus:outline-none focus:ring-2 focus:ring-bg placeholder:text-bg text-bg"
              placeholder="Enter your username"
              value={logoN_NAME}
              onChange={(e) => setLogoN_NAME(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-white">Password</label>
            <input
              type="password"
              id="password"
              className="mt-2 p-3 w-full border-2 border-bg rounded-badge bg-transparent focus:outline-none focus:ring-2 focus:ring-bg placeholder:text-bg"
              placeholder="Enter your password"
              value={useR_PASSWORD}
              onChange={(e) => setUseR_PASSWORD(e.target.value)}
            />
          </div>

          <div className='bg-bg rounded-badge px-2'>
            {/* Error Message */}
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            {/* Success Message */}
            {success && <div className="text-green-500 text-sm mb-4">{success}</div>}
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-bg">
              Don't have an account?{' '}
              <a href="/home" className="text-bg font-bold">
                Sign Up
              </a>
            </p>
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="btn btn-outline bg-bg text-lg font-bold text-layer-item border border-bg rounded-full shadow-lg hover:scale-105 transform transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
