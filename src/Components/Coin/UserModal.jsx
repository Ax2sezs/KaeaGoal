import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

export const ErrorModal = ({ error, onClose }) => (
  <dialog id="error_modal" className="modal">
    <div className="modal-box bg-red-500 text-white text-center">
      <h1 className='text-bg'><CloseOutlinedIcon fontSize='large' className='animate-bounce' /></h1>
      <h3 className="text-xl font-bold">{error}</h3>
      <button
        className="btn border-bg bg-bg rounded-badge text-red-500 mt-3 border-hidden hover:transition-transform hover:scale-105 hover:bg-bg"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </dialog>
);

export const SuccessModal = ({ onClose }) => (
  <dialog id="success_modal" className="modal">
    <div className="modal-box bg-green-500 text-white text-center">
      <h1 className='text-bg'><CheckIcon fontSize='large' className='animate-bounce' /></h1>
      <h3 className="text-xl font-bold">Give coin Successfully!</h3>
      <p>You have successfully give coin...</p>
      <button
        className="btn border-bg bg-bg rounded-badge text-green-500 mt-3 border-hidden hover:transition-transform hover:scale-105 hover:bg-bg"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </dialog>
);

export const UserCoinModal = ({ 
  user, 
  coinValue, 
  desText, 
  isConfirmed, 
  coinBalance,
  onCoinChange,
  onTextChange,
  onConfirmChange,
  onGiveCoin,
  onClose
}) => (
  <dialog id={`modal-${user.a_USER_ID}`} className="modal">
    <div className="modal-box bg-bg">
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40 flex justify-center items-center">
          <img
            src={user?.imageUrls || 'profile.png'}
            className="w-full h-full rounded-full object-cover"
            alt="User Profile"
          />
        </div>
        <h3 className="font-bold text-lg text-center mt-5 text-button-text">To {user.displayName}</h3>
      </div>
      <div className="py-4">
        <label className="block mb-2 font-medium text-center text-button-text">Enter Coin Amount (1-10)</label>
        <input
          type="number"
          className="input input-bordered w-full bg-bg border-heavy-color"
          value={coinValue}
          onChange={onCoinChange}
          onKeyDown={(e) => {
            if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
              e.preventDefault();
            }
          }}
          inputMode="numeric"
        />
        <label className="block my-2 font-medium text-center text-button-text">Message</label>
        <input 
          type="text" 
          className="input input-bordered w-full bg-bg text-button-text"
          value={desText}
          maxLength={200}
          placeholder="Tell Something"
          onChange={onTextChange}
        />

        {coinBalance >= coinValue && (
          <div className="mt-4 flex items-center justify-center">
            <input
              type="checkbox"
              id={`confirm-${user.a_USER_ID}`}
              className="checkbox mr-2 border-button-text"
              checked={isConfirmed}
              onChange={onConfirmChange}
            />
            <label htmlFor={`confirm-${user.a_USER_ID}`} className="font-medium text-button-text">
              Coin given to {user.user_Name}: {coinValue} coins!
            </label>
          </div>
        )}
      </div>
      <div className="modal-action">
        <button
          className="btn bg-[#54d376] border-none w-24 rounded-badge text-white hover:bg-[#43af60]"
          disabled={!isConfirmed || !coinValue || coinBalance < coinValue}
          onClick={onGiveCoin}
        >
          Confirm
        </button>
        <button
          className="btn bg-[#ff6060] border-none w-24 rounded-badge text-white hover:bg-[#d44141]"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  </dialog>
);