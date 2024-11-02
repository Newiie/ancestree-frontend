import axios from 'axios';
import { Credentials, User } from './types';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

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