import axios from 'axios';

const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/',
  headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  },
});
//El GET sí deja. No hay problemas de CORS, parece
// TODO: Ver problema de CORS al crear pedido.

apiClient.interceptors.request.use(
  async (config) => {
    // const thisSession = useSession();
    const userToken = JSON.parse(localStorage.getItem('userInfo')!).token;

    if (localStorage.getItem('userInfo'))
      config.headers.authorization = `Bearer ${userToken}`;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default apiClient;

//MongoDB credentials:
/**
 * user: letmechooseanemail1135
 * password: V9ieXX4FdfkHgyQg
 *
 * user: foodiemovieuser
 * password: mongoDBpassword
 */
