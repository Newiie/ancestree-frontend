import React, { useState } from 'react';
import Image from 'next/image';
import { PencilIcon, Trash2Icon, EllipsisVerticalIcon, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useParams } from 'next/navigation';
import galleryService from '@/services/api/galleryService';
import { useRecords } from '@/providers/RecordsProvider';
import useError from '@/hooks/useError';

const ImageContainer = ({ photo }: { photo: { key: string; url: string } }) => {
  const { albumId } = useParams();
  const { setIsFetching } = useRecords();
  const { setError } = useError();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleEditPhoto = async () => {
    if (!selectedFile) return;

    try {
      setIsUpdating(true);
      setIsFetching(true);
      const formData = new FormData();
      formData.append('photo', selectedFile);
      await galleryService.editPhoto(albumId as string, photo.key, formData);
      setIsEditOpen(false);
      setIsPopoverOpen(false);
      clearSelection();
    } catch (error) {
      setError('Failed to update photo');
    } finally {
      setIsUpdating(false);
      setIsFetching(false);
    }
  };

  return (
    <div className='relative w-full aspect-square rounded-[4px] overflow-hidden group'>
      <Image 
        src={photo.url} 
        className='h-full w-full object-cover' 
        alt="placeholder" 
        width={1000} 
        height={1000} 
      />
      <div className='absolute top-0 left-0 w-full h-full bg-black/20'></div>
      
      <div className='absolute top-0 left-0 w-full h-full flex justify-center items-start'>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger>
            <div className='
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
            '>
              <EllipsisVerticalIcon className='text-[#FAFAFA]' size={12} />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-40 mt-8 w-[8rem] p-1">
            <div className="flex flex-col">
              <AlertDialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <AlertDialogTrigger asChild>
                  <button className="p-1 hover:bg-gray-100 cursor-pointer text-gray-700 flex gap-2 items-center">
                    <PencilIcon size={16} />
                    Edit
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Update Photo</AlertDialogTitle>
                    <AlertDialogDescription>
                      Select a new photo to replace the current one
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
                    <AlertDialogCancel onClick={() => {
                      clearSelection();
                      setIsPopoverOpen(false);
                    }}>
                      Cancel
                    </AlertDialogCancel>
                    <button 
                      onClick={handleEditPhoto}
                      disabled={!selectedFile || isUpdating}
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
                      {isUpdating ? 'Updating...' : 'Update Photo'}
                    </button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
