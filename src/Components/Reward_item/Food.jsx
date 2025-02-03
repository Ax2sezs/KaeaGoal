import React, { useState } from 'react';

function Food() {
  // Sample data
  const data = [
    {
      img: 'src/assets/123.jpg', // Replace with your image URL
      title: 'Cy Ganderton',
      description: 'Quality Control Specialist',
      points: '50 pts',
    },
    {
      img: 'src/assets/ms.jpg',
      title: 'Hart Hagerty',
      description: 'Desktop Support Technician',
      points: '40 pts',
    },
    {
      img: 'src/assets/000.jpg',
      title: 'Brice Swyre',
      description: 'Tax Accountant',
      points: '60 pts',
    },
    {
      img: 'src/assets/123.jpg', // Replace with your image URL
      title: 'Cy Ganderton',
      description: 'Quality Control Specialist',
      points: '50 pts',
    },
    {
      img: 'src/assets/ms.jpg',
      title: 'Hart Hagerty',
      description: 'Desktop Support Technician',
      points: '40 pts',
    },
    {
      img: 'src/assets/000.jpg',
      title: 'Brice Swyre',
      description: 'Tax Accountant',
      points: '60 pts',
    },
    {
      img: 'src/assets/123.jpg', // Replace with your image URL
      title: 'Cy Ganderton',
      description: 'Quality Control Specialist',
      points: '50 pts',
    },
    {
      img: 'src/assets/ms.jpg',
      title: 'Hart Hagerty',
      description: 'Desktop Support Technician',
      points: '40 pts',
    },
    {
      img: 'src/assets/000.jpg',
      title: 'Brice Swyre',
      description: 'Tax Accountant',
      points: '60 pts',
    },
  ];

  // State to track the selected modal
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isModalSuccess, setIsModalSuccess] = useState(false);

  // Handle button click to open modal
  const handleButtonClick = (index) => {
    setSelectedIndex(index);
    setIsModalSuccess(false); // Reset success message
    document.getElementById('my_modal_5').showModal();
  };

  // Handle confirmation click
  const handleConfirm = () => {
    setIsModalSuccess(true);
    setTimeout(() => {
      document.getElementById('my_modal_5').close(); // Close modal after a short delay
    }, 1000);
  };

  return (
    <div className="bg-bg w-full min-h-screen rounded-2xl mb-16 sm:p-3 lg:p-3">
      <div className="grid grid-cols-2 gap-5 items-center p-3 h-auto bg-bg rounded-xl lg:grid-cols-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="relative w-full h-auto flex flex-col justify-center items-center bg-bg rounded-xl shadow-lg  hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <button
              className="relative w-full h-28 rounded-t-2xl overflow-hidden flex group sm:h-40"
              onClick={() => handleButtonClick(index)}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover"
              />

            </button>
            <div className="flex flex-col justify-between p-2 w-full">
              {/* Text Content */}
              <div className="flex flex-col">
                <h2 className="text-xs font-bold truncate sm:text-lg text-left text-gray-800">{item.title}</h2>
                <p className="text-sm truncate text-left">{item.description}</p>
              </div>
              {/* Points and Date */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className='flex flex-row'>
                  <img src='src/assets/icons8-shopping-bag-26.png' className='invert w-3 h-3 mr-1 md:w-6 md:h-6' />
                  <h1 className='text-xs md:text-lg'>100/100</h1>
                </div>
                <span className="flex flex-row text-sm justify-center items-center gap-1 text-green-600 font-bold bg-bg rounded-badge py-1">
                  <img
                    src="src/assets/1.png" // Replace with your coin icon URL
                    alt="Coin Icon"
                    className="w-5 h-5 md:w-7 md:h-7"
                  />
                  <h1 className='text-xs md:text-lg'>{item.points}</h1>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <dialog id="my_modal_5" className="modal modal-middle">
        <div className="modal-box bg-bg">
          {selectedIndex !== null && (
            <>
              <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4">
                <img
                  src={data[selectedIndex].img}
                  alt={data[selectedIndex].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between p-2 w-full">
                {/* Text Content */}
                <div className="flex flex-col">
                  <h3 className="font-bold text-lg sm:text-xl text-left text-gray-800">
                    Mission: {data[selectedIndex].title}
                  </h3>
                  <p className="text-sm text-left text-gray-600">{data[selectedIndex].description}</p>
                </div>
                {/* Points and Date */}
                <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                  <span className="flex items-center text-green-600 font-bold">
                    <img
                      src="src/assets/coin.png" // Replace with your coin icon URL
                      alt="Coin Icon"
                      className="w-4 h-4 mr-1"
                    />
                    {data[selectedIndex].points}
                  </span>
                  <span>End Date: {data[selectedIndex].date}</span>
                </div>
              </div>
            </>
          )}
          {isModalSuccess ? (
            <p className="text-green-600 mt-4 text-center">Success!</p>
          ) : (
            <div className="modal-action mt-4">
              <button
                className="btn bg-[#54d376] border-none w-24 rounded-badge text-white hover:bg-[#43af60]"
                onClick={handleConfirm}
              >
                CONFIRM
              </button>
              <button
                className="btn bg-[#ff6060] border-none w-24 rounded-badge text-white hover:bg-[#d44141]"
                onClick={() => document.getElementById('my_modal_5').close()}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}

export default Food;
