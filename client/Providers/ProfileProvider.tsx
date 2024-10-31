import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileProviderType {
  selectedDetail: string;
  setSelectedDetail: (detail: string) => void;
  profileTabs: string;
  setProfileTabs: (tabs: string) => void;
  profileSidebarData: string[];
  profileTabsData: string[];
}

const ProfileContext = createContext<ProfileProviderType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedDetail, setSelectedDetail] = useState('General Information');
  const [profileTabs, setProfileTabs] = useState('Personal Details');

  const profileSidebarData = [
    'General Information', 
    'Addresses', 
    'Vital Information', 
    'Personal Interests', 
    'Contact Information'
  ]

  const profileTabsData = [
    'Personal Details', 
    'Profile Memo', 
    'Connections'
  ]

  const GeneralInformation = () => {
    return (
        <>
        <h3 className='font-bold'>Name</h3>
        <p><strong>First Name:</strong> Jethro</p>
        <p><strong>Middle Name:</strong> Layan</p>
        <p><strong>Last Name:</strong> Cenas</p>
        <p><strong>Suffix:</strong> N/A</p>
        <h3 className='font-bold mt-4'>Birth Details</h3>
        <p><strong>Birth Date:</strong> January 01, 2002</p>
        <p><strong>Birth Place:</strong> Cebu City, Cebu, Visayas, PH</p>
        <p><strong>Birthing Center:</strong> Unknown</p>
        <h3 className='font-bold mt-4'>Citizenship</h3>
        <p><strong>Nationality:</strong> Filipino</p>
        <p><strong>Civil Status:</strong> Divorced</p>
      </>
    );
  };
  return (
    <ProfileContext.Provider value={{ 
      selectedDetail, setSelectedDetail,
      profileTabs, setProfileTabs, 

      profileSidebarData, profileTabsData }}> 
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