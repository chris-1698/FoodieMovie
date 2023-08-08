import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store } from '../utils/Store';
import { Alert, Button, Card, CardMedia, Grid, Link, List, ListItem, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
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

export default function PlaceOrderPage({
  title,
  subtitle
}: {
  title: string;
  subtitle: string;
}) {
  const navigate = useNavigate();
  useTitle(title + subtitle);
  const { state, dispatch } = useContext(Store)
  const { userInfo, cart } = state
  // const orderDetails = JSON.parse(localStorage.getItem('orderDetails') || '')
  // const cartItems = JSON.parse(localStorage.getItem('cartItems') ||)
  const [openSnackbar, setOpenSnackbar] = useState(false);

  //TODO: Bookmark: 3:38:54 ojo, en el video de Sanity

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
  // TODO: IMPORTANTE Revisar esto. Da fallo de uso incorrecto de hooks?
  //5:08:34
  //https://www.youtube.com/watch?v=-ifcPnXHn8Q&ab_channel=CodingwithBasir
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
      console.log(cart.orderDetails, cart.cartItems, cart.paymentMethod);
      console.log(getError(err as ApiError));

      // setOpenSnackbar(true)
    }
  }

  return (
    <Layout title='preview order' description='preview order'>
      <CheckoutRequirements activeStep={4}></CheckoutRequirements>
      <Typography component='h1' variant='h1'>
        Place Order
      </Typography>

      <Grid container spacing={1}>
        <Grid item md={9} xs={12}>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component='h2' variant='h2'>
                  Order Details
                </Typography>
              </ListItem>
              <ListItem>
                <Stack direction='column'>
                  <Typography>{`Nombre: ${cart.orderDetails?.fullName}\n`}</Typography>
                  <Typography>{`Correo electrónico: ${cart.orderDetails?.email}`}</Typography>
                  <Typography>{`Fecha de recogida: ${cart.orderDetails?.pickUpDate}`}</Typography>
                  <Typography>{`Hora de recogida: ${cart.orderDetails?.pickUpTime}`}</Typography>
                </Stack>
                {/* TODO: Ver cómo poner saltos de línea y continuar con la página */}

              </ListItem>
              <ListItem>
                <Button onClick={() => navigate('/orderDetails')} variant='contained' color='secondary'>
                  Edit
                </Button>
              </ListItem>
            </List>
          </Card>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component='h2' variant='h2'>
                  Payment
                </Typography>
              </ListItem>
              <ListItem>
                Method: {cart.paymentMethod}
              </ListItem>
              <ListItem>
                <Button
                  onClick={() => navigate('/payment')}
                  variant='contained'
                  color='secondary'
                >
                  Edit
                </Button>
              </ListItem>
            </List>
          </Card>
          <Card sx={classes.section}>
            <List>
              <ListItem>
                <Typography component='h2' variant='h2'>
                  Items
                </Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ paddingLeft: '9%' }}>Image</TableCell>
                        <TableCell sx={{ paddingLeft: '9%' }}>Name</TableCell>
                        <TableCell align='right'>Quantity</TableCell>
                        <TableCell align='right'>Price</TableCell>
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
                <Typography variant='h2'>Order Summary</Typography>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Items:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align='right'>{cart.itemsPrice}€</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    Taxes:
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align='right'>{cart.taxPrice}€</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <strong>Total:</strong>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align='right'><strong>{cart.totalPrice}€</strong></Typography>
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
                  Place Order
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
          Ha ocurrido algún error, inténtelo de nuevo.
          {/* setLoading(false); */}
        </Alert>
      </Snackbar>
    </Layout >

  )
}



