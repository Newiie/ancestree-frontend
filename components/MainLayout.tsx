"use client";
import NavBar from "@/components/common/NavBar";
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import  store from '@/store/store'; 

const MainLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <Provider store={store}>
     <NavBar />
      {children}
    </Provider>
  );
};

export default MainLayout;