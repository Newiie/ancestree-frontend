"use client";

import Header from '@/components/dashboard/Header';
import React, { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import Sidebar from '@/components/dashboard/Sidebar';
import Content from '@/components/dashboard/Content';

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
    
      <div className="content | overflow-y-auto">
        <Content />
      </div>
    
  );
};

export default Page;