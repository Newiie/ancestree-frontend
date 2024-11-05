import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { baseUrl } from '@/lib/config';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import axios from 'axios';
import { headers } from 'next/headers';

interface ProfileProviderType {
  selectedDetail: string;
  setSelectedDetail: (detail: string) => void;
  profileTabs: string;
  setProfileTabs: (tabs: string) => void;
  userData: any;
  setUserData: (data: any) => void;
  profileSidebarData: string[];
  profileTabsData: string[];
  updateUserData: (data: any) => void;
  updateProfileImage: (imageFile: File) => void;
  updateBackgroundImage: (imageFile: File) => void;
  isFetching: boolean;
}

const ProfileContext = createContext<ProfileProviderType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode, userId: string }> = ({ children, userId }) => {
  const [selectedDetail, setSelectedDetail] = useState<string>('General Information');
  const [profileTabs, setProfileTabs] = useState<string>('Personal Details');
  const [userData, setUserData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const user = useAuth();
  const router = useRouter();

  const profileSidebarData = [
    'General Information', 
    'Addresses', 
    'Vital Information', 
    'Personal Interests', 
    'Contact Information'
  ];

  const profileTabsData = [
    'Personal Details', 
    'Profile Memo', 
    'Connections'
  ];

  const fetchUserData = useCallback(async () => {
    setIsFetching(true);
    try {
        const response = await fetch(`${baseUrl}/person/${userId}`);
        const data = await response.json();
        console.log("DATA", data);
        
        if (data.message === "Invalid User ID") {
            router.push(`/dashboard/profile/`);
            return; 
        } else {
            setUserData(data); 
        }
    } catch (error) {
        router.push(`/dashboard/profile/`);
        console.error("Error fetching user data:", error);
    } finally {
        setIsFetching(false);
    }
  }, [userId, router]);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }

    if (userId == null) {
        setUserData(null);
        router.push("/login");
    }
  }, [userId, fetchUserData, router]);

  // SENDS REQUEST FOR UPDATED USER DATA
  const updateUserData = async (data: any) => {
    try {
      const { userId, relatedUser, profilePicture, backgroundPicture, ...restData } = data;
      const updatedData = {
        ...restData
      };

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.user?.token}`
      }

      const response = await axios.put(`${baseUrl}/person/${userId}`, updatedData, { headers });
      console.log("RESPONSE", response);
      if (response.status === 200) {
        await fetchUserData();
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  }

  const updateProfileImage = async (imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append('profilePicture', imageFile); 
  
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${user?.user?.token}`
      };
  
      const response = await axios.post(`${baseUrl}/person/${userId}/profile-picture`, formData, { headers });
      console.log("RESPONSE", response);
      if (response.status === 200) {
        await fetchUserData();
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const updateBackgroundImage = async (imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append('backgroundPicture', imageFile);

      const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${user?.user?.token}`
      };
      
      const response = await axios.post(`${baseUrl}/person/${userId}/background-picture`, formData, { headers });
      console.log("RESPONSE", response);
      if (response.status === 200) {
        await fetchUserData();
      }
    } catch (error) {
      console.error("Error updating background image:", error);
    }
  }



  return (
    <ProfileContext.Provider value={{ 
      selectedDetail, setSelectedDetail,
      profileTabs, setProfileTabs, 
      userData, setUserData,  
      profileSidebarData, profileTabsData,
      updateUserData,
      updateProfileImage,
      updateBackgroundImage,
      isFetching
    }}> 
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};