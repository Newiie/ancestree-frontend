"use client";

import Header from '@/components/dashboard/Header';
import React, { useEffect, useState } from 'react';
import useAuth from '@/providers/useAuth';
import Sidebar from '@/components/dashboard/Sidebar';
import Content from '@/components/dashboard/Profile/Content';
import { ProfileProvider } from '@/providers/ProfileProvider';

const Page = () => {
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;  
  }

  if (!user) {
    return null;  
  }

  return (
    <ProfileProvider> 
      <div className="content | bg-[#DFDFDF] overflow-y-auto">
        <Content />
      </div>
    </ProfileProvider>
    
  );
};

export default Page;