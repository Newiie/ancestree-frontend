import React, { useState } from 'react';
import { useProfile } from '../../../providers/ProfileProvider';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';

const ProfileSidebar = () => {
  const { selectedDetail, setSelectedDetail, profileTabs, profileSidebarData } = useProfile();
  const [isOpen, setIsOpen] = useState(false);

  if (profileTabs !== 'Personal Details') return null;

  return (
    <div className='w-full border-b md:border-b-0 md:border-r border-stone-200'>
      {/* Mobile Dropdown */}
      <div
        className='md:hidden flex justify-between items-center p-4 cursor-pointer hover:bg-stone-50 transition-colors'
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className='text-sm font-semibold text-stone-700'>{selectedDetail}</span>
        {isOpen ? <ChevronDownIcon size={16} className='text-stone-400' /> : <ChevronRightIcon size={16} className='text-stone-400' />}
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} md:block py-3 px-2`}>
        <p className='hidden md:block px-2 mb-2 text-xs font-semibold text-stone-400 uppercase tracking-widest'>Personal Details</p>
        <div className='space-y-0.5'>
          {profileSidebarData.map((item) => (
            <button
              key={item}
              onClick={() => { setSelectedDetail(item); setIsOpen(false); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 ${
                item === selectedDetail
                  ? 'bg-[#EAF1E5] text-[#1B5A1B] font-semibold'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
