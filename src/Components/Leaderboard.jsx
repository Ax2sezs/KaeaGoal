import React, { useState, useEffect } from 'react';
import { useAuth } from './APIManage/AuthContext';  // Assuming this is your custom hook/context
import useFetchData from './APIManage/useFetchData';  // Import the merged custom hook

function Leaderboard() {
  const { user } = useAuth();

  // Initialize leaderItem as an empty array, then set data when fetched
  const [leaderItem, setLeaderItem] = useState([]);

  // Fetch leaderboard data
  const { leaderboard = [], error, isLoading, fetchLeaderboard, toptenLeaderboard, myranking, fetchMyLeaderboard, fetchToptenLeaderboard } = useFetchData(user?.token);

  const medalImages = [
    './1st.png',
    './2nd.png',
    './3rd.png',
  ];
  // Refetch on token change
  useEffect(() => {
    if (user?.token) {
      fetchToptenLeaderboard()
    }
  }, [user?.token, fetchToptenLeaderboard]);

  // Use Effect to update leaderItem when leaderboard data changes
  useEffect(() => {
    if (toptenLeaderboard.length > 0) {
      setLeaderItem(toptenLeaderboard);
    }
  }, [toptenLeaderboard]);

  if (isLoading) return <div className="text-center text-gray-500">
    <span className="loading loading-dots loading-lg"></span>
  </div>;

  if (error) return <p className="text-red-500">Error: {error.message || 'An error occurred'}</p>;

  return (
    <div className="bg-bg w-full sm:w-full rounded-2xl p-3 mb-16 sm:mb-0">
      <h1 className='text-2xl text-layer-item font-bold'>LEADERBOARD</h1>
      <div className="overflow-x-auto">
        <h1 className='text-xl text-gray-800 mt-3'>*Sum of Kae Coin</h1>
        <div className='flex flex-col justify-center items-center'>
          <hr className="h-px mt-3 bg-gray-200 border-0 dark:bg-gray-400 w-full" />
        </div>

        {/* <div className='relative grid grid-cols-3 gap-4 my-2 sm:grid-cols-3 sm:gap-4 sm:my-2'>
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
            <p className='text-lg text-gray-700'>{leaderItem[0]?.user_Name || 'Anonymous'}</p>
          </div>

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
            <p className='text-lg text-gray-600'>{leaderItem[1]?.user_Name || 'Anonymous'}</p>
          </div>

          <div className='flex flex-col items-center col-start-3 row-start-2 mt-16 sm:col-start-3 sm:row-start-2 sm:mt-16'>
            <div className='relative'>
              <img
                className='w-24 h-24 rounded-full mb-3 border-4 border-gray-400 object-cover'
                src={leaderItem[2]?.imageUrls}
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
            <p className='text-lg text-gray-600'>{leaderItem[2]?.user_Name || 'Anonymous'}</p>
          </div>
        </div> */}

        <div className='bg-layer-background rounded-2xl p-2 border-hidden overflow-hidden mt-2'>
          <table className="table w-full">
            <thead>
              <tr>
                <th className='text-xl text-button-text w-11'>Rank</th>
                <th className='text-xl'></th>
                <th className='text-xl text-button-text'>Name</th>
                <th className='text-xl text-button-text'>Points</th>
              </tr>
            </thead>
            <tbody className='bg-bg'>
              {leaderItem.map((item, index) => (
                <tr key={index} className="">
                  <td className='text-xl text-gray-700 w-11'>#{item.rank}</td>
                  <td>
                    <img src={item?.imageUrls || './profile.png'} className='w-10 h-10 object-cover rounded-full' />
                  </td>
                  <td>
                    <p className='text-sm text-gray-600 truncate'>{item?.user_Name || 'Anonymous'}</p>
                  </td>
                  <td className='text-sm text-end text-gray-800'>{item?.point}</td>
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
