// MUI resources
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
  Snackbar,
  IconButton,
} from '@mui/material';
import { List, ListItem } from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';

// React resources
import React, { useContext, useEffect, useState } from 'react';

// Project resources
import client from '../../../src/utils/client';
import Layout from '../../layouts/Layout';
import classes from '../../utils/classes';
import { getImageUrl } from '../../utils/image';
import { Store } from '../../utils/Store';
import { CartItem } from '../../typings/Cart';
import { convertProductToCartitem } from '../../utils/utils';

// Translation resources
import { useTranslation } from 'react-i18next';
import useTitle from '../../hooks/useTitle';

export default function ProductInfo({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  useTitle(title + subtitle);
  const slug = localStorage.getItem('product-slug');
  const { t } = useTranslation();
  const {
    state: { cart },
    dispatch,
  } = useContext(Store);

  const [openSnackBar, setOpenSnackBar] = useState(false);
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

  const addToCartHandler = async (item: CartItem) => {
    const existItem = cart.cartItems.find(
      (x: { _id: any }) => x._id === product?._id
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product!.countInStock < quantity) {
      return;
    }
    setOpenSnackBar(true);
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  const closeSnackBar = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-aria-label="close"
        color="inherit"
        onClick={handleCloseSnackBar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
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
                image={getImageUrl(product?.image)}
                alt={product.name}
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
                    {product.countInStock === 0 ? (
                      <Button size="small" disabled>
                        {' '}
                        {t('dashboard.addCart')}
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={
                            () =>
                              addToCartHandler(
                                convertProductToCartitem(product)
                              )
                          }
                          fullWidth
                          variant="contained"
                        >
                          {t('dashboard.addCart')}
                        </Button>
                        <Snackbar
                          open={openSnackBar}
                          autoHideDuration={6000}
                          onClose={handleCloseSnackBar}
                          action={closeSnackBar}
                        >
                          <Alert
                            onClose={handleCloseSnackBar}
                            severity="success"
                          >
                            {`El aperitivo se ha añadido al carro.`}
                          </Alert>
                        </Snackbar>{' '}
                      </>
                    )}
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

export function getServerSideProps(context: { params: { slug: unknown } }) {
  return {
    props: { slug: context.params.slug },
  };
}
