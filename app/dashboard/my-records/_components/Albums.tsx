import React from 'react'
import { CirclePlus } from 'lucide-react'
import Folder from './Folder'
import { useRecords } from '@/providers/RecordsProvider'
import Image from 'next/image'

interface AlbumsProps {
    onAddAlbum: () => void;
}

const Albums: React.FC<AlbumsProps> = ({ onAddAlbum }) => {
    const { albums } = useRecords();

    return (
        <div className='w-full'>
            <div className='flex items-center justify-between mb-4'>
                <p className='text-sm text-stone-500'>
                    {albums.length} {albums.length === 1 ? 'album' : 'albums'}
                </p>
            </div>
            {albums.length > 0 ? (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3'>
                    {albums.map((album) => (
                        <Folder key={album.id} album={album} />
                    ))}
                    <button
                        type="button"
                        onClick={onAddAlbum}
                        aria-label="New Album"
                        className='aspect-square border-2 border-dashed border-stone-300 hover:border-primary/50 hover:bg-stone-50 rounded-xl flex flex-col items-center justify-center gap-2 text-stone-500 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                    >
                        <CirclePlus size={24} aria-hidden="true" />
                        <span className='text-xs font-medium'>New Album</span>
                    </button>
                </div>
            ) : (
                <div className='flex flex-col items-center justify-center py-10 text-center'>
                    <Image
                        src='/images/no-albums.svg'
                        alt='No albums'
                        width={250}
                        height={250}
                        className='mb-4 opacity-70'
                    />
                    <h3 className='text-lg font-semibold text-stone-900 mb-2'>No Albums Yet</h3>
                    <p className='text-sm text-stone-500 max-w-md mb-4'>
                        Your album collection is empty. Start organizing your family&apos;s memories
                        by creating your first album.
                    </p>
                    <button
                        type="button"
                        onClick={onAddAlbum}
                        className='inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                    >
                        <CirclePlus size={16} aria-hidden="true" />
                        Create First Album
                    </button>
                </div>
            )}
        </div>
    )
}

export default Albums
