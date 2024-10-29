import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaChartBar, FaUser, FaBell, FaTree, FaHeart, FaFileAlt, FaImages, FaCog, FaBars, FaEllipsisV, FaSignOutAlt, FaQuestionCircle } from 'react-icons/fa';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import  useAuth  from '@/hooks/useAuth';
import {usePathname} from 'next/navigation';


const Sidebar = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();

  const pathName = usePathname();

  const dashboardRegex = /^\/Dashboard/i;

  const isDashboardPath = dashboardRegex.test(pathName);
  const toggleSidebar = () => {
    console.log("PATH NAME ", pathName);
    console.log("IS PATH ", isDashboardPath);
    setIsMinimized(!isMinimized);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`relative bg-white p-4 h-full flex flex-col transition-width duration-300 ${isMinimized ? 'w-[5rem]' : 'w-[15rem]'}`}>
      <button className="absolute top-2 -right-4 z-20 bg-white shadow-md rounded-[3px] p-2 flex items-center justify-center"
        onClick={toggleSidebar}
      >
        <FaBars className="text-black" />  
      </button>

      <ul className="space-y-2 flex-grow overflow-y-auto">
        {[ 
          { icon: <FaHome />, label: 'Home', url: "/Dashboard" },
          // { icon: <FaChartBar />, label: 'Analytics', url: "/Dashboard/Analytics" },
          { icon: <FaUser />, label: 'Profile', url: "/Dashboard/Profile" },
          { icon: <FaBell />, label: 'Notifications', url: "/Dashboard/Notifications" },
          { icon: <FaTree />, label: 'Family Tree', url: "/Dashboard/FamilyTree" },
          { icon: <FaHeart />, label: 'Relationships', url: "/Dashboard/Relationships" },
          { icon: <FaFileAlt />, label: 'My records', url: "/Dashboard/MyRecords" },
          { icon: <FaImages />, label: 'Gallery', url: "/Dashboard/Gallery" },
        ].map((item, index) => (
          <Link
            href={item.url}
            key={index}
            className={`flex px-2 py-[6px] rounded-[3px] items-center text-[1.2rem] text-black ${ (pathName ==  "/Dashboard/" + item.label) ?  "bg-gradient-linear-green-white": "hover:bg-gradient-linear-green-white"} cursor-pointer h-[3rem] overflow-none`}
          >
            <div className="flex-shrink-0 text-primary w-[1.5rem] h-[1.5rem] mr-3">
              {item.icon}
            </div>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${isMinimized ? 'max-w-0 opacity-0' : 'max-w-full opacity-100'}`}
            >
              <span className='text-primary'>{item.label}</span>
            </div>
          </Link>
        ))}
      </ul>
      <Popover>
        <div className="mt-auto pt-4 border-t border-gray-300">
          <div className="flex items-center">
            <Image
                src={'/images/doge.png'}
                alt='Profile'
                width={100}
                height={100}
                className='w-10 h-10 rounded-full border-4 border-white'
              />
            <div className="flex flex-col flex-grow">
              {!isMinimized && <span className="font-bold text-gray-800">Username User</span>}
              {!isMinimized && <span className="text-sm text-gray-600">user@email.com</span>}
            </div>
            <PopoverTrigger>
              <div onClick={toggleMenu} className="p-2">
                <FaEllipsisV className="text-gray-500" />
              </div>
            </PopoverTrigger>
            <PopoverContent>
                <p className="p-2 hover:bg-gray-100 cursor-pointer flex gap-2 items-center" onClick={logout}>
                  <FaSignOutAlt />
                  Logout
                </p>
                <p className="p-2 hover:bg-gray-100 cursor-pointer flex gap-2 items-center">
                  <FaQuestionCircle />
                  Help
                </p>
                <p className="p-2 hover:bg-gray-100 cursor-pointer flex gap-2 items-center">
                  <FaCog />
                  Settings
                </p>
            </PopoverContent>
          </div>
        </div>
      </Popover>
    </div>
  );
}

export default Sidebar;
