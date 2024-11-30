"use client";

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { setUser, UserState } from '@/store/userSlice';
import { usePathname } from 'next/navigation';

const useAuth = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    if (!user && pathname !== '/register' && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, router, pathname]);

  const login = (useraccount: UserState) => {
    console.log("USER ON LOGIN", useraccount);
    dispatch(setUser({ username: useraccount.username, id: useraccount.id, token: useraccount.token }));
    const userData = { username: useraccount.username, id: useraccount.id, token: useraccount.token };
    window.localStorage.setItem('AncestreeUser', JSON.stringify(userData));
  };

  const logout = () => {
    dispatch(setUser({ username: null, id: null, token: null }));
    window.localStorage.removeItem('AncestreeUser');
    router.push('/login');
  };

  return { user, login, logout };
};

export default useAuth;