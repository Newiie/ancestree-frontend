import Image from 'next/image';
import React, { useState } from 'react';
import { FaHome, FaChartBar, FaUser, FaBell, FaTree, FaHeart, FaFileAlt, FaImages, FaQuestionCircle, FaCog, FaBars } from 'react-icons/fa';

const Sidebar = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`relative bg-white p-4 h-full flex flex-col transition-width duration-300 ${isMinimized ? 'w-[5rem]' : 'w-[15rem]'}`}>
      <button className="absolute top-2 -right-4 bg-white shadow-md rounded-[3px] p-2 flex items-center justify-center"
        onClick={toggleSidebar}
      >
       
          <FaBars className="text-black" />
        
      </button>

      <ul className="space-y-2 flex-grow overflow-y-auto">
        {[ 
          { icon: <FaHome />, label: 'Home' },
          { icon: <FaChartBar />, label: 'Analytics' },
          { icon: <FaUser />, label: 'Profile' },
          { icon: <FaBell />, label: 'Notifications' },
          { icon: <FaTree />, label: 'Family Tree' },
          { icon: <FaHeart />, label: 'Relationships' },
          { icon: <FaFileAlt />, label: 'My records' },
          { icon: <FaImages />, label: 'Gallery' },
          { icon: <FaQuestionCircle />, label: 'Help' },
          { icon: <FaCog />, label: 'Settings' },
        ].map((item, index) => (
          <li
            key={index}
            className="flex px-2 py-[6px] rounded-[3px] items-center text-[1.2rem] text-black hover:bg-gradient-linear-green-white cursor-pointer h-[3rem] overflow-none"
          >
            <div className="flex-shrink-0 w-[1.5rem] h-[1.5rem] mr-3">
              {item.icon}
            </div>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${isMinimized ? 'max-w-0 opacity-0' : 'max-w-full opacity-100'}`}
            >
              <span>{item.label}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-4 border-t border-gray-300">
        <div className="flex items-center">
          <Image
              src={'/images/doge.png'}
              alt='Profile'
              width={100}
              height={100}
              className='w-10 h-10 rounded-full border-4 border-white'
            />
          <div className="flex flex-col">
            {!isMinimized && <span className="font-bold text-gray-800">Username User</span>}
            {!isMinimized && <span className="text-sm text-gray-600">user@email.com</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
