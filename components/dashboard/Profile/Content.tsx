import React, { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';
import ProfileSidebar from './ProfileSidebar';
import DetailsContent from './DetailsContent';
import { useProfile } from '../../../providers/ProfileProvider';

const Content = () => {
  const { profileTabs } = useProfile();
  
  return (
    <div className='bg-stone-50 text-black p-4 sm:p-6'>
      <div className='flex flex-col items-center'>
        <ProfileHeader />
        <ProfileTabs />
        <div className={`
          w-full mt-4
          ${profileTabs === 'Personal Details'
            ? 'grid md:grid-cols-[13rem_1fr]'
            : 'grid grid-cols-1'
          }
          bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden
        `}>
          <ProfileSidebar />
          <DetailsContent />
        </div>
      </div>
    </div>
  );
};

export default Content;
