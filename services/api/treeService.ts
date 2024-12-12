import store from "@/store/store";
import { selectToken } from "@/store/userSlice";
import { baseUrl } from '@/lib/config';

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
        return data;   
    } catch (error) {
        console.error("Error fetching tree data:", error);
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
        return data;   
    } catch (error) {
        console.error("Error fetching tree data:", error);
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
        return data;   
    } catch (error) {
        console.error("Error fetching tree data:", error);
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
        return data;   
    } catch (error) {
        console.error("Error fetching tree data:", error);
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
        return data;   
    } catch (error) {
        console.error("Error fetching tree data:", error);
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
        return data;   
    } catch (error) {
        console.error("Error fetching tree data:", error);
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