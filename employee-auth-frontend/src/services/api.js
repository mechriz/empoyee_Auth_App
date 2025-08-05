// services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const checkProfile = async (token) => {
  const res = await API.get('/profile/check', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.profileExists;
};
