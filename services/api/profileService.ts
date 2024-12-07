import axios from "axios";
import store from "@/store/store";
import { selectToken, selectId } from "@/store/userSlice";
import { baseUrl } from '@/lib/config';

const fetchUserData = async (userId: string) => {
    try {
        const token = selectToken(store.getState());
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const response = await axios.get(`${baseUrl}/person/${userId}`, { headers });
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
            `${baseUrl}/person/${userId}`, 
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
            `${baseUrl}/person/${userId}/profile-picture`, 
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
            `${baseUrl}/person/${userId}/background-picture`, 
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
            `${baseUrl}/users/send-friend-request/${userId}`, 
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
            `${baseUrl}/users/accept-friend-request/${userId}`, 
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
        const id = selectId(store.getState());

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const response = await axios.get(
            `${baseUrl}/users/friends-list/${id}`, 
            { headers }
        );
        const data = response.data;
        return data;
    } catch (error) {
        console.error("Error getting friend list:", error);
    }
}

const populateFriendList = async () => {
    try {
        const friendList = await getFriendList();
        const populatedFriendList = await Promise.all(friendList.friends.map(async (friend: any) => {
            const user = await fetchUserData(friend.toString());
            return { ...friend, user };
        }));

        console.log("POPULATED FRIEND LIST", populatedFriendList)
        return populatedFriendList; 
    } catch (error) {
        console.error("Error populating friend list:", error);
    }
}

const profileService = { 
    fetchUserData, 
    updateUserData, 
    updateProfileImage, 
    updateBackgroundImage, 
    sendFriendRequest, 
    acceptFriendRequest,
    getFriendList,
    populateFriendList
};

export default profileService