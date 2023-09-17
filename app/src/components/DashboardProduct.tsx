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
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { urlForThumbnail } from '../utils/image';
import { Store } from '../utils/Store';
import { convertProductToCartitem } from '../utils/utils';
import React, { useContext, useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useUser } from '@clerk/clerk-react';
import { ROUTING_MANAGER } from '../navigation/Router';

/* eslint-disable */
export default function DashboardProduct({ product }) {
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const { t } = useTranslation();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const addToCartHandler = () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.countInStock < quantity) {
      alert('Lo sentimos. El producto no tiene stock.');
      return;
    }
    setOpenSnackBar(true);
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
        // color="primary"
        // href={ROUTING_MANAGER.COMBO.replace(':slug', product.slug.current)}
        href={ROUTING_MANAGER.ALL_COMBOS + `/${product.slug.current}`}
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
              <Rating value={product.rating} readOnly></Rating> (
              {product.numReviews} reviews)
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
      <CardActions>
        <Typography>{product.price}€</Typography>
        <p></p>
        {product.countInStock === 0 ? (
          <Button size="small" disabled>
            {t('dashboard.addCart')}
          </Button>
        ) : (
          <>
            <Button
              size="small"
              color="primary"
              onClick={addToCartHandler}
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
              >{`${product.name} se ha añadido al carro.`}</Alert>
            </Snackbar>
          </>
        )}
      </CardActions>
    </Card>
  );
}
