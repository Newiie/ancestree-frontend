"use client"
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon, XIcon, PencilIcon, Trash2Icon } from 'lucide-react'

export interface LightboxPhoto {
    key: string
    url: string
}

interface LightboxProps {
    photos: LightboxPhoto[]
    startIndex: number
    albumName?: string
    onClose: () => void
    onEdit?: (photo: LightboxPhoto) => void
    onDelete?: (photo: LightboxPhoto) => Promise<void>
}

const Lightbox: React.FC<LightboxProps> = ({ photos, startIndex, albumName, onClose, onEdit, onDelete }) => {
    const [index, setIndex] = useState(startIndex)
    const touchStartX = useRef<number | null>(null)
    const onCloseRef = useRef(onClose)
    useEffect(() => { onCloseRef.current = onClose })

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') setIndex((i) => Math.min(photos.length - 1, i + 1))
            else if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1))
            else if (e.key === 'Escape') onCloseRef.current()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [photos.length])

    if (photos.length === 0) return null
    const safeIndex = Math.max(0, Math.min(index, photos.length - 1))
    const photo = photos[safeIndex]
    const isFirst = safeIndex === 0
    const isLast = safeIndex === photos.length - 1

    const handleDelete = async () => {
        if (!onDelete) return
        const wasOnly = photos.length === 1
        const wasLast = isLast
        const prevIndex = safeIndex - 1
        await onDelete(photo)
        if (wasOnly) onClose()
        else if (wasLast) setIndex(prevIndex)
        // else: stay at same index — list shifts up
    }

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
    }
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return
        const dx = e.changedTouches[0].clientX - touchStartX.current
        if (Math.abs(dx) > 50) {
            if (dx < 0 && !isLast) setIndex(safeIndex + 1)
            else if (dx > 0 && !isFirst) setIndex(safeIndex - 1)
        }
        touchStartX.current = null
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center'
            onClick={onClose}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* TOP BAR */}
            <div
                onClick={(e) => e.stopPropagation()}
                className='absolute top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 text-white'
            >
                <div className='flex items-center gap-3 text-sm text-white/70'>
                    <span>{safeIndex + 1} of {photos.length}</span>
                    {albumName && (
                        <>
                            <span className='text-white/40'>·</span>
                            <span className='truncate max-w-[40vw]'>{albumName}</span>
                        </>
                    )}
                </div>
                <div className='flex items-center gap-2'>
                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(photo)}
                            className='inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40'
                            aria-label="Edit photo"
                        >
                            <PencilIcon size={14} aria-hidden="true" /> <span className='hidden sm:inline'>Edit</span>
                        </button>
                    )}
                    {onDelete && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className='inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-rose-300 px-3 py-1.5 rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40'
                            aria-label="Delete photo"
                        >
                            <Trash2Icon size={14} aria-hidden="true" /> <span className='hidden sm:inline'>Delete</span>
                        </button>
                    )}
                    <span className='w-px h-5 bg-white/20 mx-1 hidden sm:block' />
                    <button
                        type="button"
                        onClick={onClose}
                        className='w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40'
                        aria-label="Close"
                    >
                        <XIcon size={16} aria-hidden="true" />
                    </button>
                </div>
            </div>

            {/* PHOTO */}
            <div onClick={(e) => e.stopPropagation()} className='relative w-[90vw] max-w-[1200px] h-[80vh]'>
                <Image
                    src={photo.url}
                    alt={`Photo ${safeIndex + 1}`}
                    fill
                    sizes="90vw"
                    className='object-contain'
                    priority
                />
            </div>

            {/* PREV / NEXT — desktop only */}
            {!isFirst && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        setIndex(safeIndex - 1)
                    }}
                    className='hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40'
                    aria-label="Previous photo"
                >
                    <ChevronLeftIcon size={22} aria-hidden="true" />
                </button>
            )}
            {!isLast && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        setIndex(safeIndex + 1)
                    }}
                    className='hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40'
                    aria-label="Next photo"
                >
                    <ChevronRightIcon size={22} aria-hidden="true" />
                </button>
            )}
        </div>
    )
}

export default Lightbox
