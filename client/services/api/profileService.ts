import axios from "axios";
import store from "@/store/store";
import { selectToken } from "@/store/userSlice";

const fetchUserData = async (userId: string) => {
    try {
        const token = selectToken(store.getState());
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const response = await axios.get(`http://localhost:3000/api/person/${userId}`, { headers });
        const data = response.data;
        return data;
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}


const updateUserData = async (userId: string, data: any) => {
    try {
        const token = selectToken(store.getState());
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const response = await axios.patch(
            `http://localhost:3000/api/person/${userId}`, 
            data, 
            { headers }
        );
        const updatedData = response.data;
        return updatedData;
    } catch (error) {
        console.error("Error updating user data:", error);
    }
}

const updateProfileImage = async (userId: string, formData: FormData) => {
    try {
        const token = selectToken(store.getState());
        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        };
        const response = await axios.post(
            `http://localhost:3000/api/person/${userId}/profile-picture`, 
            formData, 
            { headers }
        );
        
        if (response.status === 200) {
            const updatedData = response.data;
            return updatedData;
        }
    } catch (error) {
        console.error("Error updating profile picture:", error);
    }
}

const updateBackgroundImage = async (userId: string, formData: FormData) => {
    try {
        const token = selectToken(store.getState());
        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        };
        const response = await axios.post(
            `http://localhost:3000/api/person/${userId}/background-picture`, 
            formData, 
            { headers }
        );

        if (response.status === 200) {
            const updatedData = response.data;
            return updatedData;
        }
    } catch (error) {
        console.error("Error updating background image:", error);
    }
}

const sendFriendRequest = async (userId: string) => {
    try {
        const token = selectToken(store.getState());
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const response = await axios.post(
            `http://localhost:3000/api/users/send-friend-request/${userId}`, 
            {}, 
            { headers }
        );
        const updatedData = response.data;
        return updatedData;
    } catch (error) {
        console.error("Error sending friend request:", error);
    }
}

const acceptFriendRequest = async (userId: string) => {
    try {
        const token = selectToken(store.getState());
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const response = await axios.post(
            `http://localhost:3000/api/users/accept-friend-request/${userId}`, 
            {}, 
            { headers }
        );
        const updatedData = response.data;
        return updatedData;
    } catch (error) {
        console.error("Error accepting friend request:", error);
    }
}

const getFriendList = async () => {
    try {
        const token = selectToken(store.getState());

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const response = await axios.get(
            `http://localhost:3000/api/users/friends-list`, 
            { headers }
        );
        const data = response.data;
        return data;
    } catch (error) {
        console.error("Error getting friend list:", error);
    }
}

const profileService = { 
    fetchUserData, 
    updateUserData, 
    updateProfileImage, 
    updateBackgroundImage, 
    sendFriendRequest, 
    acceptFriendRequest,
    getFriendList
};

export default profileService