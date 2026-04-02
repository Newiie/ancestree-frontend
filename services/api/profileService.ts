import axios from "axios";
import store from "@/store/store";
import { selectToken, selectId } from "@/store/userSlice";
import { baseUrl } from '@/lib/config';
import { UserData } from '@/types/profile';
import { ApiError } from '@/lib/errors';
import { userDataResponseSchema } from '@/lib/schema';

const fetchUserData = async (userId: string) => {
    const token = selectToken(store.getState());
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    try {
        const response = await axios.get(`${baseUrl}/person/${userId}`, { headers });
        const data = response.data;
        const parsed = userDataResponseSchema.safeParse(data);
        if (!parsed.success) {
            throw new ApiError(500, 'Unexpected response shape from user API');
        }
        return data;
    } catch (error: unknown) {
        if (error instanceof ApiError) {
            throw error;
        }
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.response?.status ?? 500, 'Failed to fetch user data');
        }
        throw new ApiError(500, 'Failed to fetch user data');
    }
}

const updateUserData = async (userId: string, data: Partial<UserData>) => {
    const token = selectToken(store.getState());
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    try {
        const response = await axios.patch(
            `${baseUrl}/person/${userId}`,
            data,
            { headers }
        );
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.response?.status ?? 500, 'Failed to update user data');
        }
        throw new ApiError(500, 'Failed to update user data');
    }
}

const updateProfileImage = async (userId: string, formData: FormData) => {
    const token = selectToken(store.getState());
    const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
    };
    try {
        const response = await axios.post(
            `${baseUrl}/person/${userId}/profile-picture`,
            formData,
            { headers }
        );
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.response?.status ?? 500, 'Failed to update profile image');
        }
        throw new ApiError(500, 'Failed to update profile image');
    }
}

const updateBackgroundImage = async (userId: string, formData: FormData) => {
    const token = selectToken(store.getState());
    const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
    };
    try {
        const response = await axios.post(
            `${baseUrl}/person/${userId}/background-picture`,
            formData,
            { headers }
        );
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.response?.status ?? 500, 'Failed to update background image');
        }
        throw new ApiError(500, 'Failed to update background image');
    }
}

const sendFriendRequest = async (userId: string) => {
    const token = selectToken(store.getState());
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    try {
        const response = await axios.post(
            `${baseUrl}/users/send-friend-request/${userId}`,
            {},
            { headers }
        );
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.response?.status ?? 500, 'Failed to send friend request');
        }
        throw new ApiError(500, 'Failed to send friend request');
    }
}

const acceptFriendRequest = async (userId: string) => {
    const token = selectToken(store.getState());
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    try {
        const response = await axios.post(
            `${baseUrl}/users/accept-friend-request/${userId}`,
            {},
            { headers }
        );
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.response?.status ?? 500, 'Failed to accept friend request');
        }
        throw new ApiError(500, 'Failed to accept friend request');
    }
}

const getFriendList = async () => {
    const token = selectToken(store.getState());
    const id = selectId(store.getState());
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    try {
        const response = await axios.get(
            `${baseUrl}/users/friends-list/${id}`,
            { headers }
        );
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.response?.status ?? 500, 'Failed to get friend list');
        }
        throw new ApiError(500, 'Failed to get friend list');
    }
}

const populateFriendList = async () => {
    try {
        const friendList = await getFriendList();
        if (!friendList || !friendList.friends) return [];
        const populatedFriendList = await Promise.all(friendList.friends.map(async (friend: string) => {
            const user = await fetchUserData(friend);
            return { id: friend, user };
        }));
        return populatedFriendList;
    } catch (error: unknown) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, 'Failed to populate friend list');
    }
}

const updateUserProgress = async (stepTitle: string) => {
    const token = selectToken(store.getState());
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    try {
        const response = await axios.patch(
            `${baseUrl}/users/progress/${stepTitle}`,
            {},
            { headers }
        );
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            throw new ApiError(error.response?.status ?? 500, 'Failed to update user progress');
        }
        throw new ApiError(500, 'Failed to update user progress');
    }
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
