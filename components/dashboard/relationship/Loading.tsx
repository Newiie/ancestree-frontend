import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const Loading = () => {
  return (
    <div className='flex items-center gap-4 p-4 bg-white rounded-2xl border border-stone-200'>
      <Skeleton className='w-12 h-12 rounded-full flex-shrink-0' />
      <div className='flex flex-col gap-2 flex-grow'>
        <Skeleton className='w-32 h-4 rounded-full' />
        <Skeleton className='w-20 h-3 rounded-full' />
      </div>
    </div>
  )
}

export default Loading
