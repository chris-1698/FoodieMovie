// MUI resources
import {
  Alert,
  Box,
  Grid,
  Typography,
  Link,
  List,
  ListItem,
  CardMedia,
  Rating,
  Card,
  Button,
  Snackbar,
  IconButton,
  Skeleton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// React resources
import React, { useContext, useEffect, useState } from 'react';

// Project resources
import client from '../../../src/utils/client';
import Layout from '../../layouts/Layout';
import classes from '../../utils/classes';
import { getImageUrl } from '../../utils/image';
import { Store } from '../../utils/Store';
import { CartItem } from '../../typings/Cart';
import { convertProductToCartitem, getError } from '../../utils/utils';

// Translation resources
import { useTranslation } from 'react-i18next';
import useTitle from '../../hooks/useTitle';
import { ApiError } from '../../typings/ApiError';

function ProductInfoSkeleton() {
  return (
    <Box>
      {/* Flecha de volver */}
      <Box sx={classes.section}>
        <Skeleton variant="circular" width={24} height={24} />
      </Box>

      <Grid container spacing={1}>
        {/* Imagen */}
        <Grid item md={6} xs={12}>
          <Skeleton variant="rectangular" width="90%" height={400} sx={{ borderRadius: 1 }} />
        </Grid>

        {/* Info del producto */}
        <Grid item md={3} xs={12}>
          <List>
            {/* Nombre */}
            <ListItem>
              <Skeleton variant="text" width="70%" sx={{ fontSize: '2rem' }} />
            </ListItem>
            {/* Categoría */}
            <ListItem>
              <Skeleton variant="text" width="50%" />
            </ListItem>
            {/* Marca */}
            <ListItem>
              <Skeleton variant="text" width="45%" />
            </ListItem>
            {/* Rating */}
            <ListItem>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Skeleton variant="text" width={60} sx={{ ml: 0.5 }} />
              </Box>
            </ListItem>
            {/* Descripción */}
            <ListItem>
              <Box width="100%">
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="75%" />
              </Box>
            </ListItem>
          </List>
        </Grid>

        {/* Card de precio y acción */}
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              {/* Precio */}
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Skeleton variant="text" width="60%" />
                  </Grid>
                  <Grid item xs={6}>
                    <Skeleton variant="text" width="40%" />
                  </Grid>
                </Grid>
              </ListItem>
              {/* Estado */}
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Skeleton variant="text" width="60%" />
                  </Grid>
                  <Grid item xs={6}>
                    <Skeleton variant="text" width="50%" />
                  </Grid>
                </Grid>
              </ListItem>
              {/* Botón */}
              <ListItem>
                <Skeleton variant="rounded" width="100%" height={36} />
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

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
  const [productState, setProductState] = useState<any>({
    product: null,
    loading: true,
    error: '',
  });

  const { product, loading, error } = productState;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const product = await client.fetch(
          `*[_type == "product" && slug.current == "` + slug + `"][0]`
        ).then();
        setProductState({ ...productState, product, loading: false });
      } catch (err) {
        setProductState({ ...productState, error: getError(err as ApiError), loading: false });
      }
    };
    fetchData();
  }, []);

  const addToCartHandler = async (item: CartItem) => {
    const existItem = cart.cartItems.find(
      (x: { _id: any }) => x._id === product?._id
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.countInStock < quantity) {
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
        aria-label="close"
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
        <ProductInfoSkeleton />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box>
          <Box sx={classes.section}>
            <Link
              href="/products"
              onClick={() => {
                if (localStorage.getItem('product-slug') !== '') {
                  localStorage.removeItem('product-slug');
                }
              }}
            >
              <ArrowBackIcon />
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
                        {t('dashboard.addCart')}
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => addToCartHandler(convertProductToCartitem(product))}
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
                          anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                        >
                          <Alert onClose={handleCloseSnackBar} severity="success">
                            {t('dashboard.addedToCart')}
                          </Alert>
                        </Snackbar>
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