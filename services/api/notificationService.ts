import { baseUrl } from "@/lib/config";
import { selectToken } from "@/store/userSlice";
import store from "@/store/store";
import profileService from "./profileService";
const notificationService = {
    fetchNotifications: async () => {
        try {
            const token = selectToken(store.getState());

            const response = await fetch(`${baseUrl}/users/notifications/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            
            if (response.status === 401) {
                throw new Error("token expired");
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching notifications:", error);
            throw error;
        }
    },
    readNotification: async (notificationId: string) => {
        try {
            const token = selectToken(store.getState());
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            };
            const response = await fetch(`${baseUrl}/users/read-notification/${notificationId}`, {
                method: "PATCH",
                headers: headers,
            });
            
            if (response.status === 401) {
                throw new Error("token expired");
            }
            
            const data = await response.json();
            await profileService.updateUserProgress("Stay informed with Notifications");
            return data;
        } catch (error) {
            console.error("Error reading notification:", error);
            throw error;
        }
    }
};

export default notificationService;