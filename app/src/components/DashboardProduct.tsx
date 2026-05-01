import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Rating,
  Alert,
  Snackbar,
  IconButton,
  Link,
  Grid
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { urlForThumbnail } from '../utils/image';
import { Store } from '../utils/Store';
import { convertProductToCartitem } from '../utils/utils';
import React, { useContext, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { ROUTING_MANAGER } from '../navigation/Router';

// TODO: Revisar que esto funcione
// interface IProduct {
//   _id: string,
//   countInStock: number,
//   name: string,
//   slug: { current: string },
//   rating: number,
//   numReviews: number,
//   image: string,
//   price: number
// }

/* eslint-disable */
export default function DashboardProduct({ product }) {
  // export default function DashboardProduct(product) {
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const { t } = useTranslation();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.countInStock < quantity) {
      setOpenSnackBar(true)
      setSnackBarMessage(`${t('dashboard.noStock')}`)
      return;
    }
    setOpenSnackBar(true);
    setSnackBarMessage(`${product.name} ${t('dashboard.xAddedToCart')}`)
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...convertProductToCartitem(product), quantity },
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
    <Card>
      <Link
        href={ROUTING_MANAGER.ALL_PRODUCTS + `/${product.slug.current}`}
        onClick={() => {
          localStorage.setItem('product-slug', product.slug.current);
        }}
        onAuxClick={() => {
          localStorage.setItem('product-slug', product.slug.current);
        }}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            image={urlForThumbnail(product.image)}
            title={product.name}
          ></CardMedia>
          <CardContent>
            <Typography>{product.name}</Typography>
            <Typography>
              <Rating value={product.rating} readOnly precision={0.5}></Rating> (
              {product.numReviews} {t('dashboard.reviews')})
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
      <CardActions sx={{ justifyContent: 'space-between', padding: '0 1rem' }}>
        {/* <Grid className='prueba-class' sx={{ justifyContent: 'space-between', display: 'flex', width: '100%', padding: '0 0.5rem' }}> */}
        <Typography variant='h2' fontSize='large'>
          {product.price} {t('currency')}
        </Typography>

        {/* If there's no stock for the product, disable "add to cart" button */}
        <Button
          size='small'

          disabled={product.countInStock === 0}
          color={product.countInStock > 0 ? 'primary' : undefined}
          variant='contained'
          onClick={() => {
            if (product.countInStock > 0) {
              addToCartHandler()
            }
          }}
        >
          {product.countInStock === 0 ?
            t('dashboard.noStockProduct') :
            t('dashboard.addCart')
          }
        </Button>
        {/* </Grid> */}
        <Snackbar
          open={openSnackBar}
          autoHideDuration={6000}
          onClose={handleCloseSnackBar}
          action={closeSnackBar}
          anchorOrigin={{
            horizontal: 'center',
            vertical: 'top'
          }}
        >
          <Alert
            onClose={handleCloseSnackBar}
            severity="success"
          >
            {snackBarMessage}
          </Alert>
        </Snackbar>
      </CardActions>
    </Card>
  );
}
