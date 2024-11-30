"use client";

import React, { FormEvent, useState, useEffect } from 'react';
import { KeyRound, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import authService from '../../services/api/authService';
import useAuth from '@/hooks/useAuth';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.id) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const userResponse = await authService.login({ username, password });
      console.log("RESPONSE", userResponse);
      
      if (userResponse && typeof userResponse === 'object' && 'username' in userResponse && 'id' in userResponse && 'token' in userResponse) {
        login({
          username: userResponse.username,
          id: userResponse.id,
          token: userResponse.token
        });
        router.push('/dashboard');
      } else {
        throw new Error('Invalid user data received');
      }
    } catch (error: any) {
      console.log("Error: ", error);
      setError(error.message);
    }
  };

  return (
   
      <div className="bg p-8 rounded-lg bg-gray-100 shadow-md w-full max-w-md">
        <h1 className='text-primary text-center text-[2rem] font-[500]'>Welcome Back!</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-[1rem] w-full">
          {error && <div className="text-red-500">{error}</div>}
          <label className="text-black" htmlFor="email">Email:</label>
          <div className="relative flex items-center">
            <User width={15} height={15} className="absolute left-3 text-primary" />
            <input
              type="text"
              id="email"
              name="email"
              className="text-primary py-[0.5rem] pl-10 pr-[1rem] border border-gray-300 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-primary w-full"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <label className="text-black" htmlFor="password">Password:</label>
          <div className="relative flex items-center">
            <KeyRound width={15} height={15} className="absolute left-3 text-primary" />
            <input
              type="password"
              id="password"
              name="password"
              className="text-primary py-[0.5rem] pl-10 pr-[1rem] border border-gray-300 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-primary w-full"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="py-[0.5rem] px-[1rem] text-[0.9rem] text-white rounded-[3px] bg-primary hover:text-primary hover:bg-hover transition-colors duration-200 mt-[1rem]" type="submit">
            Login
          </button>
        </form>
      </div> 
    
  );
};

export default LoginForm;

