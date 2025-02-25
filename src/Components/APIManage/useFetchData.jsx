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
  const [Reward, setReward] = useState([]);
  const [adminReward, setAdminReward] = useState([]);
  const [userReward, setUserReward] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [history, setHistory] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch data function
  const fetchData = useCallback(async () => {
    if (!token) {
      setError('Token is missing or invalid');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Fetch user details
      const userResponse = await api.get('/Auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched user data:', userResponse.data);
      const { a_USER_ID, logoN_NAME } = userResponse.data;

      // Store data in localStorage
      if (a_USER_ID && logoN_NAME) {
        localStorage.setItem('a_USER_ID', a_USER_ID);
        localStorage.setItem('logoN_NAME', logoN_NAME);
      }

      setUserDetails(userResponse.data);

      // Fetch coin details
      const coinResponse = await api.get('/Coin/Coin-Balance', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoinDetails(coinResponse.data);
      try {
        const missionResponse = await api.get('/Mission/Get-All-Mission', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllMission(missionResponse.data || []);
      } catch (err) {
        if (err.response?.status === 404) {
          console.warn('No missions available.');
          setAllMission([]); // Treat 404 as no data
        } else {
          throw err; // Rethrow other errors
        }
      }
      try {
        const userResponse = await api.get('/Auth/Get-All-User', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlluserDetail(userResponse.data || []);
      } catch (err) {
        if (err.response?.status === 404) {
          console.warn('No missions available.');
          setAlluserDetail([]); // Treat 404 as no data
        } else {
          throw err; // Rethrow other errors
        }
      }

      // Fetch missions
      try {
        setIsLoading(true);
        const missionResponse = await api.get('/Mission/Get-Unaccepted-Mission', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMissions(missionResponse.data || []);
      } catch (err) {
        if (err.response?.status === 404) {
          console.warn('No unaccepted missions available.');
          setMissions([]); // Treat 404 as no data
        } else {
          throw err; // Rethrow other errors
        }
      }

      try {
        // Attempt to fetch user missions
        const userMissions = await api.get('/Mission/User-Mission', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserMission(userMissions.data || []);
      } catch (err) {
        // Handle 404 or other errors gracefully
        if (err.response?.status === 404) {
          console.warn('User missions endpoint not found.');
          setUserMission([]); // Set empty user missions
        } else {
          throw err; // Rethrow other errors
        }
      }

      try {
        // Attempt to fetch user missions
        const completeMissions = await api.get('/Mission/Get-Completed-Mission', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompleteMission(completeMissions.data || []);
      } catch (err) {
        // Handle 404 or other errors gracefully
        if (err.response?.status === 404) {
          console.warn('User missions endpoint not found.');
          setCompleteMission([]); // Set empty user missions
        } else {
          throw err; // Rethrow other errors
        }
      }
      try {
        const ApproveQR = await api.get('Mission/Get-Approve-QRCode-Mission', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApproveQR(ApproveQR.data || []);
      } catch (err) {
        if (err.response?.status === 403) {
          console.warn('Access forbidden for this user. Skipping error.');
          setApproveQR([]); // Gracefully handle the case by setting a default state
        } else if (err.response?.status === 404) {
          console.warn('Mission not found.');
          setApproveQR([]);
        } else {
          throw err; // Rethrow unexpected errors
        }
      }
      try {
        const ApprovePhoto = await api.get('Mission/Get-All-Approve-Photo-Mission', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApprovePhoto(ApprovePhoto.data || []);
      } catch (err) {
        if (err.response?.status === 403) {
          console.warn('Access forbidden for this user. Skipping error.');
          setApprovePhoto([]); // Gracefully handle the case by setting a default state
        } else if (err.response?.status === 404) {
          console.warn('Mission not found.');
          setApprovePhoto([]);
        } else {
          throw err; // Rethrow unexpected errors
        }
      }
      try {
        const adminUserMissions = await api.get('Mission/Admin-Get-User-Mission', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminUserMissions(adminUserMissions.data || []);
      } catch (err) {
        if (err.response?.status === 403) {
          console.warn('Access forbidden for this user. Skipping error.');
          setAdminUserMissions([]); // Gracefully handle the case by setting a default state
        } else if (err.response?.status === 404) {
          console.warn('Mission not found.');
          setAdminUserMissions([]);
        } else {
          throw err; // Rethrow unexpected errors
        }
      }
      try {
        const rewardResponse = await api.get('/Reward/Get-All-Reward', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReward(rewardResponse.data || []); // Safely handle empty or undefined response data
      } catch (err) {
        if (err.response?.status === 404) {
          console.warn('No missions available.');
          setReward([]); // Treat 404 as no data
        } else {
          console.error('An unexpected error occurred:', err); // Log the error for debugging
          setReward([]); // Optionally, you can set the reward to an empty array here
        }
      }
      try {
        const responseReward = await api.get('/Reward/Admin-Get-All-User-Reward', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminReward(responseReward.data || []); // Safely handle empty or undefined response data
      } catch (err) {
        if (err.response?.status === 404) {
          console.warn('No reward available.');
          setAdminReward([]); // Treat 404 as no data
        } else {
          console.error('An unexpected error occurred:', err); // Log the error for debugging
          setAdminReward([]); // Optionally, you can set the reward to an empty array here
        }
      }
      try {
        const responseReward = await api.get('/Reward/Get-User-Reward', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserReward(responseReward.data || []); // Safely handle empty or undefined response data
      } catch (err) {
        if (err.response?.status === 404) {
          console.warn('No reward available.');
          setUserReward([]); // Treat 404 as no data
        } else {
          console.error('An unexpected error occurred:', err); // Log the error for debugging
          setUserReward([]); // Optionally, you can set the reward to an empty array here
        }
      }

      try {
        const responseLeader = await api.get('Leaderboard/Get-Current-Leaderboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaderboard(responseLeader.data || []); // Safely handle empty or undefined response data
      } catch (err) {
        if (err.response?.status === 404) {
          console.warn('No reward available.');
          setLeaderboard([]); // Treat 404 as no data
        } else {
          console.error('An unexpected error occurred:', err); // Log the error for debugging
          setLeaderboard([]); // Optionally, you can set the reward to an empty array here
        }
      }
      try {
        // Fetch Transaction History
        const responseHistory = await api.get('Coin/Recent-Transaction', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(responseHistory.data || []);
      } catch (err) {
        if (err.response?.status === 404) {
          console.warn('No history available.');
          setHistory([]); // Treat 404 as no data
        } else {
          console.error('An unexpected error occurred:', err);
          setHistory([]); // Optionally set empty array on error
        }
      }


      setSuccess('Data fetched successfully!');
    } catch (err) {
      setError('Failed to fetch data');
      console.error('API Error:', err.response?.data || err);

      // Redirect to login on token failure
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, navigate]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refetch function
  const refetch = useCallback(() => {
    setIsLoading(true);
    fetchData();
  }, [fetchData]);


  const login = async (logoN_NAME, useR_PASSWORD) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');
  
      // ส่งข้อมูล login ไปที่ API
      const response = await api.post('/Auth/login', { logoN_NAME, useR_PASSWORD });
  
      // ดึง token, a_USER_ID, และ logoN_NAME จาก response
      const { token: { accessToken: token }, a_USER_ID, logoN_NAME: fetchedUserName } = response.data;
  
      // เก็บ token และข้อมูลผู้ใช้ใน localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('a_USER_ID', a_USER_ID);
      localStorage.setItem('logoN_NAME', fetchedUserName);
  
      // อัปเดตข้อมูลผู้ใช้ใน state
      setUserDetails({ a_USER_ID, logoN_NAME: fetchedUserName });
      setSuccess('Login successful!');
  
      // แสดง Loading หรือ Logo ก่อนที่จะไปหน้า Home
      setIsLoading(true); // Set isLoading to true for loading screen
  
      // Add a small delay to show loading
      setTimeout(() => {
        // นำทางไปหน้า Home
        navigate('/home');
        window.location.reload();  // Refresh หน้าเมื่อ Login สำเร็จ
      }, 1500); // Delay of 1.5 seconds (adjust as needed)
  
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
      setSuccess("Password changed successfully!");
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
    createMission,
    approveMission,
    convertCoin,
    approvePhoto,
    giveCoin,
    createReward,
    acceptReward,
    rewardStatus,
    refetch,
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
    adminUserMissions,
    alluserDetail,
    Reward,
    adminReward,
    userReward,
    leaderboard,
    history,

  };
};

export default useFetchData;
