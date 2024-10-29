import React from 'react';
import { useProfile } from '../../../hooks/ProfileContext';
const ProfileTabs = () => {
  const { setProfileTabs, profileTabs } = useProfile();
  return (
    <div className='w-full grid grid-cols-4 gap-4 mt-4'>
      {[
        'Personal Details', 
        'Profile Memo', 
        'Connections', 
        'Timeline'
      ].map((item) => (
        <button key={item} onClick={() => setProfileTabs(item)} 
        className={` px-4 py-2 rounded-lg shadow-sm  transition duration-200 
        ${profileTabs === item ? 'bg-btn-active text-white hover:bg-btn-hover' : 'bg-white text-black hover:bg-gray-200'}`}>
          {item}
        </button>
      ))}
    </div>
  );
};

export default ProfileTabs;
