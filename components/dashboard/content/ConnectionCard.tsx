import React from 'react'
import { EllipsisIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import profileService from '@/services/api/profileService';

const ConnectionCard = ({ result }: { result: any }) => {
  return (
    <Link
      onClick={() => profileService.updateUserProgress("View search results and connect with relatives")}
      href={`/dashboard/profile/${result.userId}`}
      className='flex items-center gap-4 p-4 bg-white rounded-2xl border border-stone-200 hover:border-[#1B5A1B]/30 hover:shadow-md transition-all duration-200 group'
    >
      <div className='relative flex-shrink-0'>
        <Image
          src={result.profilePicture ? result.profilePicture : '/images/doge.png'}
          alt={result.firstName ? `${result.firstName} ${result.lastName}` : 'Profile photo'}
          width={48}
          height={48}
          className='w-12 h-12 rounded-full object-cover ring-2 ring-stone-100 group-hover:ring-[#D4F3C0] transition-all'
        />
      </div>
      <div className='flex-grow min-w-0'>
        <p className='text-sm font-semibold text-stone-800 truncate'>
          {result.firstName} {result.lastName}
        </p>
        <p className='text-xs text-stone-400 truncate mt-0.5'>
          {result.birthPlace || 'View profile →'}
        </p>
      </div>
    </Link>
  )
}

export default ConnectionCard
