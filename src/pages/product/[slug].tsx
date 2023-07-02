// TODO: Revisar por qué no funciona este componente. Además, ver si se queda como .js o .tsx
import { useEffect, useState } from 'react';
import client from '../../../src/utils/client';
import Layout from '../../layouts/Layout';
import {
  Alert,
  Box,
  Grid,
  Typography,
  Link,
  CircularProgress,
  CardMedia,
  Rating,
  Card,
  Button,
} from '@mui/material';
import classes from '../../utils/classes';
import { getImageUrl } from '../../utils/image';
import Image from 'next/image';
import { List, ListItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export default function ProductInfo(props) {
  const slug = localStorage.getItem('product-slug');
  const { t } = useTranslation();
  const [state, setState] = useState({
    product: null,
    loading: true,
    error: '',
  });

  const { product, loading, error } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Se obtiene el producto del CMS a partir del seleccionado.
        // Devuelve un array del que sólo queremos el primer elemento.
        const product = await client.fetch(
          `*[_type == "product" && slug.current == "` + slug + `"][0]`
        );
        //Se modifica el estado actual
        setState({ ...state, product, loading: false });
      } catch (err) {
        setState({ ...state, error: err.message, loading: false });
      }
    };
    fetchData();
  }, []);

  return (
    //     // <h1>Hola</h1>
    <Layout>
      {loading ? (
        <CircularProgress value={2} />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box>
          <Box sx={classes.section}>
            <Link
              href="/combos"
              onClick={() => {
                if (localStorage.getItem('product-slug') !== '') {
                  localStorage.removeItem('product-slug');
                }
              }}
            >
              <Typography>back to result</Typography>
            </Link>
          </Box>
          <Grid container spacing={1}>
            <Grid item md={6} xs={12}>
              <CardMedia
                component="img"
                image={getImageUrl(product.image)}
                alt={product.name}
                // width={640}
                // height={640}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <List>
                <ListItem>
                  <Typography component="h1" variant="h1">
                    {product.name}
                  </Typography>
                </ListItem>
                <ListItem>Categoría: {product.category}</ListItem>
                <ListItem>Marca: {product.brand}</ListItem>
                <ListItem>
                  <Rating value={product.rating} readOnly></Rating>
                  <Typography sx={classes.smallText}>
                    ({product.numReviews} valoraciones)
                  </Typography>
                </ListItem>
                <ListItem>Descripción: {product.description}</ListItem>
              </List>
            </Grid>
            <Grid item md={3} xs={12}>
              <Card>
                <List>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Precio</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>{product.price}€</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Estado</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>
                          {product.countInStock > 0
                            ? 'Disponible'
                            : 'No disponible'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Button fullWidth variant="contained">
                      {t('dashboard.addCart')}
                    </Button>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Layout>
  );
}

export function getServerSideProps(context) {
  return {
    props: { slug: context.params.slug },
  };
}
