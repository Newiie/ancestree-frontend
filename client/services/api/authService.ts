import axios from 'axios';
import { Credentials, User } from './types';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const login = async (credentials: Credentials): Promise<User> => {
  try {
    const response = await axios.post(`${baseUrl}/login`, credentials);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

const register = async (credentials: Credentials): Promise<User> => {
  try {
    const response = await axios.post(`${baseUrl}/users`, credentials);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

const authService = { login, register };

export default authService;