import axios from 'axios';
import { Credentials } from './types';
import { baseUrl } from '@/lib/config';

const login = async (credentials: { username: string, password: string }): Promise<any> => {
  try {
    const response = await axios.post(`${baseUrl}/login`, credentials);
    console.log("Response: ", response);
    return response.data;
  } catch (error: any) {
    console.log("Error: ", error);
    throw new Error(error.response?.data?.message || 'Invalid username or password');
  }
};

const register = async (credentials: Credentials): Promise<any> => {
  try {
    const response = await axios.post(`${baseUrl}/users`, credentials);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

const authService = { login, register };

export default authService;