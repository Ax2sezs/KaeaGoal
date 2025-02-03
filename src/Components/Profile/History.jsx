import React from 'react';

function History() {
  // Sample data
  const data = [
    {
      title: 'Received KAEA Coin',
      status: 'get',
      coin: 'k',
      description: 'Mission : Running',
      date: '2023-12-06',
      time: '10:00 AM',
      points: '50',
    },
    {
      title: 'Give Thanks Coin',
      status: 'give',
      coin: 't',
      description: 'To : Test Test',
      date: '2023-12-05',
      time: '3:30 PM',
      points: '40',
    },
    {
      title: 'Received Thanks Coin',
      status: 'get',
      coin: 't',
      description: 'From : Test123',
      date: '2023-12-04',
      time: '2:15 PM',
      points: '60',
    },
    {
      title: 'Received KAEA Coin',
      status: 'get',
      coin: 'k',
      description: 'Mission : Running',
      date: '2023-12-06',
      time: '10:00 AM',
      points: '50',
    },
    {
      title: 'Give Thanks Coin',
      status: 'give',
      coin: 't',
      description: 'To : Test Test',
      date: '2023-12-05',
      time: '3:30 PM',
      points: '40',
    },
    {
      title: 'Received Thanks Coin',
      status: 'get',
      coin: 't',
      description: 'From : Test123',
      date: '2023-12-04',
      time: '2:15 PM',
      points: '60',
    },
  ];

  const coinIcons = {
    k: 'src/assets/1.png',  // KAEA Coin
    t: 'src/assets/2.png',  // Thanks Coin
  };

  return (
    <div className="flex flex-col justify-center items-center p-4 bg-layer-background rounded-xl">
      <div className="w-full bg-bg rounded-xl p-4">
        {/* Rows */}
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 border-b border-gray-200 py-2"
          >
            {/* <div className="flex justify-center items-center w-4">
              <div
                className={`w-2 h-16 rounded-badge ${item.status === 'get' ? 'bg-green-500' : 'bg-red-500'
                  }`}
              >
              </div>
            </div> */}
            {/* Title and Description */}
            <div className="flex flex-col flex-grow">
              <span className="text-xs font-bold text-gray-900 lg:text-sm">{item.title}</span>
              <span className="text-xs text-gray-600">{item.description}</span>
            </div>
            {/* Date and Points */}
            <div className="flex flex-col items-end relative">
              <span className="text-xs text-gray-700">{item.date}</span>
              <span className="text-xs text-gray-700">{item.time}</span>
              <span
                className={`relative flex flex-row ${item.status === 'get' ? 'text-green-500' : 'text-red-500'
                  } font-bold gap-2`}
              >
                {/* Add coin icon behind points */}
                {item.status === 'get' ? '+' : '-'} {item.points}
                <img
                  src={coinIcons[item.coin]}
                  alt="coin-icon"
                  className=" w-5 h-5 "
                />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
