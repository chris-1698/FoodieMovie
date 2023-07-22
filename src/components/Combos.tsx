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
  const session = useSession();
  const { user } = useUser();

  const [productState, setProductState] = useState({
    products: [],
    error: '',
    loading: true,
  });
  const { products, error, loading } = productState;
  const { state, dispatch } = useContext(Store);

  useEffect(() => {
    console.log('La sesion es: ', session);
    const fetchData = async () => {
      try {
        const products = await client.fetch(`*[_type == "product"]`);
        setProductState({ products, loading: false, error: '' });
        console.log('Dentro del try: ', session);
      } catch (err) {
        setProductState({ products: [], loading: false, error: err.message });
      }
    };
    fetchData();
  }, []);

  // Almacenamos en el estado la información del usuario para orderDetails
  useEffect(() => {
    const userData = {
      fullName: user?.fullName,
      email: user?.emailAddresses[0].emailAddress,
      id: user?.id,
    };
    dispatch({
      type: 'USER_SIGNIN',
      payload: {
        fullName: user?.fullName,
        email: user?.emailAddresses[0].emailAddress,
      },
    });
    localStorage.setItem('userInfo', JSON.stringify(userData));
    // }
  }, [user]);
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
