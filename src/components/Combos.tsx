import { useEffect, useState } from 'react';
import Layout from '../layouts/Layout';
import client from '../utils/client';
import { Alert, CircularProgress, Grid } from '@mui/material';
import DashboardProduct from './DashboardProduct';

export default function Combos() {
  const [state, setState] = useState({
    products: [],
    error: '',
    loading: true,
  });
  const { products, error, loading } = state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await client.fetch(`*[_type == "product"]`);
        setState({ products, loading: false, error: '' });
      } catch (err) {
        setState({ products: [], loading: false, error: err.message });
      }
    };
    fetchData();
  }, []);
  return (
    <Layout title="products" description="">
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error"> {error} </Alert>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.slug.current}>
              {/* Productos: */}
              <DashboardProduct product={product}></DashboardProduct>
              {/* <Typography>{product.name}</Typography> */}
            </Grid>
          ))}
        </Grid>
      )}
    </Layout>
  );
}
