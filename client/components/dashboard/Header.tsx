'use client'
import Image from 'next/image'
import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Header = () => {
    const user = useSelector((state: RootState) => state.user.user);
    return (
        <div className='col-span-2 flex justify-between items-center px-[1rem] py-[0.5rem] bg-white shadow-md'>

            <div className='text-[1.5rem] flex items-center gap-[0.5rem] font-semibold'>
                <Image src="/images/logo.png" alt="logo" width={40} height={40} />
                <h1 className='text-primary'>
                    <span className='text-primary/50'>Ances</span>TREE
                </h1>
            </div>
            <p className='text-[1rem] text-black font-semibold'>WELCOME, {user}!</p>
        </div>
    )
}

export default Header
