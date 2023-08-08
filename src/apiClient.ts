import axios from 'axios';

const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '/',
  headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Access-Control-Allow-Methods': '*',
  },
});
// TODO: Ver problema de CORS al crear pedido.

apiClient.interceptors.request.use(
  async (config) => {
    // const thisSession = useSession();
    const userToken = JSON.parse(localStorage.getItem('userInfo')!).token;

    // const encryptedToken = jwt.sign(
    //   { token: userToken },
    //   process.env.VITE_REACT_APP_CLERK_JWT_KEY || 'secretkey',
    //   { algorithm: 'HS256' }
    // );

    // console.log('Fallo porque le tengo miedo al éxito: ', userToken);
    // console.log(
    //   'Los árboles hablan vietnamita por algún motivo. ',
    //   encryptedToken
    // );

    if (localStorage.getItem('userInfo'))
      config.headers.authorization = `Bearer ${
        userToken
        //TODO: Ver si pasar como JSON
        //Also: Si useSession no funciona por lo que fuera, podría guardar
        //el token en userInfo, obtenerlo aquí como JSON y acceder al
        //campo "token"
        // thisSession.session?.getToken({ template: 'foodie-movie-jwt' })
      }`;

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
