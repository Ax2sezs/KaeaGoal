import React from 'react';
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';

function MissionCard({ onSelectMission }) {
  const { user } = useAuth();
  const { allMission = [], error, isLoading } = useFetchData(user?.token);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-button-text">Mission Cards</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : allMission.length === 0 ? (
        <p>No missions available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allMission.map((mission) => (
            <div
              key={mission.missioN_ID}
              className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => onSelectMission(mission)} // Pass mission details on click
            >
              <img src={mission.missionImages[0]} alt="Mission" />
              <h3 className="text-xl font-semibold text-gray-800">{mission.missioN_NAME}</h3>
              <p className="text-sm text-gray-600">{mission.missioN_TYPE}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MissionCard;
