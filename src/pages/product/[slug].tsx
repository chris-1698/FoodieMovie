import { useContext, useEffect, useState } from 'react';
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
import { getImageUrl, urlForThumbnail } from '../../utils/image';
import { List, ListItem, Snackbar } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Store } from '../../utils/Store';
import axios from 'axios';

export default function ProductInfo() {
  const slug = localStorage.getItem('product-slug');
  const { t } = useTranslation();
  const {
    state: { cart },
    dispatch,
  } = useContext(Store);
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

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      <Snackbar autoHideDuration={6000}>
        <Alert severity="error">Lo sentimos, producto fuera de stock</Alert>
      </Snackbar>;
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        _key: product._id,
        name: product.name,
        countInStock: product.countInStock,
        slug: product.slug.current,
        price: product.price,
        image: urlForThumbnail(product.image),
        quantity,
      },
    });
    <Snackbar>
      <Alert severity="success">{`${product.name} añadido al carro`}</Alert>
    </Snackbar>;
  };
  //TODO Revisar lo de axios. Si no, buscar otra manera de implementar.
  return (
    <Layout title={product?.name} description={product?.description}>
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
                <ListItem>
                  {t('dashboard.category')} {product.category}
                </ListItem>
                <ListItem>
                  {t('dashboard.brand')} {product.brand}
                </ListItem>
                <ListItem>
                  <Rating value={product.rating} readOnly></Rating>
                  <Typography sx={classes.smallText}>
                    ({product.numReviews} {t('dashboard.reviews')})
                  </Typography>
                </ListItem>
                <ListItem>
                  {t('dashboard.description')} {product.description}
                </ListItem>
              </List>
            </Grid>
            <Grid item md={3} xs={12}>
              <Card>
                <List>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>{t('dashboard.price')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>{product.price}€</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>{t('dashboard.status')}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>
                          {product.countInStock > 0
                            ? t('dashboard.productAvailable')
                            : t('dashboard.productUnavailable')}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Button
                      onClick={addToCartHandler}
                      fullWidth
                      variant="contained"
                    >
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
