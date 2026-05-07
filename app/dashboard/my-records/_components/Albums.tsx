import { CirclePlus } from 'lucide-react'
import React, { useEffect } from 'react'
import Folder from './Folder'
import galleryService from '@/services/api/galleryService'
import { useRecords } from '@/providers/RecordsProvider'
import useError from '@/hooks/useError'
import Image from 'next/image'

interface AlbumsProps {
    onAddAlbum: () => void;
}

const Albums: React.FC<AlbumsProps> = ({ onAddAlbum }) => {
    const { isFetching, albums, setAlbums } = useRecords();
    const { setError } = useError();

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const albums = await galleryService.getAlbums();
                setAlbums(albums);
            } catch (error) {
                setError('Failed to fetch albums:')
            }
        };
        fetchAlbums();
    }, [setAlbums, isFetching, setError]);

    return (
        <div className='w-full'>
            <div className='flex justify-start mb-4'>
                <button
                    onClick={onAddAlbum}
                    className='inline-flex items-center gap-2 text-sm bg-white text-primary border border-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors'
                >
                    <CirclePlus size={16} />
                    Add New Album
                </button>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4 w-full'>
                {albums.length > 0 ? (
                    albums.map((album) => (
                        <div key={album.id} className='w-full'>
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
