"use client";

import Header from '@/components/dashboard/Header';
import React, { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import Sidebar from '@/components/dashboard/Sidebar';
import Content from '@/components/dashboard/Profile/Content';
import { ProfileProvider } from '@/providers/ProfileProvider';

const Page = ({params}: {params: {id: string}}) => {
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);

  const { id } = params;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !id) {
    return null;  
  }

  return (
    <ProfileProvider userId={id as string}> 
      <div className="content | bg-[#DFDFDF] overflow-y-auto">
        <Content />
      </div>
    </ProfileProvider>
  );
};

export default Page;