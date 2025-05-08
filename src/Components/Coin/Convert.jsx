import React, { useState, useEffect, useRef } from 'react';
import useFetchData from '../APIManage/useFetchData';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../APIManage/AuthContext';
import CheckIcon from '@mui/icons-material/Check';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';

const Convert = () => {
  const [thankCoinAmount, setThankCoinAmount] = useState(0);
  const [kaeaCoinAmount, setKaeaCoinAmount] = useState(0);
  const [currentThankCoinBalance, setCurrentThankCoinBalance] = useState(0);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const { user } = useAuth();
  const { coinDetails, convertCoin, error, isLoading, fetchCoinDetails } = useFetchData(user?.token);
  const navigate = useNavigate();

  const confirmModalRef = useRef(null);
  const successModalRef = useRef(null);
  const errorModalRef = useRef(null);

  // Refetch on token change
  useEffect(() => {
    if (user?.token) {
      fetchCoinDetails();
    }
  }, [user?.token, fetchCoinDetails]);

  // ตรวจสอบว่า coinDetails พร้อมใช้งานหรือยัง
  useEffect(() => {
    if (coinDetails && coinDetails.thankCoinConvert !== undefined) {
      setCurrentThankCoinBalance(coinDetails.thankCoinConvert);
    }
  }, [coinDetails]);

  const calculateKaeaCoins = (thankCoinAmount) => {
    const exchangeRate = 10;
    return thankCoinAmount / exchangeRate;
  };

  const handleCoinAmountChange = (e) => {
    const amount = e.target.value;
    if (amount === '' || /^[0-9]*0$/.test(amount)) {
      setThankCoinAmount(Number(amount));
      setKaeaCoinAmount(calculateKaeaCoins(Number(amount)));
    }
  };

  const isDisabled = thankCoinAmount <= 0; // ตรวจสอบว่าค่าที่ใส่มาเป็น 0 หรือติดลบ

  const handleOpenConfirmModal = () => {
    confirmModalRef.current.showModal();
  };

  const handleConfirmConversion = async () => {
    try {
      await convertCoin(thankCoinAmount);
      confirmModalRef.current.close();
      setIsSuccessModalOpen(true);
      setThankCoinAmount("");
      setKaeaCoinAmount(0);
      fetchCoinDetails();
      setTimeout(() => {
        successModalRef.current.showModal();
      }, 500);
    } catch (err) {
      confirmModalRef.current.close();
      errorModalRef.current.showModal();
    }
  };

  const increaseCoinAmount = () => {
    setThankCoinAmount((prevAmount = 0) => {
      const maxAmount = coinDetails?.thankCoinConvert || 0;
      const newAmount = prevAmount + 10;

      if (newAmount <= maxAmount) {
        setKaeaCoinAmount(calculateKaeaCoins(newAmount));
        setCurrentThankCoinBalance((prevBalance) => maxAmount - newAmount);
        return newAmount;
      } else {
        return prevAmount;
      }
    });
  };

  const decreaseCoinAmount = () => {
    setThankCoinAmount((prevAmount = 0) => {
      const maxAmount = coinDetails?.thankCoinConvert || 0;
      const newAmount = prevAmount - 10;

      if (newAmount >= 0) {
        setKaeaCoinAmount(calculateKaeaCoins(newAmount));
        setCurrentThankCoinBalance((prevBalance) => maxAmount - newAmount);
        return newAmount;
      } else {
        return prevAmount;
      }
    });
  };

  if (isLoading || !coinDetails) {
    return <div className="text-center text-gray-500"><span className="loading loading-dots loading-lg"></span></div>;
  }

  return (
    <div>
      <div className="bg-bg w-full rounded-2xl p-3 sm:p-10">
        <div className="flex flex-col justify-center items-center gap-6">
          <div className="flex flex-col">
            <div className="flex flex-row justify-center items-center gap-2">
              <p className="text-4xl text-green-500 font-bold">{coinDetails.thankCoinConvert.toLocaleString()}</p>
              <img src="./2.png" className="w-10 h-10" />
            </div>
            <div className='flex flex-row gap-3 mt-5'>
              <h1 className='text-red-500 text-lg font-bold'>*Ratio</h1>
              <div className='flex flex-row gap-3'>
                <h1 className='text-green-500 text-lg font-bold'>10</h1>
                  <img src="./2.png" className='w-5 h-5' />
              </div>
              =
              <div className='flex flex-row gap-3'>
                <h1 className='text-yellow-500 text-lg font-bold'>1</h1>
                <img src='./1.png' className='w-5 h-5'/>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between w-full gap-5">
            <img src="./2.png" alt="Green Coin" className="w-16 h-16 sm:w-24 sm:h-24" />
            <p className="text-xl sm:text-lg text-green-500 font-bold mt-3">{currentThankCoinBalance.toLocaleString()}</p>
            <p className="text-xl sm:text-lg text-green-500 font-bold mt-3">Thank Coin</p>
          </div>
          <div className="divider"><ExpandMoreOutlinedIcon /></div>
          <div className="flex flex-row items-center justify-between w-full">
            <img src="./1.png" alt="Yellow Coin" className="w-16 h-16 sm:w-24 sm:h-24" />
            <p className="text-xl sm:text-lg text-yellow-500 font-bold mt-3">{kaeaCoinAmount.toLocaleString()}</p>
            <p className="text-xl sm:text-lg text-yellow-500 font-bold mt-3">Kaea Coin</p>
          </div>

          {/* ส่วนของปุ่มและอินพุต */}
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
                readOnly
                placeholder="Thanks Coin"
              />
              <button
                className="btn bg-layer-item border-hidden w-16 rounded-badge text-white hover:bg-heavy-color disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={increaseCoinAmount}
                disabled={thankCoinAmount + 10 > coinDetails.thankCoinConvert}
              >
                +10
              </button>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleOpenConfirmModal}
                disabled={isLoading || isDisabled}
                className="btn bg-layer-item border-hidden w-28 rounded-badge text-white hover:bg-heavy-color"
              >
                {isLoading ? 'Converting...' : 'Convert Coin'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <dialog ref={confirmModalRef} className="modal">
        <div className="modal-box bg-bg p-6 rounded-lg shadow-lg w-80 sm:w-96">
          <h3 className="font-bold text-xl text-button-text">Confirm Conversion</h3>
          <div className='flex flex-col'>
            <div className='flex flex-row justify-between items-center'>
              <div className=''>
                <img src='./2.png' className='w-20 h-20' />
                <p className='text-center text-green-500 mt-3'>{thankCoinAmount}</p>
              </div>
              <div>
                <ChevronRightOutlinedIcon />
              </div>
              <div className=''>
                <img src='./1.png' className='w-20 h-20' />
                <p className='text-center text-yellow-500 mt-3'>{kaeaCoinAmount}</p>
              </div>
            </div>
          </div>
          <div className="divider"></div>

          <p className="py-4 text-button-text text-center">
            Are you sure you want to convert <br /><b className='text-green-500'>{thankCoinAmount} Thanks Coin</b> to <b className='text-yellow-500'>{kaeaCoinAmount} Kaea Coin?</b>
          </p>
          <div className="modal-action flex justify-end gap-4">
            <button
              className="btn btn-success text-bg rounded-badge"
              onClick={handleConfirmConversion}
            >
              Confirm
            </button>
            <button
              className="btn btn-error btn-outline rounded-badge"
              onClick={() => confirmModalRef.current.close()}
            >
              Cancel
            </button>
          </div>
        </div>
      </dialog>

      {/* Success Modal */}
      <dialog ref={successModalRef} className="modal">
        <div className="modal-box bg-green-500 text-white text-center">
          <h1 className='text-bg'><CheckIcon fontSize='large' className='animate-bounce' /></h1>
          <h3 className="text-xl font-bold">Converted Successfully!</h3>
          <p>You have successfully converted coin...</p>
          <button
            className="btn border-bg bg-bg rounded-badge text-green-500 mt-3 hover:bg-bg"
            onClick={() => successModalRef.current.close()}
          >
            Close
          </button>
        </div>
      </dialog>

      {/* Error Modal */}
      <dialog ref={errorModalRef} className="modal">
        <div className="modal-box bg-red-500 text-white text-center">
          <h1 className='text-bg'><CloseOutlinedIcon fontSize='large' className='animate-bounce' /></h1>
          <h3 className="text-xl font-bold">Not enough Thanks coin</h3>
          <button
            className="btn border-bg bg-bg rounded-badge text-red-500 mt-3 hover:bg-bg"
            onClick={() => errorModalRef.current.close()}
          >
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default Convert;
