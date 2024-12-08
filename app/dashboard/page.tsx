"use client";

import Header from '@/components/dashboard/Header';
import React, { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import Sidebar from '@/components/dashboard/Sidebar';
import Content from '@/components/dashboard/Content';
import { ProfileProvider } from '@/providers/ProfileProvider';

const Page = () => {
  return (
    <div className="content | bg-[#DFDFDF] overflow-y-auto">
      <Content />
    </div>
  );
};

export default Page;