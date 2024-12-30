import { CirclePlus } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import Folder from './Folder'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import galleryService from '@/services/api/galleryService'
import { useRecords } from '@/providers/RecordsProvider'
import useError from '@/hooks/useError'
import Image from 'next/image'

const Albums = () => {
    const { isFetching, setIsFetching, albums, setAlbums } = useRecords();
    const [albumName, setAlbumName] = useState("")
    const { setError } = useError();
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const albums = await galleryService.getAlbums();
                setAlbums(albums);
                console.log(albums)
            } catch (error) {
                setError('Failed to fetch albums:')
            }
        };
        fetchAlbums();
    }, [setAlbums, isFetching, setError]); 

    const handleCreateAlbum = async () => {
        if (!albumName.trim()) return
        setIsFetching(true)
        try {
            console.log('Creating album:', albumName)
            await galleryService.addAlbum(albumName)
            setAlbumName("")
            setIsOpen(false) 
        } catch (error) {
            setError('Error creating album:')
        } finally {
            setIsFetching(false)
        }
    }

    return (
        <div className='w-full'>
            <div className='flex justify-start mb-4'>
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                    <AlertDialogTrigger>
                        <span className='
                            text-sm 
                            sm:text-base 
                            px-2 
                            py-1 
                            rounded-lg 
                            flex 
                            items-center 
                            gap-2 
                            border 
                            border-primary 
                            shadow-sm 
                            bg-btn-inactive 
                            text-primary 
                            transition 
                            duration-200 
                            hover:text-white 
                            hover:bg-btn-primary
                        '>
                            <CirclePlus size={16} />
                            Add New Album
                        </span>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Create New Album</AlertDialogTitle>
                            <AlertDialogDescription>
                                Give your album a name to help you organize your records
                            </AlertDialogDescription>
                            <Input
                                label="Album Name"
                                type="text"
                                value={albumName}
                                onChange={(e) => setAlbumName(e.target.value)}
                            />
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setAlbumName("")}>Cancel</AlertDialogCancel>
                            <button 
                                onClick={handleCreateAlbum}
                                disabled={!albumName.trim() || isFetching}
                                className='
                                    w-full 
                                    sm:w-auto 
                                    bg-primary 
                                    text-white 
                                    px-4 
                                    py-2 
                                    rounded-lg 
                                    hover:bg-primary/80 
                                    transition 
                                    duration-300 
                                    disabled:bg-primary/50 
                                    disabled:text-white/50 
                                    disabled:cursor-not-allowed
                                '
                            >
                                {isFetching ? "Creating..." : "Create Album"}
                            </button>
                        </AlertDialogFooter>    
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4 w-full'>
                {albums.length > 0 ? (
                    albums.map((album) => (
                        <div key={album._id} className='w-full'>
                            <Folder album={album} />
                        </div>
                    ))
                ) : (
                    <div className='col-span-full flex flex-col items-center justify-center py-10 text-center'>
                        <Image 
                            src='/images/no-albums.svg' 
                            alt='No albums' 
                            width={250} 
                            height={250} 
                            className='mb-4 opacity-70'
                        />
                        <h3 className='text-lg text-[#1B5A1B] font-semibold mb-2'>No Albums Yet</h3>
                        <p className='text-sm text-gray-600 max-w-md'>
                            Your album collection is empty. Start organizing your family&apos;s memories 
                            by creating your first album.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Albums