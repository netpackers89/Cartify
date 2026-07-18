import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api' // Note the /api prefix
});

export default api;