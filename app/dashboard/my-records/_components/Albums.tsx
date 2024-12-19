import { CirclePlus } from 'lucide-react'
import React, { useState } from 'react'
import ImageContainer from '@/app/dashboard/my-records/_components/ImageContainer'
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

const Albums = () => {
    const [albumName, setAlbumName] = useState("")

    const handleCreateAlbum = () => {
        if (!albumName.trim()) return
        // Add your album creation logic here
        console.log('Creating album:', albumName)
        setAlbumName("")
    }

    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger>
                    <button className='px-2 py-1 rounded-lg flex items-center gap-2 border border-primary shadow-sm bg-btn-inactive text-primary transition duration-200 hover:text-white hover:bg-btn-primary'>
                        <CirclePlus size={16} />
                        Add New Album
                    </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>New Album Name:</AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter the name of the new album
                        </AlertDialogDescription>
                        <Input
                            type="text"
                            placeholder="Enter album name"
                            value={albumName}
                            onChange={(e) => setAlbumName(e.target.value)}
                            className="mt-4"
                        />
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setAlbumName("")}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleCreateAlbum}
                            disabled={!albumName.trim()}
                        >
                            Create Album
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className='flex flex-wrap gap-4 py-4'>
                <Folder />
                <Folder />
                <Folder />
                <Folder />
            </div>
        </div>
    )
}

export default Albums