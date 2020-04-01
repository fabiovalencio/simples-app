import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.mais-simples.com',
});

export default api;
