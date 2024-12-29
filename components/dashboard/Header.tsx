'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import useAuth from '@/hooks/useAuth';

const Header = () => {
    const { user } = useAuth();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true); 
    }, []);

    return (
        <div className='col-span-2 z-50 flex justify-between items-center px-[1rem] py-[0.5rem] bg-white shadow-md'>

            <div className='text-[1.5rem] flex items-center gap-[0.5rem] font-semibold'>
                <Image src="/images/logo.png" alt="logo" width={40} height={40} />
                <h1 className='text-primary'>
                    <span className='text-primary/50'>Ances</span>TREE
                </h1>
            </div>
     
            {isMounted && (user ? (
                <p className='text-[1rem] text-black font-semibold'>WELCOME, {user.username}!</p>
            ) : (
                <p className='text-[1rem] text-black font-semibold'>WELCOME!</p>
            ))}
        </div>
    )
}

export default Header
