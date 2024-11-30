const fetchTreeData = async (userId: string) => {
    try {
        const response = await fetch(`http://localhost:3000/api/trees/family-tree/${userId}`, {
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
        console.log("CHILD DETAILS", childDetails);

        const user = window.localStorage.getItem('AncestreeUser');
        const token = JSON.parse(user || '{}').token;

        console.log("USER FROM TOKEN", user);
        console.log("TOKEN", token);

        const response = await fetch(`http://localhost:3000/api/trees/add-child`, {
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


const patchEditPersonNode = async (nodeId: string, formData: any) => {
    try {
        const user = window.localStorage.getItem('AncestreeUser');
        const token = JSON.parse(user || '{}').token;
        const body = {
            "generalInformation": formData
        }

        const response = await fetch(`http://localhost:3000/api/trees/update-node/${nodeId}`, {
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
        const user = window.localStorage.getItem('AncestreeUser');
        const token = JSON.parse(user || '{}').token;

        console.log("USER FROM TOKEN", user);
        console.log("TOKEN", token);
        console.log("NODE ID", nodeId);

        const response = await fetch(`http://localhost:3000/api/trees/delete-node/${nodeId}`, {
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
    patchEditPersonNode
};

export default TreeService