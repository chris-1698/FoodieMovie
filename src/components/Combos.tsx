// React resources
import { useContext, useEffect, useState } from 'react';

// Sanity client
import client from '../utils/client';

// MUI resources
import { Alert, CircularProgress, Grid } from '@mui/material';

// Project resources
import DashboardProduct from './DashboardProduct';
import { Store } from '../utils/Store';

// Clerk resources
import { useSession, useUser } from '@clerk/clerk-react';


export default function Combos() {

  const thisSession = useSession();

  const [obtainedToken, setObtainedToken] = useState('')
  const [productState, setProductState] = useState({
    products: [],
    error: '',
    loading: true,
  });

  const { user } = useUser();
  const { products, error, loading } = productState;
  const { state, dispatch } = useContext(Store);
  //TODO: Ver dónde crear y guardar el token. 
  //No puedo hacerlo de esta manera porque se queda esperando
  // const userToken = thisSession.session?.getToken({
  //   template: 'foodie-movie-jwt',
  // }).then((tokenResponse) => {
  //   setObtainedToken(tokenResponse!);
  // });
  // const userToken = thisSession.session?.getToken({
  //   template: 'foodie-movie-jwt',
  // })
  useEffect(() => {
    // console.log('La sesion es: ', thisSession);
    const fetchData = async () => {
      try {
        const products = await client.fetch(`*[_type == "product"]`);
        setProductState({ products, loading: false, error: '' });
        // console.log('Dentro del try: ', thisSession);
      } catch (err) {
        setProductState({ products: [], loading: false, error: err.message });
      }
    };
    fetchData();
    // const userToken = thisSession.session?.getToken({
    //   template: 'foodie-movie-jwt',
    // })

    // setObtainedToken(userToken!);
  }, []);

  // Almacenamos en el estado la información del usuario para orderDetails
  useEffect(() => {
    if (thisSession) {
      const userToken = thisSession.session?.getToken({
        template: 'foodie-movie-jwt',
      }).then((token) => {
        setObtainedToken(token!)
        console.log('El token de usuario es: ', token)

      }
      )

    } else { return; }

    // if (obtainedToken === '') {
    //   return;
    // }
    const userData = {
      fullName: user?.fullName,
      email: user?.emailAddresses[0].emailAddress,
      id: user?.id,
      token: obtainedToken,
    };
    dispatch({
      type: 'USER_SIGNIN',
      payload: {
        fullName: user?.fullName,
        email: user?.emailAddresses[0].emailAddress,
        id: user?.id,
      },
    });
    localStorage.setItem('userInfo', JSON.stringify(userData));
    localStorage.setItem('product-slug', '');
    // }
    // console.log('Susana sigue debiendo una caña a Pedro ', userToken);
    // TODO: Empezar login desde 0. Siguiendo el tutorial y trabajando con la BBDD
  }, []);
  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        //TODO:  Modificar esto o dejar como alerta?
        <Alert severity="error"> {error} </Alert>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.slug.current}>
              {/* Productos: */}
              <DashboardProduct product={product}></DashboardProduct>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
