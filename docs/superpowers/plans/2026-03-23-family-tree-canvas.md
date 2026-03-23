# Family Tree Canvas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the broken pan/zoom/sizing implementation with a unified canvas that fills the viewport, supports scroll-to-zoom and drag-to-pan on desktop, and touch gestures on mobile.

**Architecture:** A single `transform: translate(x,y) scale(z)` on the inner `.tree` div drives all pan and zoom. A `zoomRef` mirrors zoom state so event handlers can read it synchronously without stale closures. Wheel and touch listeners are attached imperatively with `{ passive: false }` so `preventDefault()` works in all browsers including Safari.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, CSS (no new dependencies)

**Spec:** `docs/superpowers/specs/2026-03-23-family-tree-canvas-design.md`

---

## File Map

| File | Role |
|---|---|
| `public/style/familytree.css` | Container sizing, remove broken `.tree` overrides and mobile hacks |
| `components/dashboard/FamilyTree/Content.tsx` | Entire canvas logic — state, refs, event handlers, transform |
| `app/dashboard/family-tree/[id]/page.tsx` | Height propagation fix on `FamilyTreeContent` wrapper |

---

## Task 1: Fix CSS — container sizing and tree cleanup

**Files:**
- Modify: `public/style/familytree.css`

- [ ] **Step 1: Update `.tree-container`**

In `.tree-container`, change:
```css
/* BEFORE */
height: 92.5vh;
overflow: auto;

/* AFTER */
height: 100%;
overflow: hidden;
```

- [ ] **Step 2: Clean `.tree` — remove conflicting properties**

In the `.tree` rule, remove these three lines:
```css
min-width: 600px;
transition: transform 0.3s ease-in-out;
transform-origin: center center;
```

The `.tree` rule should keep only `position: relative`, `display: flex`, `justify-content: center`, `align-items: center`.

- [ ] **Step 3: Remove broken mobile media query for `.tree`**

Delete the entire block inside `@media (max-width: 768px)` that targets `.tree` and `.tree-content`:
```css
/* DELETE this entire block */
@media (max-width: 768px) {
    .tree-container {
        overflow: auto;
        width: 100%;
        max-width: 100vw;
    }
    .tree {
        min-width: 200%;
        transform-origin: left center !important;
        margin-left: -50% !important;
    }
    .tree-content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
    }
}
```

- [ ] **Step 4: Commit**

```bash
git add public/style/familytree.css
git commit -m "fix: clean up tree container CSS, remove 92.5vh and mobile hacks"
```

---

## Task 2: Fix height propagation in page wrapper

**Files:**
- Modify: `app/dashboard/family-tree/[id]/page.tsx`

- [ ] **Step 1: Update `FamilyTreeContent` wrapper div**

Find the `FamilyTreeContent` component (around line 837). The return for the non-fetching path has a wrapper div:
```tsx
// BEFORE
<div className="relative content tree-content | overflow-y-auto">

// AFTER
<div className="relative content tree-content | h-full overflow-hidden">
```

Replace `overflow-y-auto` with `h-full overflow-hidden`. Keep all other classes unchanged.

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/family-tree/[id]/page.tsx
git commit -m "fix: propagate h-full to family tree content wrapper"
```

---

## Task 3: Replace state and refs in Content.tsx

**Files:**
- Modify: `components/dashboard/FamilyTree/Content.tsx`

This task strips out the old broken state and adds the new refs. Do not change event handlers or the JSX yet — that comes in later tasks.

- [ ] **Step 1: Remove old state and isMobile**

In the `FamilyTreeContent` component body, delete these lines entirely:
```tsx
// DELETE
const [zoomLevel, setZoomLevel] = useState(1);
const [isDragging, setIsDragging] = useState(false);
const [position, setPosition] = useState({ x: 0, y: 0 });
const [startPos, setStartPos] = useState({ x: 0, y: 0 });
const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

// DELETE this entire useEffect
useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}, []);
```

- [ ] **Step 2: Add new state and refs**

Replace with:
```tsx
const [zoom, setZoom] = useState(1);
const [pan, setPan] = useState({ x: 0, y: 0 });
const zoomRef = useRef(1);
const isDragging = useRef(false);
const lastPointer = useRef({ x: 0, y: 0 });
const lastTouchDist = useRef<number | null>(null);
```

> Note: The spec also mentions a `lastTouchMid` ref, but it is intentionally omitted here. The touch handlers recalculate the midpoint each `touchmove` frame from the live touch coordinates, so caching it serves no purpose.

- [ ] **Step 3: Add the `updateZoom` helper**

Directly after the refs, add:
```tsx
const updateZoom = (newZoom: number) => {
  zoomRef.current = newZoom;
  setZoom(newZoom);
};
```

- [ ] **Step 4: Verify the file still compiles**

Run:
```bash
cd C:/Users/jethr/personal-projects/ancestree-frontend && npx tsc --noEmit
```

TypeScript will complain about unused handlers referencing the deleted variables — that's expected. Fix any import errors (e.g. if `useState` imports need adjusting). Do not fix handler errors yet.

- [ ] **Step 5: Commit**

```bash
git add components/dashboard/FamilyTree/Content.tsx
git commit -m "refactor: replace broken zoom/pan state with unified refs in FamilyTreeContent"
```

---

## Task 4: Apply unified transform to .tree div

**Files:**
- Modify: `components/dashboard/FamilyTree/Content.tsx`

- [ ] **Step 1: Update the `.tree` div style**

Find the inner `.tree` div (currently has `transform: scale(${zoomLevel})`). Replace its `style` prop:

```tsx
// BEFORE
<div
    className="tree"
    style={{
        transform: `scale(${zoomLevel})`,
        transformOrigin: 'top left',
        width: 'max-content'
    }}
>

// AFTER
<div
    className="tree"
    style={{
        transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        transformOrigin: '0 0',
        width: 'max-content',
    }}
>
```

- [ ] **Step 2: Add `h-full` to the Content outer div**

The outermost div in `Content.tsx`'s return statement currently has `className='relative'`. Add `h-full`:
```tsx
// BEFORE
<div className='relative'>

// AFTER
<div className='relative h-full'>
```

- [ ] **Step 3: Remove the old `style` from `.tree-container`**

The `.tree-container` div currently has:
```tsx
style={{
    left: isMobile ? 0 : position.x,
    top: isMobile ? 0 : position.y
}}
```
Remove this `style` prop entirely. The container no longer moves — only the inner `.tree` does.

- [ ] **Step 4: Verify the file compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add components/dashboard/FamilyTree/Content.tsx
git commit -m "fix: apply unified translate+scale transform to .tree div"
```

---

## Task 5: Add pointer event handlers for drag-to-pan

**Files:**
- Modify: `components/dashboard/FamilyTree/Content.tsx`

- [ ] **Step 1: Replace old mouse handlers with pointer handlers**

Delete the old handlers:
```tsx
// DELETE all of these
const handleMouseDown = ...
const handleMouseMove = ...
const handleMouseUp = ...
```

Add the new pointer handlers in their place:
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

- [ ] **Step 2: Update the `.tree-container` div event props**

Replace the old `onMouseDown`, `onMouseMove`, `onMouseUp`, `onMouseLeave` props with:
```tsx
onPointerDown={handlePointerDown}
onPointerMove={handlePointerMove}
onPointerUp={handlePointerUp}
onPointerCancel={handlePointerUp}
```

Remove `onMouseLeave` — pointer capture handles drag continuation outside the element.

- [ ] **Step 3: Verify compile and manual test**

```bash
npx tsc --noEmit
```

Then start the dev server:
```bash
npm run dev
```

Navigate to `http://localhost:3000/dashboard/family-tree/<your-user-id>`. Confirm you can drag the tree around with the mouse. The tree should move smoothly under the cursor.

- [ ] **Step 4: Commit**

```bash
git add components/dashboard/FamilyTree/Content.tsx
git commit -m "feat: add pointer-capture drag-to-pan for family tree canvas"
```

---

## Task 6: Add scroll-to-zoom (wheel event)

**Files:**
- Modify: `components/dashboard/FamilyTree/Content.tsx`

- [ ] **Step 1: Delete the old `zoomIn`/`zoomOut` functions**

```tsx
// DELETE
const zoomIn = () => { setZoomLevel(zoomLevel + 0.1); };
const zoomOut = () => { if (zoomLevel > 0.1) { setZoomLevel(zoomLevel - 0.1); } };
```

- [ ] **Step 2: Add `zoomToward` and new zoom button functions**

```tsx
const zoomToward = (nextZoom: number) => {
  const el = treeContainerRef.current;
  if (!el) return;
  const cx = el.clientWidth / 2;
  const cy = el.clientHeight / 2;
  const currentZoom = zoomRef.current;
  setPan(prev => ({
    x: cx - (cx - prev.x) * (nextZoom / currentZoom),
    y: cy - (cy - prev.y) * (nextZoom / currentZoom),
  }));
  updateZoom(nextZoom);
};

const zoomIn  = () => zoomToward(Math.min(3,   zoom + 0.1));
const zoomOut = () => zoomToward(Math.max(0.2, zoom - 0.1));
```

- [ ] **Step 3: Add the wheel event useEffect**

Add this `useEffect` alongside the other effects in the component:
```tsx
useEffect(() => {
  const el = treeContainerRef.current;
  if (!el) return;
  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const rect = el.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
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
}, []);
```

- [ ] **Step 4: Verify compile and manual test**

```bash
npx tsc --noEmit
```

Navigate to the family tree page. Confirm:
- Scroll wheel zooms in/out
- The point under the cursor stays fixed while zooming
- Zoom buttons still work and zoom toward the center
- Zoom clamps at 0.2 (minimum) and 3.0 (maximum)

- [ ] **Step 5: Commit**

```bash
git add components/dashboard/FamilyTree/Content.tsx
git commit -m "feat: add cursor-centered scroll-to-zoom for family tree canvas"
```

---

## Task 7: Add touch event handlers for mobile

**Files:**
- Modify: `components/dashboard/FamilyTree/Content.tsx`

- [ ] **Step 1: Register touch listeners imperatively (for iOS Safari)**

Touch is handled entirely via imperative `addEventListener` — not React synthetic events. Both `touchstart` and `touchmove` must be registered with `{ passive: false }` so `preventDefault()` is honoured in iOS Safari (Safari ignores `preventDefault()` on `touchmove` unless `touchstart` was also non-passive).

Add this `useEffect` alongside the wheel event `useEffect`:
```tsx
useEffect(() => {
  const el = treeContainerRef.current;
  if (!el) return;

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      isDragging.current = false;
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      lastTouchDist.current = Math.hypot(dx, dy);
    }
  };

  const onTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging.current) {
      const dx = e.touches[0].clientX - lastPointer.current.x;
      const dy = e.touches[0].clientY - lastPointer.current.y;
      lastPointer.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    } else if (e.touches.length === 2 && lastTouchDist.current !== null) {
      const rect = el.getBoundingClientRect();
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      const newDist = Math.hypot(dx, dy);
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
      const scale = newDist / lastTouchDist.current;
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

  const onTouchEnd = () => {
    isDragging.current = false;
    lastTouchDist.current = null;
  };

  el.addEventListener('touchstart', onTouchStart, { passive: false });
  el.addEventListener('touchmove',  onTouchMove,  { passive: false });
  el.addEventListener('touchend',   onTouchEnd);
  return () => {
    el.removeEventListener('touchstart', onTouchStart);
    el.removeEventListener('touchmove',  onTouchMove);
    el.removeEventListener('touchend',   onTouchEnd);
  };
}, []);
```

- [ ] **Step 2: Verify compile**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Manual test on mobile or browser DevTools touch simulation**

Open DevTools → Toggle device toolbar (Ctrl+Shift+M). Navigate to the family tree page. Confirm:
- Single-finger drag pans the tree
- Two-finger pinch zooms in/out around the midpoint of the two fingers
- Page does not scroll behind the tree while interacting

- [ ] **Step 4: Commit**

```bash
git add components/dashboard/FamilyTree/Content.tsx
git commit -m "feat: add touch drag-to-pan and pinch-to-zoom for mobile"
```

---

## Task 8: Final cleanup and smoke test

**Files:**
- Modify: `components/dashboard/FamilyTree/Content.tsx` (remove any dead code)

- [ ] **Step 1: Remove any remaining dead imports or variables**

Check for unused imports (e.g. if `useState` for `isMobile` is gone, make sure `window` references are also gone). Run:
```bash
npx tsc --noEmit
```
Fix any remaining TypeScript errors.

- [ ] **Step 2: Full smoke test checklist**

Start the dev server (`npm run dev`) and verify each item:

| Check | Expected |
|---|---|
| Navigate to `/dashboard/family-tree/<id>` | Tree fills full height below header, no scrollbar on the page |
| Drag the tree | Smooth pan, tree follows cursor, works even when cursor passes over a node |
| Scroll wheel on the tree | Zooms in/out, point under cursor stays fixed |
| Click zoom-in button | Tree zooms toward center |
| Click zoom-out button | Tree zooms out toward center |
| Zoom out to limit | Stops at 0.2x, no further shrinking |
| Zoom in to limit | Stops at 3.0x, no further growing |
| Resize browser window to < 768px | Tree container still fills the space, no overflow |
| DevTools mobile simulation, drag | Single-finger pan works |
| DevTools mobile simulation, pinch | Two-finger zoom works, tree doesn't scroll the page |

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "fix: replace broken family tree pan/zoom with unified canvas"
```
