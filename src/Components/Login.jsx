import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchData from './APIManage/useFetchData'; // Import the custom hook

function Login() {
  const [logoN_NAME, setLogoN_NAME] = useState('');
  const [useR_PASSWORD, setUseR_PASSWORD] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // ✅ เพิ่ม state สำหรับ checkbox
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
      className="flex min-h-screen items-center justify-center w-full"
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
          <div className="text-center flex gap-2">
            <input type='checkbox' className='checkbox checkbox-success bg-bg' 
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            />
            <p className='text-sm text-bg'>I accept</p>
            <p className="text-sm text-bg cursor-pointer font-bold" onClick={() => document.getElementById('policy').showModal()}>
              the terms and conditions.
            </p>
          </div>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="btn btn-outline bg-bg text-lg font-bold text-layer-item border-hidden rounded-full hover:scale-105 hover:bg-layer-item transform transition-all duration-300"
              disabled={isLoading || !isChecked} // ✅ ปิดปุ่มถ้า checkbox ไม่ถูกติ๊ก
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>

      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="policy" className="modal">
        <div className="modal-box bg-bg text-button-text" >
          <h3 className="font-bold text-lg">Policy</h3>
          <p className="py-4">
            นโยบายการจัดเก็บและใช้รูปภาพ

            เว็บไซต์ของเรามีการให้คุณส่งรูปภาพ ซึ่งอาจมีบุคคลอื่นติดอยู่ในภาพด้วย และเราจะจัดเก็บรูปของคุณในฐานข้อมูล รูปภาพที่คุณส่งมา อาจถูกนำไปใช้ในกิจกรรมของเว็บไซต์ หรือใช้เป็นตัวอย่างสำหรับกิจกรรมในอนาคต

            หากคุณต้องการให้ลบรูปภาพของคุณ สามารถแจ้ง Admin เพื่อดำเนินการลบให้ได้ทุกเมื่อ
          </p>
          <div className='divider'></div>
          <p className='py-4'>
            Policy on Image Storage and Usage

            Our website allows you to upload images, which may include other individuals in the background. We will store your uploaded images in our database. The images you provide may be used for website activities or as examples for future events.

            If you wish to have your images removed, you can contact Admin at any time to request deletion.
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-success rounded-badge">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default Login;
