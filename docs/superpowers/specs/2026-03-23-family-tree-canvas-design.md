# Family Tree Canvas — Design Spec
**Date:** 2026-03-23
**Status:** Approved

## Problem

The family tree view has three compounding issues:

1. **Bad sizing** — `.tree-container` uses `height: 92.5vh`, a magic number that doesn't track the actual remaining space after the header and sidebar.
2. **Broken pan + zoom** — Pan offsets are applied via `left`/`top` on the outer `.tree-container`, while zoom is applied via `scale()` on the inner `.tree`. The two transforms fight each other and produce incorrect behavior.
3. **Mobile breaks** — The mobile media query uses `min-width: 200%` and `margin-left: -50%` hacks that break the layout. `window.innerWidth` is also accessed directly in `useState`, which crashes during server-side rendering.

## Goal

A full-viewport pan/zoom canvas for the family tree that:
- Fills all available space below the header and beside the sidebar
- Supports drag-to-pan and scroll-to-zoom (cursor-centered) on desktop
- Supports touch-drag-to-pan and pinch-to-zoom on mobile
- Does not break on any screen size

---

## Design

### 1. Container Sizing

The dashboard layout (`app/dashboard/layout.tsx`) is a CSS grid with `h-screen`, `grid-rows-[auto_1fr]`, `grid-cols-[auto_1fr]`. The header takes row 1; the sidebar and page content share row 2. The page content cell has a defined height from the `1fr` grid row.

To make `.tree-container` fill this cell, every element between the grid cell and `.tree-container` must propagate height. The exact chain for the **canvas** (non-fetching) path:

```
Grid content cell           → defined height (1fr row of h-screen grid)
└── FamilyTreeContent       → replace overflow-y-auto with h-full overflow-hidden
      (app/dashboard/family-tree/[id]/page.tsx, the wrapper div inside FamilyTreeContent)
    └── Content outer div   → add h-full
          (components/dashboard/FamilyTree/Content.tsx, outermost div)
        └── .tree-container → height: 100% (was 92.5vh)
```

For the **skeleton** (fetching) path, `FamilyTreeContent` returns `<FamilyTreeSkeleton />` directly with no wrapper. `FamilyTreeSkeleton` renders `<div class="tree-container">` as its root element, making it the direct child of the grid cell. `height: 100%` on `.tree-container` therefore resolves to the grid cell height with no intermediate elements — no additional changes needed in `loading.tsx`.

The modals (`AddFamilyMember`, `EditPersonNode`, `ConnectPersonModal`) are rendered as `absolute top-0 left-0 w-full h-full` children of `FamilyTreeContent`, which will have a defined height via `h-full`. This is unaffected by the change.

### 2. Unified Pan + Zoom Transform

Replace the two-state, two-element approach with a single CSS transform on the inner `.tree` div.

**State:**
```tsx
const [zoom, setZoom] = useState(1);
const [pan, setPan] = useState({ x: 0, y: 0 });
const zoomRef = useRef(1);            // mirrors zoom state — readable synchronously in touch handlers
const isDragging = useRef(false);     // ref, not state — avoids re-renders during drag
const lastPointer = useRef({ x: 0, y: 0 });
```

Whenever `zoom` is updated, update `zoomRef` at the same time:
```tsx
const updateZoom = (newZoom: number) => {
  zoomRef.current = newZoom;
  setZoom(newZoom);
};
```
Use `updateZoom` everywhere instead of calling `setZoom` directly.

**Applied transform:**
```tsx
style={{
  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
  transformOrigin: '0 0',
  transition: isDragging.current ? 'none' : undefined,  // suppress lag during drag
}}
```

**Zoom clamp:** both scroll and buttons clamp to `[0.2, 3]`.

---

#### Drag-to-pan (mouse)

Use pointer capture so drag continues even when the cursor leaves the container or passes over child nodes:

```tsx
const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
  e.currentTarget.setPointerCapture(e.pointerId);
  isDragging.current = true;
  lastPointer.current = { x: e.clientX, y: e.clientY };
};

const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
  if (!isDragging.current) return;
  const dx = e.clientX - lastPointer.current.x;
  const dy = e.clientY - lastPointer.current.y;
  lastPointer.current = { x: e.clientX, y: e.clientY };
  setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
};

const handlePointerUp = () => {
  isDragging.current = false;
};
```

Attach `onPointerDown`, `onPointerMove`, `onPointerUp`, `onPointerCancel` to the `.tree-container` div. Pointer capture means `onMouseLeave` is not needed as a drag-stop — remove it.

---

#### Scroll-to-zoom (wheel)

Attach a non-passive `wheel` listener via `useEffect` (cannot use `onWheel` in React as it is passive by default in modern browsers, which prevents `preventDefault()`):

```tsx
useEffect(() => {
  const el = treeContainerRef.current;
  if (!el) return;
  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const rect = el.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;   // cursor relative to container top-left
    const cursorY = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    // Read zoom from ref (synchronous) — same pattern as touch handler, avoids stale closure
    // that would desync pan and zoom when wheel events fire faster than React renders.
    const currentZoom = zoomRef.current;
    const newZoom = Math.min(3, Math.max(0.2, currentZoom * delta));
    updateZoom(newZoom);
    setPan(prev => ({
      x: cursorX - (cursorX - prev.x) * (newZoom / currentZoom),
      y: cursorY - (cursorY - prev.y) * (newZoom / currentZoom),
    }));
  };
  el.addEventListener('wheel', onWheel, { passive: false });
  return () => el.removeEventListener('wheel', onWheel);
}, []);  // stable — no closure over zoom; zoomRef is always current
```

> Note: `cursorX/Y` must use `getBoundingClientRect()` — not `event.offsetX/Y`, which shifts when the cursor is over a child element (a tree node) and would cause a zoom jump.

---

#### Zoom buttons (center-zoom)

Zoom toward the center of the container. `containerWidth/Height` are read from `treeContainerRef.current`:

```tsx
const zoomToward = (nextZoom: number) => {
  const el = treeContainerRef.current;
  if (!el) return;
  const cx = el.clientWidth / 2;
  const cy = el.clientHeight / 2;
  const currentZoom = zoomRef.current;  // read from ref — avoids stale closure
  setPan(prev => ({
    x: cx - (cx - prev.x) * (nextZoom / currentZoom),
    y: cy - (cy - prev.y) * (nextZoom / currentZoom),
  }));
  updateZoom(nextZoom);
};

const zoomIn  = () => zoomToward(Math.min(3,   zoom + 0.1));
const zoomOut = () => zoomToward(Math.max(0.2, zoom - 0.1));
```

---

#### Touch (mobile)

```tsx
const lastTouchDist = useRef<number | null>(null);
const lastTouchMid  = useRef({ x: 0, y: 0 });

const handleTouchStart = (e: React.TouchEvent) => {
  if (e.touches.length === 1) {
    isDragging.current = true;
    lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  } else if (e.touches.length === 2) {
    isDragging.current = false;
    const dx = e.touches[1].clientX - e.touches[0].clientX;
    const dy = e.touches[1].clientY - e.touches[0].clientY;
    lastTouchDist.current = Math.hypot(dx, dy);
    lastTouchMid.current = {
      x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
      y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
    };
  }
};

const handleTouchMove = (e: React.TouchEvent) => {
  e.preventDefault();
  if (e.touches.length === 1 && isDragging.current) {
    const dx = e.touches[0].clientX - lastPointer.current.x;
    const dy = e.touches[0].clientY - lastPointer.current.y;
    lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  } else if (e.touches.length === 2 && lastTouchDist.current !== null) {
    const rect = treeContainerRef.current!.getBoundingClientRect();
    const dx = e.touches[1].clientX - e.touches[0].clientX;
    const dy = e.touches[1].clientY - e.touches[0].clientY;
    const newDist = Math.hypot(dx, dy);
    const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
    const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
    const scale = newDist / lastTouchDist.current;
    // Read current zoom from ref (synchronous — avoids calling setPan inside setZoom updater,
    // which violates React's requirement that updater functions be pure)
    const currentZoom = zoomRef.current;
    const newZoom = Math.min(3, Math.max(0.2, currentZoom * scale));
    updateZoom(newZoom);
    setPan(prev => ({
      x: midX - (midX - prev.x) * (newZoom / currentZoom),
      y: midY - (midY - prev.y) * (newZoom / currentZoom),
    }));
    lastTouchDist.current = newDist;
  }
};

const handleTouchEnd = () => {
  isDragging.current = false;
  lastTouchDist.current = null;
};
```

Attach to the `.tree-container` div. Both `touchstart` and `touchmove` must be registered with `{ passive: false }` via `useEffect` — iOS Safari ignores `preventDefault()` in `touchmove` unless the `touchstart` handler was also registered as non-passive. Use the same `addEventListener`/`removeEventListener` pattern as the wheel handler.

---

### 3. Zoom Controls DOM Position

The zoom controls `<div>` is positioned `absolute` inside the outer `<div className="relative h-full">` wrapper in `Content.tsx` — **outside** of `.tree-container`. This means `overflow: hidden` on `.tree-container` does not clip them. This structure is unchanged from the current code and is correct.

DOM structure after changes:
```
<div class="relative h-full">          ← Content.tsx outer div
  <div class="absolute ...">           ← zoom buttons (outside container)
  <div class="tree-container">         ← overflow: hidden, height: 100%
    <div class="tree">                 ← unified transform applied here
      {tree nodes}
```

### 4. CSS Cleanup (`familytree.css`)

**Remove:**
- `height: 92.5vh` from `.tree-container` → replace with `height: 100%`
- `overflow: auto` from `.tree-container` → replace with `overflow: hidden`
- `min-width: 600px` from `.tree`
- `transform-origin: center center` from `.tree` (inline style owns this now)
- `transition: transform 0.3s ease-in-out` from `.tree` (causes visible lag during drag/zoom; remove entirely — the inline style suppresses it during drag anyway, but removing from CSS is cleaner)
- Entire `@media (max-width: 768px)` block for `.tree` (the `200%` / `-50%` hacks)

**Keep unchanged:**
- Grid background pattern on `.tree-container`
- `cursor: grab` / `cursor: grabbing` on `.tree-container`
- All connector line styles (`.tree li::before`, `.tree li::after`, etc.)
- `.tree-container` mobile media query width/overflow lines (harmless, can be simplified to just `width: 100%`)

### 5. SSR Fix

Remove from `Content.tsx`:
```tsx
// Remove entirely
const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
// Remove entirely
useEffect(() => {
    const handleResize = () => { setIsMobile(window.innerWidth <= 768); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}, []);
```

The `useIsMobile` hook at `hooks/useIsMobile.ts` is also not used by this component after the change. No import of it should be added.

---

## Files Changed

| File | Changes |
|---|---|
| `public/style/familytree.css` | Fix container height/overflow, remove mobile hacks, clean `.tree` transitions |
| `components/dashboard/FamilyTree/Content.tsx` | Add `h-full` to outermost div; unified transform state; pointer events; scroll-to-zoom; touch events; remove `isMobile` |
| `app/dashboard/family-tree/[id]/page.tsx` | `FamilyTreeContent` wrapper: `h-full overflow-hidden` |
| `app/dashboard/family-tree/[id]/loading.tsx` | No changes needed — skeleton's `.tree-container` is direct child of grid cell |

## Out of Scope

- Minimap / overview panel
- Fit-to-screen button
- Animated pan/zoom transitions
