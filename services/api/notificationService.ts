import { baseUrl } from "@/lib/config";
import { selectToken } from "@/store/userSlice";
import store from "@/store/store";

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
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching notifications:", error);
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
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    }
};


export default notificationService;