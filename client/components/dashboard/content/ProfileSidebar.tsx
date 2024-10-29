import React from 'react';
import { useProfile } from '../../../hooks/ProfileContext';

const ProfileSidebar = () => {
  const { selectedDetail, setSelectedDetail, profileTabs } = useProfile();

  return (
    profileTabs === 'Personal Details' && <div className='flex flex-col border-r-[2.5px] border-[#DFDFDF] py-4 pr-4'>
      <h2 className='p-2 text-lg font-bold'>Personal Details</h2>
      <div className='mt-2'>
        {[
        'General Information', 
        'Addresses', 
        'Vital Information', 
        'Personal Interests', 
        'Contact Information'
      ].map((item) => (
          <p key={item} onClick={() => setSelectedDetail(item)} className={`text-black p-2 ${item === selectedDetail ? 'bg-gray-200' : 'hover:bg-gray-200'} mt-2 rounded-lg cursor-pointer transition duration-300`}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ProfileSidebar;
