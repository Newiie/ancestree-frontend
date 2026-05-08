"use client"
import React, { useState, useEffect } from 'react'
import ImageContainer from '../_components/ImageContainer'
import { ImagePlusIcon, ArrowLeft } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useRecords } from '@/providers/RecordsProvider'
import useError from '@/hooks/useError';
import galleryService from '@/services/api/galleryService'
import Image from 'next/image'

const FolderPage = () => {
  const { isFetching, setIsFetching } = useRecords();
  const [uploadOpen, setUploadOpen] = useState(false)
  const { setError } = useError();
  const router = useRouter();
  const albumId = useParams().albumId;
  const [album, setAlbum] = useState<any>(null);

  const photoCount = album?.photos?.length ?? 0

  useEffect(() => {
    if (!albumId) {
      router.push('/dashboard/my-records');
    }

    const fetchAlbumData = async () => {
      try {
        const album = await galleryService.getAlbum(albumId);
        setAlbum(album);
      } catch (error) {
        setError('Failed to fetch album data');
      }
    };

    fetchAlbumData();
  }, [albumId, isFetching, router, setError]);

  const handleGoBack = () => {
    router.push('/dashboard/my-records');
  };

  return (
    <div className="content | overflow-y-auto h-screen">
      <div className='bg-stone-50 text-black min-h-full p-4 sm:p-6'>
        <div className='w-full bg-white border border-stone-200 rounded-2xl p-5 sm:p-6'>
          {/* HEADER */}
          <div className='flex items-start gap-4 mb-5'>
            <button
              type="button"
              onClick={handleGoBack}
              className='p-2 rounded-full hover:bg-stone-100 transition-colors flex-shrink-0 text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              aria-label="Go back to albums"
            >
              <ArrowLeft size={20} aria-hidden="true" />
            </button>
            <div className='flex-1 min-w-0'>
              <p className='text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1'>Album</p>
              <h1 className='text-2xl font-bold text-stone-900 truncate'>{album?.name ?? ' '}</h1>
              <p className='text-sm text-stone-500 mt-0.5'>
                {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setUploadOpen(true)}
              className='inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            >
              <ImagePlusIcon size={16} aria-hidden="true" />
              Upload
            </button>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4'>
            {
              album?.photos?.length > 0 ? album.photos.map((photo: any) => (
                <ImageContainer key={photo.key} photo={photo} />
              )) : (
                <div className='col-span-full text-center text-gray-500 py-8'>
                  No photos in this album
                </div>
              )
            }
          </div>
          {/* TODO Task 9: <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} albumId={albumId as string} albumName={album?.name ?? ''} onComplete={() => setIsFetching(true)} /> */}
        </div>
      </div>
    </div>
  )
}

export default FolderPage
