# Ancestree Frontend: Comprehensive Cleanup Design

**Date:** 2026-04-02
**Status:** Approved
**Approach:** Option A — Safety-first phased cleanup

---

## Context

The ancestree-frontend codebase has active development but accumulated technical debt across type safety, error handling, and component organization. Errors occur at runtime due to a blocking env var mismatch and missing try/catch in async handlers. A phased cleanup addresses all issues while keeping the app shippable after each phase.

---

## Phase 1 — Blocking Fixes + Error Handling + Console.log Removal

**Goal:** App works correctly and is safe to ship.

### Tasks

1. **Fix env var mismatch**
   - `lib/config.ts` references `NEXT_PUBLIC_API_BASE_URL`
   - `.env` defines `NEXT_PUBLIC_API_URL`
   - Fix: update `lib/config.ts` to use `NEXT_PUBLIC_API_URL`

2. **Remove all console statements**
   - 56+ `console.log` / `console.error` across the codebase
   - Replace with no-op or a dev-only `debug()` utility that strips in production
   - Files affected: `store/userSlice.ts`, `services/api/authService.ts`, `services/api/treeService.ts`, `services/api/profileService.ts`, `components/dashboard/FamilyTree/Content.tsx`, `components/dashboard/relationship/Content.tsx`, `components/dashboard/Profile/DetailsContent.tsx`, `app/dashboard/family-tree/[id]/page.tsx`

3. **Add try/catch to TreeProvider async handlers**
   - `handleAddFamilyMember` — no try/catch; silent crash if service throws
   - `handleEditPerson` — no try/catch; failed edits silently ignored
   - `handleConnectPersonToUser` — no try/catch; no error feedback
   - Fix: wrap all three in try/catch; show user-facing toast via Sonner on error

4. **Add error feedback in ProfileProvider**
   - Catch blocks log to console but never notify the user
   - Fix: replace `console.error` with Sonner `toast.error()` calls

5. **Fix missing `key` props**
   - `components/dashboard/FamilyTree/Content.tsx` — nationality `.map()` (line ~183) and parent `.map()` (line ~211) missing `key` props
   - Fix: add stable string key to each (use index as fallback if no unique id available)

---

## Phase 2 — Type Safety + Constants

**Goal:** Eliminate `any` types and magic numbers; codebase is fully typed.

### New Files

- `types/tree.ts` — `PersonNode`, `TreeNode`, `FamilyMember`, `AddFamilyMemberFormData`
- `types/profile.ts` — `UserData`, `GeneralInformation`, `UserFriends`
- `types/api.ts` — `ApiResponse<T>`, `ApiError`

### Replace `any` Types

| File | Instances |
|------|-----------|
| `providers/TreeProvider.tsx` | 8 |
| `providers/ProfileProvider.tsx` | 6 |
| `components/dashboard/FamilyTree/Content.tsx` | 8 |
| `components/dashboard/Profile/DetailsContent.tsx` | 5 |
| `services/api/profileService.ts` | 3 |
| `services/api/treeService.ts` | 2 |

### Extract Constants to `lib/constants.ts`

```typescript
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_ZOOM = 3;
export const MIN_ZOOM = 0.2;
export const ZOOM_STEP = 0.1;
export const FALLBACK_AVATAR = '/images/pirot.png';
```

---

## Phase 3 — Component Splitting

**Goal:** Break monolithic components into focused, single-responsibility files.

### `app/dashboard/family-tree/[id]/page.tsx` (869 lines → ~5 files)

| New File | Responsibility |
|----------|---------------|
| `page.tsx` | Orchestrator only; manages modal open/close state |
| `components/dashboard/FamilyTree/modals/AddFamilyMemberModal.tsx` | Add family member form + submission logic |
| `components/dashboard/FamilyTree/modals/EditPersonModal.tsx` | Edit person form + submission |
| `components/dashboard/FamilyTree/modals/ConnectPersonModal.tsx` | Connect person form + submission |
| `components/dashboard/FamilyTree/FamilyTreeCanvas.tsx` | Zoom/pan canvas wrapper |

### `components/dashboard/FamilyTree/Content.tsx` (468 lines → ~3 files)

| New File | Responsibility |
|----------|---------------|
| `Content.tsx` | Tree layout + zoom/pan logic only |
| `components/dashboard/FamilyTree/TreeNode.tsx` | Single node card render |
| `components/dashboard/FamilyTree/TreeNodeDetails.tsx` | Expanded node info panel |

### `components/dashboard/Profile/DetailsContent.tsx` (593 lines → ~4 files)

| New File | Responsibility |
|----------|---------------|
| `DetailsContent.tsx` | Orchestrator; edit/view toggle state |
| `components/dashboard/Profile/sections/GeneralInfoSection.tsx` | General info form/view |
| `components/dashboard/Profile/sections/ContactSection.tsx` | Contact info form/view |
| `components/dashboard/Profile/sections/FamilyBackgroundSection.tsx` | Family background form/view |

---

## Phase 4 — Error Boundaries + API Validation

**Goal:** App never shows a blank white screen; API responses are validated at runtime.

### Tasks

1. **Create `components/ErrorBoundary.tsx`**
   - React class component (required for error boundaries)
   - Catches render errors; shows friendly fallback UI
   - Props: `fallback?: ReactNode`, `children`

2. **Wrap major routes with ErrorBoundary**
   - `app/layout.tsx` — top-level catch-all
   - `app/dashboard/family-tree/[id]/page.tsx` — family tree page
   - `app/dashboard/profile/page.tsx` — profile page

3. **Add Zod validation to API responses**
   - Validate response shape in each service before returning to UI
   - On schema failure: throw typed `ApiError` with clear message

4. **Standardize error types**
   - Create `lib/errors.ts` with `ApiError` class:
     ```typescript
     export class ApiError extends Error {
       constructor(public statusCode: number, message: string) {
         super(message);
         this.name = 'ApiError';
       }
     }
     ```
   - All services throw `ApiError` instead of raw `Error`

---

## Success Criteria

- [ ] No runtime errors from env var mismatch
- [ ] No `console.log` or `console.error` in production build
- [ ] All `any` types replaced with explicit interfaces
- [ ] No component file exceeds 300 lines
- [ ] App never shows blank white screen on error
- [ ] API response shape mismatches surface as clear error messages
