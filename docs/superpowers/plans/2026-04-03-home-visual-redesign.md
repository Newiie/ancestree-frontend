# Home Dashboard Visual Redesign Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the visual layer of `components/dashboard/Content.tsx` — improving hierarchy, removing the gray washed-out background, adding a clean profile hero and quick-actions strip — without touching any data-fetching logic, state, or API calls.

**Architecture:** All changes are confined to `components/dashboard/Content.tsx` and `app/dashboard/page.tsx`. Every state variable, useEffect, and service call stays exactly as-is. Only JSX structure and Tailwind classNames change. Tasks are ordered so each produces a compilable, visually coherent intermediate state.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript strict, Tailwind CSS, shadcn/ui (Accordion, Carousel, Popover), lucide-react icons, `useProfile` from `@/providers/ProfileProvider`, `useAuth` from `@/hooks/useAuth`

---

## File Map

**Modified files only:**
- `app/dashboard/page.tsx` — remove `bg-[#DFDFDF]` outer wrapper color (Task 1)
- `components/dashboard/Content.tsx` — all visual changes (Tasks 1–6)

**No new files. No logic changes.**

---

## IMPORTANT: What must NOT change

In `components/dashboard/Content.tsx`, leave these untouched:
- All `import` statements (lines 1–28)
- The `progress`, `memories`, `monthlyUpdates` static arrays (lines 30–96)
- The `ActivityCard` component definition (lines 98–137) — it is unused but leave it
- All `useState`, `useEffect`, and `dashboardService` calls inside `Content` (lines 140–197)
- The `count` state variable (used by carousel, keep even if not referenced in new JSX)

---

## Task 1: Page background + profile hero

**Files:**
- Modify: `app/dashboard/page.tsx`
- Modify: `components/dashboard/Content.tsx` (lines 198–229)

### Step 1: Update page.tsx wrapper color

- [ ] Open `app/dashboard/page.tsx`. Change the wrapper className from `bg-[#DFDFDF]` to `bg-stone-50`:

```tsx
// app/dashboard/page.tsx
"use client";

import React from 'react';
import Content from '@/components/dashboard/Content';

const Page = () => {
  return (
    <div className="content | bg-stone-50 overflow-y-auto">
      <Content />
    </div>
  );
};

export default Page;
```

### Step 2: Replace the outer wrapper and profile hero in Content.tsx

- [ ] In `components/dashboard/Content.tsx`, find the `return (` block starting at line 198. Replace lines 198–229 (the outer div, white wrapper, and profile section) with:

```tsx
  return (
    <div className='bg-stone-50 text-black p-4 sm:p-6 space-y-4'>
      {/* PROFILE HERO */}
      <div className='flex items-center gap-4 bg-white rounded-2xl p-5 border border-stone-200 shadow-sm'>
        <div className='relative flex-shrink-0'>
          <Image
            src={userData?.profilePicture ? userData.profilePicture : '/images/doge.png'}
            alt='profile'
            width={64}
            height={64}
            className='w-16 h-16 rounded-full object-cover ring-2 ring-[#1B5A1B]/20'
          />
        </div>
        <div className='flex-grow min-w-0'>
          <h1 className='text-xl font-bold text-stone-800 truncate'>
            {userData?.generalInformation?.firstName} {userData?.generalInformation?.lastName}
          </h1>
          <p className='text-sm text-stone-400'>Your family tree awaits</p>
        </div>
        <Link
          href={`/dashboard/family-tree/${userData?.userId}`}
          className='flex-shrink-0 px-4 py-2 bg-[#1B5A1B] text-white text-sm font-medium rounded-xl hover:bg-[#1B5A1B]/90 transition-colors'
        >
          View Tree
        </Link>
      </div>
```

Note: the closing `</div>` at the bottom of the return block (currently closing both `bg-white` and `bg-[#DFDFDF]`) should become a single `</div>` closing `bg-stone-50`.

### Step 3: Verify

- [ ] Run: `npx tsc --noEmit`
- [ ] Expected: no errors

### Step 4: Commit

- [ ] `git add app/dashboard/page.tsx components/dashboard/Content.tsx`
- [ ] `git commit -m "refactor: update dashboard background and profile hero"`

---

## Task 2: Quick actions strip

**Files:**
- Modify: `components/dashboard/Content.tsx` — add after profile hero, before the two-column grid

### Step 1: Add quickActions data and import

- [ ] In `components/dashboard/Content.tsx`, add the `CheckIcon` import to the existing lucide-react import line:

```tsx
import { CalendarHeartIcon, CheckIcon, CirclePlusIcon, EllipsisIcon, GiftIcon, NetworkIcon, HeartIcon, BookTextIcon, BookImageIcon } from 'lucide-react';
```

- [ ] Add the `quickActions` array just above the `Content` component (after the `monthlyUpdates` array, around line 97):

```tsx
const quickActions = [
  { label: 'Family Tree', icon: <NetworkIcon size={18} />, url: '' }, // url filled in JSX using user.id
  { label: 'Relationships', icon: <HeartIcon size={18} />, url: '/dashboard/relationships' },
  { label: 'My Records', icon: <BookTextIcon size={18} />, url: '/dashboard/my-records' },
  { label: 'Gallery', icon: <BookImageIcon size={18} />, url: '/dashboard/gallery' },
];
```

Note: `BookImageIcon` is already imported in the original file. `NetworkIcon`, `HeartIcon`, `BookTextIcon` need to be added to the lucide-react import.

### Step 2: Add quick actions strip JSX

- [ ] In the `Content` component JSX, after the profile hero `</div>` and before `<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>`, insert:

```tsx
      {/* QUICK ACTIONS */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
        <Link
          href={`/dashboard/family-tree/${userData?.userId}`}
          className='flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-stone-200 hover:border-[#1B5A1B]/40 hover:shadow-sm transition-all group'
        >
          <span className='w-10 h-10 flex items-center justify-center rounded-xl bg-[#EAF1E5] text-[#1B5A1B] group-hover:bg-[#1B5A1B] group-hover:text-white transition-colors'>
            <NetworkIcon size={18} />
          </span>
          <span className='text-xs font-medium text-stone-600 text-center'>Family Tree</span>
        </Link>
        <Link
          href='/dashboard/relationships'
          className='flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-stone-200 hover:border-[#1B5A1B]/40 hover:shadow-sm transition-all group'
        >
          <span className='w-10 h-10 flex items-center justify-center rounded-xl bg-[#EAF1E5] text-[#1B5A1B] group-hover:bg-[#1B5A1B] group-hover:text-white transition-colors'>
            <HeartIcon size={18} />
          </span>
          <span className='text-xs font-medium text-stone-600 text-center'>Relationships</span>
        </Link>
        <Link
          href='/dashboard/my-records'
          className='flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-stone-200 hover:border-[#1B5A1B]/40 hover:shadow-sm transition-all group'
        >
          <span className='w-10 h-10 flex items-center justify-center rounded-xl bg-[#EAF1E5] text-[#1B5A1B] group-hover:bg-[#1B5A1B] group-hover:text-white transition-colors'>
            <BookTextIcon size={18} />
          </span>
          <span className='text-xs font-medium text-stone-600 text-center'>My Records</span>
        </Link>
        <Link
          href='/dashboard/gallery'
          className='flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-stone-200 hover:border-[#1B5A1B]/40 hover:shadow-sm transition-all group'
        >
          <span className='w-10 h-10 flex items-center justify-center rounded-xl bg-[#EAF1E5] text-[#1B5A1B] group-hover:bg-[#1B5A1B] group-hover:text-white transition-colors'>
            <BookImageIcon size={18} />
          </span>
          <span className='text-xs font-medium text-stone-600 text-center'>Gallery</span>
        </Link>
      </div>
```

### Step 3: Update the two-column grid wrapper

- [ ] Change `<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>` to remove `mt-4` (spacing is now handled by `space-y-4` on the parent):

```tsx
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
```

### Step 4: Verify

- [ ] Run: `npx tsc --noEmit`
- [ ] Expected: no errors

### Step 5: Commit

- [ ] `git add components/dashboard/Content.tsx`
- [ ] `git commit -m "feat: add quick actions strip to dashboard home"`

---

## Task 3: Replace progress accordion with progress bar card

**Files:**
- Modify: `components/dashboard/Content.tsx` — replace the Accordion block (~lines 235–254)

The Accordion import can stay (it may be used elsewhere or can simply be unused — TypeScript won't error on unused imports).

### Step 1: Add CheckIcon to imports

- [ ] Ensure `CheckIcon` is in the lucide-react import (added in Task 2). If Task 2 wasn't run yet, add it now.

### Step 2: Replace Accordion block with progress card

- [ ] Find the Accordion block in the first column:

```tsx
              <Accordion type="single" collapsible className='w-full'>
                <AccordionItem value="item-1">
                  ...
                </AccordionItem>
              </Accordion>
```

Replace entirely with:

```tsx
              {/* GETTING STARTED PROGRESS */}
              {(() => {
                const completedCount = progressSteps.filter(s => s.completed).length;
                const pct = Math.round((completedCount / progressSteps.length) * 100);
                return (
                  <div className='bg-white rounded-2xl border border-stone-200 p-5'>
                    <div className='flex items-center justify-between mb-2'>
                      <h2 className='text-sm font-semibold text-stone-700'>Getting Started</h2>
                      <span className='text-xs text-stone-400'>{completedCount} of {progressSteps.length} complete</span>
                    </div>
                    <div className='w-full h-1.5 bg-stone-100 rounded-full overflow-hidden mb-4'>
                      <div
                        className='h-full bg-[#1B5A1B] rounded-full transition-all duration-500'
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className='space-y-2.5'>
                      {progressSteps.slice(0, 4).map((step, i) => (
                        <div key={i} className='flex items-start gap-2.5'>
                          <div className={`mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center border ${step.completed ? 'bg-[#1B5A1B] border-[#1B5A1B]' : 'border-stone-300'}`}>
                            {step.completed && <CheckIcon size={9} className='text-white' />}
                          </div>
                          <p className={`text-sm leading-snug ${step.completed ? 'text-stone-400 line-through decoration-stone-300' : 'text-stone-700'}`}>
                            {step.title}
                          </p>
                        </div>
                      ))}
                    </div>
                    {progressSteps.length > 4 && (
                      <p className='mt-3 text-xs font-medium text-[#1B5A1B] cursor-pointer hover:underline'>
                        +{progressSteps.length - 4} more steps →
                      </p>
                    )}
                  </div>
                );
              })()}
```

### Step 3: Verify

- [ ] Run: `npx tsc --noEmit`
- [ ] Expected: no errors

### Step 4: Commit

- [ ] `git add components/dashboard/Content.tsx`
- [ ] `git commit -m "refactor: replace progress accordion with compact progress bar card"`

---

## Task 4: Restyle memories carousel card

**Files:**
- Modify: `components/dashboard/Content.tsx` — the Memories section inside the first column

### Step 1: Update memories card wrapper

- [ ] Find: `<div className='bg-[#EAF1E5] h-[max-content] rounded-lg p-4'>`
  (the one wrapping the Memories section — there are two `bg-[#EAF1E5]` cards; this is the first one)

  Replace with: `<div className='bg-white rounded-2xl border border-stone-200 p-5'>`

- [ ] Find the heading inside: `<h2 className='text-xl sm:text-2xl text-[#1B5A1B] font-semibold'>Memories</h2>`

  Replace with: `<h2 className='text-sm font-semibold text-stone-700 mb-3'>Memories</h2>`

- [ ] Find the empty-state wrapper: `<div className='flex flex-col items-center justify-center py-10 text-center'>`
  Leave as-is — it already looks reasonable inside the new white card.

### Step 2: Verify

- [ ] Run: `npx tsc --noEmit`
- [ ] Expected: no errors

### Step 3: Commit

- [ ] `git add components/dashboard/Content.tsx`
- [ ] `git commit -m "refactor: restyle memories carousel card"`

---

## Task 5: Merge birthdays + anniversaries into Upcoming widget

**Files:**
- Modify: `components/dashboard/Content.tsx` — replace the occasions section (~lines 320–356)

### Step 1: Replace the two-box occasions section

- [ ] Find the entire occasions block:

```tsx
              {/* OCCASIONS UPDATES */}
              <div className='flex flex-col sm:flex-row gap-4 bg-[#EAF1E5] rounded-lg p-4'>
                <div className='bg-[#D4E2CC] flex-1 rounded-lg p-4'>
                  ...Birthdays...
                </div>
                <div className='bg-[#D4E2CC] flex-1 rounded-lg p-4'>
                  ...Anniversaries...
                </div>
              </div>
```

Replace entirely with:

```tsx
              {/* UPCOMING EVENTS */}
              <div className='bg-white rounded-2xl border border-stone-200 p-5'>
                <h2 className='text-sm font-semibold text-stone-700 mb-3'>Upcoming</h2>
                {birthdays.length === 0 && anniversary.length === 0 ? (
                  <p className='text-sm text-stone-400 py-2'>No upcoming events</p>
                ) : (
                  <div className='space-y-2'>
                    {(birthdays as any[]).map((person, index) => (
                      <div key={`b-${index}`} className='flex items-center gap-3 py-2 border-b border-stone-100 last:border-0'>
                        <span className='w-7 h-7 flex items-center justify-center rounded-full bg-[#EAF1E5] flex-shrink-0'>
                          <GiftIcon size={13} className='text-[#1B5A1B]' />
                        </span>
                        <div className='min-w-0'>
                          <p className='text-sm font-medium text-stone-800 truncate'>{person.name}</p>
                          <p className='text-xs text-stone-400'>Birthday</p>
                        </div>
                      </div>
                    ))}
                    {(anniversary as any[]).map((person, index) => (
                      <div key={`a-${index}`} className='flex items-center gap-3 py-2 border-b border-stone-100 last:border-0'>
                        <span className='w-7 h-7 flex items-center justify-center rounded-full bg-[#EAF1E5] flex-shrink-0'>
                          <CalendarHeartIcon size={13} className='text-[#1B5A1B]' />
                        </span>
                        <div className='min-w-0'>
                          <p className='text-sm font-medium text-stone-800 truncate'>{person.name}</p>
                          <p className='text-xs text-stone-400'>Anniversary</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
```

### Step 2: Verify

- [ ] Run: `npx tsc --noEmit`
- [ ] Expected: no errors

### Step 3: Commit

- [ ] `git add components/dashboard/Content.tsx`
- [ ] `git commit -m "refactor: merge birthdays and anniversaries into Upcoming widget"`

---

## Task 6: Restyle notepad + monthly updates cards

**Files:**
- Modify: `components/dashboard/Content.tsx` — second column (lines ~360–408)

### Step 1: Restyle Notepad card

- [ ] Find: `<div className='bg-[#EAF1E5] h-[max-content] rounded-lg p-4'>` in the **second column** (the one containing "Notepad"):

  Replace with: `<div className='bg-white rounded-2xl border border-stone-200 p-5'>`

- [ ] Find heading: `<h2 className='text-xl sm:text-2xl text-[#1B5A1B] font-semibold'>Notepad</h2>`

  Replace with: `<h2 className='text-sm font-semibold text-stone-700'>Notepad</h2>`

- [ ] Find the placeholder note cards:

```tsx
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className='bg-[#F3FFE6] rounded-lg p-4'>
                      <p className='text-sm sm:text-lg text-[#1B5A1B] font-semibold'>Add a new note</p>
                    </div>
                  ))}
```

  Replace with:

```tsx
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className='bg-stone-50 border border-dashed border-stone-200 rounded-xl p-4'>
                      <p className='text-sm text-stone-400'>Add a new note…</p>
                    </div>
                  ))}
```

### Step 2: Restyle Monthly Updates card

- [ ] Find: `<div className='bg-[#EAF1E5] h-[max-content] rounded-lg p-4'>` in the second column (the one containing "Monthly Updates"):

  Replace with: `<div className='bg-white rounded-2xl border border-stone-200 p-5'>`

- [ ] Find heading: `<h2 className='text-xl sm:text-2xl text-[#1B5A1B] font-semibold'>Monthly Updates</h2>`

  Replace with: `<h2 className='text-sm font-semibold text-stone-700 mb-3'>Monthly Updates</h2>`

- [ ] Find the list items:

```tsx
                  <ul className='list-disc list-inside'>
                    {monthlyUpdatesList.map((item, index) => (
                      <li key={index} className='text-sm sm:text-lg text-[#434343] font-semibold'>{item}</li>
                    ))}
                  </ul>
```

  Replace with:

```tsx
                  <div className='space-y-2'>
                    {monthlyUpdatesList.map((item, index) => (
                      <div key={index} className='flex items-start gap-2.5 py-2 border-b border-stone-100 last:border-0'>
                        <span className='mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1B5A1B] flex-shrink-0' />
                        <p className='text-sm text-stone-700'>{item}</p>
                      </div>
                    ))}
                  </div>
```

- [ ] Find the empty-state: `<p className='text-base italic'>No updates this month</p>`

  Replace with: `<p className='text-sm text-stone-400 py-2'>No updates this month</p>`

### Step 3: Verify TypeScript and lint

- [ ] Run: `npx tsc --noEmit`
- [ ] Run: `npm run lint`
- [ ] Expected: no errors (pre-existing warnings OK)

### Step 4: Commit

- [ ] `git add components/dashboard/Content.tsx`
- [ ] `git commit -m "refactor: restyle notepad and monthly updates cards"`

---

## Done

All 6 tasks complete. The home dashboard now has:
- Clean `bg-stone-50` page background instead of the washed-out gray
- A polished profile hero card with avatar, name, and View Tree CTA
- A quick-actions strip with 4 navigation tiles
- A compact progress bar replacing the buried accordion
- A unified Upcoming events widget (birthdays + anniversaries merged)
- Consistent white cards with `border-stone-200` across all sections
