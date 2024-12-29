"use client"
import React, { useState, useEffect } from 'react'
import ImageContainer from '../_components/ImageContainer'
import { PencilIcon, ImagePlusIcon, X, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogCancel } from '@/components/ui/alert-dialog'
import { CirclePlus } from 'lucide-react'
import { FolderClosedIcon } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useRecords } from '@/providers/RecordsProvider'
import useError from '@/hooks/useError';
import galleryService from '@/services/api/galleryService'
import Image from 'next/image'

const FolderPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isFetching, setIsFetching } = useRecords();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { setError } = useError();
  const router = useRouter();
  const albumId = useParams().albumId;
  const [album, setAlbum] = useState<any>(null);

  useEffect(() => {
    if (!albumId) {
      router.push('/dashboard/my-records');
    }

    const fetchAlbumData = async () => {
      try {
        const album = await galleryService.getAlbum(albumId);
        console.log(album)
        setAlbum(album);
      } catch (error) {
        setError('Failed to fetch album data');
      }
    };

    fetchAlbumData();
  }, [albumId, isFetching, router, setError]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) return;
    setIsFetching(true);
    try {
      const formData = new FormData();
      formData.append('photo', selectedFile);
      await galleryService.uploadPhoto(albumId, formData);
      setIsOpen(false);
      clearSelection();
    } catch (error) {
      setError('Error uploading photo');
    } finally {
      setIsFetching(false);
    }
  };

  const handleGoBack = () => {
    router.push('/dashboard/my-records');
  };

  return (
    <div className="content | overflow-y-auto">
      <div className='bg-[#DFDFDF] text-black h-full p-4 sm:p-6'>
        <div className='w-full p-4 h-full bg-gray-100 rounded-lg shadow-md'>
          <div className='flex items-center gap-4 mb-4'>
            <button 
              onClick={handleGoBack} 
              className='
                p-2 
                rounded-full 
                hover:bg-gray-200 
                transition 
                duration-300 
                flex 
                items-center 
                justify-center
              '
              aria-label="Go back to albums"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className='text-xl sm:text-2xl font-bold'>{album?.name}</h1>
          </div>
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
                <ImagePlusIcon size={16} />
                Add Photo
              </span>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Upload Photo</AlertDialogTitle>
                <AlertDialogDescription>
                  Select a photo to add to this album
                </AlertDialogDescription>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2"
                />
                {preview && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Selected Photo:</h4>
                    <div className="relative group w-full max-w-md mx-auto">
                      <Image
                        src={preview}
                        alt="Preview"
                        width={0}
                        height={0}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={clearSelection}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                  </div>
                )}
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={clearSelection}>Cancel</AlertDialogCancel>
                <button 
                  onClick={handleUploadPhoto}
                  disabled={!selectedFile || isFetching}
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
                  {isFetching ? "Uploading..." : "Upload Photo"}
                </button>
              </AlertDialogFooter>    
            </AlertDialogContent>
          </AlertDialog>
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
        </div>
      </div>
    </div>
  )
}

export default FolderPage