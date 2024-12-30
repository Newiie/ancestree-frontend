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
  const [isLoading, setIsLoading] = useState(false);
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
    
    // Prevent multiple login attempts
    if (isLoading) return;

    try {
      setIsLoading(true);
      const userResponse = await authService.login({ username, password });
      console.log("RESPONSE", userResponse);
      
      if (userResponse && typeof userResponse === 'object' && 'username' in userResponse && 'id' in userResponse && 'token' in userResponse && 'isCompleted' in userResponse) {
        login({
          username: userResponse.username,
          id: userResponse.id,
          token: userResponse.token,
          isCompleted: userResponse.isCompleted || false
        });
        router.push('/dashboard');
      } else {
        throw new Error('Invalid user data received');
      }
    } catch (error: any) {
      console.log("Error: ", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg p-8 rounded-lg bg-gray-100 shadow-md w-full max-w-md">
      <h1 className='text-primary text-center text-[2rem] font-[500]'>Welcome Back!</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-[1rem] w-full">
        {error && <div className="text-red-500">{error}</div>}
        <label className="text-black" htmlFor="email">Username:</label>
        <div className="relative flex items-center">
          <User width={15} height={15} className="absolute left-3 text-primary" />
          <input
            type="text"
            id="email"
            name="email"
            disabled={isLoading}
            className="text-primary py-[0.5rem] pl-10 pr-[1rem] border border-gray-300 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-primary w-full disabled:opacity-50"
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
            disabled={isLoading}
            className="text-primary py-[0.5rem] pl-10 pr-[1rem] border border-gray-300 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-primary w-full disabled:opacity-50"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button 
          className="py-[0.5rem] px-[1rem] text-[0.9rem] text-white rounded-[3px] bg-primary hover:text-primary hover:bg-hover transition-colors duration-200 mt-[1rem] flex items-center justify-center disabled:opacity-50" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Login'
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
