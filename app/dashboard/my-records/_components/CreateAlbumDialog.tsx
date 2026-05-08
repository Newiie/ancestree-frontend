"use client"
import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import galleryService from '@/services/api/galleryService'
import { useRecords } from '@/providers/RecordsProvider'
import useError from '@/hooks/useError'

interface CreateAlbumDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const CreateAlbumDialog: React.FC<CreateAlbumDialogProps> = ({ open, onOpenChange }) => {
    const { isFetching, setIsFetching } = useRecords()
    const { setError } = useError()
    const [albumName, setAlbumName] = useState("")

    const handleCreate = async () => {
        if (!albumName.trim()) return
        setIsFetching(true)
        try {
            await galleryService.addAlbum(albumName)
            setAlbumName("")
            onOpenChange(false)
        } catch (error) {
            setError('Error creating album')
        } finally {
            setIsFetching(false)
        }
    }

    const handleCancel = () => {
        setAlbumName("")
        onOpenChange(false)
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Create New Album</AlertDialogTitle>
                    <AlertDialogDescription>
                        Give your album a name to help you organize your records
                    </AlertDialogDescription>
                    <Input
                        type="text"
                        value={albumName}
                        onChange={(e) => setAlbumName(e.target.value)}
                        placeholder="Album name"
                    />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                    <button
                        type="button"
                        onClick={handleCreate}
                        disabled={!albumName.trim() || isFetching}
                        className='w-full sm:w-auto bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                    >
                        {isFetching ? "Creating..." : "Create Album"}
                    </button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CreateAlbumDialog
