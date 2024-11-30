"use client";

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import  store from '@/store/store'; 

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

export default MainLayout;