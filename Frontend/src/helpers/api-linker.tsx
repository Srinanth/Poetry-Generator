import axios from 'axios';
import { server } from '../main';

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`${server}/user/login`, { email, password }, { withCredentials: true });
  if (res.status !== 200) {
    throw new Error('Failed to login');
  }
  const data = await res.data;
  return data;
};

export const signupUser = async (name: string, email: string, password: string) => {
  const res = await axios.post(`${server}/user/signup`, { name, email, password }, { withCredentials: true });
  if (res.status !== 201) {
    throw new Error('Unable to Signup');
  }
  const data = await res.data;
  return data;
};

export const checkAuthStatus = async () => {
  const res = await axios.get(`${server}/user/auth-status`, { withCredentials: true });
  if (res.status !== 200) {
    throw new Error('Failed to Authenticate');
  }
  const data = await res.data;
  return data;
};


