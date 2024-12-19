import React from 'react'
import { EllipsisVerticalIcon, FolderClosedIcon } from 'lucide-react'

const Folder = () => {
  return (
    <div className='relative px-2 flex items-center text-white cursor-pointer gap-2 w-[10rem] h-[2.5rem] rounded-[4px] bg-black/30 hover:bg-black/50 transition-colors duration-300 overflow-hidden'>
        <FolderClosedIcon className='w-6 h-6' />
        Folder Name
        <div className='absolute top-0 right-0 bg-black/55 p-1.5 rounded-full top-2 right-2 cursor-pointer'>
            <EllipsisVerticalIcon className='text-[#FAFAFA]' size={12} />
        </div>
    </div>
  )
}

export default Folder