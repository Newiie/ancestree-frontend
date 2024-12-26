import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FolderClosedIcon, EllipsisVerticalIcon } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { useRecords } from '@/providers/RecordsProvider'
import galleryService from '@/services/api/galleryService'
import useError from '@/hooks/useError'
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
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"

const Folder = ({album}:any) => {
  const router = useRouter();
  const { setIsFetching } = useRecords();
  const { setError } = useError();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState(album.name);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const stringifyAlbum = (album: any) => {
    const albumName = album.name;
    const croppedName = albumName.length > 11 ? albumName.slice(0, 11) + '...' : albumName;
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
    <div className='relative px-2 flex items-center text-white cursor-pointer gap-2 w-[10rem] h-[2.5rem] rounded-[4px] bg-black/30 hover:bg-black/50 transition-colors duration-300 overflow-hidden'>
      <div onClick={() => {
        router.push(`/dashboard/my-records/${album._id}`)
      }} className='flex items-center gap-2 flex-grow'>
        <FolderClosedIcon className='w-6 h-6' />
        {JSON.parse(stringifyAlbum(album)).name}
      </div>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger>
          <div className='absolute top-0 right-0 bg-black/55 p-1.5 rounded-full top-2 right-2 cursor-pointer'>
            <EllipsisVerticalIcon className='text-[#FAFAFA]' size={12} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-40">
          <div className="flex flex-col">
            <AlertDialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <AlertDialogTrigger asChild>
                <button className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700 flex gap-2 items-center">
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
                  <AlertDialogCancel onClick={() => {
                    setNewAlbumName(album.name);
                    setIsPopoverOpen(false);
                  }}>
                    Cancel
                  </AlertDialogCancel>
                  <button 
                    onClick={handleEdit}
                    disabled={!newAlbumName.trim() || newAlbumName === album.name}
                    className='bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition duration-300 disabled:bg-primary/50 disabled:text-white/50 disabled:cursor-not-allowed'
                  >
                    Save Changes
                  </button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <button onClick={handleDelete} className="p-2 hover:bg-gray-100 cursor-pointer text-red-600 flex gap-2 items-center">
              <Trash2Icon size={16} />
              Delete
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default Folder