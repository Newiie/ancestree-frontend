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

const postAddChild = async (treeId: string, nodeId: string, formData: any) => {
    try {
        const childDetails = {
            "generalInformation": formData
        }
        const token = selectToken(store.getState());
        const response = await fetch(`${baseUrl}/trees/add-child`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Tree-Id": treeId
            },
            body: JSON.stringify({ nodeId, childDetails }),
        });
        const data = await response.json();
        return data;   
    } catch (error) {
        console.error("Error fetching tree data:", error);
    }
}    

const postAddParent = async (treeId: string, nodeId: string, formData: any) => {
    try {
        const parentDetails = {
            "generalInformation": formData
        }
        const token = selectToken(store.getState());
        const response = await fetch(`${baseUrl}/trees/add-parent`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Tree-Id": treeId
            },
            body: JSON.stringify({ nodeId, parentDetails }),
        });
        const data = await response.json();
        return data;   
    } catch (error) {
        console.error("Error fetching tree data:", error);
    }
}


const patchEditPersonNode = async (nodeId: string, formData: any) => {
    try {
        const token = selectToken(store.getState());
        const body = {
            "generalInformation": formData
        }

        const response = await fetch(`${baseUrl}/trees/update-node/${nodeId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
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

const TreeService = { 
    fetchTreeData,
    postAddChild,
    deletePersonNode,
    patchEditPersonNode,
    postAddParent
};

export default TreeService