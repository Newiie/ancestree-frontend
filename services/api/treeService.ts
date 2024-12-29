import store from "@/store/store";
import { selectToken } from "@/store/userSlice";
import { baseUrl } from '@/lib/config';
import updateService from './updateService';
import { UpdateType } from './updateService';
import profileService from './profileService';

const fetchTreeData = async (userId: string) => {
    try {
        const response = await fetch(`${baseUrl}/trees/family-tree/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;   
    } catch (error) {
        console.error("Error fetching tree data:", error);
    }
}


const postAddParent = async (treeId: string, formData: any) => {
    try {
        const token = selectToken(store.getState());
        const response = await fetch(`${baseUrl}/trees/add-parent`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-Tree-Id": treeId
            },
            body: formData,
        });
        const data = await response.json();
        
        // Create an update when a parent is added
        if (response.status == 200) {
            // Extract parent name from the response
            const parentName = data.name || data.fullName || 'New Family Member';
            
            await updateService.addFamilyMember(parentName);
            
            // Update user progress for creating first family tree
            await profileService.updateUserProgress("Create your first Family Tree");
        }
        
        return data;   
    } catch (error) {
        console.error("Error adding parent:", error);
    }
}

const postAddChild = async (treeId: string, formData: FormData) => {
    try {
        const token = selectToken(store.getState());
        const response = await fetch(`${baseUrl}/trees/add-child`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-Tree-Id": treeId
            },
            body: formData,
        });
        const data = await response.json();
        
        // Create an update when a child is added
        if (response.status == 200) {
            console.log("ADD CHILD SERVICE", data);
            
            // Extract child name from the response
            const childName = data.name || data.fullName || 'New Family Member';
            
            await updateService.addFamilyMember(childName);
            
            // Update user progress for creating first family tree
            await profileService.updateUserProgress("Create your first Family Tree");
        }
        
        return data;   
    } catch (error) {
        console.error("Error adding child:", error);
    }
}    


const patchEditPersonNode = async (nodeId: string, formData: FormData) => {
    try {
        const token = selectToken(store.getState());
        const response = await fetch(`${baseUrl}/trees/update-node/${nodeId}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        });
        const data = await response.json();
        
        // Create an update when a person node is edited
        if (response.status == 200) {
            await updateService.createUpdate(
                UpdateType.TREE_UPDATED, 
                `Person node edited in family tree`
            );
        }
        
        return data;   
    } catch (error) {
        console.error("Error editing person node:", error);
    }
}

const deletePersonNode = async (nodeId: string ) => {
    try {
        const token = selectToken(store.getState());

        const response = await fetch(`${baseUrl}/trees/delete-node/${nodeId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        const data = await response.json();
        
        // Create an update when a person node is deleted
        if (response.status == 200) {
            await updateService.createUpdate(
                UpdateType.TREE_UPDATED, 
                `Person node deleted from family tree`
            );
        }
        
        return data;   
    } catch (error) {
        console.error("Error deleting person node:", error);
    }
}

const postConnectPersonToUser = async (userId: string, nodeId: string) => {
    try {
        const token = selectToken(store.getState());
        const response = await fetch(`${baseUrl}/trees/connect-person/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ nodeId }),
        });
        const data = await response.json();
        
        // Create an update when a person is connected to a user
        if (response.status == 200) {
            await updateService.createUpdate(
                UpdateType.TREE_UPDATED, 
                `Person connected to user in family tree`
            );
        }
        
        return data;   
    } catch (error) {
        console.error("Error connecting person to user:", error);
    }
}

const acceptConnectionRequest = async (nodeId: string) => {
    try {   
        const token = selectToken(store.getState());
        const response = await fetch(`${baseUrl}/trees/accept-connection-request/${nodeId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        const data = await response.json();
        
        // Create an update when a connection request is accepted
        if (response.status == 200) {
            await updateService.createUpdate(
                UpdateType.TREE_UPDATED, 
                `Connection request accepted in family tree`
            );
        }
        
        return data;   
    } catch (error) {
        console.error("Error accepting connection request:", error);
    }
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