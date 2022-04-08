import axios from 'axios';

const api = axios.create({
  baseURL: 'https://meiabarra.herokuapp.com/api',
});

export default api;
