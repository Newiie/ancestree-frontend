import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderClosedIcon, EllipsisVerticalIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { useRecords } from '@/providers/RecordsProvider';
import galleryService from '@/services/api/galleryService';
import useError from '@/hooks/useError';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

const Folder = ({ album }: any) => {
  const router = useRouter();
  const { setIsFetching } = useRecords();
  const { setError } = useError();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState(album.name);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const stringifyAlbum = (album: any) => {
    const albumName = album.name;
    const croppedName = albumName.length > 30 ? albumName.slice(0, 30) + '...' : albumName;
    return JSON.stringify({ ...album, name: croppedName });
  };

  const handleDelete = async () => {
    try {
      setIsFetching(true);
      await galleryService.deleteAlbum(album._id);
      setIsFetching(false);
    } catch (error) {
      setError('Failed to delete album');
      setIsFetching(false);
    }
  };

  const handleEdit = async () => {
    if (!newAlbumName.trim() || newAlbumName === album.name) return;

    try {
      setIsFetching(true);
      await galleryService.editAlbum(album._id, newAlbumName);
      setIsEditOpen(false);
      setIsPopoverOpen(false);
    } catch (error) {
      setError('Failed to rename album');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div
      className="
        relative 
        w-full 
        h-[3rem] 
        min-w-[100px] 
        max-w-full 
        rounded-[4px] 
        bg-black/30 
        hover:bg-black/50 
        transition-colors 
        duration-300 
        overflow-hidden 
        flex 
        items-center 
        justify-between
        cursor-pointer
      "
      
    >
      <div
        className="
          flex 
          items-center 
          gap-2 
          flex-grow 
          pl-2 
          pr-8 
          text-white 
          truncate 
          sm:pr-2
        "
        onClick={(e) => {
          // Check if the click target is not within the popover trigger
          if (!e.currentTarget.querySelector('[data-popover-trigger]')?.contains(e.target as Node)) {
            router.push(`/dashboard/my-records/${album._id}`)
          }
        }}
      >
        <FolderClosedIcon className="w-5 h-5 flex-shrink-0" />
        <span className="truncate text-sm sm:text-xs">
          {JSON.parse(stringifyAlbum(album)).name}
        </span>
      </div>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger 
          data-popover-trigger 
          onClick={(e) => e.stopPropagation()} 
          className="absolute top-0 right-0 h-full sm:relative"
        >
          <div
            className="
              bg-black/55 
              p-1.5 
              h-full 
              flex 
              items-center 
              justify-center 
              cursor-pointer
            "
          >
            <EllipsisVerticalIcon className="text-[#FAFAFA]" size={16} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-40 sm:w-32">
          <div className="flex flex-col">
            <AlertDialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <AlertDialogTrigger asChild>
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700 flex gap-2 items-center"
                >
                  <PencilIcon size={16} />
                  Rename
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Rename Album</AlertDialogTitle>
                  <AlertDialogDescription>
                    Enter a new name for your album
                  </AlertDialogDescription>
                  <Input
                    type="text"
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    placeholder="Album name"
                  />
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewAlbumName(album.name);
                      setIsPopoverOpen(false);
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit();
                    }}
                    disabled={!newAlbumName.trim() || newAlbumName === album.name}
                    className="
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
                    "
                  >
                    Save Changes
                  </button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer text-red-600 flex gap-2 items-center"
            >
              <Trash2Icon size={16} />
              Delete
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Folder;
