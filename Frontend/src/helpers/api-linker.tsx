import axios from 'axios';

export const loginUser = async (email: string, password: string) => {
  const res = await axios.post(`https://poetry-generator-3q8c.onrender.com/api/v1/user/login`, { email, password });
  if (res.status !== 200) {
    throw new Error('Failed to login');
  }
  const data = await res.data;
  return data;
};

export const signupUser = async (name: string, email: string, password: string) => {
  const res = await axios.post(`https://poetry-generator-3q8c.onrender.com/api/v1/user/signup`, { name, email, password }, { withCredentials: true });
  if (res.status !== 201) {
    throw new Error('Unable to Signup');
  }
  const data = await res.data;
  return data;
};

export const checkAuthStatus = async () => {
  const res = await axios.get(`https://poetry-generator-3q8c.onrender.com/api/v1/user/auth-status`, { withCredentials: true });
  if (res.status !== 200) {
    throw new Error('Failed to Authenticate');
  }
  const data = await res.data;
  return data;
};


