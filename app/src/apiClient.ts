import axios from 'axios';

const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/',
  headers: {
    'Content-type': 'application/json',
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    if (localStorage.getItem('userInfo'))
      config.headers.authorization = `Bearer ${
        JSON.parse(localStorage.getItem('userInfo')!).token
      }`;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default apiClient;

//TODO: MongoDB credentials:
/**
 * user: letmechooseanemail1135
 * password: V9ieXX4FdfkHgyQg
 *
 * user: foodiemovieuser
 * password: mongoDBpassword
 */
