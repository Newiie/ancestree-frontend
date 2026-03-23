# Family Tree Canvas — Design Spec
**Date:** 2026-03-23
**Status:** Approved

## Problem

The family tree view has three compounding issues:

1. **Bad sizing** — `.tree-container` uses `height: 92.5vh`, a magic number that doesn't track the actual remaining space after the header and sidebar. It under- or over-fills depending on screen size.
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

Pass `height: 100%` down the component chain so the canvas fills the grid cell without hardcoded viewport units.

| Element | Change |
|---|---|
| `FamilyTreeContent` wrapper (`[id]/page.tsx`) | `h-full overflow-hidden` (was `overflow-y-auto`) |
| `Content` outer `<div>` (`Content.tsx`) | Add `h-full` |
| `.tree-container` (`familytree.css`) | `height: 100%` (was `92.5vh`), `overflow: hidden` |

### 2. Unified Pan + Zoom Transform

Replace the two-state, two-element approach with a single CSS transform on the inner `.tree` div.

**State:**
```tsx
const [zoom, setZoom] = useState(1);
const [pan, setPan] = useState({ x: 0, y: 0 });
```

**Applied transform:**
```tsx
style={{
  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
  transformOrigin: '0 0',
}}
```

**Drag-to-pan (mouse):**
- `onMouseDown` — record start position and set `isDragging = true`
- `onMouseMove` — while dragging, update `pan` by mouse delta
- `onMouseUp` / `onMouseLeave` — stop dragging

**Scroll-to-zoom (wheel):**
- Attach `wheel` event listener on container ref (with `{ passive: false }` to call `preventDefault`)
- Clamp zoom between `0.2` and `3`
- Keep the point under the cursor fixed using:
  ```
  newPan.x = cursorX - (cursorX - pan.x) * (newZoom / oldZoom)
  newPan.y = cursorY - (cursorY - pan.y) * (newZoom / oldZoom)
  ```
  where `cursorX/Y` is relative to the container's bounding rect.

**Zoom buttons:**
- Zoom toward the center of the container (not cursor position)
- Step size: `±0.1` per click, clamped to `[0.2, 3]`

**Touch (mobile):**
- `onTouchStart` — record initial touch point(s)
- `onTouchMove`:
  - 1 finger → pan delta from last touch position
  - 2 fingers → compute distance between touches; delta drives zoom with same cursor-centered math (midpoint of the two touches acts as the zoom focus)
- `onTouchEnd` — clear touch state

No `isMobile` flag needed. Touch and mouse events are handled independently.

### 3. CSS Cleanup

**Remove from `familytree.css`:**
- The entire `@media (max-width: 768px)` block for `.tree` — the `min-width: 200%` / `margin-left: -50%` hacks
- `min-width: 600px` from `.tree`
- `transform-origin: center center` from `.tree` (inline style owns transforms now)

**Keep:**
- `.tree-container` grid background pattern
- `cursor: grab` / `cursor: grabbing`
- All connector line styles (`.tree li::before`, etc.)

### 4. SSR Fix

Remove the direct `window` access in state initialization:
```tsx
// Remove this line entirely
const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
```
The `isMobile` state and its `useEffect` resize listener are deleted. Mobile behavior is handled by touch events, not a flag.

---

## Files Changed

| File | Changes |
|---|---|
| `public/style/familytree.css` | Fix container height, remove mobile hacks, clean `.tree` |
| `components/dashboard/FamilyTree/Content.tsx` | Unified transform state, scroll-to-zoom, touch events, remove `isMobile` |
| `app/dashboard/family-tree/[id]/page.tsx` | Wrapper `h-full overflow-hidden` |

## Out of Scope

- Minimap / overview panel
- Fit-to-screen button (can be added later)
- Animating pan/zoom transitions
