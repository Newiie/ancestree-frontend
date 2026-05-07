# My Records Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Gallery (`/dashboard/my-records`) to match the home-redesign visual system (`bg-stone-50`, white cards, primary green CTAs), upgrade the upload UX to multi-file drag-and-drop, and add a fullscreen lightbox photo viewer.

**Architecture:** All changes confined to `app/dashboard/my-records/` and its `_components/`. No backend or service-layer changes. Multi-upload is implemented as sequential client-side calls to the existing single-photo endpoint. Two new dialog components are extracted (`CreateAlbumDialog`, `EditPhotoDialog`) so their open-state can be lifted to parent pages, allowing the new Lightbox and page-header CTAs to trigger them.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript strict, Tailwind CSS, shadcn/ui (`AlertDialog`, `Popover`), `lucide-react` icons, `useRecords` provider, Jest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-05-07-my-records-redesign-design.md`

---

## File Map

**Modified:**
- `app/dashboard/my-records/page.tsx` — outer wrapper, header, pill tabs, photo grid, opens Lightbox
- `app/dashboard/my-records/[albumId]/page.tsx` — outer wrapper, header, opens UploadDialog and Lightbox
- `app/dashboard/my-records/_components/Albums.tsx` — folder grid + dashed "+ New Album" tile, uses lifted CreateAlbumDialog
- `app/dashboard/my-records/_components/Folder.tsx` — cover-thumbnail card layout
- `app/dashboard/my-records/_components/ImageContainer.tsx` — restyled hover overlay; delegates edit dialog to parent

**New:**
- `app/dashboard/my-records/_components/CreateAlbumDialog.tsx` — extracted create-album dialog (open-state lifted to page)
- `app/dashboard/my-records/_components/UploadDialog.tsx` — multi-file drag-and-drop upload
- `app/dashboard/my-records/_components/EditPhotoDialog.tsx` — extracted edit-photo dialog (open-state lifted to page)
- `app/dashboard/my-records/_components/Lightbox.tsx` — fullscreen photo viewer
- `__tests__/components/my-records/UploadDialog.test.tsx` — tests for file filtering and state transitions
- `__tests__/components/my-records/Lightbox.test.tsx` — tests for keyboard navigation

**Deleted:**
- `app/dashboard/my-records/_components/AddAlbum.tsx` — unused stub that just renders the string `"AddAlbum"`

**Untouched:**
- `services/api/galleryService.ts`, `providers/RecordsProvider.tsx`, all routes, all data shapes.

---

## What must NOT change

- Existing logic in `RecordsProvider.fetchAlbums` (already fixed earlier this session — returns `data?.albums ?? []`).
- The shape of `Album` / `Photo` interfaces in `RecordsProvider.tsx`.
- Any service in `services/api/galleryService.ts`.
- Any route. Folder URLs stay `/dashboard/my-records/[albumId]`.

---

## Task 1: Outer page wrappers

**Files:**
- Modify: `app/dashboard/my-records/page.tsx:17-19` (outer wrapper)
- Modify: `app/dashboard/my-records/[albumId]/page.tsx:80-83` (outer wrapper)

### Step 1: Update index page wrapper

- [ ] In `app/dashboard/my-records/page.tsx`, find lines 17-20:

```tsx
<div className="content | overflow-y-auto h-screen">
    <div className='bg-[#DFDFDF] text-black h-full p-4 sm:p-6'>
        <div className='w-full p-4 h-full bg-gray-100 rounded-lg shadow-md'>
```

Replace with:

```tsx
<div className="content | overflow-y-auto h-screen">
    <div className='bg-stone-50 text-black min-h-full p-4 sm:p-6'>
        <div className='w-full bg-white border border-stone-200 rounded-2xl p-5 sm:p-6'>
```

### Step 2: Update album-detail page wrapper

- [ ] In `app/dashboard/my-records/[albumId]/page.tsx`, find lines 80-83:

```tsx
<div className="content | overflow-y-auto">
  <div className='bg-[#DFDFDF] text-black h-full p-4 sm:p-6'>
    <div className='w-full p-4 h-full bg-gray-100 rounded-lg shadow-md'>
```

Replace with:

```tsx
<div className="content | overflow-y-auto h-screen">
  <div className='bg-stone-50 text-black min-h-full p-4 sm:p-6'>
    <div className='w-full bg-white border border-stone-200 rounded-2xl p-5 sm:p-6'>
```

### Step 3: Verify

- [ ] Run: `npx tsc --noEmit`
- [ ] Expected: no errors
- [ ] Manually open `/dashboard/my-records` and a folder — pages render with the new background and white card. Existing content (heading, tabs, grid) still shows, just on the new chrome.

### Step 4: Commit

```bash
git add app/dashboard/my-records/page.tsx app/dashboard/my-records/[albumId]/page.tsx
git commit -m "refactor: update my-records outer wrappers to match design system"
```

---

## Task 2: Extract `CreateAlbumDialog` component

**Files:**
- Create: `app/dashboard/my-records/_components/CreateAlbumDialog.tsx`
- Modify: `app/dashboard/my-records/_components/Albums.tsx`
- Modify: `app/dashboard/my-records/page.tsx`

**Why this is a refactor with no visible change:** Today the create-album dialog lives inside `Albums.tsx`, so it only exists in the DOM when the Albums tab is active. Subsequent tasks need the page header to also trigger it (visible on both tabs), so we lift the dialog to the page level. No behavior change yet.

### Step 1: Create the component

- [ ] Create `app/dashboard/my-records/_components/CreateAlbumDialog.tsx`:

```tsx
"use client"
import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import galleryService from '@/services/api/galleryService'
import { useRecords } from '@/providers/RecordsProvider'
import useError from '@/hooks/useError'

interface CreateAlbumDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const CreateAlbumDialog: React.FC<CreateAlbumDialogProps> = ({ open, onOpenChange }) => {
    const { isFetching, setIsFetching } = useRecords()
    const { setError } = useError()
    const [albumName, setAlbumName] = useState("")

    const handleCreate = async () => {
        if (!albumName.trim()) return
        setIsFetching(true)
        try {
            await galleryService.addAlbum(albumName)
            setAlbumName("")
            onOpenChange(false)
        } catch (error) {
            setError('Error creating album')
        } finally {
            setIsFetching(false)
        }
    }

    const handleCancel = () => {
        setAlbumName("")
        onOpenChange(false)
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Create New Album</AlertDialogTitle>
                    <AlertDialogDescription>
                        Give your album a name to help you organize your records
                    </AlertDialogDescription>
                    <Input
                        type="text"
                        value={albumName}
                        onChange={(e) => setAlbumName(e.target.value)}
                        placeholder="Album name"
                    />
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                    <button
                        onClick={handleCreate}
                        disabled={!albumName.trim() || isFetching}
                        className='w-full sm:w-auto bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed'
                    >
                        {isFetching ? "Creating..." : "Create Album"}
                    </button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CreateAlbumDialog
```

### Step 2: Lift `createAlbumOpen` state into the index page

- [ ] In `app/dashboard/my-records/page.tsx`, add state and render the dialog. After the existing `useState("All Photos")` line, add:

```tsx
const [createAlbumOpen, setCreateAlbumOpen] = useState(false)
```

- [ ] Add the import at the top:

```tsx
import CreateAlbumDialog from './_components/CreateAlbumDialog'
```

- [ ] Render the dialog at the end of the outer JSX (just before the final closing `</div>` of the outer wrapper):

```tsx
<CreateAlbumDialog open={createAlbumOpen} onOpenChange={setCreateAlbumOpen} />
```

### Step 3: Make `Albums.tsx` use the lifted dialog instead of its own

- [ ] In `app/dashboard/my-records/_components/Albums.tsx`, accept a callback prop. Update the function signature:

```tsx
interface AlbumsProps {
    onAddAlbum: () => void;
}

const Albums: React.FC<AlbumsProps> = ({ onAddAlbum }) => {
```

- [ ] Remove all of the dialog markup (lines 53-119 — the `AlertDialog` block including `AlertDialogTrigger`, `AlertDialogContent`, etc.) and the local state variables (`albumName`, `isOpen`, `handleCreateAlbum`, `setError`). Replace the trigger button with a plain button that calls `onAddAlbum`:

```tsx
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
        {/* existing grid stays unchanged for now */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-4 w-full'>
            {/* ... existing folder rendering code ... */}
        </div>
    </div>
)
```

- [ ] Drop the now-unused imports: `AlertDialog`, `AlertDialogContent`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogTrigger`, `AlertDialogCancel`, `Input`, `galleryService`, `useError`. Drop `setError` from the `useRecords` destructure if it was pulled in. Keep: `CirclePlus`, `useState` (still needed?), `useEffect`, `Folder`, `useRecords`, `Image`. Actually `useState` and `useEffect` and `galleryService` are still used by the duplicate-fetch effect — that effect is removed in Task 6, so for now just keep the imports needed for the grid.

### Step 4: Pass the callback from `page.tsx`

- [ ] In `app/dashboard/my-records/page.tsx`, find the line `{ selectedTab === "Albums" && <Albums /> }` and replace with:

```tsx
{ selectedTab === "Albums" && <Albums onAddAlbum={() => setCreateAlbumOpen(true)} /> }
```

### Step 5: Verify

- [ ] Run: `npx tsc --noEmit`
- [ ] Expected: no errors
- [ ] Manual: open the Albums tab, click "Add New Album", confirm the dialog still opens and creating an album still works.

### Step 6: Commit

```bash
git add app/dashboard/my-records/_components/CreateAlbumDialog.tsx app/dashboard/my-records/_components/Albums.tsx app/dashboard/my-records/page.tsx
git commit -m "refactor: extract CreateAlbumDialog and lift open-state to page"
```

---

## Task 3: Index page header + pill tabs

**Files:**
- Modify: `app/dashboard/my-records/page.tsx`

### Step 1: Replace heading and tab strip

- [ ] In `app/dashboard/my-records/page.tsx`, find the heading + tab block (currently around lines 21-45):

```tsx
<h1 className='text-xl sm:text-2xl font-bold mb-4'>Gallery</h1>
<div className='flex items-center border-b-1 border-primary overflow-x-auto'>
    {["All Photos", "Albums"].map((item, index) => (
        <div
            key={index}
            onClick={() => setSelectedTab(item)}
            className={`...`}
        >
            {item}
        </div>
    ))}
</div>
```

Replace the entire block with:

```tsx
{/* HEADER */}
<div className='flex items-start justify-between gap-4 mb-5'>
    <div>
        <p className='text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1'>Records</p>
        <h1 className='text-2xl font-bold text-stone-900'>Gallery</h1>
        <p className='text-sm text-stone-500 mt-0.5'>
            {photoCount} {photoCount === 1 ? 'photo' : 'photos'} · {albums.length} {albums.length === 1 ? 'album' : 'albums'}
        </p>
    </div>
    <button
        onClick={() => setCreateAlbumOpen(true)}
        className='inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors flex-shrink-0'
    >
        <PlusIcon size={16} />
        New Album
    </button>
</div>

{/* PILL TABS */}
<div className='inline-flex gap-0.5 bg-stone-100 p-0.5 rounded-xl mb-5'>
    {["All Photos", "Albums"].map((item) => {
        const active = selectedTab === item
        return (
            <button
                key={item}
                onClick={() => setSelectedTab(item)}
                className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                    active
                        ? 'bg-white text-stone-900 shadow-sm font-semibold'
                        : 'text-stone-500 hover:text-stone-700 font-medium'
                }`}
            >
                {item}
            </button>
        )
    })}
</div>
```

### Step 2: Compute `photoCount` and add `PlusIcon` import

- [ ] At the top of the file, add `PlusIcon` to the lucide-react import (or the existing one):

```tsx
import { PlusIcon } from 'lucide-react'
```

- [ ] Inside the `Page` component, just after `useRecords()`, add:

```tsx
const photoCount = albums.reduce((sum, a) => sum + (a?.photos?.length ?? 0), 0)
```

### Step 3: Verify

- [ ] Run: `npx tsc --noEmit`
- [ ] Expected: no errors
- [ ] Manual: index page now shows the eyebrow "RECORDS", title "Gallery", subline like "0 photos · 0 albums", and a "+ New Album" CTA on the right. Tabs are pill-shaped with active state. The CTA opens the create dialog (works because of Task 2's state lift).

### Step 4: Commit

```bash
git add app/dashboard/my-records/page.tsx
git commit -m "feat: redesign index page header and tabs"
```

---

## Task 4: Photo grid — denser, rounded-xl

**Files:**
- Modify: `app/dashboard/my-records/page.tsx`
- Modify: `app/dashboard/my-records/_components/ImageContainer.tsx`

### Step 1: Update grid wrapper on the index page

- [ ] In `app/dashboard/my-records/page.tsx`, find the grid container (currently around line 46):

```tsx
<div className={`grid ${selectedTab === "Albums" ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"}  gap-4 p-4`}>
```

Replace with:

```tsx
<div className={
    selectedTab === "Albums"
        ? 'grid grid-cols-1'
        : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2'
}>
```

### Step 2: Update photo tile rounding in `ImageContainer.tsx`

- [ ] In `app/dashboard/my-records/_components/ImageContainer.tsx`, find line 90:

```tsx
<div className='relative w-full aspect-square rounded-[4px] overflow-hidden group'>
```

Replace with:

```tsx
<div className='relative w-full aspect-square rounded-xl overflow-hidden group cursor-pointer'>
```

(The `cursor-pointer` is preparation for Task 11 where clicking opens the lightbox. It's harmless before then since today there's no click handler.)

### Step 3: Verify

- [ ] Run: `npx tsc --noEmit`
- [ ] Expected: no errors
- [ ] Manual: All Photos tab shows tighter-spaced photos with rounded-xl corners.

### Step 4: Commit

```bash
git add app/dashboard/my-records/page.tsx app/dashboard/my-records/_components/ImageContainer.tsx
git commit -m "refactor: denser photo grid with rounded-xl tiles"
```

---

## Task 5: Folder card redesign

**Files:**
- Modify: `app/dashboard/my-records/_components/Folder.tsx`

### Step 1: Replace the entire return block

- [ ] In `app/dashboard/my-records/_components/Folder.tsx`, find the `return (` block (line 66-206) and replace the outer card markup. The full new return:

```tsx
return (
    <div className='group relative bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow'>
        {/* COVER (clickable area for navigation) */}
        <div
            onClick={() => router.push(`/dashboard/my-records/${album.id}`)}
            className='cursor-pointer'
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
        </div>

        {/* NAME STRIP */}
        <div className='flex items-center justify-between gap-2 px-3 py-2.5'>
            <div
                onClick={() => router.push(`/dashboard/my-records/${album.id}`)}
                className='min-w-0 flex-1 cursor-pointer'
            >
                <p className='text-sm font-semibold text-stone-900 truncate'>{album.name}</p>
                {(!album.photos || album.photos.length === 0) && (
                    <p className='text-xs text-stone-400 mt-0.5'>Empty</p>
                )}
            </div>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger
                    data-popover-trigger
                    onClick={(e) => e.stopPropagation()}
                    className='p-1 rounded hover:bg-stone-100 text-stone-500 flex-shrink-0'
                >
                    <EllipsisVerticalIcon size={16} />
                </PopoverTrigger>
                <PopoverContent className="w-40 sm:w-32">
                    <div className="flex flex-col">
                        <AlertDialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                            <AlertDialogTrigger asChild>
                                <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-2 hover:bg-gray-100 cursor-pointer text-gray-700 flex gap-2 items-center text-sm"
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
                                        className='w-full sm:w-auto bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed'
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
                            className="p-2 hover:bg-gray-100 cursor-pointer text-red-600 flex gap-2 items-center text-sm"
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
```

### Step 2: Update imports in `Folder.tsx`

- [ ] Add `FolderClosedIcon` to the lucide-react import:

```tsx
import { FolderClosedIcon, EllipsisVerticalIcon, PencilIcon, Trash2Icon } from 'lucide-react'
```

- [ ] Add `Image` from next/image:

```tsx
import Image from 'next/image'
```

- [ ] The `stringifyAlbum` helper (lines 34-38) is no longer needed since we use `truncate` CSS for long names — delete it.

- [ ] Existing handlers (`handleDelete`, `handleEdit`) and state (`isEditOpen`, `newAlbumName`, `isPopoverOpen`) stay as-is.

### Step 3: Verify

- [ ] Run: `npx tsc --noEmit`
- [ ] Expected: no errors
- [ ] Manual: Albums tab shows folder cards with cover thumbnails (or folder icon for empty albums), photo count badge, and a kebab menu that still rename/deletes correctly. Clicking the cover or name navigates to the album.

### Step 4: Commit

```bash
git add app/dashboard/my-records/_components/Folder.tsx
git commit -m "feat: redesign folder card with cover thumbnail"
```

---

## Task 6: "+ New Album" tile in folder grid + remove duplicate fetch

**Files:**
- Modify: `app/dashboard/my-records/_components/Albums.tsx`

### Step 1: Replace the Albums grid with the new layout

- [ ] In `app/dashboard/my-records/_components/Albums.tsx`, the file should now be a focused grid component (after Task 2's surgery). Replace its return block entirely with:

```tsx
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
                    onClick={onAddAlbum}
                    className='aspect-square border-2 border-dashed border-stone-300 hover:border-primary/50 hover:bg-stone-50 rounded-xl flex flex-col items-center justify-center gap-2 text-stone-500 hover:text-primary transition-colors'
                >
                    <CirclePlus size={24} />
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
                    onClick={onAddAlbum}
                    className='inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors'
                >
                    <CirclePlus size={16} />
                    Create First Album
                </button>
            </div>
        )}
    </div>
)
```

### Step 2: Remove the duplicate fetch effect

- [ ] In `Albums.tsx`, the existing `useEffect` (lines 27-37) that calls `galleryService.getAlbums()` duplicates `RecordsProvider.fetchAlbums()`. Delete it entirely.

- [ ] Also remove the now-unused imports: `useState`, `useEffect`, `galleryService`, `useError`. Drop `setIsFetching` and `setAlbums` from the `useRecords` destructure if they're no longer used. The minimal `useRecords` destructure becomes:

```tsx
const { albums } = useRecords()
```

- [ ] Remove the unused `useError()` invocation and the unused `setError`.

### Step 3: Final imports

The file should end up with imports roughly like:

```tsx
import React from 'react'
import { CirclePlus } from 'lucide-react'
import Folder from './Folder'
import { useRecords } from '@/providers/RecordsProvider'
import Image from 'next/image'
```

### Step 4: Verify

- [ ] Run: `npx tsc --noEmit`
- [ ] Run: `npm run lint`
- [ ] Expected: no errors
- [ ] Manual: Albums tab shows the count subline, the folder grid with the dashed "+ New Album" tile at the end. Empty state shows the SVG + a primary CTA. Both the tile and the CTA open the create dialog (via `onAddAlbum` from page.tsx).

### Step 5: Commit

```bash
git add app/dashboard/my-records/_components/Albums.tsx
git commit -m "feat: redesign albums grid with dashed New Album tile"
```

---

## Task 7: Album-detail page header

**Files:**
- Modify: `app/dashboard/my-records/[albumId]/page.tsx`

### Step 1: Replace the header block

- [ ] In `app/dashboard/my-records/[albumId]/page.tsx`, find the existing header block (lines 84-127 — the back button, title, and the `AlertDialogTrigger` for "Add Photo"). Replace it with:

```tsx
{/* HEADER */}
<div className='flex items-start gap-4 mb-5'>
    <button
        onClick={handleGoBack}
        className='p-2 rounded-full hover:bg-stone-100 transition-colors flex-shrink-0 text-stone-700'
        aria-label="Go back to albums"
    >
        <ArrowLeft size={20} />
    </button>
    <div className='flex-1 min-w-0'>
        <p className='text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1'>Album</p>
        <h1 className='text-2xl font-bold text-stone-900 truncate'>{album?.name ?? ' '}</h1>
        <p className='text-sm text-stone-500 mt-0.5'>
            {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
        </p>
    </div>
    <button
        onClick={() => setUploadOpen(true)}
        className='inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors flex-shrink-0'
    >
        <ImagePlusIcon size={16} />
        Upload
    </button>
</div>
```

### Step 2: Add `uploadOpen` state and `photoCount` derived value

- [ ] At the top of the `FolderPage` component, after the existing useState/useParams, add:

```tsx
const [uploadOpen, setUploadOpen] = useState(false)
const photoCount = album?.photos?.length ?? 0
```

### Step 3: Remove the old AlertDialog block

- [ ] Find and delete the entire `<AlertDialog open={isOpen} onOpenChange={setIsOpen}>` block (lines 103-186 in the original). It's no longer needed — the upload dialog will be replaced in Task 9. Also delete the orphaned `isOpen`, `selectedFile`, `preview`, `handleFileChange`, `clearSelection`, `handleUploadPhoto` declarations — they will move into the new `UploadDialog` component.

- [ ] Remove the imports that are no longer used: `AlertDialog`, `AlertDialogContent`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogTrigger`, `AlertDialogCancel`, `Input`, `CirclePlus`, `FolderClosedIcon`, `PencilIcon`, `X`. Keep: `ImagePlusIcon`, `ArrowLeft`, `useRouter`, `useParams`, `useRecords`, `useError`, `galleryService`, `Image`, `useState`, `useEffect`.

### Step 4: Add a placeholder where the upload dialog will mount

- [ ] At the end of the JSX, just before the final closing tag of the outermost div, add a comment for now (we'll replace this in Task 9):

```tsx
{/* TODO Task 9: <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} albumId={albumId as string} albumName={album?.name ?? ''} onComplete={() => setIsFetching(true)} /> */}
```

### Step 5: Verify

- [ ] Run: `npx tsc --noEmit`
- [ ] Expected: no errors. There may be unused-variable warnings for `setUploadOpen` — the state is consumed by the header button but TS may flag the comment. If so, leave it; we'll fix it in Task 9. To suppress, you can wrap the placeholder in `{false && <div />}` — but it's not needed since the state is used by the header button.
- [ ] Manual: album detail page shows the new header (eyebrow "ALBUM", title, photo count, primary "Upload" CTA). Clicking Upload sets state but no dialog appears yet — that's expected; Task 9 wires it up.

### Step 6: Commit

```bash
git add app/dashboard/my-records/[albumId]/page.tsx
git commit -m "feat: redesign album-detail page header"
```

---

## Task 8: Build `UploadDialog` component (with logic test)

**Files:**
- Create: `app/dashboard/my-records/_components/UploadDialog.tsx`
- Create: `__tests__/components/my-records/UploadDialog.test.tsx`

### Step 1: Write the failing test

- [ ] Create `__tests__/components/my-records/UploadDialog.test.tsx`:

```tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UploadDialog from '@/app/dashboard/my-records/_components/UploadDialog'

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        return <img {...props} />
    },
}))

const mockUpload = jest.fn()
jest.mock('@/services/api/galleryService', () => ({
    __esModule: true,
    default: {
        uploadPhoto: (...args: unknown[]) => mockUpload(...args),
    },
}))

jest.mock('@/providers/RecordsProvider', () => ({
    useRecords: () => ({ setIsFetching: jest.fn() }),
}))

jest.mock('sonner', () => ({
    toast: { success: jest.fn(), error: jest.fn() },
}))

const makeFile = (name: string, type = 'image/png', size = 1000) => {
    const f = new File(['x'.repeat(size)], name, { type })
    return f
}

describe('UploadDialog', () => {
    beforeEach(() => {
        mockUpload.mockReset()
    })

    it('shows the empty dropzone when first opened', () => {
        render(
            <UploadDialog
                open={true}
                onOpenChange={() => {}}
                albumId="a1"
                albumName="Test"
                onComplete={() => {}}
            />
        )
        expect(screen.getByText(/drop photos here/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /upload/i })).toBeDisabled()
    })

    it('filters out non-image files when dropping', () => {
        const onChange = jest.fn()
        render(
            <UploadDialog
                open={true}
                onOpenChange={onChange}
                albumId="a1"
                albumName="Test"
                onComplete={() => {}}
            />
        )
        const dropzone = screen.getByTestId('upload-dropzone')
        const dataTransfer = {
            files: [makeFile('a.png', 'image/png'), makeFile('b.pdf', 'application/pdf')],
        }
        fireEvent.drop(dropzone, { dataTransfer })

        // Only a.png should appear; b.pdf is silently filtered
        expect(screen.getByText('1 photo selected')).toBeInTheDocument()
    })

    it('rejects files exceeding the size cap', () => {
        render(
            <UploadDialog
                open={true}
                onOpenChange={() => {}}
                albumId="a1"
                albumName="Test"
                onComplete={() => {}}
            />
        )
        const dropzone = screen.getByTestId('upload-dropzone')
        // 11MB > 10MB cap
        const big = makeFile('big.png', 'image/png', 11 * 1024 * 1024)
        fireEvent.drop(dropzone, { dataTransfer: { files: [big] } })
        expect(screen.getByText(/too large/i)).toBeInTheDocument()
    })

    it('uploads each file sequentially when Upload is clicked', async () => {
        mockUpload.mockResolvedValue({ ok: true })
        const onComplete = jest.fn()
        render(
            <UploadDialog
                open={true}
                onOpenChange={() => {}}
                albumId="a1"
                albumName="Test"
                onComplete={onComplete}
            />
        )
        const dropzone = screen.getByTestId('upload-dropzone')
        fireEvent.drop(dropzone, {
            dataTransfer: {
                files: [makeFile('1.png'), makeFile('2.png'), makeFile('3.png')],
            },
        })
        fireEvent.click(screen.getByRole('button', { name: /upload 3 photos/i }))
        await waitFor(() => expect(mockUpload).toHaveBeenCalledTimes(3))
        expect(onComplete).toHaveBeenCalledTimes(1)
    })
})
```

### Step 2: Run the test to verify it fails

- [ ] Run: `npm test -- UploadDialog`
- [ ] Expected: FAIL with "Cannot find module '@/app/dashboard/my-records/_components/UploadDialog'" (file doesn't exist yet)

### Step 3: Create the component

- [ ] Create `app/dashboard/my-records/_components/UploadDialog.tsx`:

```tsx
"use client"
import React, { useRef, useState } from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { UploadCloudIcon, XIcon, CheckIcon, RotateCwIcon } from 'lucide-react'
import Image from 'next/image'
import galleryService from '@/services/api/galleryService'
import { useRecords } from '@/providers/RecordsProvider'
import { toast } from 'sonner'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

type EntryStatus = 'pending' | 'uploading' | 'done' | 'error'
interface FileEntry {
    id: string
    file: File
    preview: string
    status: EntryStatus
    error?: string
}

interface UploadDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    albumId: string
    albumName: string
    onComplete: () => void
}

const UploadDialog: React.FC<UploadDialogProps> = ({ open, onOpenChange, albumId, albumName, onComplete }) => {
    const { setIsFetching } = useRecords()
    const [entries, setEntries] = useState<FileEntry[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [phase, setPhase] = useState<'idle' | 'uploading'>('idle')
    const inputRef = useRef<HTMLInputElement>(null)

    const reset = () => {
        setEntries([])
        setPhase('idle')
    }

    const addFiles = (files: FileList | File[]) => {
        const next: FileEntry[] = []
        Array.from(files).forEach((file) => {
            if (!file.type.startsWith('image/')) return
            const id = `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`
            const isOversize = file.size > MAX_FILE_SIZE
            const reader = new FileReader()
            reader.onload = () => {
                setEntries((prev) =>
                    prev.map((e) => (e.id === id ? { ...e, preview: reader.result as string } : e))
                )
            }
            reader.readAsDataURL(file)
            next.push({
                id,
                file,
                preview: '',
                status: isOversize ? 'error' : 'pending',
                error: isOversize ? 'Too large (max 10MB)' : undefined,
            })
        })
        setEntries((prev) => [...prev, ...next])
    }

    const removeEntry = (id: string) => {
        if (phase === 'uploading') return
        setEntries((prev) => prev.filter((e) => e.id !== id))
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) addFiles(e.target.files)
        e.target.value = '' // allow re-selecting the same file
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (phase === 'uploading') return
        addFiles(e.dataTransfer.files)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        if (phase === 'uploading') return
        setIsDragging(true)
    }

    const handleDragLeave = () => setIsDragging(false)

    const setEntry = (id: string, patch: Partial<FileEntry>) => {
        setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))
    }

    const startUpload = async () => {
        setPhase('uploading')
        let done = 0
        let failed = 0
        for (const entry of entries) {
            if (entry.status === 'error') {
                failed += 1
                continue
            }
            setEntry(entry.id, { status: 'uploading' })
            try {
                const fd = new FormData()
                fd.append('photo', entry.file)
                await galleryService.uploadPhoto(albumId, fd)
                setEntry(entry.id, { status: 'done' })
                done += 1
            } catch (err) {
                setEntry(entry.id, { status: 'error', error: String(err) })
                failed += 1
            }
        }
        if (failed === 0) {
            toast.success(`Uploaded ${done} ${done === 1 ? 'photo' : 'photos'}`)
            onComplete()
            setIsFetching((v) => !v) // trigger provider refetch
            reset()
            onOpenChange(false)
        } else {
            toast.error(`${done} uploaded, ${failed} failed`)
            setPhase('idle')
            // keep the dialog open so the user can retry / dismiss
        }
    }

    const total = entries.length
    const validCount = entries.filter((e) => e.status !== 'error').length
    const totalSize = entries.reduce((s, e) => s + e.file.size, 0)
    const formatSize = (b: number) => `${(b / 1024 / 1024).toFixed(1)} MB`
    const doneCount = entries.filter((e) => e.status === 'done').length
    const isUploading = phase === 'uploading'

    return (
        <AlertDialog
            open={open}
            onOpenChange={(next) => {
                if (isUploading) return // can't close while uploading
                if (!next) reset()
                onOpenChange(next)
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{isUploading ? 'Uploading photos' : 'Upload photos'}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {isUploading
                            ? `${doneCount} of ${total} done · don't close this dialog`
                            : total > 0
                                ? `${total} ${total === 1 ? 'photo selected' : 'photos selected'} · ${formatSize(totalSize)} total`
                                : `Add to ${albumName}. JPG, PNG, or HEIC up to 10MB each.`}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                />

                {/* Progress bar while uploading */}
                {isUploading && (
                    <div className='w-full h-1 bg-stone-100 rounded-full overflow-hidden mb-3'>
                        <div
                            className='h-full bg-primary transition-all'
                            style={{ width: `${total === 0 ? 0 : (doneCount / total) * 100}%` }}
                        />
                    </div>
                )}

                {/* Empty state */}
                {!isUploading && total === 0 && (
                    <div
                        data-testid="upload-dropzone"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => inputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                            isDragging ? 'border-primary bg-primary/5' : 'border-stone-300 bg-stone-50'
                        }`}
                    >
                        <div className='w-12 h-12 rounded-xl bg-[#EAF1E5] text-primary mx-auto mb-3 flex items-center justify-center'>
                            <UploadCloudIcon size={22} />
                        </div>
                        <p className='text-sm font-medium text-stone-700 mb-1'>Drop photos here</p>
                        <p className='text-xs text-stone-500'>
                            or <span className='text-primary font-semibold underline'>browse from your device</span>
                        </p>
                    </div>
                )}

                {/* Selected / Uploading thumbnails */}
                {total > 0 && (
                    <>
                        <div className='grid grid-cols-4 gap-1.5 mb-2'>
                            {entries.map((e) => (
                                <div key={e.id} className='relative aspect-square rounded-lg overflow-hidden bg-stone-100'>
                                    {e.preview && (
                                        <Image
                                            src={e.preview}
                                            alt={e.file.name}
                                            fill
                                            sizes="100px"
                                            className='object-cover'
                                        />
                                    )}
                                    {e.status === 'done' && (
                                        <div className='absolute inset-0 bg-black/50 flex items-center justify-center text-white'>
                                            <CheckIcon size={20} />
                                        </div>
                                    )}
                                    {e.status === 'uploading' && (
                                        <div className='absolute inset-0 bg-white/40 flex items-center justify-center text-primary text-xs font-bold'>
                                            …
                                        </div>
                                    )}
                                    {e.status === 'error' && (
                                        <div className='absolute inset-0 bg-rose-500/70 flex flex-col items-center justify-center text-white text-[10px] p-1 text-center'>
                                            <RotateCwIcon size={14} />
                                            <span>{e.error?.includes('Too large') ? 'Too large' : 'Failed'}</span>
                                        </div>
                                    )}
                                    {!isUploading && e.status !== 'done' && (
                                        <button
                                            onClick={(ev) => {
                                                ev.stopPropagation()
                                                removeEntry(e.id)
                                            }}
                                            className='absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80'
                                            aria-label="Remove"
                                        >
                                            <XIcon size={11} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {!isUploading && (
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => inputRef.current?.click()}
                                className={`border border-dashed rounded-lg py-2.5 text-center text-xs cursor-pointer transition-colors ${
                                    isDragging ? 'border-primary bg-primary/5 text-primary' : 'border-stone-300 bg-stone-50 text-stone-500'
                                }`}
                            >
                                <span className='text-primary font-semibold'>+ Add more</span>{' '}
                                <span className='text-stone-400'>or drop photos here</span>
                            </div>
                        )}
                    </>
                )}

                {/* Error message for individual oversize file shown via tile, but show a top-level note for screen readers + clarity */}
                {entries.some((e) => e.status === 'error' && e.error?.includes('Too large')) && (
                    <p className='text-xs text-rose-600 mt-2'>
                        Some files are too large (10MB limit) — they will be skipped.
                    </p>
                )}

                <div className='flex justify-end gap-2 mt-3'>
                    <button
                        onClick={() => {
                            if (!isUploading) {
                                reset()
                                onOpenChange(false)
                            }
                        }}
                        disabled={isUploading}
                        className='text-sm text-stone-700 px-3 py-2 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={startUpload}
                        disabled={validCount === 0 || isUploading}
                        className='text-sm text-white px-4 py-2 bg-primary rounded-lg hover:bg-primary/90 font-medium disabled:bg-primary/40 disabled:cursor-not-allowed'
                    >
                        {isUploading ? 'Uploading…' : validCount === 0 ? 'Upload' : `Upload ${validCount} ${validCount === 1 ? 'photo' : 'photos'}`}
                    </button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default UploadDialog
```

### Step 4: Run tests

- [ ] Run: `npm test -- UploadDialog`
- [ ] Expected: PASS — all 4 tests green.

### Step 5: Commit

```bash
git add app/dashboard/my-records/_components/UploadDialog.tsx __tests__/components/my-records/UploadDialog.test.tsx
git commit -m "feat: add UploadDialog with multi-file drag-and-drop"
```

---

## Task 9: Wire `UploadDialog` into album-detail page

**Files:**
- Modify: `app/dashboard/my-records/[albumId]/page.tsx`

### Step 1: Add the import and replace the placeholder

- [ ] Add to imports:

```tsx
import UploadDialog from '../_components/UploadDialog'
```

- [ ] Find the `{/* TODO Task 9: ... */}` comment from Task 7 and replace with:

```tsx
<UploadDialog
    open={uploadOpen}
    onOpenChange={setUploadOpen}
    albumId={albumId as string}
    albumName={album?.name ?? ''}
    onComplete={() => setIsFetching(true)}
/>
```

- [ ] `setIsFetching` from `useRecords()` is already destructured. Verify.

### Step 2: Verify

- [ ] Run: `npx tsc --noEmit`
- [ ] Expected: no errors
- [ ] Manual: open an album, click "Upload" — new dialog opens with drop zone. Drag a few JPG/PNG files, see thumbnails. Click "Upload N photos" — uploads sequentially with per-tile progress. After completion, dialog closes and the album re-fetches showing the new photos. Drop a non-image — silently filtered.

### Step 3: Commit

```bash
git add app/dashboard/my-records/[albumId]/page.tsx
git commit -m "feat: wire UploadDialog into album-detail page"
```

---

## Task 10: Build `Lightbox` component (with keyboard test)

**Files:**
- Create: `app/dashboard/my-records/_components/Lightbox.tsx`
- Create: `__tests__/components/my-records/Lightbox.test.tsx`

### Step 1: Write the failing test

- [ ] Create `__tests__/components/my-records/Lightbox.test.tsx`:

```tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Lightbox from '@/app/dashboard/my-records/_components/Lightbox'

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        const { fill: _fill, ...rest } = props
        return <img {...rest} />
    },
}))

const photos = [
    { key: 'a', url: 'http://x/a.jpg' },
    { key: 'b', url: 'http://x/b.jpg' },
    { key: 'c', url: 'http://x/c.jpg' },
]

describe('Lightbox', () => {
    it('shows the photo at startIndex', () => {
        render(<Lightbox photos={photos} startIndex={1} onClose={() => {}} />)
        expect(screen.getByText('2 of 3')).toBeInTheDocument()
        expect(screen.getByRole('img')).toHaveAttribute('src', 'http://x/b.jpg')
    })

    it('advances on right arrow key', () => {
        render(<Lightbox photos={photos} startIndex={0} onClose={() => {}} />)
        fireEvent.keyDown(window, { key: 'ArrowRight' })
        expect(screen.getByText('2 of 3')).toBeInTheDocument()
    })

    it('goes back on left arrow key', () => {
        render(<Lightbox photos={photos} startIndex={2} onClose={() => {}} />)
        fireEvent.keyDown(window, { key: 'ArrowLeft' })
        expect(screen.getByText('2 of 3')).toBeInTheDocument()
    })

    it('does not advance past the last photo', () => {
        render(<Lightbox photos={photos} startIndex={2} onClose={() => {}} />)
        fireEvent.keyDown(window, { key: 'ArrowRight' })
        expect(screen.getByText('3 of 3')).toBeInTheDocument()
    })

    it('calls onClose when Escape is pressed', () => {
        const onClose = jest.fn()
        render(<Lightbox photos={photos} startIndex={0} onClose={onClose} />)
        fireEvent.keyDown(window, { key: 'Escape' })
        expect(onClose).toHaveBeenCalled()
    })

    it('shows the album name when provided', () => {
        render(<Lightbox photos={photos} startIndex={0} albumName="Family Reunion" onClose={() => {}} />)
        expect(screen.getByText('Family Reunion')).toBeInTheDocument()
    })

    it('renders Edit and Delete buttons only when handlers provided', () => {
        const { rerender } = render(<Lightbox photos={photos} startIndex={0} onClose={() => {}} />)
        expect(screen.queryByRole('button', { name: /edit/i })).toBeNull()
        rerender(<Lightbox photos={photos} startIndex={0} onClose={() => {}} onEdit={() => {}} onDelete={async () => {}} />)
        expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })
})
```

### Step 2: Run the test to verify it fails

- [ ] Run: `npm test -- Lightbox`
- [ ] Expected: FAIL with "Cannot find module '.../Lightbox'"

### Step 3: Create the component

- [ ] Create `app/dashboard/my-records/_components/Lightbox.tsx`:

```tsx
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

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') setIndex((i) => Math.min(photos.length - 1, i + 1))
            else if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1))
            else if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [photos.length, onClose])

    if (photos.length === 0) return null
    const safeIndex = Math.max(0, Math.min(index, photos.length - 1))
    const photo = photos[safeIndex]
    const isFirst = safeIndex === 0
    const isLast = safeIndex === photos.length - 1

    const handleDelete = async () => {
        if (!onDelete) return
        await onDelete(photo)
        if (photos.length === 1) onClose()
        else if (isLast) setIndex(safeIndex - 1)
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
                            onClick={() => onEdit(photo)}
                            className='inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm'
                            aria-label="Edit photo"
                        >
                            <PencilIcon size={14} /> <span className='hidden sm:inline'>Edit</span>
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            className='inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-rose-300 px-3 py-1.5 rounded-lg text-sm'
                            aria-label="Delete photo"
                        >
                            <Trash2Icon size={14} /> <span className='hidden sm:inline'>Delete</span>
                        </button>
                    )}
                    <span className='w-px h-5 bg-white/20 mx-1 hidden sm:block' />
                    <button
                        onClick={onClose}
                        className='w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center'
                        aria-label="Close"
                    >
                        <XIcon size={16} />
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
                    onClick={(e) => {
                        e.stopPropagation()
                        setIndex(safeIndex - 1)
                    }}
                    className='hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full items-center justify-center'
                    aria-label="Previous photo"
                >
                    <ChevronLeftIcon size={22} />
                </button>
            )}
            {!isLast && (
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        setIndex(safeIndex + 1)
                    }}
                    className='hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full items-center justify-center'
                    aria-label="Next photo"
                >
                    <ChevronRightIcon size={22} />
                </button>
            )}
        </div>
    )
}

export default Lightbox
```

### Step 4: Run the tests

- [ ] Run: `npm test -- Lightbox`
- [ ] Expected: PASS — all 7 tests green.

### Step 5: Commit

```bash
git add app/dashboard/my-records/_components/Lightbox.tsx __tests__/components/my-records/Lightbox.test.tsx
git commit -m "feat: add Lightbox photo viewer with keyboard nav"
```

---

## Task 11: Wire `Lightbox` into both pages (view-only)

**Files:**
- Modify: `app/dashboard/my-records/page.tsx`
- Modify: `app/dashboard/my-records/[albumId]/page.tsx`
- Modify: `app/dashboard/my-records/_components/ImageContainer.tsx`

### Step 1: Add a click handler prop to `ImageContainer.tsx`

- [ ] In `app/dashboard/my-records/_components/ImageContainer.tsx`, change the props signature:

```tsx
interface ImageContainerProps {
    photo: { key: string; url: string }
    onPhotoClick?: () => void
}

const ImageContainer: React.FC<ImageContainerProps> = ({ photo, onPhotoClick }) => {
```

- [ ] Wrap the click on the outer div (the `aspect-square` block) so it fires `onPhotoClick` only if the click target is not the popover trigger or its descendants. Replace the outer wrapper return JSX top to:

```tsx
return (
    <div
        onClick={(e) => {
            if (!(e.target as HTMLElement).closest('[data-photo-menu]')) {
                onPhotoClick?.()
            }
        }}
        className='relative w-full aspect-square rounded-xl overflow-hidden group cursor-pointer'
    >
        {/* existing inner markup unchanged */}
    </div>
)
```

- [ ] Add `data-photo-menu` to the `PopoverTrigger` *and* the `PopoverContent` so clicks on the kebab dot itself or anywhere inside the open menu don't bubble to "open lightbox":

```tsx
<PopoverTrigger asChild data-photo-menu>
    <div className='absolute bg-black/55 ...'>
        <EllipsisVerticalIcon ... />
    </div>
</PopoverTrigger>
<PopoverContent data-photo-menu className="...">
```

Note: `PopoverContent` from shadcn renders into a portal, so its clicks won't actually bubble through the photo wrapper anyway — but tagging it is defense-in-depth in case shadcn's behavior changes. The trigger tag is the load-bearing one.

### Step 2: Wire Lightbox into the index page

- [ ] In `app/dashboard/my-records/page.tsx`, add state and import:

```tsx
import Lightbox, { LightboxPhoto } from './_components/Lightbox'
```

```tsx
const [lightboxState, setLightboxState] = useState<{ photos: LightboxPhoto[]; index: number; albumName: string } | null>(null)
```

- [ ] Build a flat list of all photos with their album context (just before the existing `albums.flatMap` JSX block):

```tsx
const allPhotos = albums.flatMap((album) =>
    (album?.photos ?? []).map((p) => ({ photo: p, albumName: album.name }))
)
```

- [ ] Update the photo grid to use `allPhotos` instead of the inline flatMap, and pass `onPhotoClick`:

```tsx
{allPhotos.length > 0 ? (
    allPhotos.map(({ photo, albumName }, i) => (
        <ImageContainer
            key={`${photo.key}-${i}`}
            photo={photo}
            onPhotoClick={() =>
                setLightboxState({
                    photos: allPhotos.map((x) => x.photo),
                    index: i,
                    albumName,
                })
            }
        />
    ))
) : (
    /* existing empty-state SVG block, unchanged */
)}
```

(This replaces both the "length > 0" branch's inline flatMap and the existing duplicate `albums.flatMap` block — there should only be one render path now.)

- [ ] Render the Lightbox at the end of the page JSX:

```tsx
{lightboxState && (
    <Lightbox
        photos={lightboxState.photos}
        startIndex={lightboxState.index}
        albumName={lightboxState.albumName}
        onClose={() => setLightboxState(null)}
    />
)}
```

### Step 3: Wire Lightbox into the album-detail page

- [ ] In `app/dashboard/my-records/[albumId]/page.tsx`, add state and import:

```tsx
import Lightbox, { LightboxPhoto } from '../_components/Lightbox'
```

```tsx
const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
```

- [ ] Update the photo grid:

```tsx
{album?.photos && album.photos.length > 0 ? album.photos.map((photo: LightboxPhoto, i: number) => (
    <ImageContainer
        key={photo.key}
        photo={photo}
        onPhotoClick={() => setLightboxIndex(i)}
    />
)) : (
    /* existing empty-state, color-refreshed in Task 14 */
)}
```

- [ ] Render the Lightbox at the end of the page JSX:

```tsx
{lightboxIndex !== null && album?.photos && (
    <Lightbox
        photos={album.photos}
        startIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
    />
)}
```

(No `albumName` passed — it's redundant on the album page.)

### Step 4: Verify

- [ ] Run: `npx tsc --noEmit`
- [ ] Run: `npm test`
- [ ] Expected: no TS errors, all tests pass.
- [ ] Manual: click any photo on the index page or in an album — lightbox opens. Use ← / → / Esc. Click backdrop to close. Click on the photo itself does not close. Click on the kebab menu does not open the lightbox.

### Step 5: Commit

```bash
git add app/dashboard/my-records/page.tsx app/dashboard/my-records/[albumId]/page.tsx app/dashboard/my-records/_components/ImageContainer.tsx
git commit -m "feat: wire Lightbox into gallery pages"
```

---

## Task 12: Extract `EditPhotoDialog` component

**Files:**
- Create: `app/dashboard/my-records/_components/EditPhotoDialog.tsx`
- Modify: `app/dashboard/my-records/_components/ImageContainer.tsx`

**Why:** The Lightbox top bar needs to trigger photo edit. Today the edit dialog lives inside `ImageContainer.tsx`. Extracting it lets the parent page own the open-state and trigger from either the kebab or the Lightbox.

### Step 1: Create `EditPhotoDialog.tsx`

- [ ] Create `app/dashboard/my-records/_components/EditPhotoDialog.tsx`:

```tsx
"use client"
import React, { useState, useEffect, useRef } from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { UploadCloudIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import galleryService from '@/services/api/galleryService'
import { useRecords } from '@/providers/RecordsProvider'
import useError from '@/hooks/useError'

interface EditPhotoDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    albumId: string
    photoKey: string | null  // null when no photo selected
}

const EditPhotoDialog: React.FC<EditPhotoDialogProps> = ({ open, onOpenChange, albumId, photoKey }) => {
    const { setIsFetching } = useRecords()
    const { setError } = useError()
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!open) {
            setSelectedFile(null)
            setPreview(null)
        }
    }, [open])

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) return
        setSelectedFile(file)
        const r = new FileReader()
        r.onloadend = () => setPreview(r.result as string)
        r.readAsDataURL(file)
    }

    const handleSubmit = async () => {
        if (!selectedFile || !photoKey) return
        setIsUpdating(true)
        setIsFetching(true)
        try {
            const fd = new FormData()
            fd.append('photo', selectedFile)
            await galleryService.editPhoto(albumId, photoKey, fd)
            onOpenChange(false)
        } catch (err) {
            setError('Failed to update photo')
        } finally {
            setIsUpdating(false)
            setIsFetching(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={(next) => !isUpdating && onOpenChange(next)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Update photo</AlertDialogTitle>
                    <AlertDialogDescription>Replace this photo with a new one.</AlertDialogDescription>
                </AlertDialogHeader>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    className="hidden"
                />

                {!preview ? (
                    <div
                        onClick={() => inputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault()
                            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
                        }}
                        className='border-2 border-dashed border-stone-300 bg-stone-50 rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors'
                    >
                        <div className='w-12 h-12 rounded-xl bg-[#EAF1E5] text-primary mx-auto mb-3 flex items-center justify-center'>
                            <UploadCloudIcon size={22} />
                        </div>
                        <p className='text-sm font-medium text-stone-700 mb-1'>Drop a photo here</p>
                        <p className='text-xs text-stone-500'>or <span className='text-primary font-semibold underline'>browse</span></p>
                    </div>
                ) : (
                    <div className='relative aspect-video rounded-xl overflow-hidden bg-stone-100'>
                        <Image src={preview} alt="Preview" fill sizes="500px" className='object-contain' />
                        <button
                            onClick={() => {
                                setSelectedFile(null)
                                setPreview(null)
                            }}
                            className='absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80'
                            aria-label="Clear"
                        >
                            <XIcon size={14} />
                        </button>
                    </div>
                )}

                <div className='flex justify-end gap-2 mt-3'>
                    <button
                        onClick={() => onOpenChange(false)}
                        disabled={isUpdating}
                        className='text-sm text-stone-700 px-3 py-2 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 disabled:opacity-50'
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedFile || isUpdating}
                        className='text-sm text-white px-4 py-2 bg-primary rounded-lg hover:bg-primary/90 font-medium disabled:bg-primary/40 disabled:cursor-not-allowed'
                    >
                        {isUpdating ? 'Updating…' : 'Update Photo'}
                    </button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default EditPhotoDialog
```

### Step 2: Strip the edit dialog out of `ImageContainer.tsx`

- [ ] In `app/dashboard/my-records/_components/ImageContainer.tsx`, accept new props for delegating edit:

```tsx
interface ImageContainerProps {
    photo: { key: string; url: string }
    onPhotoClick?: () => void
    onEditClick?: () => void  // NEW — opens parent's EditPhotoDialog
}
```

- [ ] Replace the kebab menu's `<AlertDialog>...</AlertDialog>` block (the entire edit dialog) with a plain button:

```tsx
<button
    onClick={(e) => {
        e.stopPropagation()
        setIsPopoverOpen(false)
        onEditClick?.()
    }}
    className="p-1 hover:bg-gray-100 cursor-pointer text-gray-700 flex gap-2 items-center"
>
    <PencilIcon size={16} />
    Edit
</button>
```

- [ ] Remove now-unused state and handlers from `ImageContainer.tsx`: `selectedFile`, `setSelectedFile`, `preview`, `setPreview`, `isEditOpen`, `setIsEditOpen`, `isUpdating`, `setIsUpdating`, `handleFileChange`, `clearSelection`, `handleEditPhoto`. Also remove unused imports: `AlertDialog`, `AlertDialogContent`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogTrigger`, `AlertDialogCancel`, `Input`, `X`. Keep: `PencilIcon`, `Trash2Icon`, `EllipsisVerticalIcon`, `Popover`, `PopoverContent`, `PopoverTrigger`, `useParams`, `galleryService`, `useRecords`, `useError`, `Image`, `useState` (for `isDeleting` and `isPopoverOpen`).

### Step 3: Verify

- [ ] Run: `npx tsc --noEmit`
- [ ] Expected: no errors.
- [ ] Manual (no wiring yet — comes in Task 13): the Edit button in the kebab menu now does nothing visibly. Delete still works. The component compiles. We'll wire it next.

### Step 4: Commit

```bash
git add app/dashboard/my-records/_components/EditPhotoDialog.tsx app/dashboard/my-records/_components/ImageContainer.tsx
git commit -m "refactor: extract EditPhotoDialog from ImageContainer"
```

---

## Task 13: Wire Edit / Delete from kebab and Lightbox

**Files:**
- Modify: `app/dashboard/my-records/[albumId]/page.tsx`
- Modify: `app/dashboard/my-records/page.tsx`

### Step 1: Album-detail page — wire EditPhotoDialog and Lightbox actions

- [ ] In `app/dashboard/my-records/[albumId]/page.tsx`, add imports and state:

```tsx
import EditPhotoDialog from '../_components/EditPhotoDialog'
import galleryService from '@/services/api/galleryService'
```

```tsx
const [editTarget, setEditTarget] = useState<{ key: string } | null>(null)
const { setIsFetching } = useRecords()  // already destructured; verify
```

- [ ] Update the `ImageContainer` render to pass `onEditClick`:

```tsx
{album.photos.map((photo: LightboxPhoto, i: number) => (
    <ImageContainer
        key={photo.key}
        photo={photo}
        onPhotoClick={() => setLightboxIndex(i)}
        onEditClick={() => setEditTarget({ key: photo.key })}
    />
))}
```

- [ ] Update the Lightbox render to pass `onEdit` and `onDelete`:

```tsx
{lightboxIndex !== null && album?.photos && (
    <Lightbox
        photos={album.photos}
        startIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onEdit={(p) => {
            setLightboxIndex(null)
            setEditTarget({ key: p.key })
        }}
        onDelete={async (p) => {
            try {
                await galleryService.deletePhoto(albumId as string, p.key)
                setIsFetching(true)
            } catch {
                setError('Failed to delete photo')
            }
        }}
    />
)}
```

- [ ] Render `EditPhotoDialog` at the end of the page:

```tsx
<EditPhotoDialog
    open={editTarget !== null}
    onOpenChange={(next) => { if (!next) setEditTarget(null) }}
    albumId={albumId as string}
    photoKey={editTarget?.key ?? null}
/>
```

### Step 2: Index page — same wiring (Edit only; Delete also routes through galleryService)

- [ ] In `app/dashboard/my-records/page.tsx`, add similar state. Note: each photo on the index belongs to a different album. `editTarget` and the deletion call need to know which `albumId` to use — extend the state shape:

```tsx
const [editTarget, setEditTarget] = useState<{ albumId: string; photoKey: string } | null>(null)
```

- [ ] Update `allPhotos` to also carry `albumId`:

```tsx
const allPhotos = albums.flatMap((album) =>
    (album?.photos ?? []).map((p) => ({ photo: p, albumName: album.name, albumId: album.id }))
)
```

- [ ] Update the `ImageContainer` render to pass `onEditClick`:

```tsx
allPhotos.map(({ photo, albumName, albumId }, i) => (
    <ImageContainer
        key={`${photo.key}-${i}`}
        photo={photo}
        onPhotoClick={() =>
            setLightboxState({
                photos: allPhotos.map((x) => x.photo),
                index: i,
                albumName,
            })
        }
        onEditClick={() => setEditTarget({ albumId, photoKey: photo.key })}
    />
))
```

- [ ] Update Lightbox render. We need to know which album the *current* photo belongs to. Build a parallel array:

```tsx
{lightboxState && (() => {
    const ctx = allPhotos[lightboxState.index]
    return (
        <Lightbox
            photos={lightboxState.photos}
            startIndex={lightboxState.index}
            albumName={lightboxState.albumName}
            onClose={() => setLightboxState(null)}
            onEdit={(p) => {
                setLightboxState(null)
                setEditTarget({ albumId: ctx.albumId, photoKey: p.key })
            }}
            onDelete={async (p) => {
                try {
                    await galleryService.deletePhoto(ctx.albumId, p.key)
                    setIsFetching(true)
                } catch {
                    // setError if useError is wired in
                }
            }}
        />
    )
})()}
```

- [ ] Add imports:

```tsx
import EditPhotoDialog from './_components/EditPhotoDialog'
import galleryService from '@/services/api/galleryService'
```

- [ ] Render the dialog (with `setIsFetching` destructured from `useRecords` if not already):

```tsx
<EditPhotoDialog
    open={editTarget !== null}
    onOpenChange={(next) => { if (!next) setEditTarget(null) }}
    albumId={editTarget?.albumId ?? ''}
    photoKey={editTarget?.photoKey ?? null}
/>
```

### Step 3: Verify

- [ ] Run: `npx tsc --noEmit`
- [ ] Run: `npm test`
- [ ] Expected: no TS errors; tests pass.
- [ ] Manual:
  - On album detail: open a photo in the Lightbox → click Edit → Lightbox closes, edit dialog opens; replace photo, dialog closes, photo updates in grid.
  - On album detail: open a photo in the Lightbox → click Delete → photo deleted, lightbox advances or closes if last.
  - On index page: same behaviors work; deletes hit the correct album's endpoint.
  - The kebab "Edit" on a photo card also opens the same dialog (without going through lightbox first).

### Step 4: Commit

```bash
git add app/dashboard/my-records/[albumId]/page.tsx app/dashboard/my-records/page.tsx
git commit -m "feat: wire Edit/Delete from kebab and Lightbox"
```

---

## Task 14: Empty state polish + delete `AddAlbum.tsx` stub

**Files:**
- Modify: `app/dashboard/my-records/page.tsx`
- Modify: `app/dashboard/my-records/[albumId]/page.tsx`
- Delete: `app/dashboard/my-records/_components/AddAlbum.tsx`

### Step 1: Refresh empty-state colors on the index page

- [ ] In `app/dashboard/my-records/page.tsx`, find the `No Photos Yet` block (in the `allPhotos.length === 0` branch). Replace the heading and body classes:

```tsx
<div className='col-span-full flex flex-col items-center justify-center py-10 text-center'>
    <Image
        src='/images/no-photos.svg'
        alt='No photos'
        width={250}
        height={250}
        className='mb-4 opacity-70'
    />
    <h3 className='text-lg font-semibold text-stone-900 mb-2'>No Photos Yet</h3>
    <p className='text-sm text-stone-500 max-w-md'>
        Your photo collection is empty. Start capturing and organizing
        your family&apos;s memories by uploading your first photo.
    </p>
</div>
```

(Removes the `text-[#1B5A1B]` heading color and `text-gray-600` body color — both replaced with the new tokens.)

### Step 2: Refresh empty-state colors on the album-detail page

- [ ] In `app/dashboard/my-records/[albumId]/page.tsx`, find the empty-state for an album with no photos:

```tsx
{
    album?.photos?.length > 0 ? album.photos.map(...) : (
        <div className='col-span-full text-center text-gray-500 py-8'>
            No photos in this album
        </div>
    )
}
```

Replace the empty branch with a richer empty state matching the index page:

```tsx
<div className='col-span-full flex flex-col items-center justify-center py-10 text-center'>
    <Image
        src='/images/no-photos.svg'
        alt='No photos'
        width={200}
        height={200}
        className='mb-4 opacity-70'
    />
    <h3 className='text-lg font-semibold text-stone-900 mb-2'>No Photos Yet</h3>
    <p className='text-sm text-stone-500 max-w-md mb-4'>
        This album is empty. Upload your first photo to get started.
    </p>
    <button
        onClick={() => setUploadOpen(true)}
        className='inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors'
    >
        <ImagePlusIcon size={16} />
        Upload First Photo
    </button>
</div>
```

### Step 3: Delete the unused stub

- [ ] Run:

```bash
rm app/dashboard/my-records/_components/AddAlbum.tsx
```

(Confirm with `grep -r "AddAlbum" app/dashboard/my-records/` first to make sure nothing imports it. Today nothing does.)

### Step 4: Verify

- [ ] Run: `npx tsc --noEmit`
- [ ] Run: `npm run lint`
- [ ] Run: `npm test`
- [ ] Expected: clean across all three.
- [ ] Manual:
  - With no albums: empty state on Albums tab shows "Create First Album" CTA.
  - With an empty album: detail page shows "Upload First Photo" CTA that opens the upload dialog.
  - All chrome matches the home-redesign system.

### Step 5: Final commit

```bash
git add app/dashboard/my-records/page.tsx app/dashboard/my-records/[albumId]/page.tsx
git rm app/dashboard/my-records/_components/AddAlbum.tsx
git commit -m "polish: empty-state colors and remove unused AddAlbum stub"
```

---

## Done

After all 14 tasks, the Gallery is:

- Visually consistent with the home redesign (`bg-stone-50`, white cards, primary green CTAs, eyebrow + title + count headers).
- Equipped with a multi-file drag-and-drop upload dialog with per-file progress and partial-failure handling.
- Equipped with a fullscreen lightbox supporting keyboard nav, mobile swipe, and inline Edit/Delete.
- Cleaner architecturally: dialog open-states are owned by the parent page, no duplicate fetches, two stub components removed.

No backend changes. No data-shape changes. Existing test suite remains green. Two new test suites (UploadDialog, Lightbox) added.
