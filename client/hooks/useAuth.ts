"use client";

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { setUser } from '@/store/userSlice';
import { usePathname } from 'next/navigation';
const useAuth = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    if (!user && pathname !== '/register' && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, router, pathname]);

  const login = (username: string) => {
    dispatch(setUser(username));
    window.localStorage.setItem('loggedNoteappUser', JSON.stringify(username));
  };

  const logout = () => {
    dispatch(setUser(null));
    window.localStorage.removeItem('loggedNoteappUser');
    router.push('/login');
  };

  return { user, login, logout };
};

export default useAuth;