
import React, { useState } from 'react';
import ProfileHeader from '../content/ProfileHeader';
import ProfileTabs from '../content/ProfileTabs';
import ProfileSidebar from '../content/ProfileSidebar';
import DetailsContent from '../content/DetailsContent';
import { useProfile } from '@/hooks/ProfileContext';

const Content = () => {
  const { profileTabs } = useProfile();
  return (

      <div className='bg-[#DFDFDF] text-black p-6'>
        <div className='flex flex-col items-center'>
          <ProfileHeader />
          <ProfileTabs />
          <div className={`w-full mt-4 grid ${profileTabs === 'Personal Details' ? 'grid-cols-[13rem_1fr]' : 'grid-cols-[1fr]'} px-4 bg-gray-100 rounded-lg shadow-md`}>
            <ProfileSidebar />
            <DetailsContent />
          </div>
        </div>
      </div>

  );
};

export default Content;
