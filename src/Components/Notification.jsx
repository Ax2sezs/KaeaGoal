// src/components/Notification.js
import React from 'react';

const Notification = ({ notification }) => {
    return (
      <li
        className={`${
          notification.isNew ? "bg-blue-50 shadow-md" : ""
        } transition-colors duration-300 ease-in-out`}
      >
        <a
          className="block hover:bg-layer-item active:bg-gray-300 transform hover:scale-105 transition-transform duration-300"
        >
          <div className="grid grid-cols-4 gap-4 p-2 bg-bg rounded-xl">
            <div className="col-span-1">
              <img
                src={notification.image}
                className="rounded-full w-10 h-10"
                alt="Notification"
              />
            </div>
            <div className="col-span-2">
              <div className="font-semibold">{notification.title}</div>
              <div className="text-sm">{notification.details}</div>
            </div>
            <div className="col-span-1 text-right pr-2">
              <div className="text-xs text-gray-500">{notification.time}</div>
              <div className="text-xs text-gray-500">{notification.date}</div>
            </div>
          </div>
        </a>
      </li>
    );
  };
  

export default Notification;
