import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.mais-simples.com',
});

api.interceptors.response.use(
  response => {
    return response;
  },
  function(error) {
    if (error.response.status === 401) {
      console.tron.log(error.config);
    }
  },
);

export default api;
