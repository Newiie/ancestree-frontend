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
  const { user } = useAuth();

  // useEffect(() => {
  //   if (user) {
  //     router.push('/dashboard');
  //   }
  // }, [user, router]);

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validate form data using Zod
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    try {
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
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            className="w-full py-2 mt-4 text-white font-semibold bg-primary rounded-md hover:bg-hover transition-colors duration-200"
            type="submit"
          >
            Register
          </button>
        </form>
      </div>
  );
};

export default RegisterForm;
