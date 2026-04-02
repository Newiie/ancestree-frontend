# Ancestree Frontend: Comprehensive Cleanup Design

**Date:** 2026-04-02
**Status:** Approved (post-agent-review revision)
**Approach:** Option A — Safety-first phased cleanup

---

## Context

The ancestree-frontend codebase has active development but accumulated technical debt across type safety, error handling, and component organization. Errors occur at runtime due to a blocking env var mismatch and missing try/catch in async handlers. A phased cleanup addresses all issues while keeping the app shippable after each phase.

---

## Phase 1 — Blocking Fixes + Error Handling + Console.log Removal

**Goal:** App works correctly and is safe to ship.

### Step 0 — Fix service-layer error swallowing (prerequisite for all other Phase 1 steps)

`treeService.ts` and `profileService.ts` both catch errors internally and return `undefined` on failure. This means provider-level try/catch blocks can never receive thrown errors. Before adding error handling to providers:

- Remove internal try/catch from every function in `treeService.ts` — let errors propagate to callers
- Remove internal try/catch from every function in `profileService.ts` — let errors propagate to callers
- `authService.ts` and `galleryService.ts` already re-throw; leave them as-is
- `notificationService.ts`: replace internal `console.error` catch with a re-throw

Note: `treeService.ts` and `galleryService.ts` use the native `fetch` API. Every `fetch` call must check `response.ok` and throw if false — `fetch` does not throw on non-2xx responses.

### Step 1 — Fix env var mismatch

- `lib/config.ts` references `NEXT_PUBLIC_API_BASE_URL`
- `.env` defines `NEXT_PUBLIC_API_URL`
- Fix: update `lib/config.ts` to use `NEXT_PUBLIC_API_URL`
- Do not rename the exported symbol (`baseUrl`) — all import sites use it and must continue to work

### Step 2 — Remove all console statements (full sweep)

56+ `console.log` / `console.error` across the codebase. Replace all with no-op (delete the line). Do not introduce a debug utility — the "or nothing" option is preferred to avoid a new unspecified abstraction.

Complete list of files to sweep:
- `store/userSlice.ts` — line 22 (`USER ON SETUSER`)
- `services/api/authService.ts` — lines 8, 11
- `services/api/treeService.ts` — all internal catch logs (to be removed with Step 0)
- `services/api/profileService.ts` — all internal catch logs (to be removed with Step 0)
- `services/api/notificationService.ts` — catch block logs
- `services/api/galleryService.ts` — any console calls
- `components/dashboard/FamilyTree/Content.tsx` — lines 66, 70, 82, 93
- `components/dashboard/relationship/Content.tsx` — lines 29, 35
- `components/dashboard/Profile/DetailsContent.tsx` — line 126
- `app/dashboard/family-tree/[id]/page.tsx` — line 94
- `app/dashboard/notifications/page.tsx` — any console calls
- `providers/TreeProvider.tsx` — any console calls
- `providers/ProfileProvider.tsx` — any console calls
- `providers/RecordsProvider.tsx` — lines 44, 47

Also remove dead commented-out console calls (e.g., `components/forms/DateInput.tsx` line 34).

After removal, add ESLint rule to prevent regression:
```json
// .eslintrc.json
{ "extends": "next/core-web-vitals", "rules": { "no-console": "error" } }
```

### Step 3 — Fix dead import in TreeProvider

- `providers/TreeProvider.tsx` line 6: `import { set } from 'zod'` — remove this unused import

### Step 4 — Add try/catch to TreeProvider async handlers

Add try/catch + `finally { setIsFetching(false) }` to all four handlers:
- `handleAddFamilyMember`
- `handleEditPerson`
- `handleConnectPersonToUser`
- `handleDeletePersonNode` (line 104 — same pattern, was previously omitted)

Each catch block: show `toast.error('Something went wrong. Please try again.')` via Sonner.

The `finally` block is required — without it, a caught error leaves `isFetching` permanently `true`, freezing the UI in skeleton/loading state until page refresh.

The useEffect fetch chain at `TreeProvider` line 57–63 uses `.then()` — add a `.catch()` handler there as well with a toast.

### Step 5 — Add error feedback in ProfileProvider

- Replace all `console.error` catch blocks with `toast.error()` via Sonner
- Cover all handlers: `fetchUserData`, `updateUserData`, `updateProfileImage`, `updateBackgroundImage`, `populateFriendList`, `sendFriendRequest`, `acceptFriendRequest`
- `populateFriendList` is called directly in `useEffect` with no `.catch()` — add `.catch()` or wrap in try/catch

Verify that `<Toaster />` from Sonner is mounted in `app/layout.tsx`. If absent, add it — toasts will fire silently otherwise.

### Step 6 — Fix missing key props

- `components/dashboard/FamilyTree/Content.tsx` nationality `.map()` (~line 183) — add `key={nationality}` or `key={index}`
- `components/dashboard/FamilyTree/Content.tsx` parent `.map()` (~line 211) — add `key={parent.personNodeId}` or `key={index}`

---

## Phase 2 — Type Safety + Constants

**Goal:** Eliminate `any` types and magic numbers; codebase is fully typed.

### New `types/` directory

Create three files. Do not conflict with existing `services/api/types.ts` — that file defines service-level types and should be kept. The new `types/` directory defines domain-level interfaces.

**`types/tree.ts`**
- `PersonNode` — shape of `node.person` (fields: `generalInformation`, `relatedUser`, etc.)
- `TreeNode` — shape of a tree node (fields: `personNodeId`, `person`, `parents`, `children`)
- `FamilyMember` — use `z.infer<typeof familyMemberSchema>` from `lib/schema.ts` rather than a hand-written interface to avoid divergence
- `AddFamilyMemberFormData` — form data shape for add family member modal

Note: `providers/TreeProvider.tsx` already defines a local `interface TreeNode`. When `types/tree.ts` is imported, the local definition must be removed to avoid duplicate identifier error.

**`types/profile.ts`**
- `UserData` — fields: `userId`, `friendsList`, `relatedUser`, `profilePicture`, `backgroundPicture`, plus profile fields
- `GeneralInformation` — use optional fields for both field-name casings from the backend (`firstName?: string; firstname?: string; lastName?: string; lastname?: string`) until backend inconsistency is resolved. This is intentional — a future cleanup task can normalize once the backend is consistent.
- `UserFriends` — shape of entries in `friendsList`

**`types/api.ts`**
- `ApiResponse<T>` — do not wrap existing service returns; use only for new typed responses. Existing services return raw `response.data` or `response.data.data.familyTree.root` — document this variance rather than forcing a uniform wrapper.

### Replace `any` types

Replace all instances in this order (provider interfaces first, then components, then services):

| File | Instances | Note |
|------|-----------|------|
| `providers/TreeProvider.tsx` | 8 | Remove local `TreeNode` interface when importing from `types/tree.ts` |
| `providers/ProfileProvider.tsx` | 6 | Update context interface (`userData: UserData`) simultaneously with state type |
| `components/dashboard/FamilyTree/Content.tsx` | 8 | Use `TreeNode` from `types/tree.ts` |
| `components/dashboard/Profile/DetailsContent.tsx` | 5 | Use `UserData` and `GeneralInformation` |
| `services/api/profileService.ts` | 3 | |
| `services/api/treeService.ts` | 2 | |

**Important:** When replacing `any` in a provider's context interface (e.g., `ProfileProviderType.userData: any → UserData`), update all consumer components that read from that context in the same commit. A partial update will produce TypeScript errors at call sites.

### Constants

**Append** to existing `lib/constants.ts` — do not overwrite. The file already exports `sectionConfigs` used by `DetailsContent.tsx`.

Add to the bottom of `lib/constants.ts`:
```typescript
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_ZOOM = 3;
export const MIN_ZOOM = 0.2;
export const ZOOM_STEP = 0.1;
export const FALLBACK_AVATAR = '/images/pirot.png';
```

Replace all inline usages in `FamilyTree/Content.tsx` and `family-tree/[id]/page.tsx` with imports from `lib/constants.ts`.

---

## Phase 3 — Component Splitting

**Goal:** Break monolithic components into focused, single-responsibility files. No file exceeds 300 lines after splitting.

### Ownership rules for this phase

- **Form state ownership:** `DetailsContent.tsx` owns the full merged form object. Section components receive a slice of that state as props and call back via `onChange` handlers. They do not own state themselves.
- **Context access in modals:** Modal components read from `TreeProvider` context directly (not via props from `page.tsx`). They must be rendered inside the `TreeProvider` subtree — verify this before splitting.
- **Prop interfaces:** Define explicit TypeScript prop interfaces for every new component before implementing.
- **Shared utilities:** `findNodeRecursively` (currently at bottom of `page.tsx`) moves to a new file `lib/treeUtils.ts` and is imported by whichever component needs it.

### `app/dashboard/family-tree/[id]/page.tsx` (869 lines → ~5 files)

| New File | Responsibility | Props / State owned |
|----------|---------------|---------------------|
| `page.tsx` | Orchestrator; modal open/close state only | `addFamilyMemberOpen`, `editPersonOpen`, `connectPersonOpen` |
| `components/dashboard/FamilyTree/modals/AddFamilyMemberModal.tsx` | Add family member form + submission | Reads `treeId`, `handleAddFamilyMember` from `TreeProvider` context |
| `components/dashboard/FamilyTree/modals/EditPersonModal.tsx` | Edit person form + submission | Reads `selectedNode`, `handleEditPerson` from `TreeProvider` context |
| `components/dashboard/FamilyTree/modals/ConnectPersonModal.tsx` | Connect person form + submission | Reads `handleConnectPersonToUser` from `TreeProvider` context |
| `lib/treeUtils.ts` | `findNodeRecursively` and other tree utility functions | — |

All modal files require `"use client"` directive.

Note: `page.tsx` in Next.js 14 App Router is a Server Component by default unless it has `"use client"`. The current `page.tsx` likely already has `"use client"`. Verify before splitting — if it does, modals can receive handler props as well as read context.

### `components/dashboard/FamilyTree/Content.tsx` (468 lines → ~3 files)

Zoom/pan state (`zoom`, `pan`, `isDragging`, `lastPointer`) and their event handlers live in `Content.tsx`. `FamilyTreeCanvas.tsx` is **not** created — the split previously proposed this as a separate file but it duplicated `Content.tsx` responsibility. Instead:

| New File | Responsibility |
|----------|---------------|
| `Content.tsx` | Zoom/pan state, event handlers, tree layout container |
| `components/dashboard/FamilyTree/TreeNode.tsx` | Single node card render; receives `node: TreeNode` and `onClick` as props |
| `components/dashboard/FamilyTree/TreeNodeDetails.tsx` | Expanded node info panel; receives `node: TreeNode` as prop |

### `components/dashboard/Profile/DetailsContent.tsx` (593 lines → ~4 files)

Form state (`formData`) lives in `DetailsContent.tsx` and is initialized via `deepMerge(userData, localDefaults)`. Section components receive a typed slice of `formData` and an `onChange` handler.

| New File | Responsibility | Props |
|----------|---------------|-------|
| `DetailsContent.tsx` | Orchestrator; edit/view toggle; full `formData` state; submit handler | Reads `userData` from `ProfileProvider` context |
| `components/dashboard/Profile/sections/GeneralInfoSection.tsx` | General info form fields (view + edit) | `data: GeneralInformation`, `isEditing: boolean`, `onChange: (patch: Partial<GeneralInformation>) => void` |
| `components/dashboard/Profile/sections/ContactSection.tsx` | Contact info form fields | similar slice + onChange |
| `components/dashboard/Profile/sections/FamilyBackgroundSection.tsx` | Family background form fields | similar slice + onChange |

The submit button and form submission call remain in `DetailsContent.tsx`.

---

## Phase 4 — Error Boundaries + API Validation

**Goal:** App never shows a blank white screen; API responses are validated at runtime.

### Step 1 — Create ErrorBoundary component

Create `components/ErrorBoundary.tsx` as a React class component with `"use client"` directive at the top. This is required — class-based ErrorBoundaries are client-only in Next.js 14 App Router.

Props: `fallback?: ReactNode`, `children: ReactNode`

### Step 2 — Wrap routes with ErrorBoundary

Do NOT place ErrorBoundary directly inside `app/layout.tsx` (a server component). Instead:

- Create `components/ClientErrorBoundaryWrapper.tsx` — a thin `"use client"` wrapper that renders `<ErrorBoundary>` around `{children}`
- Import and use `ClientErrorBoundaryWrapper` in `app/layout.tsx`

This preserves `layout.tsx` as a server component while enabling client-side error catching.

Also add per-page error boundaries for `family-tree/[id]/page.tsx` and `profile/[id]/page.tsx`.

### Step 3 — Standardize error types

Create `lib/errors.ts`:
```typescript
export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}
```

Update all services to throw `ApiError` instead of raw `Error`. Include the original error as context where possible.

### Step 4 — Add Zod validation to API responses

Add response validation inside each service function after Step 0 (service re-throw) is in place.

Use `schema.safeParse()` rather than `schema.parse()` to avoid hard failures on fields the backend sends inconsistently (e.g., `firstname` vs `firstName`). On parse failure, log the validation error to a dev-only channel and return the raw data with a warning rather than throwing — this prevents existing data from breaking the app while the backend inconsistency is being resolved.

Response schemas live in `lib/schema.ts` alongside existing form schemas, not in a new file.

---

## Success Criteria

- [ ] No runtime errors from env var mismatch
- [ ] No `console.log` or `console.error` in production build (enforced by ESLint `no-console` rule)
- [ ] All `any` types replaced with explicit interfaces
- [ ] No component file exceeds 300 lines
- [ ] App never shows blank white screen on error
- [ ] API response shape mismatches surface as clear error messages (or graceful fallback)
- [ ] `isFetching` always resets to `false` after any async handler completes or fails
- [ ] All service functions propagate errors to callers (no internal swallowing)
