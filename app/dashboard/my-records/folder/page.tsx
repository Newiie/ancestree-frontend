"use client"
import React, { useState } from 'react'
import ImageContainer from '../_components/ImageContainer'
const FolderPage = () => {
  return (
    <div className="content | overflow-y-auto">
        <div className='bg-[#DFDFDF] text-black h-full p-6'>
            <div className='w-full p-4 h-full bg-gray-100 rounded-lg shadow-md'>
                <h1 className='text-2xl font-bold mb-4'>Folder Name</h1>
                <div className='flex flex-wrap gap-4 p-4'>
                        <>
                            <ImageContainer />
                            <ImageContainer />
                            <ImageContainer />
                            <ImageContainer />
                        </>
                </div>
            </div>
        </div>
    

    </div>
  )
}

export default FolderPage