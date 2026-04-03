'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { BellIcon, SearchIcon } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import { useProfile } from '@/providers/ProfileProvider'


const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const Header = () => {
  const { user } = useAuth();
  const { userData } = useProfile();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const displayName =
    userData?.generalInformation?.firstName ||
    user?.username ||
    '';

  return (
    <div className='hidden md:flex col-span-2 z-50 items-center justify-between px-5 py-2.5 bg-white border-b border-stone-200'>

      {/* Brand */}
      <div className='flex items-center gap-2.5'>
        <Image src="/images/logo.png" alt="logo" width={32} height={32} className='w-8 h-8' />
        <span className='text-xl font-bold tracking-tight leading-none'>
          <span className='text-[#1B5A1B]/40'>Ances</span><span className='text-[#1B5A1B]'>TREE</span>
        </span>
      </div>

      {/* Search */}
      <div className='flex-1 max-w-xs mx-6'>
        <Link
          href='/dashboard/search'
          className='flex items-center gap-2 w-full px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl text-stone-400 text-sm transition-colors'
        >
          <SearchIcon size={14} className='flex-shrink-0' />
          <span>Search family members…</span>
        </Link>
      </div>

      {/* Right: greeting + notification + avatar */}
      {isMounted && (
        <div className='flex items-center gap-4'>
          {displayName && (
            <p className='text-sm text-stone-500'>
              {getGreeting()},{' '}
              <span className='font-semibold text-stone-800'>{displayName}</span>
            </p>
          )}

          <Link
            href="/dashboard/notifications"
            className='w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors'
          >
            <BellIcon size={17} />
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header
