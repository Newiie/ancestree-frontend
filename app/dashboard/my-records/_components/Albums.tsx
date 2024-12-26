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
        <div>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogTrigger>
                    <span className='px-2 py-1 rounded-lg flex items-center gap-2 border border-primary shadow-sm bg-btn-inactive text-primary transition duration-200 hover:text-white hover:bg-btn-primary'>
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
                            className='bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition duration-300 disabled:bg-primary/50 disabled:text-white/50 disabled:cursor-not-allowed'
                        >
                            {isFetching ? "Creating..." : "Create Album"}
                        </button>
                    </AlertDialogFooter>    
                </AlertDialogContent>
            </AlertDialog>
            <div className='flex flex-wrap gap-4 py-4'>
                {albums.map((album) => (
                    <Folder key={album._id} album={album} />
                ))}
            </div>
        </div>
    )
}

export default Albums