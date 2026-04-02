import axios from "axios";
import store from "@/store/store";
import { selectToken, selectId } from "@/store/userSlice";
import { baseUrl } from '@/lib/config';
import { UserData } from '@/types/profile';

const fetchUserData = async (userId: string) => {
    const token = selectToken(store.getState());
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.get(`${baseUrl}/person/${userId}`, { headers });
    return response.data;
}

const updateUserData = async (userId: string, data: Partial<UserData>) => {
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

const populateFriendList = async () => {
    const friendList = await getFriendList();
    if (!friendList || !friendList.friends) return [];
    const populatedFriendList = await Promise.all(friendList.friends.map(async (friend: string) => {
        const user = await fetchUserData(friend);
        return { id: friend, user };
    }));
    return populatedFriendList;
}

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

const profileService = {
    fetchUserData,
    updateUserData,
    updateProfileImage,
    updateBackgroundImage,
    sendFriendRequest,
    acceptFriendRequest,
    getFriendList,
    populateFriendList,
    updateUserProgress
};

export default profileService
