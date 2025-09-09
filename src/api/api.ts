import axios from 'axios';

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://inspecoes-api.vercel.app';

export const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});
