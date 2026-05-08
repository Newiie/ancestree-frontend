import React, { useState } from 'react';
import Image from 'next/image';
import { PencilIcon, Trash2Icon, EllipsisVerticalIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useParams } from 'next/navigation';
import galleryService from '@/services/api/galleryService';
import { useRecords } from '@/providers/RecordsProvider';
import useError from '@/hooks/useError';

interface ImageContainerProps {
    photo: { key: string; url: string }
    onPhotoClick?: () => void
    onEditClick?: () => void  // NEW — opens parent's EditPhotoDialog
}

const ImageContainer: React.FC<ImageContainerProps> = ({ photo, onPhotoClick, onEditClick }) => {
  const { albumId } = useParams();
  const { setIsFetching } = useRecords();
  const { setError } = useError();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleDeletePhoto = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      setIsFetching(true);
      await galleryService.deletePhoto(albumId as string, photo.key);
    } catch (error) {
      setError('Failed to delete photo');
    } finally {
      setIsDeleting(false);
      setIsFetching(false);
    }
  };

  return (
    <div
        onClick={(e) => {
            if (!(e.target as HTMLElement).closest('[data-photo-menu]')) {
                onPhotoClick?.()
            }
        }}
        className='relative w-full aspect-square rounded-xl overflow-hidden group cursor-pointer'
    >
      <Image 
        src={photo.url} 
        className='h-full w-full object-cover' 
        alt="placeholder" 
        width={1000} 
        height={1000} 
      />
      <div className='absolute top-0 left-0 w-full h-full bg-black/20'></div>
      
      <div className='absolute top-0 left-0 w-full h-full flex justify-center items-start pointer-events-none'>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <div data-photo-menu className='
              absolute
              bg-black/55
              p-1.5
              rounded-full
              top-2
              right-2
              cursor-pointer
              opacity-0
              group-hover:opacity-100
              transition-opacity
              duration-300
              pointer-events-auto
            '>
              <EllipsisVerticalIcon className='text-[#FAFAFA]' size={12} />
            </div>
          </PopoverTrigger>
          <PopoverContent data-photo-menu className="w-40 mt-8 w-[8rem] p-1">
            <div className="flex flex-col">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsPopoverOpen(false)
                  onEditClick?.()
                }}
                className="p-1 hover:bg-gray-100 cursor-pointer text-gray-700 flex gap-2 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <PencilIcon size={16} aria-hidden="true" />
                Edit
              </button>
              <button
                onClick={handleDeletePhoto}
                disabled={isDeleting}
                className="p-1 hover:bg-gray-100 cursor-pointer text-red-600 flex gap-2 items-center disabled:opacity-50"
              >
                <Trash2Icon size={16} />
                Delete
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ImageContainer;
