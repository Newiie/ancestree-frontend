import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { useProfile } from '../../../providers/ProfileProvider';

const ProfileHeader = () => {
  return (
    <div className='w-full relative bg-white p-4 rounded-lg'>
      <div className='absolute inset-0 h-[13rem] w-full'>
        <Image
          src={'/images/bg-arcade-1.jpg'}
          alt='Background'
          layout='fill'
          objectFit='cover'
          className='rounded-t-lg'
        />
      </div>
      <div className='relative flex flex-col pl-[2rem] pb-[1rem] mt-[8rem]'>
        <div className='w-24 h-24 rounded-full bg-[#F5F5F5]'>
          <Image
            src={'/images/doge.png'}
            alt='Profile'
            width={100}
            height={100}
            className='w-24 h-24 rounded-full border-4 border-white'
          />
        </div>
       
        <h1 className='text-xl font-bold mt-2'>Jethro Layan Cenas</h1>
        <p className='text-gray-700'>ID: 0000000000000001</p>
        <div className='flex mt-2'>
          <Link href={'/dashboard/FamilyTree'} className={`bg-white hover:bg-btn-secondary text-primary border-1 border-green px-2 py-1 rounded-lg mr-2`}>View Tree</Link>
          <button className={`bg-white hover:bg-btn-secondary cursor-pointer text-primary border-1 border-green px-2 py-1 rounded-lg`}>Connect</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
