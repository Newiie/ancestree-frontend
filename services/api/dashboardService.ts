import axios from 'axios';
import { baseUrl } from '@/lib/config';
import { selectToken } from '@/store/userSlice';
import store from '@/store/store';

const dashboardService = {
  // Fetch user progress
  async fetchUserProgress() {
    try {
      const token = selectToken(store.getState());
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await axios.get(`${baseUrl}/users/progress`, { headers });
      return response.data;
    } catch (error) {
      console.error("Error fetching user progress:", error);
      throw error;
    }
  },

  // Fetch recent memories (photos)
  async fetchRecentMemories() {
    try {
      const token = selectToken(store.getState());
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await axios.get(`${baseUrl}/records/recent-photos`, { headers });
      return response.data;
    } catch (error) {
      console.error("Error fetching recent memories:", error);
      throw error;
    }
  },

  // Fetch monthly updates
  async fetchMonthlyUpdates() {
    try {
      const token = selectToken(store.getState());
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await axios.get(`${baseUrl}/updates`, { headers });
      return response.data;
    } catch (error) {
      console.error("Error fetching monthly updates:", error);
      throw error;
    }
  },

  // Fetch upcoming birthdays
  async fetchUpcomingBirthdays() {
    try {
      const token = selectToken(store.getState());
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await axios.get(`${baseUrl}/updates/family-events`, { headers });
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming birthdays:", error);
      throw error;
    }
  }
};

export default dashboardService;
