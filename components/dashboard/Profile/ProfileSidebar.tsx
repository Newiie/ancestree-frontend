import React, { useState } from 'react';
import { useProfile } from '../../../providers/ProfileProvider';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';

const ProfileSidebar = () => {
  const { selectedDetail, setSelectedDetail, profileTabs, profileSidebarData } = useProfile();
  const [isOpen, setIsOpen] = useState(false);

  if (profileTabs !== 'Personal Details') return null;

  return (
    <div className='w-full'>
      {/* Mobile Dropdown */}
      <div 
        className='md:hidden flex justify-between items-center bg-gray-100 p-4 cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className='font-bold'>{selectedDetail}</span>
        {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
      </div>

      {/* Sidebar for Desktop and Mobile Dropdown */}
      <div className={`
        ${isOpen ? 'block' : 'hidden'} 
        md:block 
        bg-white 
        md:bg-transparent 
        border-t md:border-t-0 
        md:border-r-[2.5px] 
        border-[#DFDFDF] 
        py-4 
        pr-4
      `}>
        <h2 className='p-2 text-lg font-bold hidden md:block'>Personal Details</h2>
        <div className='mt-2'>
          {profileSidebarData.map((item) => (
            <p 
              key={item} 
              onClick={() => {
                setSelectedDetail(item);
                setIsOpen(false);
              }} 
              className={`
                text-black 
                p-2 
                ${item === selectedDetail ? 'bg-gray-200' : 'hover:bg-gray-200'} 
                mt-2 
                rounded-lg 
                cursor-pointer 
                transition 
                duration-300
                text-sm 
                md:text-base
              `}
            >
              {item}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
