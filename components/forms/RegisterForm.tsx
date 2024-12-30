"use client";

import React, { FormEvent, useState, useEffect } from 'react';
import { KeyRound, User } from 'lucide-react';
import authService from '../../services/api/authService';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { registerSchema } from '@/lib/schema';
  
const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // useEffect(() => {
  //   if (user) {
  //     router.push('/dashboard');
  //   }
  // }, [user, router]);

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    // Prevent multiple registration attempts
    if (isLoading) return;

    // Validate form data using Zod
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        password: formData.password,
      });
      if (response.message == "Registered successfully!") {
        console.log('Registered user:', user);
        router.push('/dashboard');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
      <div className="bg p-8 rounded-lg bg-gray-100 shadow-md w-full max-w-md">
        <h1 className='text-primary text-center text-[2rem] font-[500]'>Register Now!</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          {error && <div className="text-red-500 text-center">{error}</div>}
            <div>
            <label className="block text-sm text-gray-600" htmlFor="username">Username</label>
            <div className="relative mt-1">
              <User width={15} height={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
              <input
                type="text"
                id="username"
                name="username"
                disabled={isLoading}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600" htmlFor="firstName">First Name</label>
              <div className="relative mt-1">
                <User width={15} height={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  disabled={isLoading}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600" htmlFor="lastName">Last Name</label>
              <div className="relative mt-1">
                <User width={15} height={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  disabled={isLoading}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600" htmlFor="password">Password</label>
              <div className="relative mt-1">
                <KeyRound width={15} height={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  disabled={isLoading}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600" htmlFor="confirmPassword">Confirm Password</label>
              <div className="relative mt-1">
                <KeyRound width={15} height={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  disabled={isLoading}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            className="w-full py-2 mt-4 text-white font-semibold bg-primary rounded-md hover:bg-hover transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Register'
            )}
          </button>
        </form>
      </div>
  );
};

export default RegisterForm;
