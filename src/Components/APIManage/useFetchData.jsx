import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const useFetchData = (token) => {
  const [userDetails, setUserDetails] = useState(null);
  const [coinDetails, setCoinDetails] = useState(null);
  const [alluserDetail, setAlluserDetail] = useState([]);
  const [missions, setMissions] = useState([]);
  const [userMission, setUserMission] = useState([]);
  const [completeMission, setCompleteMission] = useState([]);
  const [allMission, setAllMission] = useState([]);
  const [ApproveQR, setApproveQR] = useState([]);
  const [adminUserMissions, setAdminUserMissions] = useState([]);
  const [ApprovePhoto, setApprovePhoto] = useState([]);
  const [ApproveText, setApproveText] = useState([]);
  const [Reward, setReward] = useState([]);
  const [adminReward, setAdminReward] = useState([]);
  const [userReward, setUserReward] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [toptenLeaderboard,setToptenLeaderboard] =useState([])
  const [myranking,setMyranking] = useState([])
  const [history, setHistory] = useState([]);
  const [filteredUserDetail, setFilteredUserDetail] = useState([])
  const [filterByDept,setFilterByDept] = useState([])
  const [department,setDepartments] = useState([])
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const fetchUserDetails = useCallback(async () => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }

    try {
      setIsLoading(true);
      const userResponse = await api.get('/Auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { a_USER_ID, logoN_NAME } = userResponse.data;

      if (a_USER_ID && logoN_NAME) {
        localStorage.setItem('a_USER_ID', a_USER_ID);
        localStorage.setItem('logoN_NAME', logoN_NAME);
      }

      setUserDetails(userResponse.data);
      setSuccess('User details fetched successfully!');
    } catch (err) {
      setError('Failed to fetch user details');
      console.error('API Error:', err.response?.data || err);

      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, navigate]);

  const fetchCoinDetails = useCallback(async () => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }

    try {
      setIsLoading(true);
      const coinResponse = await api.get('/Coin/Coin-Balance', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoinDetails(coinResponse.data);
      setSuccess('Coin details fetched successfully!');
    } catch (err) {
      setError('Failed to fetch coin details');
      console.error('API Error:', err.response?.data || err);

      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, navigate]);

  const fetchAllMissions = useCallback(async () => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }

    try {
      setIsLoading(true);
      const missionResponse = await api.get('/Mission/Get-All-Mission', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllMission(missionResponse.data || []);
      setSuccess('All missions fetched successfully!');
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('No missions available.');
        setAllMission([]);
      } else {
        setError('Failed to fetch all missions');
        console.error('API Error:', err.response?.data || err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchAllUserDetails = useCallback(async () => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }

    try {
      setIsLoading(true);
      const userResponse = await api.get('/Auth/Get-All-User', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlluserDetail(userResponse.data || []);
      setSuccess('All user details fetched successfully!');
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('No users available.');
        setAlluserDetail([]);
      } else {
        setError('Failed to fetch all user details');
        console.error('API Error:', err.response?.data || err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchMissions = useCallback(async () => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }

    try {
      setIsLoading(true);
      const missionResponse = await api.get('/Mission/Get-Unaccepted-Mission', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMissions(missionResponse.data || []);
      setSuccess('Missions fetched successfully!');
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('No unaccepted missions available.');
        setMissions([]);
      } else {
        setError('Failed to fetch missions');
        console.error('API Error:', err.response?.data || err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchUserMissions = useCallback(async () => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }

    try {
      setIsLoading(true);
      const userMissions = await api.get('/Mission/User-Mission', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserMission(userMissions.data || []);
      setSuccess('User missions fetched successfully!');
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('User missions endpoint not found.');
        setUserMission([]);
      } else {
        setError('Failed to fetch user missions');
        console.error('API Error:', err.response?.data || err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchCompleteMissions = useCallback(async () => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }

    try {
      setIsLoading(true);
      const completeMissions = await api.get('/Mission/Get-Completed-Mission', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompleteMission(completeMissions.data || []);
      setSuccess('Complete missions fetched successfully!');
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('No completed missions available.');
        setCompleteMission([]);
      } else {
        setError('Failed to fetch complete missions');
        console.error('API Error:', err.response?.data || err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchApproveQR = useCallback(async () => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }

    try {
      setIsLoading(true);
      const ApproveQR = await api.get('Mission/Get-Approve-QRCode-Mission', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApproveQR(ApproveQR.data || []);
      setSuccess('Approve QR missions fetched successfully!');
    } catch (err) {
      if (err.response?.status === 403) {
        console.warn('Access forbidden for this user. Skipping error.');
        setApproveQR([]);
      } else if (err.response?.status === 404) {
        console.warn('Mission not found.');
        setApproveQR([]);
      } else {
        setError('Failed to fetch approve QR missions');
        console.error('API Error:', err.response?.data || err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchApprovePhoto = useCallback(async () => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }

    try {
      setIsLoading(true);
      const ApprovePhoto = await api.get('Mission/Get-All-Approve-Photo-Mission', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApprovePhoto(ApprovePhoto.data || []);
      setSuccess('Approve photo missions fetched successfully!');
    } catch (err) {
      if (err.response?.status === 403) {
        console.warn('Access forbidden for this user. Skipping error.');
        setApprovePhoto([]);
      } else if (err.response?.status === 404) {
        console.warn('Mission not found.');
        setApprovePhoto([]);
      } else {
        setError('Failed to fetch approve photo missions');
        console.error('API Error:', err.response?.data || err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchApproveText = useCallback(async () => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }

    try {
      setIsLoading(true);
      const ApproveText = await api.get('Mission/Get-All-Approve-Text-Mission', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApproveText(ApproveText.data || []);
      setSuccess('Approve text missions fetched successfully!');
    } catch (err) {
      if (err.response?.status === 403) {
        console.warn('Access forbidden for this user. Skipping error.');
        setApproveText([]);
      } else if (err.response?.status === 404) {
        console.warn('Mission not found.');
        setApproveText([]);
      } else {
        setError('Failed to fetch approve text missions');
        console.error('API Error:', err.response?.data || err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchAdminUserMissions = useCallback(async () => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }

    try {
      setIsLoading(true);
      const adminUserMissions = await api.get('Mission/Admin-Get-User-Mission', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminUserMissions(adminUserMissions.data || []);
      setSuccess('Admin user missions fetched successfully!');
    } catch (err) {
      if (err.response?.status === 403) {
        console.warn('Access forbidden for this user. Skipping error.');
        setAdminUserMissions([]);
      } else if (err.response?.status === 404) {
        console.warn('Mission not found.');
        setAdminUserMissions([]);
      } else {
        setError('Failed to fetch admin user missions');
        console.error('API Error:', err.response?.data || err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchRewards = useCallback(async () => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }

    try {
      setIsLoading(true);
      const rewardResponse = await api.get('/Reward/Get-All-Reward', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReward(rewardResponse.data || []);
      setSuccess('Rewards fetched successfully!');
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('No rewards available.');
        setReward([]);
      } else {
        setError('Failed to fetch rewards');
        console.error('API Error:', err.response?.data || err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchAdminRewards = useCallback(async () => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }

    try {
      setIsLoading(true);
      const responseReward = await api.get('/Reward/Admin-Get-All-User-Reward', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminReward(responseReward.data || []);
      setSuccess('Admin rewards fetched successfully!');
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('No rewards available.');
        setAdminReward([]);
      } else {
        setError('Failed to fetch admin rewards');
        console.error('API Error:', err.response?.data || err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchUserRewards = useCallback(async () => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }

    try {
      setIsLoading(true);
      const responseReward = await api.get('/Reward/Get-User-Reward', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserReward(responseReward.data || []);
      setSuccess('User rewards fetched successfully!');
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('No rewards available.');
        setUserReward([]);
      } else {
        setError('Failed to fetch user rewards');
        console.error('API Error:', err.response?.data || err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchLeaderboard = useCallback(async () => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }

    try {
      setIsLoading(true);
      const responseLeader = await api.get('Leaderboard/Get-Current-Leaderboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaderboard(responseLeader.data || []);
      setSuccess('Leaderboard fetched successfully!');
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('No leaderboard available.');
        setLeaderboard([]);
      } else {
        setError('Failed to fetch leaderboard');
        console.error('API Error:', err.response?.data || err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchToptenLeaderboard = useCallback(async () => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }
    try {
      setIsLoading(true);
      const responseLeader = await api.get('Leaderboard/top10', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToptenLeaderboard(responseLeader.data || []);
      setSuccess('Leaderboard fetched successfully!');
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('No leaderboard available.');
        setToptenLeaderboard([]);
      } else {
        setError('Failed to fetch leaderboard');
        console.error('API Error:', err.response?.data || err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);
  const fetchMyLeaderboard = useCallback(async () => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }
    try {
      setIsLoading(true);
      const responseLeader = await api.get('Leaderboard/ranking/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyranking(responseLeader.data || []);
      setSuccess('Leaderboard fetched successfully!');
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('No leaderboard available.');
        setMyranking([]);
      } else {
        setError('Failed to fetch leaderboard');
        console.error('API Error:', err.response?.data || err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchFilterByDept = useCallback(async (site,departmentName, page = 1, pageSize = 50) => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }
  
    try {
      setIsLoading(true);
      const responseFilter = await api.get('Auth/FilterByDepartment', {
        headers: { Authorization: `Bearer ${token}` },
        params: { site, department: departmentName, page, pageSize },
      });
  
      console.log("API Response:", responseFilter);
  
      // ตรวจสอบว่า responseFilter.data มีโครงสร้างที่ถูกต้องไหม
      if (Array.isArray(responseFilter.data)) {
        setFilterByDept(responseFilter.data); // ถ้า data เป็น array
      } else if (responseFilter.data?.data) {
        setFilterByDept(responseFilter.data.data); // ถ้าข้อมูลอยู่ใน response.data.data
      } else {
        setFilterByDept([]); // ถ้าไม่พบข้อมูลที่ต้องการ
      }
  
      setSuccess('Users fetched successfully!');
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('No Users available.');
        setFilterByDept([]);
      } else {
        setError('Failed to fetch');
        console.error('API Error:', err.response?.data || err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);
  

  
  const fetchDept = useCallback(async (site) => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }
  
    try {
      setIsLoading(true);
      const responseDept = await api.get('Auth/GetDepartmentsBySite', {
        headers: { Authorization: `Bearer ${token}` },
        params: { site }, // ส่ง Site เป็นพารามิเตอร์
      });
  
      // ตรวจสอบว่า response เดินมาถึงหรือไม่
      console.log("API Response:", responseDept);
  
      setDepartments(responseDept.data || []); // ✅ ใช้ตัวแปร setDepartments แทน setFilterByDept
      setSuccess('Departments fetched successfully!');
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('No Departments available.');
        setDepartments([]);
      } else {
        setError('Failed to fetch');
        console.error('API Error:', err.response?.data || err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);
  

  const fetchHistory = useCallback(async () => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }

    try {
      setIsLoading(true);
      const responseHistory = await api.get('Coin/Recent-Transaction', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(responseHistory.data || []);
      setSuccess('History fetched successfully!');
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('No history available.');
        setHistory([]);
      } else {
        setError('Failed to fetch history');
        console.error('API Error:', err.response?.data || err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (logoN_NAME, useR_PASSWORD) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
  
      // ส่งข้อมูล login ไปที่ API
      const response = await api.post('/Auth/login', { logoN_NAME, useR_PASSWORD });
  
      // ดึง token จาก response
      const { token: { accessToken: token } } = response.data;
  
      // เก็บ token ใน localStorage
      localStorage.setItem('token', token);
  
      // ดึงข้อมูลผู้ใช้เพิ่มเติมจาก API /Auth/me (ใช้ token)
      const userResponse = await api.get('/Auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // ดึง a_USER_ID และ logoN_NAME จากการตอบกลับของ /Auth/me
      const { a_USER_ID, logoN_NAME: fetchedUserName } = userResponse.data;
  
      // เก็บข้อมูลผู้ใช้ใน localStorage
      localStorage.setItem('a_USER_ID', a_USER_ID);
      localStorage.setItem('logoN_NAME', fetchedUserName);
        setUserDetails(userResponse.data);
  
      // แสดง Success Message และนำทางไปหน้า Home
      setSuccess('Login successful!');
      setTimeout(() => {
        // นำทางไปหน้า Home
        navigate('/home');
        window.location.reload();  // Refresh หน้าเมื่อ Login สำเร็จ
      }); // Delay of 1.5 seconds (adjust as needed)
  
      return response.data; // คืนค่าข้อมูลเพื่อใช้งานต่อ
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
      console.error('Login Error:', err.response?.data || err);
      throw err;
    } finally {
      setIsLoading(false); // Set loading state to false after the process is finished
    }
  };
  

  const acceptMission = async (missionId, userId) => {
    if (!missionId || !userId) {
      console.error('Missing missionId or userId');
      throw new Error('Mission ID or User ID is missing');
    }

    try {
      console.log('Sending mission accept request:', { missionId, userId });

      const response = await api.post(
        '/Mission/Accept-Mission',
        { a_USER_ID: userId, missioN_ID: missionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Mission accepted successfully!');

      console.log('Mission accepted successfully:', missionId);

      // อัปเดตรายการ missions โดยลบ mission ที่ถูกยอมรับออก
      setMissions((prevMissions) =>
        prevMissions.filter((mission) => mission.missioN_ID !== missionId)
      );

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to accept mission';
      setError(errorMessage);
      console.error('API Error:', errorMessage, err);
      throw err;
    }
  };
  const acceptReward = async (rewardId, userId) => {
    if (!rewardId || !userId) {
      console.error('Missing rewardId or userId');
      throw new Error('Reward ID or User ID is missing');
    }

    try {
      console.log('Sending reward accept request:', { rewardId, userId });

      const response = await api.post(
        '/Reward/Redeem-Reward',
        { a_USER_ID: userId, reward_Id: rewardId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Reward accepted successfully!');

      console.log('Reward accepted successfully:', rewardId);

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to accept Reward';
      setError(errorMessage);
      console.error('API Error:', errorMessage, err);
      throw err;
    }
  };


  // New function to handle mission code execution
  const executeCodeMission = async (missionId, missionCode) => {
    try {
      const response = await api.post(
        '/Mission/Execute-Code-Mission',
        { missionId, missionCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // เช็คว่า API ตอบกลับโดยไม่มีปัญหาจริงๆ ก่อนแสดงข้อความ success
      if (response && response.data) {
        setSuccess('Mission code executed successfully!');
        return response.data;
      } else {
        throw new Error("No response data");
      }
    } catch (err) {
      setError('Failed to execute mission code');
      console.error('API Error:', err.response?.data || err);
      // ให้ข้อมูลผิดพลาดไปยัง UI
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Failed to execute mission code');
      }
      throw err;  // Propagate error for handling in the calling function
    }
  };

  const executeQRMission = async (missionId, userMissionId, qrCode) => {
    try {
      // Log payload for debugging
      console.log("Sending payload:", { missionId, userMissionId, qrCode });

      const response = await api.post(
        '/Mission/Execute-QR-Mission', // Endpoint for executing QR mission
        { missionId, userMissionId, qrCode }, // Include all required fields
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('QR Code mission executed successfully!');
      console.log("API Response:", response.data);
      return response.data;
    } catch (err) {
      setError('Failed to execute QR mission');
      if (err.response) {
        console.error("API Response Error:", err.response.data);
      } else {
        console.error("Error:", err.message);
      }
      throw err;
    }
  };
  const executePhotoMission = async (missionId, userMissionId, imageFiles) => {
    try {
      const formData = new FormData();
      formData.append("missionId", missionId);
      formData.append("userMissionId", userMissionId);

      // Append multiple image files
      imageFiles.forEach((file, index) => {
        formData.append("imageFile", file);
      });

      const response = await api.post(
        "/Mission/Execute-Photo-Mission",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Add token if required
          },
        }
      );

      console.log("Images uploaded successfully:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error uploading images:", err);
      throw err;
    }
  };
  const executeTextMission = async (missionId, userMissionId, text) => {
    try {
      // Log payload for debugging
      console.log("🔹 Sending payload:", { mission_id: missionId, user_mission_id: userMissionId, text });

      // Ensure text is not empty before sending
      if (!text || text.trim() === "") {
        throw new Error("Text cannot be empty");
      }

      const response = await api.post(
        "/Mission/Execute-Text-Mission", // API Endpoint
        { mission_id: missionId, user_mission_id: userMissionId, text }, // JSON Body with correct field names
        { headers: { Authorization: `Bearer ${token}` } } // Auth Header
      );

      if (setSuccess) setSuccess("✅ Text mission executed successfully!");
      console.log("✅ API Response:", response.data);
      return response.data;
    } catch (err) {
      if (setError) setError("❌ Failed to execute text mission");
      console.error("❌ API Error:", err.response?.data || err.message || err);
      console.log("Sending missionId", missionId, "userMissionId", userMissionId, "text", text)

      // Handle API-specific error response
      if (err.response?.data) {
        setError(err.response.data.message || "Failed to execute text mission");
      }

      throw err; // Rethrow error for higher-level handling
    }
  };

  const createMission = async (missionData) => {
    try {
      // Create FormData object
      const formData = new FormData();

      // Append each field to the FormData object
      formData.append('MISSION_NAME', missionData.MISSION_NAME);
      formData.append('MISSION_TYPE', missionData.MISSION_TYPE);
      formData.append('Coin_Reward', missionData.Coin_Reward);
      formData.append('Mission_Point', missionData.Mission_Point);
      formData.append('Start_Date', missionData.Start_Date);
      formData.append('Expire_Date', missionData.Expire_Date);
      formData.append('Description', missionData.Description);
      formData.append('Accept_limit', missionData.Accept_limit)
      formData.append('Is_Limited', missionData.Is_Limited);
      formData.append('Participate_Type', missionData.Participate_Type);

      // Append files (Images)
      missionData.Images.forEach((file) => {
        formData.append('Images', file);
      });

      // Append conditional fields based on MISSION_TYPE
      if (missionData.MISSION_TYPE === 'QR') {
        formData.append('QRCode', missionData.QRCode);
      } else if (missionData.MISSION_TYPE === 'Code') {
        formData.append('Code_Mission_Code', missionData.Code_Mission_Code);
      }

      // Make the API call
      const response = await api.post('/Mission/Admin-Create-Mission', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Mission created successfully!');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create the mission.');
      console.error('Create Mission Error:', err.response?.data || err);
      throw err;
    }
  };
  const createReward = async (rewardData) => {
    console.log("Inside createReward, rewardData:", rewardData);  // Debugging line
    try {
      // Create FormData object to handle image and other reward data
      const formData = new FormData();
      formData.append('REWARD_NAME', rewardData.REWARD_NAME);
      formData.append('REWARD_PRICE', rewardData.REWARD_PRICE);
      formData.append('QUANTITY', rewardData.QUANTITY);
      formData.append('DESCRIPTION', rewardData.DESCRIPTION);

      // Append files if any
      rewardData.ImageFile.forEach((file) => {
        formData.append('ImageFile', file);
      });

      const response = await api.post('/Reward/Admin-Create-Reward', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('API response:', response.data);
      setSuccess('Reward created successfully!');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create the reward.');
      console.error('Create Reward Error:', err.response?.data || err);
      throw err;
    }
  };

  const createUser = async (userData) => {
    try {
      // Prepare the JSON body for the API request
      const userPayload = {
        logoN_NAME: userData.logoN_NAME,
        firstName: userData.firstName,
        lastName: userData.lastName,
        branchCode: userData.branchCode,
        branch: userData.branch,
        stateCode: userData.stateCode,
        deletionStateCode: userData.deletionStateCode,
        isBkk: userData.isBkk,
        isAdmin: userData.isAdmin,
        user_Name: userData.user_Name,
        isshop: userData.isshop,
        issup: userData.issup,
        isQSC: userData.isQSC,
        useR_EMAIL: userData.useR_EMAIL,
        user_Position: userData.user_Position,
        site: userData.site,
      };

      // Make the API call
      const response = await api.post('/Auth/Admin-Register', userPayload, {
        headers: {
          Authorization: `Bearer ${token}`,  // Add token if required for authorization
          'Content-Type': 'application/json',  // Set the content type to JSON
        },
      });

      console.log('User created successfully:', response.data);
      setSuccess('User created successfully!');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create the user.');
      console.error('Create User Error:', err.response?.data || err);
      throw err;
    }
  };

  const approveMission = async (userQRCodeMissionId, approve) => {
    try {
      console.log('Payload:', { userQRCodeMissionId, approve });
      const response = await api.post(
        '/Mission/Admin-Approve-QRCode-Mission',
        { userQRCodeMissionId, approve },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('API Response:', response.data);
      setSuccess('Mission approval processed successfully!');
      return response.data; // Return the API response for further use
    } catch (err) {
      console.error('Approve Mission Error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to process mission approval.');
      throw err; // Re-throw for error handling in the calling component
    }

  };
  const approvePhoto = async (useR_PHOTO_MISSION_ID, approve) => {
    try {
      console.log('Payload:', { useR_PHOTO_MISSION_ID, approve });
      const response = await api.post(
        '/Mission/Admin-Approve-Photo-Mission',
        { useR_PHOTO_MISSION_ID, approve },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('API Response:', response.data);
      setSuccess('Mission approval processed successfully!');
      return response.data; // Return the API response for further use
    } catch (err) {
      console.error('Approve Mission Error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to process mission approval.');
      throw err; // Re-throw for error handling in the calling component
    }

  };
  const approveText = async (useR_TEXT_MISSION_ID, approve) => {
    try {
      console.log('Payload:', { useR_TEXT_MISSION_ID, approve });

      if (!useR_TEXT_MISSION_ID || typeof approve === 'undefined') {
        console.error('Invalid parameters:', { useR_TEXT_MISSION_ID, approve });
        return;
      }

      const response = await api.post(
        '/Mission/Admin-Approve-Text-Mission',
        { useR_TEXT_MISSION_ID, approve },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('API Response:', response.data);
      setSuccess('Mission approval processed successfully!');
      return response.data; // Return the API response for further use
    } catch (err) {
      console.error('Approve Mission Error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to process mission approval.');
      throw err; // Re-throw for error handling in the calling component
    }
  };

  const convertCoin = async (thankCoinAmount) => {
    try {
      console.log('Converting ThankCoin to another type:', { thankCoinAmount });

      const response = await api.post(
        '/Coin/Convert-Coin',
        { thankCoinAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Conversion successful:', response.data);
      setSuccess('Coin conversion successful!');
      return response.data; // ส่งข้อมูลกลับไปใช้ต่อหากจำเป็น
    } catch (err) {
      console.error('Coin Conversion Error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to convert coin.');
      throw err; // ส่งต่อข้อผิดพลาดให้จัดการในที่เรียกใช้
    }
  };

  const giveCoin = async (receiverId, amount) => {
    try {
      // Log the data you are sending for debugging
      console.log('Giving ThankCoin to another user:', { receiverId, amount });

      // Make the API call to give the ThankCoin
      const response = await api.post(
        '/Coin/Give-ThankCoin',
        { receiverId, amount },  // Send the receiver ID and amount in the request body
        { headers: { Authorization: `Bearer ${token}` } }  // Include the token in the headers for authorization
      );

      // Log the successful response for debugging
      console.log('Coin given successfully:', response.data);

      // Set a success message if the request is successful
      setSuccess('Coin given successfully!');

      return response.data; // Return the response data if needed elsewhere in your app
    } catch (err) {
      // Log any errors to the console for debugging
      console.error('Give Coin Error:', err.response?.data || err);

      // Set an error message based on the API response or generic error message
      setError(err.response?.data?.message || 'Failed to give coin.');

      // Throw the error so it can be handled by the caller
      throw err;
    }
  };
  // const addWinnerCoinPhoto = async (a_USER_ID, missioN_ID, amount) => {
  //   try {
  //     console.log("Adding Winner Coin Reward:", { a_USER_ID, missioN_ID, amount });

  //     const response = await api.post(
  //       "/Mission/Missioner-Add-Winners-Coin-Reward-Photo",
  //       { a_USER_ID, missioN_ID, amount }, // JSON Body ที่ API ต้องการ
  //       { headers: { Authorization: `Bearer ${token}` } } // ใช้ Token Authentication
  //     );

  //     console.log("Winner Coin Reward Added Successfully:", response.data);
  //     setSuccess("Winner coin reward added successfully!");

  //     return response.data; // คืนค่าให้ใช้ใน component อื่น ๆ
  //   } catch (err) {
  //     console.error("Add Winner Coin Photo Error:", err.response?.data || err);
  //     setError(err.response?.data?.message || "Failed to add winner coin reward.");
  //     throw err; // ส่งต่อ error ให้ handle ใน component ที่เรียกใช้
  //   }
  // };
  const addAllCoinPhoto = async (mission_ID, amount) => {
    try {
      console.log("Coin Amount:", amount);
      console.log("Mission ID:", mission_ID);

      const response = await api.post(
        `/Mission/Missioner-Add-Batch-Coin-Reward-Photo?Amount=${amount}`, // ส่ง Amount ใน Query
        mission_ID, // ส่ง Mission_ID ใน body ตามที่ Swagger กำหนด
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // เปลี่ยนจาก multipart/form-data เป็น JSON
          },
        }
      );

      console.log("Winner Coin Reward Added Successfully:", response.data);
      setSuccess("Give Coin Reward to All User Successful");
      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error adding coin reward:", err);
      setError("Failed to give coin reward");
      throw err;
    }
  };

  const addAllCoinText = async (mission_ID, amount) => {
    try {
      console.log("Coin Amount:", amount);
      console.log("Mission ID:", mission_ID);

      const response = await api.post(
        `/Mission/Missioner-Add-Batch-Coin-Reward-Text?Amount=${amount}`, // ส่ง Amount ใน Query
        mission_ID, // ส่ง Mission_ID ใน body ตามที่ Swagger กำหนด
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // เปลี่ยนจาก multipart/form-data เป็น JSON
          },
        }
      );

      console.log("Winner Coin Reward Added Successfully:", response.data);
      setSuccess("Give Coin Reward to All User Successful");
      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error adding coin reward:", err);
      setError("Failed to give coin reward");
      throw err;
    }
  };
  const addAllCoinQR = async (mission_ID, amount) => {
    try {
      console.log("Coin Amount:", amount);
      console.log("Mission ID:", mission_ID);

      const response = await api.post(
        `/Mission/Missioner-Add-Batch-Coin-Reward-QRCode?Amount=${amount}`, // ส่ง Amount ใน Query
        mission_ID, // ส่ง Mission_ID ใน body ตามที่ Swagger กำหนด
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // เปลี่ยนจาก multipart/form-data เป็น JSON
          },
        }
      );

      console.log("Winner Coin Reward Added Successfully:", response.data);
      setSuccess("Give Coin Reward to All User Successful");
      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error adding coin reward:", err);
      setError("Failed to give coin reward");
      throw err;
    }
  };

  const addThankCoin = async (userId, amount, description) => {
    try {
      console.log("User ID:", userId);
      console.log("Coin Amount:", amount);
      console.log("Description:", description);

      const response = await api.post(
        `/Coin/Add-THANKCoin`, // URL ของ API
        {
          userId: userId, // ส่ง userId
          amount: amount, // ส่ง amount
          description: description, // ส่ง description
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token สำหรับการยืนยันตัวตน
            "Content-Type": "application/json", // ใช้ Content-Type เป็น JSON
          },
        }
      );

      console.log("Thanks Coin Reward Added Successfully:", response.data);
      setSuccess("Thanks Coin Given Successfully");
      setError(null);
      return response.data;
    } catch (err) {
      console.error("Error giving thanks coin:", err);
      setError("Failed to give thanks coin");
      throw err;
    }
  };


  const rewardStatus = async (useR_REWARD_ID, status) => {
    try {
      // Log the payload for debugging
      console.log('Payload:', { useR_REWARD_ID, status });

      // Check if token is available
      if (!token) {
        throw new Error('Authorization token is missing');
      }

      // Make API call
      const response = await api.put(
        '/Reward/Admin-Change-User-Reward-Status',
        { useR_REWARD_ID, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Handle success
      console.log('API Response:', response.data);
      setSuccess('Change Status successfully!');
      return response.data; // Return the API response for further use
    } catch (err) {
      // Handle errors
      if (err.response) {
        console.error('API Error:', err.response.data);
        setError(err.response.data.message || 'Failed to change status.');
      } else {
        console.error('Unexpected Error:', err.message || err);
        setError('Unexpected error occurred.');
      }
      throw err; // Re-throw for further handling if needed
    }
  };

  const editProfileImg = async (photoFile) => {
    try {
      if (!photoFile) {
        throw new Error("No file selected");
      }

      const formData = new FormData();
      formData.append("photo", photoFile);

      if (!token) {
        throw new Error("Authorization token is missing");
      }

      const response = await api.put("/Auth/Update-Photo-Profile", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("API Response Status:", response.status);
      console.log("API Response Data:", response.data);

      // Check if the response message is what we expect
      if (response.data === "Profile has been updated.") {
        setSuccess("Profile image updated successfully!");
        return response.data;
      } else {
        throw new Error("API responded with failure: " + response.data);
      }
    } catch (err) {
      console.error("Error updating profile image:", err);
      setError("Failed to update profile image.");
      throw err; // Rethrow the error so it can be caught outside if necessary
    }
  };


  const editDisplayName = async (displayName) => {
    try {
      if (!displayName) {
        throw new Error("Display name is required");
      }

      if (!token) {
        throw new Error("Authorization token is missing");
      }

      // Make API call with JSON payload
      const response = await api.put(
        "/Auth/Update-Display-Name",
        { displayName }, // Sending JSON object
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json", // Correct Content-Type
          },
        }
      );

      console.log("API Response:", response.data);
      setSuccess("Display name updated successfully!");
      return response.data; // Return API response
    } catch (err) {
      console.error("Error updating display name:", err);
      setError("Failed to update display name.");
      throw err;
    }
  };
  const resetPassword = async (a_USER_ID) => {
    try {
      // Send userId as a query parameter instead of in the body
      const response = await api.put(
        `/Auth/Admin-Reset-Password?userId=${a_USER_ID}`,
        {}, // Empty body since the ID is in the query
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data); // Log response to inspect it

      if (response.status === 200) {
        setSuccess("Password reset successfully!");
        return true;
      } else {
        setError("Failed to reset password.");
        return false;
      }
    } catch (err) {
      console.error("Error resetting password:", err.response?.data || err.message);
      setError(`Failed to reset password. ${err.response?.data?.message || ""}`);
      throw err; // Rethrow error for handling in the caller function
    }
  };



  const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    try {
      // Make API call with JSON payload (no userId if not required)
      const response = await api.put(
        "/Auth/Change-Password",
        {
          currenT_PASSWORD: currentPassword, // Current password
          password: newPassword,             // New password
          confirM_PASSWORD: confirmPassword  // Confirm new password
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json", // Correct Content-Type
          },
        }
      );

      console.log("API Response:", response.data);
      setSuccess(response.data);
      return response.data; // Return API response
    } catch (err) {
      console.error("Error changing password:", err);
      setError("Failed to change password.");
      throw err;
    }
  };


  const editUserDetail = async (userData) => {
    try {
      if (!userData || !userData.a_USER_ID) {
        throw new Error("User ID is required");
      }

      if (!token) {
        throw new Error("Authorization token is missing");
      }

      console.log("UserData to be sent to API:", userData);  // Log userData before the API call

      const response = await api.put(
        "/Auth/Admin-Update-User-Detail",
        userData, // Sending JSON object
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);  // Log API response
      setSuccess("User details updated successfully!");
      return response.data;
    } catch (err) {
      console.error("Error updating user details:", err);
      setError("Failed to update user details.");
      throw err;
    }
  };

  const fetchFilteredUsers = useCallback(async (filterData) => {
    if (!token) {
      setError('Token is missing or invalid');
      return;
    }
  
    try {
      setIsLoading(true);
      const response = await api.post('/Auth/get-filter-user', filterData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("API Response:", response.data); // ดูว่า API ส่งอะไรมาบ้าง
  
      if (Array.isArray(response.data.items)) {
        const filteredData = response.data.items.map(user => ({
          a_USER_ID: user.a_USER_ID,
          logoN_NAME: user.logoN_NAME,
          firstName: user.firstName,
          lastName: user.lastName,
          branchCode: user.branchCode,
          branch: user.branch,
          user_Name: user.user_Name,
          user_Position: user.user_Position,
          imageUrls: user.imageUrls, // เพิ่ม imageUrls ที่ได้จาก API
        }));
  
        setFilteredUserDetail(filteredData); // เซ็ตข้อมูลที่กรองมา
      } else {
        console.error("Invalid API response format:", response.data);
        setFilteredUserDetail([]); // ถ้าข้อมูลผิด ให้ใช้ []
      }
  
      setSuccess('Filtered user details fetched successfully!');
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('No matching users found.');
        setFilteredUserDetail([]); // ถ้าไม่พบผู้ใช้ ให้ใช้ []
      } else {
        setError('Failed to fetch filtered user details');
        console.error('API Error:', err.response?.data || err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [token]);
  
  

  return {
    userDetails,
    userMission,
    coinDetails,
    missions,
    success,
    error,
    isLoading,
    login,
    acceptMission,
    executeCodeMission,
    executeQRMission,
    executePhotoMission,
    executeTextMission,
    createMission,
    approveMission,
    approveText,
    addAllCoinPhoto,
    addAllCoinText,
    addAllCoinQR,
    convertCoin,
    approvePhoto,
    giveCoin,
    addThankCoin,
    createReward,
    acceptReward,
    rewardStatus,
    fetchFilteredUsers,
    // refetch,
    editProfileImg,
    editDisplayName,
    editUserDetail,
    resetPassword,
    changePassword,
    createUser,
    completeMission,
    allMission,
    ApproveQR,
    ApprovePhoto,
    ApproveText,
    adminUserMissions,
    alluserDetail,
    Reward,
    adminReward,
    userReward,
    leaderboard,
    toptenLeaderboard,
    myranking,
    history,
    filterByDept,
    department,
    fetchUserDetails,
    fetchCoinDetails,
    fetchAllMissions,
    fetchAllUserDetails,
    fetchMissions,
    fetchUserMissions,
    fetchCompleteMissions,
    fetchApproveQR,
    fetchApprovePhoto,
    fetchApproveText,
    fetchAdminUserMissions,
    fetchRewards,
    fetchAdminRewards,
    fetchUserRewards,
    fetchLeaderboard,
    fetchHistory,
    filteredUserDetail,
    fetchToptenLeaderboard,
    fetchMyLeaderboard,
    fetchFilterByDept,
    fetchDept,

  };
};

export default useFetchData;
