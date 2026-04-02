# Ancestree Frontend Comprehensive Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up the Ancestree frontend codebase across four phases: fix blocking errors, remove console statements, add proper error handling, enforce type safety, split monolithic components, and add error boundaries.

**Architecture:** Safety-first phased approach — each phase leaves the app in a working, shippable state. Phase 1 fixes runtime errors and removes debug noise. Phase 2 adds type safety. Phase 3 splits large components into focused files. Phase 4 adds error resilience.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5 (strict), Redux Toolkit, Axios, Tailwind CSS, Sonner (toasts), Zod, native `fetch` (tree/gallery/notification services), Axios (profile/auth services)

---

## File Map

**Phase 1 — modified files:**
- `lib/config.ts` — fix env var name
- `providers/TreeProvider.tsx` — remove dead import, add try/catch/finally, remove console.logs
- `providers/ProfileProvider.tsx` — remove console.logs, add toast errors
- `providers/RecordsProvider.tsx` — remove console.logs, add toast on error
- `services/api/treeService.ts` — remove internal try/catch, add response.ok checks
- `services/api/profileService.ts` — remove internal try/catch
- `services/api/notificationService.ts` — remove console.error (already re-throws)
- `store/userSlice.ts` — remove console.log
- `components/dashboard/FamilyTree/Content.tsx` — remove console.logs, fix key props
- `components/dashboard/relationship/Content.tsx` — remove console.logs
- `components/dashboard/Profile/DetailsContent.tsx` — remove console.log
- `components/forms/DateInput.tsx` — remove dead commented-out console.log
- `app/dashboard/family-tree/[id]/page.tsx` — remove console.log
- `app/dashboard/notifications/page.tsx` — remove console.log
- `app/layout.tsx` — add Toaster
- `.eslintrc.json` — add no-console rule

**Phase 2 — new files:**
- `types/tree.ts` — TreeNode, PersonNode, FamilyMember, AddFamilyMemberFormData
- `types/profile.ts` — UserData, GeneralInformation, UserFriends
- `types/api.ts` — ApiResponse<T>

**Phase 2 — modified files:**
- `lib/constants.ts` — append new constants (preserve existing sectionConfigs)
- `providers/TreeProvider.tsx` — replace 8 any types
- `providers/ProfileProvider.tsx` — replace 6 any types
- `components/dashboard/FamilyTree/Content.tsx` — replace 8 any types
- `components/dashboard/Profile/DetailsContent.tsx` — replace 5 any types
- `services/api/profileService.ts` — replace 3 any types
- `services/api/treeService.ts` — replace 2 any types

**Phase 3 — new files:**
- `lib/treeUtils.ts` — findNodeRecursively helper
- `components/dashboard/FamilyTree/TreeNode.tsx` — single node card
- `components/dashboard/FamilyTree/TreeNodeDetails.tsx` — expanded node info panel
- `components/dashboard/FamilyTree/modals/AddFamilyMemberModal.tsx`
- `components/dashboard/FamilyTree/modals/EditPersonModal.tsx`
- `components/dashboard/FamilyTree/modals/ConnectPersonModal.tsx`
- `components/dashboard/Profile/sections/GeneralInfoSection.tsx`
- `components/dashboard/Profile/sections/ContactSection.tsx`
- `components/dashboard/Profile/sections/FamilyBackgroundSection.tsx`

**Phase 3 — modified files:**
- `app/dashboard/family-tree/[id]/page.tsx` — shrink to orchestrator (~100 lines)
- `components/dashboard/FamilyTree/Content.tsx` — shrink, import TreeNode/TreeNodeDetails
- `components/dashboard/Profile/DetailsContent.tsx` — shrink, import section components

**Phase 4 — new files:**
- `lib/errors.ts` — ApiError class
- `components/ErrorBoundary.tsx` — class component
- `components/ClientErrorBoundaryWrapper.tsx` — "use client" wrapper

**Phase 4 — modified files:**
- `app/layout.tsx` — wrap with ClientErrorBoundaryWrapper
- `services/api/treeService.ts` — throw ApiError
- `services/api/profileService.ts` — throw ApiError
- `lib/schema.ts` — add response validation schemas

---

## PHASE 1: Blocking Fixes + Error Handling + Console Removal

---

### Task 1: Fix env var mismatch

**Files:**
- Modify: `lib/config.ts`

- [ ] **Step 1: Update env var reference in lib/config.ts**

Replace the entire file contents:

```typescript
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export { 
    baseUrl 
};
```

- [ ] **Step 1b: Verify .env file uses the correct key**

Open `.env`. It should contain:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

If it says `NEXT_PUBLIC_API_BASE_URL`, rename that key to `NEXT_PUBLIC_API_URL`. If any other env files exist (`.env.local`, `.env.production`), update them too.

- [ ] **Step 2: Verify build compiles**

```bash
npm run build
```

Expected: Build succeeds. If it previously failed with URL errors, it should now resolve correctly.

- [ ] **Step 3: Commit**

```bash
git add lib/config.ts
git commit -m "fix: correct env var from NEXT_PUBLIC_API_BASE_URL to NEXT_PUBLIC_API_URL"
```

---

### Task 2: Remove console statements — services and store

**Files:**
- Modify: `store/userSlice.ts`
- Modify: `services/api/treeService.ts`
- Modify: `services/api/profileService.ts`
- Modify: `services/api/notificationService.ts`

- [ ] **Step 1: Remove console.log from userSlice.ts**

In `store/userSlice.ts`, delete line 22:
```typescript
// DELETE THIS LINE:
console.log("USER ON SETUSER", action.payload);
```

The `setUser` reducer should look like:
```typescript
setUser: (state, action: PayloadAction<UserState>) => {
  state.username = action.payload.username;
  state.id = action.payload.id;
  state.token = action.payload.token;
  state.isCompleted = action.payload.isCompleted || false;
}
```

- [ ] **Step 2: Remove console.error calls from treeService.ts**

In `services/api/treeService.ts`, delete every `console.error(...)` line inside catch blocks. There are 6 of them (one per function). Do not remove any other code.

- [ ] **Step 3: Remove console.error calls from profileService.ts**

In `services/api/profileService.ts`, delete every `console.error(...)` line inside catch blocks. There are 8 of them. Also delete line 151: `console.log("POPULATED FRIEND LIST", populatedFriendList)`.

- [ ] **Step 4: Remove console.error calls from notificationService.ts**

In `services/api/notificationService.ts`, delete the two `console.error(...)` lines (inside `fetchNotifications` and `readNotification` catch blocks). The `throw error` lines must stay — they are correct error propagation.

- [ ] **Step 4b: Remove console statements from remaining service files**

These files also have console statements that will fail the ESLint no-console rule added in Task 4:

- `services/api/authService.ts` — delete line 8: `console.log("Response: ", response)` and line 11: `console.log("Error: ", error)`
- `services/api/dashboardService.ts` — delete 4 `console.error(...)` lines (lines 19, 36, 53, 70)
- `services/api/relationshipService.ts` — delete 1 `console.error(...)` line (line 29)
- `services/api/updateService.ts` — delete 3 `console.error(...)` lines (lines 33, 50, 75)
- `services/api/galleryService.ts` — delete any `console.log` or `console.error` calls

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add store/userSlice.ts services/api/treeService.ts services/api/profileService.ts services/api/notificationService.ts
git commit -m "fix: remove console statements from store and services"
```

---

### Task 3: Remove console statements — providers and components

**Files:**
- Modify: `providers/TreeProvider.tsx`
- Modify: `providers/ProfileProvider.tsx`
- Modify: `providers/RecordsProvider.tsx`
- Modify: `components/dashboard/FamilyTree/Content.tsx`
- Modify: `components/dashboard/relationship/Content.tsx`
- Modify: `components/dashboard/Profile/DetailsContent.tsx`
- Modify: `components/forms/DateInput.tsx`
- Modify: `app/dashboard/family-tree/[id]/page.tsx`
- Modify: `app/dashboard/notifications/page.tsx`

- [ ] **Step 1: Remove console statements from TreeProvider.tsx**

Delete these lines from `providers/TreeProvider.tsx`:
- Line 58: `console.log("FETCHED TREE DATA", data.familyTree.root);`
- Line 75: `console.log("FORM DATA", formData);`
- Line 76: `console.log("TREE ID", treeId);`

- [ ] **Step 2: Remove console statements from ProfileProvider.tsx**

Delete these lines from `providers/ProfileProvider.tsx`:
- Line 59: `console.log("FETCHED USER DATA", response);`
- Line 65: `console.log("USER FRIENDS", friendList);`
- Line 68: `console.error("Error fetching user data:", error);`
- Line 82: `console.log("POPULATED FRIEND LIST", friendList);`
- Line 99: `console.error("Error sending friend request:", error);`
- Line 109: `console.error("Error accepting friend request:", error);`
- Line 126: `console.error("Error updating user data:", error);`
- Line 139: `console.error("Error updating profile picture:", error);`
- Line 150: `console.error("Error updating background image:", error);`

- [ ] **Step 3: Remove console statements from RecordsProvider.tsx**

Delete these lines from `providers/RecordsProvider.tsx`:
- Line 44: `console.log("FETCHED ALBUMS", fetchedAlbums)`
- Line 47: `console.error('Error fetching albums:', error)`

- [ ] **Step 4: Remove console statements from FamilyTree/Content.tsx**

Delete these lines from `components/dashboard/FamilyTree/Content.tsx`:
- `console.log(node?.person?.relatedUser);` (inside the router.push branch)
- `console.log("No related user");` (inside the else branch)
- `console.log("SECLECTED NODE", selectedNode);` (inside toggleEditPersonModal click)
- `console.log(node);` (inside the InfoIcon SheetTrigger onClick)

- [ ] **Step 5: Remove console statements from remaining files**

- `components/dashboard/relationship/Content.tsx`: delete both `console.log` calls (lines ~29, 35)
- `components/dashboard/Profile/DetailsContent.tsx`: delete `console.log("ERRORS", errorObj)` (~line 126)
- `components/forms/DateInput.tsx`: delete the commented-out `//   console.log("SET DATE", date)` line
- `app/dashboard/family-tree/[id]/page.tsx`: delete `console.log("FORM DATA", formData)` (~line 94)
- `app/dashboard/notifications/page.tsx`: delete any `console.log` or `console.error` calls

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add providers/ components/dashboard/FamilyTree/Content.tsx components/dashboard/relationship/Content.tsx components/dashboard/Profile/DetailsContent.tsx components/forms/DateInput.tsx app/dashboard/family-tree/ app/dashboard/notifications/
git commit -m "fix: remove console statements from providers and components"
```

---

### Task 4: Add ESLint no-console rule

**Files:**
- Modify: `.eslintrc.json`

- [ ] **Step 1: Add no-console rule**

Replace the entire `.eslintrc.json` with:

```json
{
  "extends": "next/core-web-vitals",
  "rules": {
    "no-console": "error"
  }
}
```

- [ ] **Step 2: Run lint to verify no remaining console calls**

```bash
npm run lint
```

Expected: No `no-console` errors. If any remain, they are files missed in Tasks 2–3 — fix them now.

- [ ] **Step 3: Commit**

```bash
git add .eslintrc.json
git commit -m "chore: add no-console ESLint rule to prevent regression"
```

---

### Task 5: Remove service error swallowing — treeService

> ⚠️ **Coupling note:** This task and Task 7 must be committed in the same session without deploying in between. After this task removes the treeService try/catch, errors propagate up to TreeProvider. Task 7 adds the catch handlers in TreeProvider. Do Task 5 → Task 7 → single combined commit or commit each individually but do not stop between them.

**Files:**
- Modify: `services/api/treeService.ts`

The current pattern in every treeService function is:
```typescript
try {
  // ... fetch call ...
} catch (error) {
  // console.error was here (now deleted)
}
```

This silently returns `undefined` on failure. The provider-level try/catch added in Task 7 depends on errors being thrown. Fix every function.

- [ ] **Step 1: Remove try/catch from fetchTreeData and add response.ok check**

Replace the `fetchTreeData` function body:

```typescript
const fetchTreeData = async (userId: string) => {
    const response = await fetch(`${baseUrl}/trees/family-tree/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch tree data: ${response.status}`);
    }
    const data = await response.json();
    return data;
}
```

- [ ] **Step 2: Remove try/catch from postAddParent and add response.ok check**

Replace the `postAddParent` function body:

```typescript
const postAddParent = async (treeId: string, formData: any) => {
    const token = selectToken(store.getState());
    const response = await fetch(`${baseUrl}/trees/add-parent`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "X-Tree-Id": treeId
        },
        body: formData,
    });
    if (!response.ok) {
        throw new Error(`Failed to add parent: ${response.status}`);
    }
    const data = await response.json();
    
    const parentName = data.name || data.fullName || 'New Family Member';
    await updateService.addFamilyMember(parentName);
    await profileService.updateUserProgress("Create your first Family Tree");
    
    return data;
}
```

- [ ] **Step 3: Remove try/catch from postAddChild and add response.ok check**

Replace the `postAddChild` function body:

```typescript
const postAddChild = async (treeId: string, formData: FormData) => {
    const token = selectToken(store.getState());
    const response = await fetch(`${baseUrl}/trees/add-child`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "X-Tree-Id": treeId
        },
        body: formData,
    });
    if (!response.ok) {
        throw new Error(`Failed to add child: ${response.status}`);
    }
    const data = await response.json();
    
    const childName = data.name || data.fullName || 'New Family Member';
    await updateService.addFamilyMember(childName);
    await profileService.updateUserProgress("Create your first Family Tree");
    
    return data;
}
```

- [ ] **Step 4: Remove try/catch from patchEditPersonNode and add response.ok check**

Replace the `patchEditPersonNode` function body:

```typescript
const patchEditPersonNode = async (nodeId: string, formData: FormData) => {
    const token = selectToken(store.getState());
    const response = await fetch(`${baseUrl}/trees/update-node/${nodeId}`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });
    if (!response.ok) {
        throw new Error(`Failed to edit person node: ${response.status}`);
    }
    const data = await response.json();
    
    await updateService.createUpdate(
        UpdateType.TREE_UPDATED, 
        `Person node edited in family tree`
    );
    
    return data;
}
```

- [ ] **Step 5: Remove try/catch from deletePersonNode and add response.ok check**

Replace the `deletePersonNode` function body:

```typescript
const deletePersonNode = async (nodeId: string) => {
    const token = selectToken(store.getState());
    const response = await fetch(`${baseUrl}/trees/delete-node/${nodeId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to delete person node: ${response.status}`);
    }
    const data = await response.json();
    
    await updateService.createUpdate(
        UpdateType.TREE_UPDATED, 
        `Person node deleted from family tree`
    );
    
    return data;
}
```

- [ ] **Step 6: Remove try/catch from postConnectPersonToUser and add response.ok check**

Replace the `postConnectPersonToUser` function body:

```typescript
const postConnectPersonToUser = async (userId: string, nodeId: string) => {
    const token = selectToken(store.getState());
    const response = await fetch(`${baseUrl}/trees/connect-person/${userId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ nodeId }),
    });
    if (!response.ok) {
        throw new Error(`Failed to connect person to user: ${response.status}`);
    }
    const data = await response.json();
    
    await updateService.createUpdate(
        UpdateType.TREE_UPDATED, 
        `Person connected to user in family tree`
    );
    
    return data;
}
```

- [ ] **Step 7: Remove try/catch from acceptConnectionRequest and add response.ok check**

Replace the `acceptConnectionRequest` function body:

```typescript
const acceptConnectionRequest = async (nodeId: string) => {
    const token = selectToken(store.getState());
    const response = await fetch(`${baseUrl}/trees/accept-connection-request/${nodeId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to accept connection request: ${response.status}`);
    }
    const data = await response.json();
    
    await updateService.createUpdate(
        UpdateType.TREE_UPDATED, 
        `Connection request accepted in family tree`
    );
    
    return data;
}
```

- [ ] **Step 8: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 9: Commit**

```bash
git add services/api/treeService.ts
git commit -m "fix: remove error swallowing from treeService and add response.ok checks"
```

---

### Task 6: Remove service error swallowing — profileService

**Files:**
- Modify: `services/api/profileService.ts`

Same pattern as Task 5 but for axios-based service. Axios automatically throws on non-2xx responses, so no `response.ok` checks needed — just remove the try/catch wrappers.

- [ ] **Step 1: Remove try/catch from fetchUserData**

Replace the `fetchUserData` function body:

```typescript
const fetchUserData = async (userId: string) => {
    const token = selectToken(store.getState());
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.get(`${baseUrl}/person/${userId}`, { headers });
    return response.data;
}
```

- [ ] **Step 2: Remove try/catch from updateUserData**

Replace the `updateUserData` function body:

```typescript
const updateUserData = async (userId: string, data: any) => {
    const token = selectToken(store.getState());
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.patch(
        `${baseUrl}/person/${userId}`, 
        data, 
        { headers }
    );
    return response.data;
}
```

- [ ] **Step 3: Remove try/catch from updateProfileImage**

Replace the `updateProfileImage` function body:

```typescript
const updateProfileImage = async (userId: string, formData: FormData) => {
    const token = selectToken(store.getState());
    const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.post(
        `${baseUrl}/person/${userId}/profile-picture`, 
        formData, 
        { headers }
    );
    return response.data;
}
```

- [ ] **Step 4: Remove try/catch from updateBackgroundImage**

Replace the `updateBackgroundImage` function body:

```typescript
const updateBackgroundImage = async (userId: string, formData: FormData) => {
    const token = selectToken(store.getState());
    const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.post(
        `${baseUrl}/person/${userId}/background-picture`, 
        formData, 
        { headers }
    );
    return response.data;
}
```

- [ ] **Step 5: Remove try/catch from sendFriendRequest**

Replace the `sendFriendRequest` function body:

```typescript
const sendFriendRequest = async (userId: string) => {
    const token = selectToken(store.getState());
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.post(
        `${baseUrl}/users/send-friend-request/${userId}`, 
        {}, 
        { headers }
    );
    return response.data;
}
```

- [ ] **Step 6: Remove try/catch from acceptFriendRequest**

Replace the `acceptFriendRequest` function body:

```typescript
const acceptFriendRequest = async (userId: string) => {
    const token = selectToken(store.getState());
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.post(
        `${baseUrl}/users/accept-friend-request/${userId}`, 
        {}, 
        { headers }
    );
    return response.data;
}
```

- [ ] **Step 7: Remove try/catch from getFriendList**

Replace the `getFriendList` function body:

```typescript
const getFriendList = async () => {
    const token = selectToken(store.getState());
    const id = selectId(store.getState());
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.get(
        `${baseUrl}/users/friends-list/${id}`, 
        { headers }
    );
    return response.data;
}
```

- [ ] **Step 8: Remove try/catch from populateFriendList**

Replace the `populateFriendList` function body:

```typescript
const populateFriendList = async () => {
    const friendList = await getFriendList();
    const populatedFriendList = await Promise.all(friendList.friends.map(async (friend: any) => {
        const user = await fetchUserData(friend.toString());
        return { ...friend, user };
    }));
    return populatedFriendList;
}
```

- [ ] **Step 9: Remove try/catch from updateUserProgress**

Replace the `updateUserProgress` function body:

```typescript
const updateUserProgress = async (stepTitle: string) => {
    const token = selectToken(store.getState());
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.patch(
        `${baseUrl}/users/progress/${stepTitle}`, 
        {}, 
        { headers }
    );
    return response.data;
};
```

- [ ] **Step 10: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 11: Commit**

```bash
git add services/api/profileService.ts
git commit -m "fix: remove error swallowing from profileService"
```

---

### Task 7: Add try/catch + finally to TreeProvider handlers

**Files:**
- Modify: `providers/TreeProvider.tsx`

- [ ] **Step 1: Remove dead and unused imports**

Delete these two lines from `providers/TreeProvider.tsx`:
```typescript
// DELETE line 3 (axios is never used in TreeProvider):
import axios from 'axios';
// DELETE line 6 (set is never used):
import { set } from 'zod';
```

- [ ] **Step 2: Add Sonner toast import**

Add to imports at top of `providers/TreeProvider.tsx`:
```typescript
import { toast } from 'sonner';
```

- [ ] **Step 3: Fix the useEffect fetch chain**

Replace lines 53–64 (the useEffect) with:

```typescript
useEffect(() => {
    if (id) {
        setIsFetching(true);
        setUserId(id);
        TreeService.fetchTreeData(id)
            .then((data) => {
                setTreeData([data.familyTree.root]);
                setTreeId(data.familyTree.root.id);
            })
            .catch(() => {
                toast.error('Failed to load family tree. Please refresh the page.');
            })
            .finally(() => {
                setIsFetching(false);
            });
    }   
}, [apiEvent, id]);
```

- [ ] **Step 4: Fix handleEditPerson**

Replace the `handleEditPerson` function:

```typescript
const handleEditPerson = async (formData: any) => {
    setIsFetching(true);
    try {
        await TreeService.patchEditPersonNode(selectedNode, formData);
        toggleEditPersonModal();
        setApiEvent(!apiEvent);
    } catch {
        toast.error('Failed to update person. Please try again.');
    } finally {
        setIsFetching(false);
    }
}
```

- [ ] **Step 5: Fix handleAddFamilyMember**

Replace the `handleAddFamilyMember` function:

```typescript
const handleAddFamilyMember = async (selectedPerson: string, formData: any) => {
    setIsFetching(true);
    try {
        if (selectedPerson === "Add Child") {
            await TreeService.postAddChild(treeId, formData);
        } else {
            await TreeService.postAddParent(treeId, formData);
        }
        toggleAddFamilyModal();
        setApiEvent(!apiEvent);
    } catch {
        toast.error('Failed to add family member. Please try again.');
    } finally {
        setIsFetching(false);
    }
};
```

- [ ] **Step 6: Fix handleConnectPersonToUser**

Replace the `handleConnectPersonToUser` function:

```typescript
const handleConnectPersonToUser = async (userId: string) => {
    try {
        await TreeService.postConnectPersonToUser(userId, selectedNode);
        setApiEvent(!apiEvent);
    } catch {
        toast.error('Failed to connect person. Please try again.');
    }
}
```

- [ ] **Step 7: Fix handleDeletePersonNode**

Replace the `handleDeletePersonNode` function:

```typescript
const handleDeletePersonNode = async () => {
    try {
        await TreeService.deletePersonNode(selectedNode);
        setApiEvent(!apiEvent);
    } catch {
        toast.error('Failed to delete person. Please try again.');
    }
};
```

- [ ] **Step 8: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 9: Commit**

```bash
git add providers/TreeProvider.tsx
git commit -m "fix: add try/catch/finally to TreeProvider handlers and remove dead zod import"
```

---

### Task 8: Add toast feedback to ProfileProvider + Toaster in layout

**Files:**
- Modify: `providers/ProfileProvider.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add Sonner toast import to ProfileProvider**

Add to imports in `providers/ProfileProvider.tsx`:
```typescript
import { toast } from 'sonner';
```

- [ ] **Step 2: Add toast to fetchUserData catch**

Replace the catch block in `fetchUserData`:
```typescript
} catch (error) {
    toast.error('Failed to load profile data. Please refresh.');
} finally {
    setIsFetching(false);
}
```

- [ ] **Step 3: Fix populateFriendList — add null guard + catch in useEffect**

`populateFriendList` in `profileService` accesses `friendList.friends` without checking if `friendList` is defined. Fix the service first:

In `services/api/profileService.ts`, update `populateFriendList`:
```typescript
const populateFriendList = async () => {
    const friendList = await getFriendList();
    if (!friendList || !friendList.friends) return [];
    const populatedFriendList = await Promise.all(friendList.friends.map(async (friend: any) => {
        const user = await fetchUserData(friend.toString());
        return { ...friend, user };
    }));
    return populatedFriendList;
}
```

Then in `ProfileProvider.tsx`, update the `populateFriendList` call inside `useEffect` (lines 79–85):

```typescript
const populateFriendList = async () => {
    const friendList = await profileService.populateFriendList();
    setFriendsData(friendList ?? []);
}

populateFriendList().catch(() => {
    toast.error('Failed to load friends list.');
});
```

- [ ] **Step 4: Add toast to sendFriendRequest catch**

Replace the catch block in `sendFriendRequest`:
```typescript
} catch {
    toast.error('Failed to send friend request. Please try again.');
}
```

- [ ] **Step 5: Add toast to acceptFriendRequest catch**

Replace the catch block in `acceptFriendRequest`:
```typescript
} catch {
    toast.error('Failed to accept friend request. Please try again.');
}
```

- [ ] **Step 6: Fix updateUserData success path and add toast to catch**

`ProfileProvider.updateUserData` currently checks `response.status === 200`, but `profileService.updateUserData` returns `response.data` (the body), not the axios response object — so `.status` is always `undefined` and `updateUserProgress` + `fetchUserData` are never called on success.

Replace the entire `updateUserData` function in `ProfileProvider.tsx`:
```typescript
const updateUserData = async (data: any) => {
    try {
        const { userId, relatedUser, profilePicture, backgroundPicture, ...restData } = data;
        await profileService.updateUserData(userId, restData);
        // axios throws on non-2xx, so reaching here means success
        await profileService.updateUserProgress("Update profile details");
        await fetchUserData();
    } catch {
        toast.error('Failed to update profile. Please try again.');
    }
}
```

- [ ] **Step 7: Add toast to updateProfileImage catch**

Replace the catch block in `updateProfileImage`:
```typescript
} catch {
    toast.error('Failed to update profile picture. Please try again.');
}
```

- [ ] **Step 8: Add toast to updateBackgroundImage catch**

Replace the catch block in `updateBackgroundImage`:
```typescript
} catch {
    toast.error('Failed to update background image. Please try again.');
}
```

- [ ] **Step 9: Add toast to RecordsProvider catch**

In `providers/RecordsProvider.tsx`, replace the catch block in `fetchAlbums`:
```typescript
} catch (error) {
    toast.error('Failed to load albums. Please try again.');
} finally {
    setIsFetching(false)
}
```

Also add the import at top:
```typescript
import { toast } from 'sonner';
```

- [ ] **Step 10: Add Toaster to app/layout.tsx**

Replace `app/layout.tsx` with:

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/MainLayout";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AncesTREE",
  description: "Connect your family Tree",
  icons: {
    icon: "./favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MainLayout>
          {children}
        </MainLayout>
        <Toaster />
      </body>
    </html>
  );
}
```

- [ ] **Step 11: Verify build passes**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 12: Commit**

```bash
git add providers/ProfileProvider.tsx providers/RecordsProvider.tsx app/layout.tsx
git commit -m "fix: add toast error feedback to ProfileProvider and RecordsProvider, add Toaster to layout"
```

---

### Task 9: Fix missing key props in FamilyTree/Content.tsx

**Files:**
- Modify: `components/dashboard/FamilyTree/Content.tsx`

- [ ] **Step 1: Find and fix the nationality map**

In `components/dashboard/FamilyTree/Content.tsx`, find the nationality `.map()` call (~line 183). It looks like:
```typescript
{node?.person?.generalInformation?.nationality?.map((nationality: any) => (
    <span>{nationality}</span>
))}
```

Add a key prop:
```typescript
{node?.person?.generalInformation?.nationality?.map((nationality: any, index: number) => (
    <span key={`${nationality}-${index}`}>{nationality}</span>
))}
```

- [ ] **Step 2: Find and fix the parent map**

Find the parent `.map()` call (~line 211). It looks like:
```typescript
{node?.parents.map((parent: any) => (
    <div>{parent.name}</div>
))}
```

Add a key prop using `personNodeId` if available, otherwise index:
```typescript
{node?.parents.map((parent: any, index: number) => (
    <div key={parent.personNodeId ?? index}>{parent.name}</div>
))}
```

- [ ] **Step 3: Verify lint passes**

```bash
npm run lint
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add components/dashboard/FamilyTree/Content.tsx
git commit -m "fix: add missing key props to nationality and parent list renders"
```

---

## PHASE 2: Type Safety + Constants

---

### Task 10: Create TypeScript type definitions

**Files:**
- Create: `types/tree.ts`
- Create: `types/profile.ts`
- Create: `types/api.ts`

- [ ] **Step 1: Create types/tree.ts**

```typescript
import { z } from 'zod';
import { familyMemberSchema } from '@/lib/schema';

export interface PersonNode {
  profilePicture?: string;
  relatedUser?: string;
  generalInformation?: GeneralInformation;
}

// Backend API returns both casings — both are optional until backend is normalized
export interface GeneralInformation {
  firstName?: string;
  firstname?: string;
  middleName?: string;
  lastName?: string;
  lastname?: string;
  suffix?: string;
  birthdate?: string;
  deathdate?: string;
  birthPlace?: string;
  birthingCenter?: string;
  nationality?: string[];
  civilStatus?: string;
  sex?: string;
  height?: string;
  weight?: string;
  eyeColor?: string;
  hairColor?: string;
  bloodType?: string;
  email?: string;
  phone?: string;
  aboutMe?: string;
  quote?: string;
}

export interface TreeNode {
  personNodeId: string;
  id?: string;
  name?: string;
  person?: PersonNode;
  parents?: TreeNode[];
  children?: TreeNode[];
  parent?: Array<{ personNodeId: string }>;
}

// Derive FamilyMember from existing Zod schema to avoid divergence
export type FamilyMember = z.infer<typeof familyMemberSchema>;

export interface AddFamilyMemberFormData extends FormData {}
```

- [ ] **Step 2: Create types/profile.ts**

```typescript
import { GeneralInformation } from './tree';

export interface UserFriend {
  _id?: string;
  userId?: string;
  user?: UserData;
}

export interface UserFriends {
  friends: UserFriend[];
}

export interface UserData {
  userId?: string;
  relatedUser?: string;
  profilePicture?: string;
  backgroundPicture?: string;
  friendsList?: UserFriend[];
  generalInformation?: GeneralInformation;
  address?: {
    streetAddress?: string;
    city?: string;
    province?: string;
    country?: string;
    zipCode?: string;
  };
  vitalInformation?: {
    sex?: string;
    height?: string;
    weight?: string;
    eyeColor?: string;
    hairColor?: string;
    bloodType?: string;
  };
  interests?: Array<{ title?: string; description?: string }>;
  personalContact?: {
    email?: string;
    phone?: string;
  };
  emergencyContact?: {
    name?: string;
    email?: string;
    relationship?: string;
    phone?: string;
  };
  aboutMe?: string;
  quote?: string;
  message?: string;
}
```

- [ ] **Step 3: Create types/api.ts**

```typescript
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add types/
git commit -m "feat: add TypeScript type definitions for tree, profile, and API"
```

---

### Task 11: Append constants to lib/constants.ts

**Files:**
- Modify: `lib/constants.ts`

- [ ] **Step 1: Append new constants**

Open `lib/constants.ts`. It currently ends with `export { sectionConfigs };`. Append the following **after** that line (do not remove or modify anything above):

```typescript
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_ZOOM = 3;
export const MIN_ZOOM = 0.2;
export const ZOOM_STEP = 0.1;
export const FALLBACK_AVATAR = '/images/pirot.png';
```

- [ ] **Step 2: Replace inline magic values in FamilyTree/Content.tsx**

In `components/dashboard/FamilyTree/Content.tsx`, find zoom-related magic numbers and replace:
- Add import: `import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP, FALLBACK_AVATAR } from '@/lib/constants';`
- Replace `Math.min(3, zoom + 0.1)` with `Math.min(MAX_ZOOM, zoom + ZOOM_STEP)`
- Replace `Math.max(0.2, zoom - 0.1)` with `Math.max(MIN_ZOOM, zoom - ZOOM_STEP)`
- Replace `'/images/pirot.png'` with `FALLBACK_AVATAR`

- [ ] **Step 3: Replace inline magic values in family-tree page.tsx**

In `app/dashboard/family-tree/[id]/page.tsx`:
- Add import: `import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from '@/lib/constants';`
- Replace `['image/jpeg', 'image/png', 'image/gif']` with `ACCEPTED_IMAGE_TYPES`
- Replace `5 * 1024 * 1024` with `MAX_FILE_SIZE_BYTES`

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add lib/constants.ts components/dashboard/FamilyTree/Content.tsx app/dashboard/family-tree/
git commit -m "feat: extract magic numbers and file type arrays to lib/constants.ts"
```

---

### Task 12: Replace any types in providers

**Files:**
- Modify: `providers/TreeProvider.tsx`
- Modify: `providers/ProfileProvider.tsx`

- [ ] **Step 1: Update TreeProvider.tsx — remove local TreeNode, import from types/**

In `providers/TreeProvider.tsx`:

1. Add imports:
```typescript
import { TreeNode, AddFamilyMemberFormData } from '@/types/tree';
```

2. Delete the local `interface TreeNode` block (lines 33–38 — the one defining `personNodeId`, `name`, `children`, `parent`).

3. Update `TreeContextType` interface — replace all `any` with proper types:
```typescript
interface TreeContextType {
  addFamilyMember: boolean;
  toggleAddFamilyModal: () => void;
  toggleEditPersonModal: () => void;
  treeData: TreeNode[];
  editPersonModal: boolean;
  showConnectPersonModal: boolean;
  setEditPersonModal: (value: boolean) => void;
  setShowConnectPersonModal: (value: boolean) => void;
  toggleConnectPersonModal: () => void;
  setTreeData: (data: TreeNode[]) => void;
  handleAddFamilyMember: (selectedPerson: string, formData: FormData) => void;
  handleEditPerson: (formData: FormData) => void;
  selectedNode: string;
  handleDeletePersonNode: () => Promise<void>;
  setSelectedNode: (node: string) => void;
  handleConnectPersonToUser: (userId: string) => void;
  isFetching: boolean;
  userId: string;
  selectedPerson: React.MutableRefObject<string>;
}
```

4. Update state declarations:
- `useState<any>([])` → `useState<TreeNode[]>([])`

- [ ] **Step 2: Update ProfileProvider.tsx — replace any types**

In `providers/ProfileProvider.tsx`:

1. Add imports:
```typescript
import { UserData, UserFriend } from '@/types/profile';
```

2. Update `ProfileProviderType` interface:
```typescript
interface ProfileProviderType {
  selectedDetail: string;
  setSelectedDetail: (detail: string) => void;
  profileTabs: string;
  setProfileTabs: (tabs: string) => void;
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  profileSidebarData: string[];
  profileTabsData: string[];
  updateUserData: (data: UserData) => void;
  updateProfileImage: (imageFile: File) => void;
  updateBackgroundImage: (imageFile: File) => void;
  sendFriendRequest: (userId: string) => void;
  acceptFriendRequest: (userId: string) => void;
  isFetching: boolean;
  userFriends: UserFriend[];
  friendsData: UserFriend[];
}
```

3. Update state declarations:
- `useState<any>(null)` → `useState<UserData | null>(null)`
- `useState<any>([])` (userFriends) → `useState<UserFriend[]>([])`
- `useState<any>([])` (friendsData) → `useState<UserFriend[]>([])`

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors. If TypeScript complains about consumers of these contexts, update those consumers to match (e.g., if a component accessed `userData.someField` typed as `any` before, TypeScript will now require the field to exist on `UserData`).

- [ ] **Step 4: Commit**

```bash
git add providers/TreeProvider.tsx providers/ProfileProvider.tsx
git commit -m "feat: replace any types in TreeProvider and ProfileProvider with proper interfaces"
```

---

### Task 13: Replace any types in components and services

**Files:**
- Modify: `components/dashboard/FamilyTree/Content.tsx`
- Modify: `components/dashboard/Profile/DetailsContent.tsx`
- Modify: `services/api/profileService.ts`
- Modify: `services/api/treeService.ts`

- [ ] **Step 1: Update FamilyTree/Content.tsx**

Add import:
```typescript
import { TreeNode } from '@/types/tree';
```

Replace the `Node` component props — change `}: any)` to an explicit interface:
```typescript
interface NodeProps {
  node: TreeNode;
  selectedNode: string;
  setSelectedNode: (id: string) => void;
  toggleAddFamilyModal: () => void;
  toggleEditPersonModal: () => void;
  toggleConnectPersonModal: () => void;
  handleDeletePersonNode: () => Promise<void>;
}

const Node = ({ 
    node, 
    selectedNode, 
    setSelectedNode, 
    toggleAddFamilyModal, 
    toggleEditPersonModal, 
    toggleConnectPersonModal,
    handleDeletePersonNode
}: NodeProps) => {
```

For remaining `.map()` callbacks typed as `any` (nationality, parent, child), replace with appropriate types:
- nationality map: `(nationality: string, index: number)`
- parent map: `(parent: TreeNode, index: number)`
- child map: `(childNode: TreeNode)`

- [ ] **Step 2: Update Profile/DetailsContent.tsx**

Add import:
```typescript
import { UserData } from '@/types/profile';
```

Replace `any` type annotations in:
- `deepMerge` function parameters: `(target: Record<string, unknown>, source: Record<string, unknown>)`
- `formData` state: `useState<Partial<UserData>>({})`
- `handleSave` parameter: `(data: Partial<UserData>)`

- [ ] **Step 3: Update services/api/profileService.ts**

Add import:
```typescript
import { UserData } from '@/types/profile';
```

Replace `any` in:
- `updateUserData(userId: string, data: any)` → `updateUserData(userId: string, data: Partial<UserData>)`
- `populateFriendList` inner `.map()` callback: `(friend: string)` (the friend is a string ID being mapped)

- [ ] **Step 4: Update services/api/treeService.ts**

Replace `any` in:
- `postAddParent(treeId: string, formData: any)` → `postAddParent(treeId: string, formData: FormData)`

- [ ] **Step 5: Verify TypeScript compiles with no errors**

```bash
npx tsc --noEmit
```

Expected: No errors. Fix any remaining TypeScript errors by adjusting types at call sites.

- [ ] **Step 6: Run lint**

```bash
npm run lint
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add components/dashboard/FamilyTree/Content.tsx components/dashboard/Profile/DetailsContent.tsx services/api/profileService.ts services/api/treeService.ts
git commit -m "feat: replace any types in FamilyTree components and API services"
```

---

## PHASE 3: Component Splitting

---

### Task 14: Create lib/treeUtils.ts with shared utility

**Files:**
- Create: `lib/treeUtils.ts`
- Modify: `app/dashboard/family-tree/[id]/page.tsx` (remove function, add import)

- [ ] **Step 1: Find findNodeRecursively in page.tsx**

Open `app/dashboard/family-tree/[id]/page.tsx`. Find the `findNodeRecursively` function near the bottom (~line 768). It looks like:
```typescript
function findNodeRecursively(nodes: any[], nodeId: string): any {
  // ... recursive tree search
}
```

Copy the complete function body.

- [ ] **Step 2: Create lib/treeUtils.ts**

```typescript
import { TreeNode } from '@/types/tree';

export function findNodeRecursively(nodes: TreeNode[], nodeId: string): TreeNode | null {
  for (const node of nodes) {
    if (node.personNodeId === nodeId) return node;
    if (node.children && node.children.length > 0) {
      const found = findNodeRecursively(node.children, nodeId);
      if (found) return found;
    }
  }
  return null;
}
```

Note: The actual implementation must match what is currently in `page.tsx`. Copy the logic exactly — only update the type signature from `any[]` to `TreeNode[]`.

- [ ] **Step 3: Remove findNodeRecursively from page.tsx and import from lib/treeUtils.ts**

In `app/dashboard/family-tree/[id]/page.tsx`:
1. Delete the `findNodeRecursively` function definition
2. Add import: `import { findNodeRecursively } from '@/lib/treeUtils';`

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add lib/treeUtils.ts app/dashboard/family-tree/
git commit -m "refactor: extract findNodeRecursively to lib/treeUtils.ts"
```

---

### Task 15: Extract TreeNode component

**Files:**
- Create: `components/dashboard/FamilyTree/TreeNode.tsx`
- Modify: `components/dashboard/FamilyTree/Content.tsx`

- [ ] **Step 1: Read the full Node component in Content.tsx**

Read `components/dashboard/FamilyTree/Content.tsx` lines 1–200 to identify the full extent of the `Node` component (from the `const Node = ...` definition to its closing `)`).

- [ ] **Step 2: Create components/dashboard/FamilyTree/TreeNode.tsx**

Create the file with `"use client"` directive. Copy the full `Node` component from `Content.tsx` into this file, update the import paths (they will shift from `../../../providers/TreeProvider` to `@/providers/TreeProvider`), and give it named exports.

The file should start with:

```typescript
"use client";

import React from 'react';
import Image from 'next/image';
import { InfoIcon, PencilIcon, PlusIcon, UserRoundIcon } from 'lucide-react';
import { useTree } from '@/providers/TreeProvider';
import { useRouter } from 'next/navigation';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { selectId } from '@/store/userSlice';
import store from '@/store/store';
import { TreeNode as TreeNodeType } from '@/types/tree';
import { FALLBACK_AVATAR } from '@/lib/constants';

interface TreeNodeProps {
  node: TreeNodeType;
  selectedNode: string;
  setSelectedNode: (id: string) => void;
  toggleAddFamilyModal: () => void;
  toggleEditPersonModal: () => void;
  toggleConnectPersonModal: () => void;
  handleDeletePersonNode: () => Promise<void>;
}

const TreeNodeCard = ({
    node,
    selectedNode,
    setSelectedNode,
    toggleAddFamilyModal,
    toggleEditPersonModal,
    toggleConnectPersonModal,
    handleDeletePersonNode
}: TreeNodeProps) => {
  // Paste the full body of the Node component from Content.tsx here
  // Update '/images/pirot.png' to FALLBACK_AVATAR
};

export default TreeNodeCard;
```

- [ ] **Step 2b: Extract SheetContent into TreeNodeDetails.tsx (optional sub-step)**

If the `Node` component contains a `<SheetContent>` block with detailed node info, extract it into a separate file:

Create `components/dashboard/FamilyTree/TreeNodeDetails.tsx` with `"use client"`:

```typescript
"use client";

import React from 'react';
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { TreeNode as TreeNodeType } from '@/types/tree';

interface TreeNodeDetailsProps {
  node: TreeNodeType;
}

export default function TreeNodeDetails({ node }: TreeNodeDetailsProps) {
  // Paste the SheetContent JSX block from the Node component here
}
```

Then in `TreeNode.tsx`, import and use `<TreeNodeDetails node={node} />` inside `<Sheet>`.

- [ ] **Step 3: Remove Node component from Content.tsx and import TreeNodeCard**

In `components/dashboard/FamilyTree/Content.tsx`:
1. Delete the entire `const Node = ...` component definition
2. Add import: `import TreeNodeCard from './TreeNode';`
3. Replace all uses of `<Node ... />` with `<TreeNodeCard ... />`

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Verify lint passes**

```bash
npm run lint
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add components/dashboard/FamilyTree/TreeNode.tsx components/dashboard/FamilyTree/Content.tsx
git commit -m "refactor: extract TreeNode card into its own component"
```

---

### Task 16: Extract modal components from family-tree page.tsx

**Files:**
- Create: `components/dashboard/FamilyTree/modals/AddFamilyMemberModal.tsx`
- Create: `components/dashboard/FamilyTree/modals/EditPersonModal.tsx`
- Create: `components/dashboard/FamilyTree/modals/ConnectPersonModal.tsx`
- Modify: `app/dashboard/family-tree/[id]/page.tsx`

- [ ] **Step 1: Read the full page.tsx to identify modal boundaries**

Read all of `app/dashboard/family-tree/[id]/page.tsx`. Identify the JSX and state/logic for each of the three modals: AddFamilyMember, EditPersonNode, and ConnectPerson.

- [ ] **Step 2: Create AddFamilyMemberModal.tsx**

Create `components/dashboard/FamilyTree/modals/AddFamilyMemberModal.tsx` with `"use client"`:

```typescript
"use client";

import React from 'react';
// Copy all imports needed by the AddFamilyMember modal UI

interface AddFamilyMemberModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddFamilyMemberModal({ open, onClose }: AddFamilyMemberModalProps) {
  // Move the AddFamilyMember form JSX and local state here
  // Read handleAddFamilyMember, selectedPerson from useTree() context directly
  // Use ACCEPTED_IMAGE_TYPES and MAX_FILE_SIZE_BYTES from @/lib/constants
}
```

Move into this component:
- All local state related to the add form (formData, file selection, selectedPerson dropdown)
- The form submission handler that calls `handleAddFamilyMember` from context
- The modal JSX

- [ ] **Step 3: Create EditPersonModal.tsx**

Create `components/dashboard/FamilyTree/modals/EditPersonModal.tsx` with `"use client"`:

```typescript
"use client";

import React from 'react';

interface EditPersonModalProps {
  open: boolean;
  onClose: () => void;
}

export default function EditPersonModal({ open, onClose }: EditPersonModalProps) {
  // Move the EditPersonNode form JSX and local state here
  // Read handleEditPerson, selectedNode from useTree() context directly
  // findNodeRecursively is imported from @/lib/treeUtils
}
```

Move into this component:
- All local state related to the edit form
- The form submission handler that calls `handleEditPerson` from context
- The modal JSX

- [ ] **Step 4: Create ConnectPersonModal.tsx**

Create `components/dashboard/FamilyTree/modals/ConnectPersonModal.tsx` with `"use client"`:

```typescript
"use client";

import React from 'react';

interface ConnectPersonModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ConnectPersonModal({ open, onClose }: ConnectPersonModalProps) {
  // Move the ConnectPerson search + form JSX here
  // Read handleConnectPersonToUser from useTree() context directly
}
```

- [ ] **Step 5: Replace modal JSX in page.tsx with components**

In `app/dashboard/family-tree/[id]/page.tsx`:
1. Import the three modal components
2. Remove the modal form JSX (now in the component files)
3. Replace with: `<AddFamilyMemberModal open={addFamilyMemberOpen} onClose={toggleAddFamilyModal} />`
4. Same pattern for Edit and Connect modals
5. Remove any local state/handlers that moved into the modals

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Manually verify the family tree page loads and modals open/close**

```bash
npm run dev
```

Open `http://localhost:3000/dashboard/family-tree/[any-id]`. Verify:
- Tree renders
- Add member modal opens and submits
- Edit person modal opens and submits
- Connect person modal opens and submits

- [ ] **Step 8: Commit**

```bash
git add components/dashboard/FamilyTree/modals/ app/dashboard/family-tree/
git commit -m "refactor: extract family tree modal components into separate files"
```

---

### Task 17: Split Profile/DetailsContent.tsx into sections

**Files:**
- Create: `components/dashboard/Profile/sections/GeneralInfoSection.tsx`
- Create: `components/dashboard/Profile/sections/ContactSection.tsx`
- Create: `components/dashboard/Profile/sections/FamilyBackgroundSection.tsx`
- Modify: `components/dashboard/Profile/DetailsContent.tsx`

- [ ] **Step 1: Read the full DetailsContent.tsx**

Read all of `components/dashboard/Profile/DetailsContent.tsx` to identify which JSX blocks belong to each section. The file uses `selectedDetail` state to show/hide different sections.

- [ ] **Step 2: Create GeneralInfoSection.tsx**

Create `components/dashboard/Profile/sections/GeneralInfoSection.tsx` with `"use client"`:

```typescript
"use client";

import React from 'react';
import { UserData } from '@/types/profile';
import { sectionConfigs } from '@/lib/constants';

interface GeneralInfoSectionProps {
  data: Partial<UserData>;
  isEditing: boolean;
  onChange: (patch: Partial<UserData>) => void;
}

export default function GeneralInfoSection({ data, isEditing, onChange }: GeneralInfoSectionProps) {
  // Move the General Information section JSX here
  // Use sectionConfigs.generalInformation for field rendering
}
```

- [ ] **Step 3: Create ContactSection.tsx**

Create `components/dashboard/Profile/sections/ContactSection.tsx` with `"use client"`:

```typescript
"use client";

import React from 'react';
import { UserData } from '@/types/profile';
import { sectionConfigs } from '@/lib/constants';

interface ContactSectionProps {
  data: Partial<UserData>;
  isEditing: boolean;
  onChange: (patch: Partial<UserData>) => void;
}

export default function ContactSection({ data, isEditing, onChange }: ContactSectionProps) {
  // Move the Contact Information section JSX here
  // Use sectionConfigs.personalContact and sectionConfigs.emergencyContact
}
```

- [ ] **Step 4: Create FamilyBackgroundSection.tsx**

Create `components/dashboard/Profile/sections/FamilyBackgroundSection.tsx` with `"use client"`:

```typescript
"use client";

import React from 'react';
import { UserData } from '@/types/profile';

interface FamilyBackgroundSectionProps {
  data: Partial<UserData>;
  isEditing: boolean;
  onChange: (patch: Partial<UserData>) => void;
}

export default function FamilyBackgroundSection({ data, isEditing, onChange }: FamilyBackgroundSectionProps) {
  // Move the family background / vital information section JSX here
}
```

- [ ] **Step 5: Refactor DetailsContent.tsx to use section components**

In `components/dashboard/Profile/DetailsContent.tsx`:
1. Import the three section components
2. Keep `formData` state and `deepMerge` logic in `DetailsContent.tsx`
3. Pass slices to each section: `<GeneralInfoSection data={formData} isEditing={isEditing} onChange={(patch) => setFormData(prev => ({ ...prev, ...patch }))} />`
4. Keep the submit button and `handleSave` in `DetailsContent.tsx`
5. Remove the section JSX that has moved into the section files

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Manually verify the profile page**

```bash
npm run dev
```

Open a profile page. Verify:
- All sections render correctly
- Edit mode works
- Saving profile data works

- [ ] **Step 8: Commit**

```bash
git add components/dashboard/Profile/sections/ components/dashboard/Profile/DetailsContent.tsx
git commit -m "refactor: split DetailsContent.tsx into focused section components"
```

---

## PHASE 4: Error Boundaries + API Validation

---

### Task 18: Create ApiError class

**Files:**
- Create: `lib/errors.ts`

- [ ] **Step 1: Create lib/errors.ts**

```typescript
export class ApiError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
  }
}
```

- [ ] **Step 2: Update treeService.ts to throw ApiError**

In `services/api/treeService.ts`, add import:
```typescript
import { ApiError } from '@/lib/errors';
```

Replace each `throw new Error(...)` in the service with `throw new ApiError(response.status, ...)`. For example:
```typescript
if (!response.ok) {
    throw new ApiError(response.status, `Failed to fetch tree data`);
}
```

Apply to all 7 functions in `treeService.ts`.

- [ ] **Step 3: Update profileService.ts to throw ApiError**

In `services/api/profileService.ts`, add import:
```typescript
import { ApiError } from '@/lib/errors';
```

For axios errors, axios wraps HTTP errors in `AxiosError` with a `response.status`. To throw `ApiError` from axios catch, re-add try/catch only where needed to intercept the axios error shape:
```typescript
const fetchUserData = async (userId: string) => {
    try {
        const token = selectToken(store.getState());
        const response = await axios.get(`${baseUrl}/person/${userId}`, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error && 'response' in error) {
            const axiosError = error as { response?: { status: number } };
            throw new ApiError(axiosError.response?.status ?? 500, 'Failed to fetch user data');
        }
        throw new ApiError(500, 'Failed to fetch user data');
    }
}
```

Apply this pattern to all profileService functions.

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add lib/errors.ts services/api/treeService.ts services/api/profileService.ts
git commit -m "feat: add ApiError class and update services to throw typed errors"
```

---

### Task 19: Create ErrorBoundary and ClientErrorBoundaryWrapper

**Files:**
- Create: `components/ErrorBoundary.tsx`
- Create: `components/ClientErrorBoundaryWrapper.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create components/ErrorBoundary.tsx**

```typescript
"use client";

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h2 className="text-xl font-semibold text-gray-700">Something went wrong.</h2>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

- [ ] **Step 2: Create components/ClientErrorBoundaryWrapper.tsx**

```typescript
"use client";

import React, { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

export default function ClientErrorBoundaryWrapper({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
```

- [ ] **Step 3: Add ClientErrorBoundaryWrapper to app/layout.tsx**

Update `app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/MainLayout";
import { Toaster } from "@/components/ui/sonner";
import ClientErrorBoundaryWrapper from "@/components/ClientErrorBoundaryWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AncesTREE",
  description: "Connect your family Tree",
  icons: {
    icon: "./favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientErrorBoundaryWrapper>
          <MainLayout>
            {children}
          </MainLayout>
        </ClientErrorBoundaryWrapper>
        <Toaster />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Verify build passes**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add components/ErrorBoundary.tsx components/ClientErrorBoundaryWrapper.tsx app/layout.tsx
git commit -m "feat: add ErrorBoundary component and wrap layout with client error boundary"
```

---

### Task 20: Add Zod response validation to services

**Files:**
- Modify: `lib/schema.ts`
- Modify: `services/api/treeService.ts`
- Modify: `services/api/profileService.ts`

- [ ] **Step 1: Add response schemas to lib/schema.ts**

Open `lib/schema.ts` and append response validation schemas at the bottom:

```typescript
import { z } from 'zod';

// Response schema for fetchTreeData
export const treeDataResponseSchema = z.object({
  familyTree: z.object({
    root: z.object({
      id: z.string().optional(),
      personNodeId: z.string().optional(),
    }).passthrough(), // passthrough allows extra fields without failing
  }),
}).passthrough();

// Response schema for fetchUserData — lenient due to backend field inconsistency
export const userDataResponseSchema = z.object({
  userId: z.string().optional(),
}).passthrough(); // passthrough: backend may return additional or differently-cased fields
```

Note: Use `passthrough()` so existing data with inconsistent field names (e.g. `firstname` vs `firstName`) does not cause hard schema failures. This catches structural issues (missing `familyTree.root`) without breaking on field-naming variations.

- [ ] **Step 2: Add validation to fetchTreeData**

In `services/api/treeService.ts`, add import:
```typescript
import { treeDataResponseSchema } from '@/lib/schema';
```

After `const data = await response.json();` in `fetchTreeData`, add:
```typescript
const parsed = treeDataResponseSchema.safeParse(data);
if (!parsed.success) {
    throw new ApiError(500, 'Unexpected response shape from tree API');
}
```

- [ ] **Step 3: Add validation to fetchUserData**

In `services/api/profileService.ts`, add import:
```typescript
import { userDataResponseSchema } from '@/lib/schema';
```

After `return response.data;` in `fetchUserData`, add validation before returning:
```typescript
const fetchUserData = async (userId: string) => {
    try {
        // ... existing axios call ...
        const data = response.data;
        const parsed = userDataResponseSchema.safeParse(data);
        if (!parsed.success) {
            throw new ApiError(500, 'Unexpected response shape from user API');
        }
        return data;
    } catch (error: unknown) {
        // ... existing error handling ...
    }
}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Run full lint + build**

```bash
npm run lint && npm run build
```

Expected: No errors, build succeeds.

- [ ] **Step 6: Commit**

```bash
git add lib/schema.ts services/api/treeService.ts services/api/profileService.ts
git commit -m "feat: add Zod response validation to tree and profile API services"
```

---

## Done

All 20 tasks complete. The codebase now has:
- No runtime errors from env var mismatch
- No `console.log` / `console.error` in production (enforced by ESLint)
- All `any` types replaced with explicit interfaces
- No component file exceeds 300 lines
- App never shows blank white screen on error (ErrorBoundary)
- API response shape mismatches surface as clear error messages
- `isFetching` always resets after any async handler
- All service functions propagate errors to callers
