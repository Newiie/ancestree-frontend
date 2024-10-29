import { PencilIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const ImageContainer = () => {
  return (
    <div className='relative w-[10rem] h-[10rem] rounded-[4px] overflow-hidden'>
      <Image src="/images/pirot.png" className='h-full w-full object-contain' alt="placeholder" width={1000} height={1000} />
      <div className='absolute top-0 left-0 w-full h-full bg-black/20'></div>
      <div className='absolute bg-black/55 p-1.5 rounded-full top-2 right-2 cursor-pointer'>
        <PencilIcon className='text-[#FAFAFA]' size={12} />
      </div>
    </div>
  )
}

export default ImageContainer
