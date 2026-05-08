"use client"
import React, { useState, useEffect, useRef } from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { UploadCloudIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import galleryService from '@/services/api/galleryService'
import { useRecords } from '@/providers/RecordsProvider'
import useError from '@/hooks/useError'

interface EditPhotoDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    albumId: string
    photoKey: string | null  // null when no photo selected
}

const EditPhotoDialog: React.FC<EditPhotoDialogProps> = ({ open, onOpenChange, albumId, photoKey }) => {
    const { setIsFetching } = useRecords()
    const { setError } = useError()
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!open) {
            setSelectedFile(null)
            setPreview(null)
        }
    }, [open])

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) return
        setSelectedFile(file)
        const r = new FileReader()
        r.onloadend = () => setPreview(r.result as string)
        r.readAsDataURL(file)
    }

    const handleSubmit = async () => {
        if (!selectedFile || !photoKey) return
        setIsUpdating(true)
        setIsFetching(true)
        try {
            const fd = new FormData()
            fd.append('photo', selectedFile)
            await galleryService.editPhoto(albumId, photoKey, fd)
            onOpenChange(false)
        } catch (err) {
            setError('Failed to update photo')
        } finally {
            setIsUpdating(false)
            setIsFetching(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={(next) => !isUpdating && onOpenChange(next)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Update photo</AlertDialogTitle>
                    <AlertDialogDescription>Replace this photo with a new one.</AlertDialogDescription>
                </AlertDialogHeader>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    className="hidden"
                />

                {!preview ? (
                    <div
                        onClick={() => inputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault()
                            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
                        }}
                        className='border-2 border-dashed border-stone-300 bg-stone-50 rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors'
                    >
                        <div className='w-12 h-12 rounded-xl bg-[#EAF1E5] text-primary mx-auto mb-3 flex items-center justify-center'>
                            <UploadCloudIcon size={22} aria-hidden="true" />
                        </div>
                        <p className='text-sm font-medium text-stone-700 mb-1'>Drop a photo here</p>
                        <p className='text-xs text-stone-500'>or <span className='text-primary font-semibold underline'>browse</span></p>
                    </div>
                ) : (
                    <div className='relative aspect-video rounded-xl overflow-hidden bg-stone-100'>
                        <Image src={preview} alt="Preview" fill sizes="500px" className='object-contain' />
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedFile(null)
                                setPreview(null)
                            }}
                            className='absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40'
                            aria-label="Clear"
                        >
                            <XIcon size={14} aria-hidden="true" />
                        </button>
                    </div>
                )}

                <div className='flex justify-end gap-2 mt-3'>
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        disabled={isUpdating}
                        className='text-sm text-stone-700 px-3 py-2 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!selectedFile || isUpdating}
                        className='text-sm text-white px-4 py-2 bg-primary rounded-lg hover:bg-primary/90 font-medium disabled:bg-primary/40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                    >
                        {isUpdating ? 'Updating…' : 'Update Photo'}
                    </button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default EditPhotoDialog
