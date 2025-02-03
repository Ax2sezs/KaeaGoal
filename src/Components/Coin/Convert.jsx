import React, { useState } from 'react';
import useFetchData from '../APIManage/useFetchData';
import { useNavigate } from 'react-router-dom';

const Convert = () => {
  const [thankCoinAmount, setThankCoinAmount] = useState(0);
  const [kaeaCoinAmount, setKaeaCoinAmount] = useState(0); // จำนวน Kaea Coin ที่ได้จากการคำนวณ
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // เปิด/ปิด Success Modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // เปิด/ปิด Confirm Modal
  const { convertCoin, error, isLoading } = useFetchData(localStorage.getItem('token'));
  const navigate = useNavigate();

  // คำนวณจำนวน Kaea Coin
  const calculateKaeaCoins = (thankCoinAmount) => {
    const exchangeRate = 10;
    return thankCoinAmount / exchangeRate;
  };

  // เมื่อเปลี่ยนค่าใน Input
  const handleCoinAmountChange = (e) => {
    const amount = e.target.value;

    // ตรวจสอบว่าเลขที่กรอกลงท้ายด้วย 0 หรือไม่
    if (amount === '' || /^[0-9]*0$/.test(amount)) {
      setThankCoinAmount(Number(amount));
      setKaeaCoinAmount(calculateKaeaCoins(Number(amount)));
    }
  };

  // ฟังก์ชันเปิด Confirm Modal
  const handleOpenConfirmModal = () => {
    if (thankCoinAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    setIsConfirmModalOpen(true); // เปิด Confirm Modal
  };

  // ฟังก์ชันยืนยันการแลกเปลี่ยนเหรียญ
  const handleConfirmConversion = async () => {
    try {
      await convertCoin(thankCoinAmount);
      setIsConfirmModalOpen(false); // ปิด Confirm Modal
      setIsSuccessModalOpen(true);  // เปิด Success Modal
    } catch (err) {
      alert(error); // แสดงข้อผิดพลาด
    }
  };

  // เพิ่มจำนวนเหรียญ
  const increaseCoinAmount = () => {
    setThankCoinAmount((prevAmount) => prevAmount + 10);
    setKaeaCoinAmount(calculateKaeaCoins(thankCoinAmount + 10));
  };

  // ลดจำนวนเหรียญ
  const decreaseCoinAmount = () => {
    if (thankCoinAmount > 0) {
      setThankCoinAmount((prevAmount) => prevAmount - 10);
      setKaeaCoinAmount(calculateKaeaCoins(thankCoinAmount - 10));
    }
  };

  return (
    <div>
      <div className="bg-bg w-full min-h-full rounded-2xl p-3 sm:p-10">
        <h1 className="text-2xl text-layer-item font-bold mb-5">CONVERT.</h1>
        <div className="flex flex-col justify-center items-center gap-10">
          {/* Display Coins */}
          <div className="flex flex-row items-center justify-center w-full">
            <div className="flex flex-col items-center w-full">
              <img src="src/assets/2.png" alt="Green Coin" className="w-16 h-16 sm:w-32 sm:h-32" />
              <p className="text-xs sm:text-lg text-gray-700 mt-3">{thankCoinAmount} Thanks Coin</p>
            </div>
            <img src="src/assets/icons8-right-arrow-26.png" className="invert w-10 h-10 mx-4" />
            <div className="flex flex-col items-center w-full">
              <img src="src/assets/1.png" alt="Yellow Coin" className="w-16 h-16 sm:w-32 sm:h-32" />
              <p className="text-xs sm:text-lg text-gray-700 mt-3">{kaeaCoinAmount} Kaea Coin</p>
            </div>
          </div>

          {/* Input & Buttons */}
          <div className="flex flex-col gap-10 w-full sm:w-auto">
            <div className="flex items-center gap-5">
              <button
                className="btn bg-layer-item border-hidden w-16 rounded-badge text-white hover:bg-heavy-color"
                onClick={decreaseCoinAmount}
                disabled={thankCoinAmount <= 0}
              >
                -10
              </button>
              <input
                className="input rounded-badge input-bordered bg-transparent border-heavy-color border-2 hover:border-heavy-color w-full sm:w-64"
                type="number"
                value={thankCoinAmount}
                onChange={handleCoinAmountChange}
                min="1"
                required
                placeholder="Enter Green Coins (ends with 0)"
              />
              <button
                className="btn bg-layer-item border-hidden w-16 rounded-badge text-white hover:bg-heavy-color"
                onClick={increaseCoinAmount}
              >
                +10
              </button>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleOpenConfirmModal}
                disabled={isLoading}
                className="btn bg-layer-item border-hidden w-28 rounded-badge text-white hover:bg-heavy-color"
              >
                {isLoading ? 'Converting...' : 'Convert Coin'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="modal-box bg-bg p-6 rounded-lg shadow-lg w-80 sm:w-96">
            <h3 className="font-bold text-xl text-yellow-600">Confirm Conversion</h3>
            <p className="py-4 text-gray-800">
              Are you sure you want to convert <b>{thankCoinAmount} Thanks Coin</b> to <b>{kaeaCoinAmount} Kaea Coin?</b>
            </p>
            <div className="modal-action flex justify-end gap-4">
              <button
                className="btn btn-error rounded-badge"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-success text-bg rounded-badge"
                onClick={handleConfirmConversion}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="modal-box bg-bg p-6 rounded-lg shadow-lg w-80 sm:w-96">
            <h3 className="font-bold text-xl text-green-600">Conversion Successful</h3>
            <p className="py-4 text-gray-800">
              You have successfully converted <b>{thankCoinAmount}</b> Thanks Coin to <b>{kaeaCoinAmount}</b> Kaea Coin.
            </p>
            <div className="modal-action flex justify-end">
              <button
                className="btn bg-layer-item border-hidden w-28 rounded-badge text-white hover:bg-heavy-color"
                onClick={() => setIsSuccessModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Convert;
