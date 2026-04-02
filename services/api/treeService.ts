import store from "@/store/store";
import { selectToken } from "@/store/userSlice";
import { baseUrl } from '@/lib/config';
import updateService from './updateService';
import { UpdateType } from './updateService';
import profileService from './profileService';

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


const postAddParent = async (treeId: string, formData: FormData) => {
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

const TreeService = {
    fetchTreeData,
    postAddChild,
    deletePersonNode,
    patchEditPersonNode,
    postAddParent,
    acceptConnectionRequest,
    postConnectPersonToUser
};

export default TreeService
