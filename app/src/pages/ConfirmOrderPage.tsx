import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store } from '../utils/Store';
import { Alert, Button, Card, CardMedia, CircularProgress, Grid, IconButton, List, ListItem, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import CheckoutRequirements from '../components/CheckoutRequirements';
import Layout from '../layouts/Layout';
import classes from '../utils/classes';
import { urlForCart } from '../utils/image';
import useTitle from '../hooks/useTitle';
import CloseIcon from '@mui/icons-material/Close';
import { useCreateOrderMutation } from '../hooks/orderHooks';
import { CartItem } from '../typings/Cart';
import { ApiError } from '../typings/ApiError';
import { getError } from '../utils/utils';
import { useTranslation } from 'react-i18next';

// http://localhost:5173/placeOrder
export default function ConfirmOrderPage({
  title,
  subtitle
}: {
  title: string;
  subtitle: string;
}) {
  useTitle(title + subtitle);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { state, dispatch } = useContext(Store)
  const { cart } = state
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [result, setResult] = useState(false);
  const days = [
    t('days.monday'),
    t('days.tuesday'),
    t('days.wednesday'),
    t('days.thursday'),
    t('days.friday'),
    t('days.saturday'),
    t('days.sunday'),
  ]
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
        isPaid: false,
        isDelivered: false,
        paidAt: '',
        isCancelled: false,
      })
      dispatch({ type: 'CART_CLEAR' })
      localStorage.removeItem('cartItems')
      navigate(`/order/${data.order._id}`)

    } catch (err) {
      setSnackBarMessage(getError(err as ApiError))
      setOpenSnackbar(true)
      setResult(false)
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
                <Typography component='h1' variant='h1'>
                  {t('orders.orderDetails')}
                </Typography>
              </ListItem>
              <ListItem>
                <Stack direction='column'>
                  <Typography>{t('orders.name')}{`${cart.orderDetails?.fullName}`}</Typography>
                  <Typography>{t('orders.email')}{`${cart.orderDetails?.email}`}</Typography>
                  <Typography>
                    {t('orders.pickUpDate')}
                    {
                      `${days[cart.orderDetails?.pickUpDate.getDay() - 1]}
                      ${cart.orderDetails?.pickUpDate.toLocaleDateString()}`
                    }
                  </Typography>
                  <Typography>
                    {t('orders.pickUpTime')}
                    {`${cart.orderDetails?.pickUpDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </Typography>
                  {cart.orderDetails.screenId ?
                    (
                      <Typography>{t('orders.screenId')} {`${cart.orderDetails?.screenId}`}</Typography>
                    ) : (
                      <></>
                    )}
                  {cart.orderDetails.seatNumber ?
                    (
                      <Typography>{t('orders.seatNumber')} {`${cart.orderDetails?.seatNumber}`}</Typography>
                    ) : (
                      <></>
                    )}

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
                <Typography component='h1' variant='h1'>
                  {t('orders.payment')}
                </Typography>
              </ListItem>
              <ListItem>
                {`${t('orders.paymentMethod')}`}
                {cart.paymentMethod === 'Cash' ? `${t('orders.paymentCash')}` : `Paypal`}
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
                            <CardMedia
                              component='img'
                              image={urlForCart(item.image)}
                              width={50}
                              height={50}
                            ></CardMedia>
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
        <Alert severity={result ? 'success' : 'error'} onClose={handleCloseSnackBar}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </Layout >

  )
}



