import axios from 'axios';
import { baseUrl } from '@/lib/config';
import { selectToken } from '@/store/userSlice';
import store from '@/store/store';

// Define update types as an enum for type safety
export enum UpdateType {
  FAMILY_MEMBER_ADDED = 'FAMILY_MEMBER_ADDED',
  CONNECTION_FOUND = 'CONNECTION_FOUND',
  RECORDS_UPLOADED = 'RECORDS_UPLOADED',
  PHOTOS_ADDED = 'PHOTOS_ADDED',
  TREE_UPDATED = 'TREE_UPDATED',
  NOTIFICATION_RECEIVED = 'NOTIFICATION_RECEIVED'
}

const updateService = {
  // Create a new update
  async createUpdate(type: UpdateType, details: string, count: number = 1) {
    try {
      const token = selectToken(store.getState());
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await axios.post(`${baseUrl}/updates`, 
        { type, details, count }, 
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating update:", error);
      throw error;
    }
  },

  // Fetch family events
  async familyEvents() {
    try {
      const token = selectToken(store.getState());
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await axios.get(`${baseUrl}/updates/family-events`, { headers });
      return response.data;
    } catch (error) {
      console.error("Error fetching family events:", error);
      throw error;
    }
  },

  // Add a method specifically for connection updates
  async createConnectionUpdate(type: UpdateType, details: string, recipientName: string) {
    try {
      const token = selectToken(store.getState());
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await axios.post(`${baseUrl}/updates`, 
        { 
          type, 
          details: `${details} with ${recipientName}`, 
          count: 1 
        }, 
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating connection update:", error);
      throw error;
    }
  },

  // Examples of specific update methods
  async addFamilyMember(memberName: string) {
    return this.createUpdate(
      UpdateType.FAMILY_MEMBER_ADDED, 
      `New family member added: ${memberName}`
    );
  },

  async recordConnectionFound(connectionName: string) {
    return this.createUpdate(
      UpdateType.CONNECTION_FOUND, 
      `New connection found: ${connectionName}`
    );
  },

  async recordsUploaded(recordCount: number) {
    return this.createUpdate(
      UpdateType.RECORDS_UPLOADED, 
      'New family records uploaded',
      recordCount
    );
  },

  async photosAdded(photoCount: number) {
    return this.createUpdate(
      UpdateType.PHOTOS_ADDED, 
      'New photos added to gallery',
      photoCount
    );
  },

  // Specific methods for connection-related updates
  async sendConnectionRequest(recipientName: string) {
    return this.createConnectionUpdate(
      UpdateType.CONNECTION_FOUND, 
      'Sent connection request',
      recipientName
    );
  },

  async acceptConnectionRequest(recipientName: string) {
    return this.createConnectionUpdate(
      UpdateType.CONNECTION_FOUND, 
      'Accepted connection request',
      recipientName
    );
  },
};

export default updateService;
