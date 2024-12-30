"use client"
import ImageContainer from './_components/ImageContainer'
import React, { useState } from 'react'
import Albums from './_components/Albums'
import { useEffect } from 'react'
import galleryService from '@/services/api/galleryService'
import { useRecords } from '@/providers/RecordsProvider'
import Image from 'next/image'

const Page = () => {
    const {
        albums, 
        setAlbums,
    } = useRecords()
    const [selectedTab, setSelectedTab] = useState("All Photos")

    return (
        <div className="content | overflow-y-auto h-screen">
            <div className='bg-[#DFDFDF] text-black h-full p-4 sm:p-6'>
                <div className='w-full p-4 h-full bg-gray-100 rounded-lg shadow-md'>
                    <h1 className='text-xl sm:text-2xl font-bold mb-4'>Gallery</h1>
                    <div className='flex items-center border-b-1 border-primary overflow-x-auto'>
                        {["All Photos", "Albums"].map((item, index) => (
                            <div 
                                key={index} 
                                onClick={() => setSelectedTab(item)} 
                                className={`
                                    text-base sm:text-lg 
                                    px-4 sm:px-8 
                                    py-2 
                                    font-semibold 
                                    border-primary 
                                    transition 
                                    hover:border-b-2 
                                    hover:text-primary 
                                    text-muted-foreground 
                                    cursor-pointer 
                                    duration-300 
                                    ${selectedTab === item ? 'border-b-2 text-primary' : ''}
                                `}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                    <div className={`grid ${selectedTab === "Albums" ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"}  gap-4 p-4`}>
                        {
                            selectedTab === "All Photos" && 
                            <>
                                {albums.flatMap((album) => 
                                    album?.photos?.map((photo, index) => (
                                        <ImageContainer 
                                            photo={photo} 
                                            key={`${photo.key}-${index}`} 
                                        />
                                    )) || []
                                ).length > 0 ? (
                                    albums.flatMap((album) => 
                                        album?.photos?.map((photo, index) => (
                                            <ImageContainer 
                                                photo={photo} 
                                                key={`${photo.key}-${index}`} 
                                            />
                                        )) || []
                                    )
                                ) : (
                                    <div className='col-span-full flex flex-col items-center justify-center py-10 text-center'>
                                        <Image 
                                            src='/images/no-photos.svg' 
                                            alt='No photos' 
                                            width={250} 
                                            height={250} 
                                            className='mb-4 opacity-70'
                                        />
                                        <h3 className='text-lg text-[#1B5A1B] font-semibold mb-2'>No Photos Yet</h3>
                                        <p className='text-sm text-gray-600 max-w-md'>
                                            Your photo collection is empty. Start capturing and organizing 
                                            your family&apos;s memories by uploading your first photo.
                                        </p>
                                       
                                    </div>
                                )}
                            </>
                        }
                        { selectedTab === "Albums" && <Albums /> }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
