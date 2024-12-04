import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import axios from 'axios';
import { headers } from 'next/headers';
import profileService from '@/services/api/profileService';

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
  sendFriendRequest: (userId: string) => void;
  acceptFriendRequest: (userId: string) => void;
  isFetching: boolean;
  userFriends: any;
  friendsData: any;
}

const ProfileContext = createContext<ProfileProviderType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode, userId: string }> = ({ children, userId }) => {
  const [selectedDetail, setSelectedDetail] = useState<string>('General Information');
  const [profileTabs, setProfileTabs] = useState<string>('Personal Details');
  const [userData, setUserData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [userFriends, setUserFriends] = useState<any>([]);
  const [friendsData, setFriendsData] = useState<any>([]);
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
        const response = await profileService.fetchUserData(userId);
        const friendList = await profileService.getFriendList();
        console.log("FETCHED USER DATA", response);
        if (response.message === "Invalid User ID") {
            return; 
        } else {
            setUserData(response); 
            setUserFriends(friendList);
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    } finally {
        setIsFetching(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }

    const populateFriendList = async () => {
      const friendList = await profileService.populateFriendList();
      setFriendsData(friendList);
      console.log("POPULATED FRIEND LIST", friendList);
    }

    populateFriendList();
    
    if (userId == null) {
        setUserData(null);
        router.push("/login");
    }
  }, [userId, fetchUserData]);

  const sendFriendRequest = async (userId: string) => {
    try {
      await profileService.sendFriendRequest(userId);
      await fetchUserData();
    }
    catch (error) {
      console.error("Error sending friend request:", error);
    }
  }

  const acceptFriendRequest = async (userId: string) => {
    try {
      await profileService.acceptFriendRequest(userId);
      await fetchUserData();
    }
    catch (error) {
      console.error("Error accepting friend request:", error);
    }
  }

  const updateUserData = async (data: any) => {
    try {
      const { userId, relatedUser, profilePicture, backgroundPicture, ...restData } = data;
      const updatedData = {
        ...restData
      };
      const response = await profileService.updateUserData(userId, updatedData);
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

      await profileService.updateProfileImage(userId, formData);
      await fetchUserData();

    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const updateBackgroundImage = async (imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append('backgroundPicture', imageFile);
      
      await profileService.updateBackgroundImage(userId, formData);
      await fetchUserData();
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
      sendFriendRequest,
      acceptFriendRequest,
      isFetching,
      userFriends,
      friendsData
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