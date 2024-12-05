import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const Loading = () => {
  return (
    <div className='relative flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm'>
      <Skeleton className='w-16 h-16 rounded-full' />
      <div className='flex flex-col gap-1'>
        <Skeleton className='w-24 h-4' />
        <Skeleton className='w-32 h-6' />
      </div>
      <Skeleton className='w-6 h-6 absolute top-4 right-4' />
  </div>
  )
}

export default Loading