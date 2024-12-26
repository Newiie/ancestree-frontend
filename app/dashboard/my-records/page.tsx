"use client"
import ImageContainer from '@/app/dashboard/my-records/_components/ImageContainer'
import React, { useState } from 'react'
import Albums from './_components/Albums'
import { useEffect } from 'react'
import galleryService from '@/services/api/galleryService'
import { useRecords } from '@/providers/RecordsProvider'

const Page = () => {
    const {
        albums, 
        setAlbums,
    } = useRecords()
    const [selectedTab, setSelectedTab] = useState("All Photos")



    return (
        <div className="content | overflow-y-auto">
            <div className='bg-[#DFDFDF] text-black h-full p-6'>
            
                <div className='w-full p-4 h-full bg-gray-100 rounded-lg shadow-md'>
                    <h1 className='text-2xl font-bold mb-4'>Gallery</h1>
                    <div className='flex items-center  border-b-1 border-primary'>
                        {["All Photos", "Albums"].map((item, index) => (
                            <div key={index} onClick={() => {
                                console.log(item)
                                setSelectedTab(item)
                            }} className={`text-lg pl-8 pr-8 font-semibold  border-primary transition hover:border-b-2 hover:text-primary text-muted-foreground cursor-pointer duration-300 ${selectedTab === item ? 'border-b-2 text-primary' : ''}`}>{item}</div>
                        ))}
                    </div>
                    <div className='flex flex-wrap gap-4 p-4'>
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
