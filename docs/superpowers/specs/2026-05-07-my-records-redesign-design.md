# My Records (Gallery) Visual Redesign — Design Spec

**Date:** 2026-05-07
**Scope:** `app/dashboard/my-records/` and supporting components — visual redesign + upload UX upgrade.
**Direction:** "Photo-app feel" (chosen over a minimal restyle). Reimagines folder cards, upload dialog, and adds a lightbox viewer. Uses the same design tokens established by the home redesign (`docs/superpowers/plans/2026-04-03-home-visual-redesign.md`).

---

## Goal

Bring the Gallery to the same visual quality bar as the redesigned home page, and upgrade the upload experience from a single-file picker to a modern multi-file drag-and-drop dialog. Add a lightbox photo viewer so clicking a thumbnail does something useful.

## Non-goals

- No changes to data models, API contracts, or services beyond what's needed for multi-upload.
- No backend changes. The backend's existing single-photo `POST .../albums/:id/photos` endpoint is reused — multi-upload is implemented as sequential client-side calls.
- No "Set as cover" feature. Folder covers are derived from `album.photos[0]` and require no backend support.
- No bulk-select/multi-delete on the photo grid. Edit/delete remain per-photo.
- No changes to the route structure (`/dashboard/my-records` and `/dashboard/my-records/[albumId]` stay).

## Locked scope decisions

| Decision | Choice |
|---|---|
| Multi-upload | Multi-file in one dialog, sequential uploads to existing single-photo endpoint |
| Folder cover | Auto-derived from `album.photos[0].url`, icon placeholder for empty albums |
| Photo click behavior | Opens a lightbox preview (prev/next/close, keyboard + click) |
| Drag-and-drop in upload | Yes, with click-to-browse fallback |

---

## Design tokens

Inherited from the home redesign — no new tokens introduced.

| Token | Value | Use |
|---|---|---|
| Page background | `bg-stone-50` | Outer page wrapper |
| Card surface | `bg-white border border-stone-200 rounded-2xl` | Major content cards |
| Primary | `#1B5A1B` (also `bg-primary`) | CTAs, active tab, accents |
| Primary tint | `#EAF1E5` | Icon-bubble backgrounds |
| Text strong | `text-stone-800` / `text-stone-900` | Titles |
| Text body | `text-stone-700` | Default body |
| Text muted | `text-stone-400` / `text-stone-500` | Secondary, captions |
| Eyebrow | `text-xs uppercase tracking-wider text-stone-500 font-semibold` | Section eyebrows |
| Divider | `border-stone-100` | Row separators |
| Radius scale | `rounded-xl` (8px controls, photo tiles), `rounded-2xl` (cards), `rounded-full` (icon bubbles) | |

---

## File map

**Modified:**

- `app/dashboard/my-records/page.tsx` — new header, pill tabs, denser photo grid, opens Lightbox on photo click
- `app/dashboard/my-records/[albumId]/page.tsx` — matching header, restyled "Add Photo" trigger, opens new UploadDialog and Lightbox
- `app/dashboard/my-records/_components/Albums.tsx` — restyled "+ New Album" affordance moves into the folder grid as a dashed tile; restyled create-album dialog
- `app/dashboard/my-records/_components/Folder.tsx` — new card layout: cover thumbnail (4:3) + name + photo count badge
- `app/dashboard/my-records/_components/ImageContainer.tsx` — restyled hover overlay; the edit-photo dialog gets the new dialog styling but **stays single-file**

**New:**

- `app/dashboard/my-records/_components/UploadDialog.tsx` — multi-file drag-and-drop upload, with empty / files-selected / uploading states
- `app/dashboard/my-records/_components/Lightbox.tsx` — fullscreen photo viewer with prev/next, keyboard, edit/delete

**Deleted:**

- `app/dashboard/my-records/_components/AddAlbum.tsx` — currently a stub that just renders the string `"AddAlbum"`. Unused. Remove.

**Untouched:**

- `services/api/galleryService.ts` — no API changes
- `providers/RecordsProvider.tsx` — no provider changes (already fixed earlier this session)
- All routes, all data shapes

---

## Section 1 — Page layout

### Outer wrapper (both `page.tsx` and `[albumId]/page.tsx`)

```
<div className="content overflow-y-auto h-screen">
  <div className="bg-stone-50 text-black p-4 sm:p-6 min-h-full">
    <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6">
      ... header + tabs + content ...
    </div>
  </div>
</div>
```

Replaces today's `bg-[#DFDFDF]` outer + `bg-gray-100 rounded-lg shadow-md` inner.

### Header (both pages)

```
[ eyebrow: RECORDS ]                                   [ + Upload ]
Gallery                                                (primary, only on
12 photos · 3 albums                                    [albumId] page)
```

- Eyebrow: `text-xs font-semibold uppercase tracking-wider text-stone-500`
- Title: `text-2xl font-bold text-stone-900`
- Subline: `text-sm text-stone-500`. Photo count and album count come from the existing `albums` array in `useRecords()` — flatten and count. On `[albumId]/page.tsx`, subline is `{photos.length} photos`.
- Primary CTA on the right:
  - **Index page** (`page.tsx`): `+ New Album` — opens the existing create-album dialog. Visible on both tabs (Photos and Albums).
  - **Album-detail page** (`[albumId]/page.tsx`): `+ Upload` — opens the new `UploadDialog`. Uploads are scoped to the current album.
- The dashed "+ New Album" tile in the Albums folder grid (described below) is a secondary affordance — both route through the same create-album dialog. The redundancy is intentional: header CTA is discoverable from any scroll position; in-grid tile is contextual when scanning folders.

### Tabs (Photos / Albums) — index page only

Pill segmented control replaces the bottom-border tab strip.

```
┌─────────┬────────┐
│ Photos  │ Albums │   ← active tab gets bg-white + shadow-sm
└─────────┴────────┘
```

- Container: `inline-flex gap-0.5 bg-stone-100 p-0.5 rounded-xl`
- Item (inactive): `px-4 py-1.5 text-sm font-medium text-stone-500 rounded-lg`
- Item (active): same + `bg-white text-stone-900 shadow-sm font-semibold`
- Existing `selectedTab` state stays as-is, just a different render.

Fix the `border-b-1` typo on the way out (currently invalid Tailwind).

### Photo grid — All Photos and album detail

- Grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2`
- Tile: `aspect-square rounded-xl overflow-hidden` (was `rounded-[4px]`)
- Tighter `gap-2` (was `gap-4`) for a denser photo-app feel.
- Click anywhere on the tile opens the Lightbox at that photo's index. The hover kebab menu (Edit/Delete) inside `ImageContainer.tsx` continues to work; click on the kebab does not bubble up to open the lightbox.

### Folder card (`Folder.tsx`) — Albums tab

Replaces the dark 3rem-tall pill with a real card.

```
┌──────────────────────┐
│                      │
│   cover thumbnail    │   ← 4:3, rounded-t-xl
│                      │   ← bottom-right "8 photos" badge
│                  [8] │      (hidden if empty)
├──────────────────────┤
│ Family Reunion   ⋮  │   ← name + kebab (rename/delete)
└──────────────────────┘
```

- Outer: `bg-white border border-stone-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer`
- Cover: `aspect-[4/3]` background image of `album.photos[0]?.url`. If empty, show a `bg-stone-50` block with a `FolderClosedIcon` centered in `text-stone-300`.
- Count badge: `absolute bottom-2 right-2 bg-black/55 text-white text-xs px-2 py-0.5 rounded-md` — only when `photos.length > 0`.
- Name strip: `px-3 py-2.5 flex items-center justify-between` — name `text-sm font-semibold text-stone-900 truncate`, kebab from existing Popover.
- Whole card click navigates to `/dashboard/my-records/${album.id}` (existing logic, just moved to the outer wrapper).
- Empty albums get a small `text-xs text-stone-400 mt-0.5` "Empty" caption.

### "New Album" tile

Last cell of the Albums grid is a dashed-border affordance that opens the existing create-album dialog.

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│                      │
│         +            │
│                      │
│     New Album        │
│                      │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

- Aspect ratio: match the folder card's total height. Folder cards are `aspect-[4/3]` cover + a `~44px` name strip, which roughly equals an outer `aspect-square` at the grid's typical column widths. Use `aspect-square` for the tile.
- `border-2 border-dashed border-stone-300 hover:border-primary/50 hover:bg-stone-50/50 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer text-stone-500`
- The existing top-left "Add New Album" button is removed (replaced by the page-header `+ New Album` CTA + this in-grid tile).

### Empty states

- **No albums** (Albums tab, no albums at all): keep the existing `/images/no-albums.svg`, but update heading/text colors to the new tokens (`text-stone-900` for the heading, `text-stone-500` for the body). Eyebrow above heading: `RECORDS`.
- **No photos in album** (album-detail page): keep the existing `/images/no-photos.svg`, same color update.
- **No photos at all** (All Photos with all albums empty): keep existing copy, color update only.

---

## Section 2 — Upload dialog (`UploadDialog.tsx`)

A new component used by `[albumId]/page.tsx`. Built on the existing `AlertDialog` primitive from `@/components/ui/alert-dialog`.

### Props

```ts
interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  albumId: string;
  albumName: string;
  onComplete: () => void;  // called after all uploads attempted; parent re-fetches
}
```

### Internal state

```ts
type FileEntry = {
  id: string;             // local nanoid for keys
  file: File;
  preview: string;        // dataURL from FileReader
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
};

const [entries, setEntries] = useState<FileEntry[]>([]);
const [isDragging, setIsDragging] = useState(false);
const [phase, setPhase] = useState<'idle' | 'uploading'>('idle');
```

### States

**A — empty (`entries.length === 0`):** dropzone with green icon bubble (`bg-[#EAF1E5] text-primary`), "Drop photos here", "or browse from your device" link. `onDragOver` highlights the dropzone border to `border-primary`.

**B — files selected (`entries.length > 0`, `phase === 'idle'`):** 4-column thumbnail grid with `×` remove button per tile. Below the grid, a small dashed "+ Add more or drop photos here" affordance (acts as both another dropzone and a file picker trigger). Footer: `Cancel` and `Upload N photos` (primary).

**C — uploading (`phase === 'uploading'`):** thumbnails show overlay state — `done` gets a darkened tile with white check, `uploading` shows a centered spinner, `pending` is dimmed to 40% opacity, `error` gets a red overlay with retry icon (click to retry that single file). Top of dialog shows `{N done} of {M total}` and a progress bar (`<progress value={done} max={M}>` styled, or a div with width %).

### Behavior

- **File input**: `<input type="file" multiple accept="image/*">`, hidden, triggered by the dropzone click and by the "browse" link. On change, append to `entries` (don't replace).
- **Drop**: native `onDrop` on the dropzone, calls the same handler. Filter `e.dataTransfer.files` to image MIME types; ignore others silently.
- **Preview**: each `File` is read via `FileReader.readAsDataURL` once, cached in `entry.preview`. Don't re-read on re-render.
- **Remove**: clicking `×` on a tile drops it from `entries`. Allowed only while `phase === 'idle'`.
- **Upload loop** (sequential):
  ```ts
  setPhase('uploading');
  for (const entry of entries) {
    setEntry(entry.id, { status: 'uploading' });
    try {
      const fd = new FormData();
      fd.append('photo', entry.file);
      await galleryService.uploadPhoto(albumId, fd);
      setEntry(entry.id, { status: 'done' });
    } catch (e) {
      setEntry(entry.id, { status: 'error', error: String(e) });
    }
  }
  // toast summary, call onComplete, reset state, close dialog
  ```
- **Partial failure**: don't roll back successes. Show a toast like `"3 uploaded, 1 failed"` and leave the dialog open with failed tiles still selectable for retry. User dismisses or retries.
- **Cancel during upload**: not supported in V1. Cancel button is disabled while `phase === 'uploading'`. Closing the dialog (Esc / backdrop) is also disabled.
- **Validation**: client-side max-size check (10MB per file, configurable constant). Files exceeding the cap are added to `entries` with `status: 'error'` and never sent.

### Trigger button on `[albumId]/page.tsx`

Replaces the existing inline `AlertDialogTrigger`. Lives in the page header on the right side:

```tsx
<button onClick={() => setUploadOpen(true)}
  className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors">
  <PlusIcon size={16} /> Upload
</button>
```

The old "Add Photo" pill in the body is removed.

### Edit-photo dialog (`ImageContainer.tsx`)

Stays single-file — different action ("replace this photo"). Gets a matching visual restyle (same dialog chrome, same dropzone styling, but no multi-file affordances).

---

## Section 3 — Lightbox (`Lightbox.tsx`)

A new component used by both gallery pages.

### Props

```ts
interface LightboxProps {
  photos: Photo[];
  startIndex: number;
  albumName?: string;        // optional context label, hidden on album-detail page
  onClose: () => void;
  onEdit?: (photo: Photo) => void;      // optional; absent disables Edit
  onDelete?: (photo: Photo) => Promise<void>;  // optional; same
}
```

### Internal state

```ts
const [index, setIndex] = useState(startIndex);
```

That's it. No data fetching.

### Layout

- Backdrop: `fixed inset-0 bg-black/90 z-50` — click to close.
- Top bar (absolute top, full-width, `text-white/70`):
  - Left: `{index + 1} of {photos.length}` · `{albumName}` (omitted when undefined).
  - Right: `Edit` button (if `onEdit`), `Delete` button (if `onDelete`, `text-rose-300`), divider, close `✕` button.
- Center: photo, `max-w-[min(90vw,1200px)] max-h-[80vh] object-contain` so portrait photos don't blow up the viewport.
- Side arrows: prev / next, `absolute left-4` / `right-4`, vertically centered, `bg-white/10 hover:bg-white/20 rounded-full w-10 h-10`. Hidden when at edges (no wrap-around — simpler than wrap, and clearer when you've reached the end).

  *Decision:* Earlier mockup showed wrap-around. Final spec is no-wrap — clearer end-of-list signal. Revisit if user feedback says otherwise.

- Bottom dot indicator: only show when `photos.length <= 8` (avoids visual noise for big sets); for larger sets show only the counter in the top bar.

### Keyboard

- `←` → `setIndex(i => Math.max(0, i - 1))`
- `→` → `setIndex(i => Math.min(photos.length - 1, i + 1))`
- `Esc` → `onClose()`
- Listeners attached to `document` via `useEffect`, cleaned up on unmount.

### Click behavior

- Click on backdrop (anywhere outside the photo and controls) → close.
- Click on the photo itself → no-op (so you can pause without dismissing).
- Click on prev/next/edit/delete/close → respective action; `e.stopPropagation()` to prevent the backdrop's click from firing.

### Edit / Delete wiring

- `onEdit`: opens the existing edit-photo dialog (currently inside `ImageContainer.tsx`'s Popover). To avoid duplicating that dialog's logic, lift its state up to the parent page so both the grid kebab and the lightbox top bar can trigger it.
- `onDelete`: calls `galleryService.deletePhoto`, then advances `index` (or closes if it was the last photo). Parent re-fetches via the existing `useRecords` provider effect.

### Mobile

- Top-bar buttons collapse to icon-only (no labels) below `sm`.
- Side arrows hidden below `sm`; `onTouchStart`/`onTouchEnd` swipe nav (threshold ~50px). No swipe library — vanilla handlers.

---

## Data flow

No new API calls beyond the existing single-photo upload (called N times for multi-upload). All other endpoints (list albums, get album, edit album, delete album, edit photo, delete photo) stay as-is and are already wired up.

After any mutation (create album, upload, edit, delete), the existing `useRecords()` provider's `isFetching` toggle re-runs `fetchAlbums()` via the existing effect. The upload dialog calls `onComplete()` which the parent uses to bump `setIsFetching` (and therefore re-fetch).

## Error handling

- **Upload partial failure**: handled in-dialog; failed tiles stay selectable for retry.
- **Network errors** during list/edit/delete: existing `useError()` hook + `toast.error` in `RecordsProvider`. No change.
- **Lightbox with empty photo set**: don't render. Parent never opens it with an empty array.
- **Drop of non-image files**: silently filtered.
- **Drop while uploading**: ignored.

## Accessibility

- Lightbox: `role="dialog"`, `aria-modal="true"`, focus trapped to the lightbox container, focus restored on close. Arrow buttons get `aria-label="Previous photo"` / `"Next photo"`.
- Upload dialog: existing `AlertDialog` provides modal semantics; ensure the "browse from your device" link has a real `<button>` underneath, not just a styled span.
- All photos in the grid are `<img>` with non-empty `alt` (existing code uses `alt="placeholder"` — replace with the photo's filename or fall back to `"Photo from {album.name}"`).
- Folder cards as keyboard-focusable: outer should be `<a>` (Next.js `<Link>`) with the kebab as a sibling, not nested — clicking the kebab should not also navigate.

## Testing

- **Manual checklist** (no automated tests for visual changes):
  1. `/dashboard/my-records` Photos tab renders; empty state ok; click photo → lightbox opens at correct index.
  2. Albums tab shows folder cards with cover thumbnails; empty albums show placeholder; "New Album" tile opens create dialog.
  3. Album-detail page shows photos; "+ Upload" opens new dialog; drag-and-drop works in Chrome and Safari; multi-file picker works; sequential upload progresses; partial failure leaves dialog open.
  4. Lightbox keyboard nav (← → Esc) works; mobile swipe works; Edit / Delete buttons work and the dialog re-uses the existing edit handler.
  5. Mobile layout (≤ 640px): tabs are pills, grid drops to 2 columns, dialog fits viewport, lightbox arrows are hidden, swipe works.
- **Type-check + lint**: `npx tsc --noEmit && npm run lint` after each task.
- **Existing test suite**: `npm test` — should remain green (no logic changes touch tested paths; the recently-added profile component tests are unaffected).

## Out of scope (deferred)

- "Set as cover photo" — explicit cover selection. Auto-derive is enough for V1.
- Bulk select + bulk delete on the photo grid.
- Server-side multi-file upload endpoint (would let us send all files in one POST). Sequential is fine for V1.
- Cancel-during-upload.
- Photo metadata sidebar in lightbox (date taken, dimensions, etc.) — backend doesn't surface this today.
- Reordering photos within an album.
- Album-level cover upload (separate from `photos[0]`).

---

## Summary of net change

- 5 files modified, 2 new files, 1 file deleted.
- 0 backend changes.
- 0 data-model changes.
- 1 new dependency? — no, all standard React + Tailwind + existing shadcn primitives. Uses `lucide-react` icons already in the project.

The redesign is purely a frontend visual + UX upgrade with no server-side dependencies.
