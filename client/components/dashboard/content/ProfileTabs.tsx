import React from 'react';
import { useProfile } from '../../../hooks/ProfileContext';
const ProfileTabs = () => {
  const { selectedDetail, setSelectedDetail } = useProfile();
  return (
    <div className='w-full grid grid-cols-4 gap-4 mt-4'>
      <button onClick={() => setSelectedDetail('Personal Details')} className='bg-btn-active text-white px-4 py-2 rounded-lg shadow-sm hover:bg-btn-hover transition duration-500'>Personal Details</button>
      <button onClick={() => setSelectedDetail('Profile Memo')} className='bg-white text-black px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition duration-500'>Profile Memo</button>
      <button onClick={() => setSelectedDetail('Connect')} className='bg-white text-black px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition duration-500'>Connect</button>
      <button onClick={() => setSelectedDetail('Timeline')} className='bg-white text-black px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition duration-500'>Timeline</button>
    </div>
  );
};

export default ProfileTabs;
