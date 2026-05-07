"use client"
import ImageContainer from './_components/ImageContainer'
import React, { useState } from 'react'
import Albums from './_components/Albums'
import CreateAlbumDialog from './_components/CreateAlbumDialog'
import { useEffect } from 'react'
import galleryService from '@/services/api/galleryService'
import { useRecords } from '@/providers/RecordsProvider'
import Image from 'next/image'
import { PlusIcon } from 'lucide-react'

const Page = () => {
    const {
        albums,
        setAlbums,
    } = useRecords()
    const photoCount = albums.reduce((sum, a) => sum + (a?.photos?.length ?? 0), 0)
    const [selectedTab, setSelectedTab] = useState("All Photos")
    const [createAlbumOpen, setCreateAlbumOpen] = useState(false)

    return (
        <div className="content | overflow-y-auto h-screen">
            <div className='bg-stone-50 text-black min-h-full p-4 sm:p-6'>
                <div className='w-full bg-white border border-stone-200 rounded-2xl p-5 sm:p-6'>
                    {/* HEADER */}
                    <div className='flex items-start justify-between gap-4 mb-5'>
                        <div>
                            <p className='text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1'>Records</p>
                            <h1 className='text-2xl font-bold text-stone-900'>Gallery</h1>
                            <p className='text-sm text-stone-500 mt-0.5'>
                                {photoCount} {photoCount === 1 ? 'photo' : 'photos'} · {albums.length} {albums.length === 1 ? 'album' : 'albums'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setCreateAlbumOpen(true)}
                            className='inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                        >
                            <PlusIcon size={16} />
                            New Album
                        </button>
                    </div>

                    {/* PILL TABS */}
                    <div className='inline-flex gap-0.5 bg-stone-100 p-0.5 rounded-xl mb-5'>
                        {["All Photos", "Albums"].map((item) => {
                            const active = selectedTab === item
                            return (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => setSelectedTab(item)}
                                    className={`px-4 py-1.5 text-sm rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                                        active
                                            ? 'bg-white text-stone-900 shadow-sm font-semibold'
                                            : 'text-stone-500 hover:text-stone-700 font-medium'
                                    }`}
                                >
                                    {item}
                                </button>
                            )
                        })}
                    </div>
                    <div className={
                        selectedTab === "Albums"
                            ? 'grid grid-cols-1'
                            : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2'
                    }>
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
                        { selectedTab === "Albums" && <Albums onAddAlbum={() => setCreateAlbumOpen(true)} /> }
                    </div>
                </div>
            </div>
            <CreateAlbumDialog open={createAlbumOpen} onOpenChange={setCreateAlbumOpen} />
        </div>
    )
}

export default Page
