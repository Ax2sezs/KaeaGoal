import React, { useState } from 'react';
import useFetchData from '../APIManage/useFetchData';
import { useAuth } from '../APIManage/AuthContext';

function Test() {
  const { user } = useAuth(); // ดึง user จาก AuthContext
  const { adminUserMissions, allMission = [], error, isLoading, approveMission } = useFetchData(user?.token); // ใช้ custom hook

  const [selectedMission, setSelectedMission] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);

  // เมื่อเลือก mission ให้กรอง user ที่เกี่ยวข้อง
  const handleMissionClick = (mission) => {
    setSelectedMission(mission);
    const users = adminUserMissions.filter(
      (userMission) => userMission.missioN_ID === mission.missioN_ID
    );
    setFilteredUsers(users);
  };

  // Handle approve/reject actions
  const handleAction = async (userMissionId, isApproved) => {
    try {
      if (isApproved) {
        await approveMission(userMissionId); // Call the approve function
        alert('Mission approved successfully!');
      } 

      // After action, filter out the updated mission from the list
      setFilteredUsers((prevUsers) =>
        prevUsers.filter((user) => user.useR_MISSION_ID !== userMissionId)
      );
    } catch (error) {
      console.error('Error handling mission action:', error);
      alert('An error occurred while processing the mission action.');
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Mission List</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {allMission.map((mission) => (
          <div
            key={mission.missioN_ID}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              width: '200px',
              cursor: 'pointer',
            }}
            onClick={() => handleMissionClick(mission)}
          >
            <h3>{mission.missioN_NAME}</h3>
            <p>Type: {mission.missioN_TYPE}</p>
            <p>Reward: {mission.coin_Reward} coins</p>
            <p>Start: {new Date(mission.start_Date).toLocaleDateString()}</p>
            <p>End: {new Date(mission.expire_Date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      {selectedMission && (
        <div style={{ marginTop: '20px' }}>
          <h2>Selected Mission: {selectedMission.missioN_NAME}</h2>
          <h3>Users in this Mission:</h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>User ID</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Status</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Accepted Date</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Completed Date</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.useR_MISSION_ID}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.a_USER_ID}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.verification_Status}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {new Date(user.accepted_Date).toLocaleString()}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {new Date(user.completed_Date).toLocaleString()}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    <button
                      className="btn btn-accent"
                      onClick={() => handleAction(user.useR_MISSION_ID, true)}
                      disabled={user.verification_Status === 'Approved' || user.verification_Status === 'Rejected'} // Disable if already approved or rejected
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={() => handleAction(user.useR_MISSION_ID, false)}
                      disabled={user.verification_Status === 'Approved' || user.verification_Status === 'Rejected'} // Disable if already approved or rejected
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Test;
