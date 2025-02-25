import React, { useState, useEffect } from 'react';
import { useAuth } from './APIManage/AuthContext';  // Assuming this is your custom hook/context
import useFetchData from './APIManage/useFetchData';  // Import the merged custom hook

function Leaderboard() {
  const { user } = useAuth();

  // Initialize leaderItem as an empty array, then set data when fetched
  const [leaderItem, setLeaderItem] = useState([]);

  // Fetch leaderboard data
  const { leaderboard = [], error, isLoading } = useFetchData(user?.token);

  const medalImages = [
    'src/assets/1st.png',
    'src/assets/2nd.png',
    'src/assets/3rd.png',
  ];

  // Use Effect to update leaderItem when leaderboard data changes
  useEffect(() => {
    if (leaderboard.length > 0) {
      setLeaderItem(leaderboard);
    }
  }, [leaderboard]);

  if (isLoading) return <div className="text-center text-gray-500">
    <span className="loading loading-dots loading-lg"></span>
  </div>;

  if (error) return <p className="text-red-500">Error: {error.message || 'An error occurred'}</p>;

  return (
    <div className="bg-bg w-full sm:w-full rounded-2xl p-3">
      <h1 className='text-2xl text-layer-item font-bold'>LEADERBOARD</h1>
      <div className="overflow-x-auto">
        <h1 className='text-xl text-gray-800 mt-3'>Top 3 earn special gifts</h1>
        <div className='flex flex-col justify-center items-center'>
          <hr className="h-px mt-3 bg-gray-200 border-0 dark:bg-gray-400 w-full" />
        </div>

        {/* Triangle layout for top 3 with higher placement for 1st */}
        <div className='relative grid grid-cols-3 gap-4 my-2 sm:grid-cols-3 sm:gap-4 sm:my-2'>
          {/* 1st place */}
          <div className='absolute left-1/2 top-0 transform -translate-x-1/2 flex flex-col items-center sm:top-0'>
            <div className='relative'>
              <img
                className='w-28 h-28 rounded-full mb-3 border-4 border-yellow-500 object-cover'
                src={leaderItem[0]?.imageUrls}
                alt={`Profile 1`}
              />
              <img
                className='absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-32'
                src={medalImages[0]}
                alt="Gold Medal"
              />
            </div>
            <p className='text-xl text-gray-700 mt-8'>Points: {leaderItem[0]?.point}</p>
            {/* Display name or placeholder */}
            <p className='text-lg text-gray-700'>{leaderItem[0]?.displayName || 'Anonymous'}</p>
          </div>

          {/* 2nd place */}
          <div className='flex flex-col items-center col-start-1 row-start-2 mt-16 sm:col-start-1 sm:row-start-2 sm:mt-16'>
            <div className='relative'>
              <img
                className='w-24 h-24 rounded-full mb-3 border-4 border-gray-400 object-cover'
                src={leaderItem[1]?.imageUrls}
                alt={`Profile 2`}
              />
              <img
                className='absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-28'
                src={medalImages[1]}
                alt="Silver Medal"
              />
            </div>
            <p className='text-lg text-gray-600 mt-8'>Points: {leaderItem[1]?.point}</p>
            {/* Display name or placeholder */}
            <p className='text-lg text-gray-600'>{leaderItem[1]?.displayName || 'Anonymous'}</p>
          </div>

          {/* 3rd place */}
          <div className='flex flex-col items-center col-start-3 row-start-2 mt-16 sm:col-start-3 sm:row-start-2 sm:mt-16'>
            <div className='relative'>
              <img
                className='w-24 h-24 rounded-full mb-3 border-4 border-gray-400 object-cover'
                src={leaderItem[3]?.imageUrls}
                alt={`Profile 3`}
              />
              <img
                className='absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-24 z-10'
                src={medalImages[2]}
                alt="Bronze Medal"
              />
            </div>
            <p className='text-lg text-gray-600'>#3</p>
            <p className='text-lg text-gray-600'>Points: {leaderItem[2]?.point}</p>
            {/* Display name or placeholder */}
            <p className='text-lg text-gray-600'>{leaderItem[2]?.displayName || 'Anonymous'}</p>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className='bg-layer-background rounded-xl p-2'>
          <table className="table mt-5 w-full">
            <thead>
              <tr>
                <th className='text-2xl text-orange-700'>Rank</th>
                <th className='text-2xl text-orange-700'>Name</th>
                <th className='text-2xl text-orange-700'>Points</th>
              </tr>
            </thead>
            <tbody className='bg-bg'>
              {leaderItem.slice(3).map((item, index) => (
                <tr key={index + 3} className="">
                  <td className='text-xl text-gray-700'>#{index + 4}</td>
                  <td>
                    <p className='text-lg text-gray-600'>{item?.displayName || 'Anonymous'}</p>

                  </td>
                  <td className='text-xl text-gray-800'>{item?.point}</td>
                  {/* Display name or placeholder */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
