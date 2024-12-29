import Image from 'next/image';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import  useAuth  from '@/hooks/useAuth';
import {usePathname} from 'next/navigation';
import { BellIcon, BookImageIcon, BookTextIcon, EllipsisVerticalIcon, HeartIcon, HelpCircleIcon, HouseIcon, LogOutIcon, NetworkIcon, SettingsIcon, UserIcon, MenuIcon, XIcon } from 'lucide-react';  
import { useProfile } from '@/providers/ProfileProvider';

const Sidebar = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const { user } = useAuth();
  const { userData } = useProfile();
  const pathName = usePathname();

  const dashboardRegex = /^\/Dashboard/i;

  const isDashboardPath = dashboardRegex.test(pathName);
  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const sidebarItems = [ 
    { icon: <HouseIcon />, label: 'Home', url: "/dashboard" },
    { icon: <UserIcon />, label: 'Profile', url: user?.id ? `/dashboard/profile/${user.id}` : '/dashboard/profile' },
    { icon: <BellIcon />, label: 'Notifications', url: "/dashboard/notifications" },
    { icon: <NetworkIcon />, label: 'Family Tree', url: `/dashboard/family-tree/${user?.id}` },
    { icon: <HeartIcon />, label: 'Relationships', url: "/dashboard/relationships" },
    { icon: <BookTextIcon />, label: 'My records', url: "/dashboard/my-records" },
  ];

  const renderSidebarLinks = (isMobile = false) => (
    <ul className={`space-y-2 ${isMobile ? 'px-4 py-6' : 'flex-grow overflow-y-auto'}`}>
      {sidebarItems.map((item) => (
        <Link
          href={item.url}
          key={item.label}
          className={`flex px-2 py-[6px] rounded-[0.6rem] items-center text-[1.2rem] text-sidebar 
            ${(pathName ==  "/dashboard/" + item.label) ? "bg-gradient-linear-green-white" : "hover:bg-gradient-linear-green-white"} 
            transition-colors duration-400 cursor-pointer h-[3rem] overflow-none`}
          onClick={isMobile ? toggleMobileSidebar : undefined}
        >
          <div className="flex-shrink-0 w-[1.5rem] h-[1.5rem] mr-3">
            {item.icon}
          </div>
          <span>{item.label}</span>
        </Link>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex relative bg-white p-4 h-full flex-col transition-width duration-300 ${isMinimized ? 'w-[5rem]' : 'w-[15rem]'}`}>
        <button 
          className="absolute top-2 -right-4 z-20 bg-white shadow-md rounded-[3px] p-2 flex items-center justify-center"
          onClick={toggleSidebar}
        >
          <MenuIcon className="text-black" />  
        </button>

        {renderSidebarLinks()}
        
        <Popover>
          <div className="mt-auto pt-4 border-t border-gray-300">
            <div className="flex gap-2 items-center">
              <Image
                src={`${userData?.profilePicture ? userData?.profilePicture : "/images/doge.png"}`}
                alt='Profile'
                width={100}
                height={100}
                className='w-10 h-10 rounded-full border-4 border-white'
              />
              <div className="flex flex-col flex-grow">
                {!isMinimized && <span className="font-bold text-gray-800">{userData?.generalInformation?.firstName} {userData?.generalInformation?.lastName}</span>}
              </div>
              <PopoverTrigger>
                <div className="p-2 text-sidebar">
                  <EllipsisVerticalIcon />
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <p className="p-2 hover:bg-gray-100 cursor-pointer text-sidebar flex gap-2 items-center" onClick={logout}>
                  <LogOutIcon />
                  Logout
                </p>
                <p className="p-2 hover:bg-gray-100 cursor-pointer text-sidebar flex gap-2 items-center">
                  <HelpCircleIcon />
                  Help
                </p>
                <p className="p-2 hover:bg-gray-100 cursor-pointer text-sidebar flex gap-2 items-center">
                  <SettingsIcon />
                  Settings
                </p>
              </PopoverContent>
            </div>
          </div>
        </Popover>
      </div>

      {/* Mobile Sidebar Trigger */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-md rounded-full p-2"
        onClick={toggleMobileSidebar}
      >
        <MenuIcon className="text-black" />
      </button>

      {/* Mobile Sidebar */}
      <div 
        className={`
          md:hidden fixed inset-0 z-40 bg-black/50 
          ${isMobileSidebarOpen ? 'visible' : 'invisible'}
          transition-all duration-300 ease-in-out
        `}
        onClick={toggleMobileSidebar}
      >
        <div 
          className={`
            absolute left-0 top-0 h-full w-[80%] bg-white shadow-lg 
            transform transition-transform duration-300 ease-in-out
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-2">
              <Image
                src={`${userData?.profilePicture ? userData?.profilePicture : "/images/doge.png"}`}
                alt='Profile'
                width={100}
                height={100}
                className='w-10 h-10 rounded-full border-4 border-white'
              />
              <span className="font-bold text-gray-800">
                {userData?.generalInformation?.firstName} {userData?.generalInformation?.lastName}
              </span>
            </div>
            <button onClick={toggleMobileSidebar}>
              <XIcon className="text-black" />
            </button>
          </div>
          
          {renderSidebarLinks(true)}
          
          <div className="border-t p-4 space-y-2">
            <p 
              className="p-2 hover:bg-gray-100 cursor-pointer text-sidebar flex gap-2 items-center" 
              onClick={logout}
            >
              <LogOutIcon />
              Logout
            </p>
            <p className="p-2 hover:bg-gray-100 cursor-pointer text-sidebar flex gap-2 items-center">
              <HelpCircleIcon />
              Help
            </p>
            <p className="p-2 hover:bg-gray-100 cursor-pointer text-sidebar flex gap-2 items-center">
              <SettingsIcon />
              Settings
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
