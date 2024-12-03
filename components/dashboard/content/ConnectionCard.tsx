import React from 'react'
import { EllipsisIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const ConnectionCard = ({ result }: { result: any }) => {
  return (
    <Link href={`/dashboard/profile/${result.userId}`} className='relative flex items-center gap-4  p-4 bg-white rounded-lg cursor-pointer border border-gray-200 shadow-sm hover:shadow-md transition duration-200'>
        <Image 
          src={result.profilePicture ? result.profilePicture : "/images/doge.png"} 
          alt='profile' 
          width={100} 
          height={100} 
          className='w-16 h-16 rounded-full' 
        />
        <div className='flex flex-col gap-1'>
            <p className='text-[0.8rem] text-gray-500'>name: </p>
            <h2 className='text-[1.2rem] font-bold'>{result.firstName} {result.lastName}</h2>
            {/* <p className='text-[0.8rem] text-gray-500'>{result.email}</p> */}
        </div>
        <EllipsisIcon className='w-6 h-6 cursor-pointer absolute top-4 right-4'  />
    </Link>
  )
}

export default ConnectionCard
