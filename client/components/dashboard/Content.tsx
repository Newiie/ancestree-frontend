import Image from 'next/image';
import React from 'react';

const Content = () => {
  return (
    <div className=' bg-[#DFDFDF] text-black p-6'>
      <div className='flex flex-col items-center'>
        {/* Profile Header */}
        <div className='w-full relative bg-white p-4 rounded-lg'>
          {/* Background Image */}
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
            {/* Profile Image */}
            <Image
              src={'/images/doge.png'}
              alt='Profile'
              width={100}
              height={100}
              className='w-24 h-24 rounded-full border-4 border-white'
            />
            <h1 className='text-xl font-bold mt-2'>Jethro Layan Cenas</h1>
            <p className='text-gray-700'>ID: 0000000000000001</p>
            <div className='flex mt-2'>
              <button className='bg-white text-green border-1 border-green px-2 py-1 rounded-lg mr-2'>View Tree</button>
              <button className='bg-btn-secondary text-primary border-1 border-green px-2 py-1 rounded-lg'>Connections</button>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className='w-full grid grid-cols-4 gap-4 mt-4'>
          <button className='bg-btn-active text-white px-4 py-2 rounded-lg shadow-sm hover:bg-btn-hover transition duration-500'>Personal Details</button>
          <button className='bg-white text-black px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition duration-500'>Profile Memo</button>
          <button className='bg-white text-black px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition duration-500'>Connect</button>
          <button className='bg-white text-black px-4 py-2 rounded-lg shadow-sm hover:bg-gray-200 transition duration-500'>Timeline</button>
        </div>

        {/* Personal Details Section */}
        <div className='w-full mt-4 grid grid-cols-[13rem_1fr] px-4 bg-gray-100 rounded-lg shadow-md '>
          {/* Sidebar */}
          <div className='flex flex-col border-r-[2.5px] border-[#DFDFDF] py-4 pr-4'>
            <h2 className='p-2 text-lg font-bold'>Personal Details</h2>
            <div className='mt-2'>
              <p className='text-black p-2 hover:bg-gray-200 rounded-lg cursor-pointer'>General Information</p>
              <p className='text-black p-2 hover:bg-gray-200 rounded-lg cursor-pointer'>Addresses</p>
              <p className='text-black p-2 hover:bg-gray-200 rounded-lg cursor-pointer'>Vitals</p>
              <p className='text-black p-2 hover:bg-gray-200 rounded-lg cursor-pointer'>Education</p>
              <p className='text-black p-2 hover:bg-gray-200 rounded-lg cursor-pointer'>Employment</p>
              <p className='text-black p-2 hover:bg-gray-200 rounded-lg cursor-pointer'>Personal Interests</p>
              <p className='text-black p-2 hover:bg-gray-200 rounded-lg cursor-pointer'>Contact Information</p>
            </div>
          </div>
          
          {/* Details Content */}
          <div className='p-4'>
            <h2 className='text-lg font-bold'>General Information</h2>
            <div className='mt-4'>
              {/* Name Details */}
              <h3 className='font-bold'>Name</h3>
              <p><strong>First Name:</strong> Jethro</p>
              <p><strong>Middle Name:</strong> Layan</p>
              <p><strong>Last Name:</strong> Cenas</p>
              <p><strong>Suffix:</strong> N/A</p>

              {/* Birth Details */}
              <h3 className='font-bold mt-4'>Birth Details</h3>
              <p><strong>Birth Date:</strong> January 01, 2002</p>
              <p><strong>Birth Place:</strong> Cebu City, Cebu, Visayas, PH</p>
              <p><strong>Birthing Center:</strong> Unknown</p>

              {/* Citizenship */}
              <h3 className='font-bold mt-4'>Citizenship</h3>
              <p><strong>Nationality:</strong> Filipino</p>
              <p><strong>Civil Status:</strong> Divorced</p>
              <p><strong>Birthing Center:</strong> Unknown</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
