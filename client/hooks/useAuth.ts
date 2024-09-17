"use client";

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { setUser } from '@/store/userSlice';

const useAuth = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

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