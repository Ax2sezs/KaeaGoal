import { React, useEffect } from "react";
import { useAuth } from "../APIManage/AuthContext";
import useFetchData from "../APIManage/useFetchData";

function History() {
  const { user } = useAuth();
  const { history = [], error, isLoading, fetchHistory } = useFetchData(user?.token);

  useEffect(() => {
    if (user?.token) {
      fetchHistory();
    }
  }, [user?.token, fetchHistory]);

  // Define coin icons
  const coinIcons = {
    2: './1.png', // KAEA Coin
    1: './2.png', // Thanks Coin
    3: './3.png',
  };

  return (
    <div className="flex flex-col justify-center items-center p-2 bg-layer-background rounded-xl">
      <div className="w-full bg-bg rounded-xl p-3">
        {isLoading ? (
          <div className="text-center text-gray-500"><span className="loading loading-dots loading-lg"></span></div>
        ) : error ? (
          <div className="text-center text-red-500">Error fetching history</div>
        ) : history.length === 0 ? (
          <div className="text-center text-gray-500">No history</div>
        ) : (
          history
            .filter((item) => item.coin_Type !== 2) // กรองเอาเฉพาะที่ coin_Type ไม่ใช่ 2
            .map((item, index) => (
              <div key={index} className="flex items-center space-x-4 border-b border-gray-200 py-2">
                {/* Title and Description */}
                <div className="flex flex-col flex-grow">
                  <span className="text-xs font-bold text-gray-900 lg:text-sm">
                    {item.transaction_Type}
                  </span>
                  <span className="text-xs text-gray-600 w-44 break-words sm:w-full">
                    {item.description.split(':').map((line, index) => (
                      <>
                        {line.trim()}
                        {index < item.description.split(':').length - 1 && ':'}
                        <br />
                      </>
                    ))}
                  </span>

                </div>

                {/* Date and Points */}
                <div className="flex flex-col items-end relative">
                  <div className="flex flex-col justify-end text-xs text-gray-700">
                    {item.transaction_Date ? (
                      <div className="flex flex-row justify-end gap-1">
                        <span>{new Date(item.transaction_Date).toLocaleDateString('th-TH')}</span>
                        <span>{new Date(item.transaction_Date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
                      </div>
                    ) : (
                      <span>No Date</span>
                    )}
                  </div>

                  {/* Amount & Coin Icon */}
                  <span
                    className={`relative flex flex-row ${Number(item.amount) < 0 ? 'text-red-500' : 'text-green-500'} font-bold gap-2`}
                  >
                    {Number(item.amount).toLocaleString()}

                    <img
                      src={item.transaction_Type === 'Receive from Admin' || item.transaction_Type === 'Receive from Mission' || item.transaction_Type === 'Give' ? coinIcons[3] : coinIcons[item.coin_Type] || coinIcons[2]}
                      alt="coin-icon"
                      className="w-5 h-5"
                    />

                  </span>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default History;
