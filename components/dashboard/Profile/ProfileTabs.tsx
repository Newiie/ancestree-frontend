import React from 'react';
import { useProfile } from '../../../providers/ProfileProvider';
const ProfileTabs = () => {
  const { setProfileTabs, profileTabs, profileTabsData } = useProfile();
  return (
    <div className='w-full mt-4'>
      <div className='flex gap-0 bg-stone-100 rounded-xl p-1'>
        {profileTabsData.map((item) => (
          <button
            key={item}
            onClick={() => setProfileTabs(item)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              profileTabs === item
                ? 'bg-white text-stone-800 shadow-sm shadow-stone-200'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;
