"use client"
import React, { useRef, useState } from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { UploadCloudIcon, XIcon, CheckIcon, RotateCwIcon } from 'lucide-react'
import Image from 'next/image'
import galleryService from '@/services/api/galleryService'
import { useRecords } from '@/providers/RecordsProvider'
import { toast } from 'sonner'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

type EntryStatus = 'pending' | 'uploading' | 'done' | 'error'
interface FileEntry {
    id: string
    file: File
    preview: string
    status: EntryStatus
    error?: string
}

interface UploadDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    albumId: string
    albumName: string
    onComplete: () => void
}

const UploadDialog: React.FC<UploadDialogProps> = ({ open, onOpenChange, albumId, albumName, onComplete }) => {
    const { setIsFetching } = useRecords()
    const [entries, setEntries] = useState<FileEntry[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [phase, setPhase] = useState<'idle' | 'uploading'>('idle')
    const inputRef = useRef<HTMLInputElement>(null)

    const reset = () => {
        setEntries([])
        setPhase('idle')
    }

    const addFiles = (files: FileList | File[]) => {
        const next: FileEntry[] = []
        Array.from(files).forEach((file) => {
            if (!file.type.startsWith('image/')) return
            const id = `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`
            const isOversize = file.size > MAX_FILE_SIZE
            const reader = new FileReader()
            reader.onload = () => {
                setEntries((prev) =>
                    prev.map((e) => (e.id === id ? { ...e, preview: reader.result as string } : e))
                )
            }
            reader.readAsDataURL(file)
            next.push({
                id,
                file,
                preview: '',
                status: isOversize ? 'error' : 'pending',
                error: isOversize ? 'Too large (max 10MB)' : undefined,
            })
        })
        setEntries((prev) => [...prev, ...next])
    }

    const removeEntry = (id: string) => {
        if (phase === 'uploading') return
        setEntries((prev) => prev.filter((e) => e.id !== id))
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) addFiles(e.target.files)
        e.target.value = '' // allow re-selecting the same file
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (phase === 'uploading') return
        addFiles(e.dataTransfer.files)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        if (phase === 'uploading') return
        setIsDragging(true)
    }

    const handleDragLeave = () => setIsDragging(false)

    const setEntry = (id: string, patch: Partial<FileEntry>) => {
        setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))
    }

    const startUpload = async () => {
        setPhase('uploading')
        let done = 0
        let failed = 0
        for (const entry of entries) {
            if (entry.status === 'error') {
                failed += 1
                continue
            }
            setEntry(entry.id, { status: 'uploading' })
            try {
                const fd = new FormData()
                fd.append('photo', entry.file)
                await galleryService.uploadPhoto(albumId, fd)
                setEntry(entry.id, { status: 'done' })
                done += 1
            } catch (err) {
                setEntry(entry.id, { status: 'error', error: String(err) })
                failed += 1
            }
        }
        if (failed === 0) {
            toast.success(`Uploaded ${done} ${done === 1 ? 'photo' : 'photos'}`)
            onComplete()
            setIsFetching((v) => !v) // trigger provider refetch
            reset()
            onOpenChange(false)
        } else {
            toast.error(`${done} uploaded, ${failed} failed`)
            setPhase('idle')
            // keep the dialog open so the user can retry / dismiss
        }
    }

    const total = entries.length
    const validCount = entries.filter((e) => e.status !== 'error').length
    const totalSize = entries.reduce((s, e) => s + e.file.size, 0)
    const formatSize = (b: number) => `${(b / 1024 / 1024).toFixed(1)} MB`
    const doneCount = entries.filter((e) => e.status === 'done').length
    const isUploading = phase === 'uploading'

    return (
        <AlertDialog
            open={open}
            onOpenChange={(next) => {
                if (isUploading) return // can't close while uploading
                if (!next) reset()
                onOpenChange(next)
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{isUploading ? 'Uploading photos' : 'Upload photos'}</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <span>
                            {isUploading
                                ? `${doneCount} of ${total} done · don't close this dialog`
                                : total > 0
                                    ? <><span>{total} {total === 1 ? 'photo selected' : 'photos selected'}</span><span className='text-stone-400'> · {formatSize(totalSize)} total</span></>
                                    : `Add to ${albumName}. JPG, PNG, or HEIC up to 10MB each.`}
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                />

                {/* Progress bar while uploading */}
                {isUploading && (
                    <div className='w-full h-1 bg-stone-100 rounded-full overflow-hidden mb-3'>
                        <div
                            className='h-full bg-primary transition-all'
                            style={{ width: `${total === 0 ? 0 : (doneCount / total) * 100}%` }}
                        />
                    </div>
                )}

                {/* Empty state */}
                {!isUploading && total === 0 && (
                    <div
                        data-testid="upload-dropzone"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => inputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                            isDragging ? 'border-primary bg-primary/5' : 'border-stone-300 bg-stone-50'
                        }`}
                    >
                        <div className='w-12 h-12 rounded-xl bg-[#EAF1E5] text-primary mx-auto mb-3 flex items-center justify-center'>
                            <UploadCloudIcon size={22} />
                        </div>
                        <p className='text-sm font-medium text-stone-700 mb-1'>Drop photos here</p>
                        <p className='text-xs text-stone-500'>
                            or <span className='text-primary font-semibold underline'>browse from your device</span>
                        </p>
                    </div>
                )}

                {/* Selected / Uploading thumbnails */}
                {total > 0 && (
                    <>
                        <div className='grid grid-cols-4 gap-1.5 mb-2'>
                            {entries.map((e) => (
                                <div key={e.id} className='relative aspect-square rounded-lg overflow-hidden bg-stone-100'>
                                    {e.preview && (
                                        <Image
                                            src={e.preview}
                                            alt={e.file.name}
                                            fill
                                            sizes="100px"
                                            className='object-cover'
                                        />
                                    )}
                                    {e.status === 'done' && (
                                        <div className='absolute inset-0 bg-black/50 flex items-center justify-center text-white'>
                                            <CheckIcon size={20} />
                                        </div>
                                    )}
                                    {e.status === 'uploading' && (
                                        <div className='absolute inset-0 bg-white/40 flex items-center justify-center text-primary text-xs font-bold'>
                                            …
                                        </div>
                                    )}
                                    {e.status === 'error' && (
                                        <div className='absolute inset-0 bg-rose-500/70 flex flex-col items-center justify-center text-white text-[10px] p-1 text-center'>
                                            <RotateCwIcon size={14} />
                                            <span>{e.error?.includes('Too large') ? '> 10MB' : 'Failed'}</span>
                                        </div>
                                    )}
                                    {!isUploading && e.status !== 'done' && (
                                        <button
                                            type="button"
                                            onClick={(ev) => {
                                                ev.stopPropagation()
                                                removeEntry(e.id)
                                            }}
                                            className='absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80'
                                            aria-label="Remove"
                                        >
                                            <XIcon size={11} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {!isUploading && (
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => inputRef.current?.click()}
                                className={`border border-dashed rounded-lg py-2.5 text-center text-xs cursor-pointer transition-colors ${
                                    isDragging ? 'border-primary bg-primary/5 text-primary' : 'border-stone-300 bg-stone-50 text-stone-500'
                                }`}
                            >
                                <span className='text-primary font-semibold'>+ Add more</span>{' '}
                                <span className='text-stone-400'>or drop photos here</span>
                            </div>
                        )}
                    </>
                )}

                {/* Error message for individual oversize file shown via tile, but show a top-level note for screen readers + clarity */}
                {entries.some((e) => e.status === 'error' && e.error?.includes('Too large')) && (
                    <p className='text-xs text-rose-600 mt-2'>
                        Some files are too large (10MB limit) — they will be skipped.
                    </p>
                )}

                <div className='flex justify-end gap-2 mt-3'>
                    <button
                        type="button"
                        onClick={() => {
                            if (!isUploading) {
                                reset()
                                onOpenChange(false)
                            }
                        }}
                        disabled={isUploading}
                        className='text-sm text-stone-700 px-3 py-2 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50'
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={startUpload}
                        disabled={validCount === 0 || isUploading}
                        className='text-sm text-white px-4 py-2 bg-primary rounded-lg hover:bg-primary/90 font-medium disabled:bg-primary/40 disabled:cursor-not-allowed'
                    >
                        {isUploading ? 'Uploading…' : validCount === 0 ? 'Upload' : `Upload ${validCount} ${validCount === 1 ? 'photo' : 'photos'}`}
                    </button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default UploadDialog
