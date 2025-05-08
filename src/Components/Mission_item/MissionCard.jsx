import React from 'react';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import GroupIcon from '@mui/icons-material/Group';
import CountdownTimer from './CountdownTimer'

const MissionCard = ({ item, onClick }) => {
  const now = new Date();
  const isExpired = item?.expire_Date ? new Date(item.expire_Date) < now : false;
  const isFull = item?.current_Accept >= item?.accept_limit;
  const isComing = item?.start_Date ? new Date(item.start_Date) > now : false;

  return (
    <div
      className={`relative w-full h-auto flex flex-col justify-center items-center bg-bg rounded-xl shadow-lg 
        ${!isExpired && !isFull && !isComing ? "hover:scale-105 transition-transform duration-300 ease-in-out" : ""}`}
      onClick={() => !isExpired && !isFull && !isComing && onClick(item)}
      style={{ position: "relative" }}
    >
      {/* Overlay for FULL and COMING SOON */}
      {(isFull || isComing) && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center rounded-xl z-10">
          <span className="text-white font-bold text-xl">
            {isFull ? "FULL" : `COMING SOON (${item?.start_Date ? new Date(item.start_Date).toLocaleDateString('th-TH') : 'No Date'})`}
          </span>
        </div>
      )}

      <div className="relative w-full h-48 rounded-t-2xl overflow-hidden">
        <img
          src={item?.missionImages?.[0]}
          alt={item?.missioN_NAME || 'Mission'}
          className="w-full h-full object-cover"
        />
      </div>

      {item?.is_Public && (
        <div className='absolute top-2 left-2 flex items-center'>
          <span className="flex flex-row text-sm justify-center items-center gap-2 bg-bg rounded-badge px-2 py-1 text-red-500 font-bold">
            <WorkspacePremiumIcon />
            Public to Community
          </span>
        </div>
      )}

      <div className='absolute bottom-20 right-2 flex items-center'>
        <span className={`flex flex-row text-sm justify-center items-center gap-2 bg-bg rounded-badge px-2 py-1 ${isFull ? 'text-red-600' : 'text-green-600'}`}>
          <GroupIcon /> {item?.current_Accept.toLocaleString()}/{item?.accept_limit.toLocaleString()}
        </span>
      </div>

      <div className='absolute top-2 right-2 flex items-center'>
        <span className={`flex flex-row text-sm justify-center items-center gap-2 bg-bg rounded-badge px-2 py-1 font-bold ${isFull ? 'text-red-600' : 'text-green-600'}`}>
          <img src={item.missioN_TypeCoin === 1 ? './3.png' : './1.png'} alt="Coin Icon" className="w-6 h-6" />
          {item?.mission_Point.toLocaleString() || 0} {item.missioN_TypeCoin === 1 ? 'Thanks' : 'Gae'}
        </span>
      </div>

      <div className="p-3 w-full flex flex-col justify-between">
        <div className='flex flex-row w-full justify-between'>
          <h2 className="text-lg text-black font-bold truncate text-left w-52 lg:w-72">
            {item?.missioN_NAME || 'N/A'}
          </h2>
          {/* <p className="text-xs truncate text-left w-52">{item?.description || 'No description available.'}</p> */}
          <p className="text-lg text-button-text text-end">{item?.missioN_TYPE || 'N/A'}</p>

        </div>
        <div className='flex flex-row justify-between'>
          <p className="text-sm truncate text-left text-button-text">{item?.participate_Type || 'No description available.'}</p>
          <div className={`text-sm ${isExpired ? 'text-red-600' : 'text-gray-600'}`}>
            {/* Exp:{item?.expire_Date ? new Date(item.expire_Date).toLocaleDateString('th-TH') : 'No Date'} */}
            <CountdownTimer expireDate={item.expire_Date} />
          </div>
          {/* <div className={`text-xs ${isComing ? 'text-blue-600' : 'text-gray-600'}`}>
            Start: {item?.start_Date ? new Date(item.start_Date).toLocaleDateString() : 'No Date'}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MissionCard;
