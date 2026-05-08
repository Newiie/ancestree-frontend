import React, { useState } from 'react';
import Link from 'next/link';
import { FolderClosedIcon, EllipsisVerticalIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRecords } from '@/providers/RecordsProvider';
import galleryService from '@/services/api/galleryService';
import useError from '@/hooks/useError';
import {
  AlertDialog,
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
  const { setIsFetching } = useRecords();
  const { setError } = useError();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState(album.name);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setIsFetching(true);
      await galleryService.deleteAlbum(album.id);
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
      await galleryService.editAlbum(album.id, newAlbumName);
      setIsEditOpen(false);
      setIsPopoverOpen(false);
    } catch (error) {
      setError('Failed to rename album');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className='group relative bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow'>
        {/* COVER (clickable area for navigation) */}
        <Link
            href={`/dashboard/my-records/${album.id}`}
            className='block cursor-pointer'
        >
            <div className='aspect-[4/3] bg-stone-50 relative overflow-hidden'>
                {album.photos && album.photos.length > 0 ? (
                    <>
                        <Image
                            src={album.photos[0].url}
                            alt={album.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                            className='object-cover'
                        />
                        <span className='absolute bottom-2 right-2 bg-black/55 text-white text-xs font-medium px-2 py-0.5 rounded-md'>
                            {album.photos.length} {album.photos.length === 1 ? 'photo' : 'photos'}
                        </span>
                    </>
                ) : (
                    <div className='w-full h-full flex items-center justify-center text-stone-300'>
                        <FolderClosedIcon size={36} />
                    </div>
                )}
            </div>
        </Link>

        {/* NAME STRIP */}
        <div className='flex items-center justify-between gap-2 px-3 py-2.5'>
            <Link
                href={`/dashboard/my-records/${album.id}`}
                className='min-w-0 flex-1 cursor-pointer'
            >
                <p className='text-sm font-semibold text-stone-900 truncate'>{album.name}</p>
                {(!album.photos || album.photos.length === 0) && (
                    <p className='text-xs text-stone-400 mt-0.5'>Empty</p>
                )}
            </Link>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger
                    data-popover-trigger
                    onClick={(e) => e.stopPropagation()}
                    className='p-1 rounded hover:bg-stone-100 text-stone-500 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                >
                    <EllipsisVerticalIcon size={16} />
                </PopoverTrigger>
                <PopoverContent className="w-40 sm:w-32">
                    <div className="flex flex-col">
                        <AlertDialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                            <AlertDialogTrigger asChild>
                                <button
                                    type="button"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700 flex gap-2 items-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit();
                                        }}
                                        disabled={!newAlbumName.trim() || newAlbumName === album.name}
                                        className='w-full sm:w-auto bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                    >
                                        Save Changes
                                    </button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                            }}
                            className="p-2 hover:bg-gray-100 cursor-pointer text-red-600 flex gap-2 items-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <Trash2Icon size={16} />
                            Delete
                        </button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    </div>
  )
};

export default Folder;
