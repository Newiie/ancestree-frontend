"use client";

import React, { FormEvent, useState, useEffect } from 'react';
import { KeyRound, Mail, User } from 'lucide-react';
import authService from '../../services/api/authService';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

const RegisterForm = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/Dashboard');
    }
  }, [user, router]);

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const user = await authService.register({ name, username, password });
      console.log('Registered user:', user);
      router.push('/Dashboard');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-[1rem] w-full">
      {error && <div className="text-red-500">{error}</div>}

      <label className="text-black" htmlFor="username">Username:</label>
      <div className="relative flex items-center">
        <User width={15} height={15} className="absolute left-3 text-primary" />
        <input
          type="text"
          id="username"
          name="username"
          className="text-primary py-[0.5rem] pl-10 pr-[1rem] border border-gray-300 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-primary w-full"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <label className="text-black" htmlFor="email">Name:</label>
      <div className="relative flex items-center">
        <Mail width={15} height={15} className="absolute left-3 text-primary" />
        <input
          type="text"
          id="email"
          name="email"
          className="text-primary py-[0.5rem] pl-10 pr-[1rem] border border-gray-300 rounded-[3px] focus:outline-none focus:ring-2 focus:ring-primary w-full"
          onChange={(e) => setName(e.target.value)}
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

      <button className="py-[0.5rem] px-[1rem] text-[0.9rem] rounded-[3px] bg-primary hover:text-primary hover:bg-hover transition-colors duration-200 mt-[1rem]" type="submit">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;