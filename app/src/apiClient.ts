import axios from 'axios';

const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/',
  headers: {
    'Content-type': 'application/json',
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
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (
      status === 401 &&
      (message?.includes('jwt expired') ||
        message?.includes('TokenExpiredError') ||
        message?.includes('jwt'))
    ) {
      localStorage.removeItem('userInfo');
      sessionStorage.setItem('authMessage', 'Tu sesión ha expirado.');

      window.location.href = '/signin';
    }

    return Promise.reject(error);
  },
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
