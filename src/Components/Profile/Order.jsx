import React, { useState } from 'react';

function Order() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const data = [
    {
      img: 'src/assets/poster.jpg',
      title: 'Cy Ganderton',
      description: 'Quality Control Specialist',
      datetime: '2023-12-06 10:00 AM',
      points: '50 pts',
      status: 'Ordered',
    },
    {
      img: 'src/assets/durian.jpg',
      title: 'Hart Hagerty',
      description: 'Desktop Support Technician',
      datetime: '2023-12-05 3:30 PM',
      points: '40 pts',
      status: 'Confirmed Order',
    },
    {
      img: 'src/assets/ms.jpg',
      title: 'Brice Swyre',
      description: 'Tax Accountant',
      datetime: '2023-12-04 2:15 PM',
      points: '60 pts',
      status: 'On Delivery',
    },
  ];

  const getStepClasses = (status, step) => {
    const statusMap = {
      Ordered: 1,
      'Confirmed Order': 2,
      'On Delivery': 3,
    };
    return statusMap[status] >= step ? 'step step-warning' : 'step';
  };

  const getCurrentStepLabel = (status) => {
    const stepLabels = {
      Ordered: 'Ordered',
      'Confirmed Order': 'Confirmed',
      'On Delivery': 'On Delivery',
    };
    return stepLabels[status] || 'Unknown';
  };

  return (
    <div className="p-2 bg-layer-background rounded-xl w-full mb-16">
      <div className="overflow-x-auto bg-bg rounded-xl shadow">
        <table className="table-auto w-full border-collapse text-xs sm:text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-2 py-2 text-center w-auto">Image</th>
              <th className="px-2 py-2 text-left w-auto">Title</th>
              <th className="px-2 py-2 text-center w-auto">Status</th>
              <th className="px-2 py-2 text-center w-auto">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <React.Fragment key={index}>
                <tr className="border-b">
                  {/* Image */}
                  <td className="px-2 py-2 text-center">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full mx-auto"
                    />
                  </td>

                  {/* Title */}
                  <td className="px-2 py-2 font-semibold text-left">{item.title}</td>

                  {/* Current Status */}
                  <td className="px-2 py-2 text-center text-gray-700 font-bold">
                    {getCurrentStepLabel(item.status)}  
                  </td>

                  {/* Show More Button */}
                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                      className="btn btn-xs sm:btn-sm btn-outline"
                    >
                      {expandedIndex === index ? 'Hide Details' : 'Show More'}
                    </button>
                  </td>
                </tr>

                {/* Expanded Details */}
                {expandedIndex === index && (
                  <tr className="bg-gray-100">
                    <td colSpan="4" className="px-4 py-4">
                    <strong className='text-button-text'>Detailed Steps:</strong>

                      <div className="text-xs sm:text-sm text-gray-700">
                        <ul className="steps steps-vertical md:steps-horizontal md:w-full">
                          <li className={getStepClasses(item.status, 1)}>Ordered</li>
                          <li className={getStepClasses(item.status, 2)}>Confirmed</li>
                          <li className={getStepClasses(item.status, 3)}>On Delivery</li>
                          <li className={getStepClasses(item.status, 4)}>Ordered</li>
                          <li className={getStepClasses(item.status, 5)}>Confirmed</li>
                        </ul>
                        <div className="mt-4">
                          <strong>Date & Time:</strong> {item.datetime}
                        </div>
                        <div>
                          <strong>Points:</strong> {item.points}
                        </div>
                        <div>
                          <strong>Description:</strong> {item.description}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Order;
