import React, { useState } from 'react';
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';

function Coin({ isTableLayout }) {
  const { user } = useAuth();
  const { completeMission = [], error, isLoading } = useFetchData(user?.token);

  if (isLoading) {
    return <div className="text-center text-gray-500">    
    <span className="loading loading-dots loading-lg"></span>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-4">


      {completeMission.length === 0 ? (
        <p className="text-center text-gray-500">No completed missions yet.</p>
      ) : isTableLayout ? (
        // Table Layout
        <div className="overflow-x-auto">
          <table className="table-fixed w-full border-hidden bg-bg rounded-xl">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="w-24"></th>
                <th className="w-28"></th>
                <th className="w-28"></th>

              </tr>
            </thead>
            <tbody>
              {completeMission.map((mission, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-300 text-gray-600"
                >
                  <td className='px-4 py-2'>
                    <img src={mission.mission_Image[0]} className="w-full h-16 object-cover rounded-2xl md:h-32"
                    /></td>
                  <td className="px-4 py-2 truncate">{mission.mission_Name}</td>
                  <td className="px-4 py-2 text-green-600 font-bold">Collected</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Grid Layout
        <div className="grid grid-cols-2 gap-4 items-center p-0 h-auto rounded-xl md:grid-cols-2 lg:grid-cols-4">
          {completeMission.map((mission, index) => (
            <div
              key={index}
              className="flex flex-col bg-bg shadow-xl rounded-2xl overflow-hidden sm:flex-col"
            >
              {/* Image Section */}
              <div className="w-full h-28">
                <img
                  src={mission.mission_Image[0] || 'placeholder-image.jpg'} // Use a placeholder if no image is provided
                  alt={mission.title || 'Mission'}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              {/* Content Section */}
              <div className="flex flex-col justify-between p-2 w-full">
                <div className="flex flex-col">
                  <h2 className="text-xs font-bold truncate sm:text-lg text-left">
                    Mission: {mission.mission_Name}
                  </h2>
                  <p className="text-sm truncate text-left">
                    Mission Type : {mission.mission_Type}
                  </p>
                </div>
                <div className="flex justify-center mt-4 sm:mt-0">
                  <strong className="text-green-600">Collected</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
      }
    </div >
  );
}

export default Coin;
