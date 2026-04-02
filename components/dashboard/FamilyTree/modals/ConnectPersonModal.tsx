"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CircleXIcon } from 'lucide-react';
import { useTree } from '@/providers/TreeProvider';

const ConnectPersonModal = () => {
  const {
    toggleConnectPersonModal,
    handleConnectPersonToUser
  } = useTree();
  const [userId, setUserId] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleConnectPersonToUser(userId);
  };
  return (
    <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black/50 z-10">
      <motion.form
        initial={{ y: '-10%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        exit={{ y: '-15%', opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative flex flex-col gap-6 bg-white rounded-[10px] py-4 px-8"
        onSubmit={handleSubmit}
      >
        <div className='text-xl text-black/70 font-bold pr-4'>Connect Person to User</div>
        <div
          className="absolute top-4 right-2 cursor-pointer"
          onClick={() => toggleConnectPersonModal()}
        >
          <CircleXIcon
            className='text-black/70 hover:text-black/50 transition-colors duration-300'
            size={24}
          />
        </div>
        {/* NAME DETAILS */}
        <div className='flex flex-wrap mt-2 w-full gap-2'>
          <div className='relative flex flex-col flex-grow'>
            <label className='absolute -top-5 left-0 text-sm text-gray-600 mb-1 font-semibold'>User ID: </label>
            <input
              type="text"
              placeholder='User ID'
              className='border flex-1 outline-none hover:bg-white/50 rounded px-2 py-1'
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className='flex justify-end gap-4'>
          <button type='button' onClick={() => toggleConnectPersonModal()} className='bg-white hover:bg-[#DFDFDF] transition-colors duration-300 text-black border-1 border-green px-4 py-1 rounded-md'>Cancel</button>
          <button className='bg-primary hover:bg-primary/70 transition-colors duration-300 text-white px-4 py-1 rounded-md' type='submit'>Connect</button>
        </div>
      </motion.form>
    </div>
  )
}

export default ConnectPersonModal;
