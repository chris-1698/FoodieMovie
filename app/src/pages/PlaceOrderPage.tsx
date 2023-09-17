import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store } from '../utils/Store';
import { Alert, Button, Card, CardMedia, Grid, List, ListItem, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import CheckoutRequirements from '../components/CheckoutRequirements';
import Layout from '../layouts/Layout';
import classes from '../utils/classes';
import { urlForCart } from '../utils/image';
import useTitle from '../hooks/useTitle';
import { CircularProgress, IconButton } from '@material-ui/core';
import CloseIcon from '@mui/icons-material/Close';
import { useCreateOrderMutation } from '../hooks/orderHooks';
import { CartItem } from '../typings/Cart';
import { ApiError } from '../typings/ApiError';
import { getError } from '../utils/utils';
import { useTranslation } from 'react-i18next';

export default function PlaceOrderPage({
  title,
  subtitle
}: {
  title: string;
  subtitle: string;
}) {
  useTitle(title + subtitle);
  // TODO:: Cambiar titulo
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { state, dispatch } = useContext(Store)
  const { userInfo, cart } = state
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // const orderDetails = JSON.parse(localStorage.getItem('orderDetails') || '')
  // const cartItems = JSON.parse(localStorage.getItem('cartItems') ||)

  // Redondea un número a dos decimales
  const roundTo2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100

  // Calcula el precio de los productos 
  cart.itemsPrice = roundTo2(
    cart.cartItems.reduce((a: number, c: CartItem) => a + c.quantity * c.price, 0)
  )

  // //10% IVA https://www.gipuzkoa.eus/es/web/ekonomiaetazergak/iva
  cart.taxPrice = roundTo2(0.1 * cart.itemsPrice)
  cart.totalPrice = cart.itemsPrice + cart.taxPrice

  const { mutateAsync: createOrder, isLoading } = useCreateOrderMutation()

  const handleCloseSnackBar = () => {
    setOpenSnackbar(false);
  }

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment')
    }
    if (cart.cartItems.length === 0) {
      navigate('/cart')
    }
  }, [cart, navigate]);

  const closeSnackBar = (
    <React.Fragment>
      <IconButton
        size='small'
        aria-aria-label='Close'
        color='inherit'
        onClick={handleCloseSnackBar}
      >
        <CloseIcon fontSize='small' />
      </IconButton>
    </React.Fragment>
  )
  const placeOrderHandler = async () => {
    try {
      const data = await createOrder({
        orderItems: cart.cartItems,
        orderDetails: cart.orderDetails,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
      dispatch({ type: 'CART_CLEAR' })
      localStorage.removeItem('cartItems')
      navigate(`/order/${data.order._id}`)

    } catch (err) {
      //TODO: Snackbar with error message
      console.log(cart.orderDetails, cart.cartItems, cart.paymentMethod);
      console.log(getError(err as ApiError));
      // setOpenSnackbar(true)
    }
  }

  return (
    <Layout title='preview order' description='preview order'>
      <CheckoutRequirements activeStep={4}></CheckoutRequirements>
      <Typography component='h1' variant='h1'>
        {t('orders.placeOrder')}
      </Typography>

      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component='h2' variant='h2'>
                  {t('orders.orderDetails')}
                </Typography>
              </ListItem>
              <ListItem>
                <Stack direction='column'>
                  <Typography>{t('orders.name')}{`${cart.orderDetails?.fullName}`}</Typography>
                  <Typography>{t('orders.email')}{`${cart.orderDetails?.email}`}</Typography>
                  <Typography>{t('orders.pickUpDate')}{`${cart.orderDetails?.pickUpDate}`}</Typography>
                  <Typography>{t('orders.pickUpTime')}{`${cart.orderDetails?.pickUpTime}`}</Typography>
                </Stack>
              </ListItem>
              <ListItem>
                <Button onClick={() => navigate('/orderDetails')} variant='contained' color='secondary'>
                  {t('orders.edit')}
                </Button>
              </ListItem>
            </List>
          </Card>

          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component='h2' variant='h2'>
                  {t('orders.payment')}
                </Typography>
              </ListItem>
              <ListItem>
                {t('orders.paymentMethod')} {cart.paymentMethod}
              </ListItem>
              <ListItem>
                <Button
                  onClick={() => navigate('/payment')}
                  variant='contained'
                  color='secondary'
                >
                  {t('orders.edit')}
                </Button>
              </ListItem>
            </List>
          </Card>

          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component='h2' variant='h2'>
                  {t('orders.items')}
                </Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ paddingLeft: '9%' }}>{t('orders.image')}</TableCell>
                        <TableCell sx={{ paddingLeft: '9%' }}>{t('orders.itemName')}</TableCell>
                        <TableCell align='right'>{t('orders.quantity')}</TableCell>
                        <TableCell align='right'>{t('orders.price')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cart.cartItems.map((item) => (
                        <TableRow key={item.slug.current}>
                          <TableCell>
                            {/* TODO: 3:46:16  https://www.youtube.com/watch?v=FcRWgWQale4&ab_channel=CodingwithBasir*/}
                            {/* <Link href={`/combos/${item.slug.current}`}> */}
                            {/* <Typography variant='h1'>Paco</Typography> Esta línea se puede borrar */}
                            <CardMedia
                              component='img'
                              image={urlForCart(item.image)}
                              width={50}
                              height={50}
                            ></CardMedia>
                            {/* </Link> */}
                          </TableCell>

                          <TableCell sx={{ paddingLeft: '6%' }}>
                            <Typography>{item.name}</Typography>
                          </TableCell>

                          <TableCell align='right'>
                            <Typography sx={{ paddingRight: '15%' }}>{item.quantity}</Typography>
                          </TableCell>

                          <TableCell align='right'>
                            <Typography>{item.price}€</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
              {/* https://www.youtube.com/watch?v=-ifcPnXHn8Q&ab_channel=CodingwithBasir */}
              {/* Bookmark: 5:07:38 */}

              {/* https://www.youtube.com/watch?v=FcRWgWQale4&ab_channel=CodingwithBasir */}
              {/* 3:39:25 */}
            </List>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography variant='h2'>{t('orders.orderSummary')}</Typography>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>{t('orders.itemsPrice')}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align='right'>{cart.itemsPrice}{t('currency')}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    {t('orders.taxes')}
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align='right'>{cart.taxPrice}{t('currency')}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <strong>{t('orders.total')}</strong>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align='right'><strong>{cart.totalPrice}{t('currency')}</strong></Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  type='button'
                  onClick={placeOrderHandler}
                  variant='contained'
                  color='primary'
                  fullWidth
                  disabled={cart.cartItems.length === 0 || isLoading}
                >
                  {t('orders.placeOrder')}
                </Button>
              </ListItem>
              {isLoading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>)}
            </List>
          </Card>
        </Grid>
      </Grid>
      <Snackbar
        autoHideDuration={3000}
        open={openSnackbar}
        action={closeSnackBar}
      >
        <Alert severity='error' onClose={handleCloseSnackBar}>
          {/* TODO: Texto */}
          Ha ocurrido algún error, inténtelo de nuevo.
          {/* setLoading(false); */}
        </Alert>
      </Snackbar>
    </Layout >

  )
}



