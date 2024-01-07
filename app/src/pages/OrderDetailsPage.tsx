import { useParams } from 'react-router-dom';
import { useGetOrderDetailsQuery, useGetPaypalClientIdQuery, usePayOrderMutation } from '../hooks/orderHooks';
import {
  CircularProgress,
  Alert,
  CardMedia,
  Grid,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  IconButton,
  Button,
  Snackbar,
} from '@mui/material';
import { getError } from '../utils/utils';
import { ApiError } from '../typings/ApiError';
import { Card } from '@mui/material'
import useTitle from '../hooks/useTitle';
import classes from '../utils/classes';
import { urlForCart } from '../utils/image';
import Layout from '../layouts/Layout';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code'
import React, { useContext, useEffect, useState } from 'react';
import { PayPalButtons, PayPalButtonsComponentProps, SCRIPT_LOADING_STATE, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import emailjs from '@emailjs/browser'
import { Store } from '../utils/Store';
import CloseIcon from '@mui/icons-material/Close'

// http://localhost:5173/orderSummary/:id
export default function OrderDetailsPage({ title, subtitle }: { title: string, subtitle: string }) {
  useTitle(title + subtitle)
  // Revisar esto. No pilla el id de la url! HECHO. Revisar página y quitar lo que
  // no haga falta
  // Revisar también lo del correo, crear otra cuenta en emailjs y probar.
  const params = useParams();
  const { id: orderId } = params;
  const { data: order, isLoading, error, refetch } = useGetOrderDetailsQuery(orderId!);
  const { data: paypalConfig } = useGetPaypalClientIdQuery()
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ isPending, isRejected }, paypalDispatch] = usePayPalScriptReducer();
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [result, setResult] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const { t } = useTranslation();
  const { mutateAsync: payOrder, isLoading: loadingPay } = usePayOrderMutation();

  const cartItemsDetail = () => {
    let details = "";
    order?.orderItems.map((item) => {
      details += `${item.name} x ${item.quantity} ${item.price}${t('currency')}\n`
    })
    details += `
    \n ${t('taxes')}  ${order?.taxPrice}${t('currency')}
    \n Total:  ${order?.totalPrice}${t('currency')}`

    return details
  }

  const testPayHandler = () => {
    payOrder({ orderId: orderId! })
    handleSendEmail()
    refetch()
    alert(t('orders.paid'))
  }

  const handleSendEmail = () => {
    if (order) {
      try {
        emailjs.send(
          // 'service_uk7l8dh', //Outlook
          'service_rpirl1w',
          'template_oprezrr',
          {
            to_name: userInfo?.name,
            pickup_code: order?.pickUpCode,
            to_email: userInfo?.email,
            order_details: cartItemsDetail(),
          },
          'ElU7Zz_Kk2wIl9-bY',
        )
        setSnackBarMessage(`${t('orders.emailSent')}`);
        setShowSnackBar(true);
        setResult(true)
        // console.log('Correo enviado!'); Send email test
      } catch (err) {
        setSnackBarMessage(getError(err as ApiError));
        setShowSnackBar(true);
        setResult(false)
      }
    }
  }

  useEffect(() => {
    if (order?.isPaid === false && order.paymentMethod === 'PayPal') {
      if (paypalConfig && paypalConfig.clientId) {
        const loadPaypalScript = async () => {
          paypalDispatch({
            type: 'resetOptions',
            value: {
              'clientId': paypalConfig.clientId!,
              currency: 'EUR'
            },
          })
          paypalDispatch({
            type: 'setLoadingStatus',
            value: SCRIPT_LOADING_STATE.PENDING,
          })
        }
        loadPaypalScript()
      }
    }
    if (order?.isPaid === true) setShowQR(true)

  }, [paypalConfig, order])

  const paypalbuttonTransactionProps: PayPalButtonsComponentProps = {
    style: { layout: 'vertical' },
    createOrder(data, actions) {
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: order!.totalPrice.toString(),
            },
          },
        ],
      }).then((orderID: string) => {
        return orderID
      })
    },
    onApprove(data, actions) {
      return actions.order!.capture().then(async (details) => {
        try {
          payOrder({ orderId: orderId!, ...details })
          handleSendEmail()
          refetch()
        } catch (err) {
          alert(getError(err as ApiError))
        }
      })
    },
    onError: (err) => {
      alert(getError(err as ApiError))
    }
  }
  const handleCloseSnackBar = () => {
    setShowSnackBar(false);
  }

  const toCloseSnackBar = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="Close"
        color="inherit"
        onClick={handleCloseSnackBar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  )

  return (
    <Layout title='order' description='order'>
      <Typography component='h2' variant='h2'>
        {t('orders.order')} {order?._id}
      </Typography>
      {isLoading ? (
        <CircularProgress></CircularProgress>
      ) : error ? (
        <Alert severity='error'>{getError(error as ApiError)}</Alert>
      ) : !order ? (
        <Alert severity='error'>{t('orders.orderNotFound')}</Alert>
      ) : (
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
                  <Stack direction='column' >
                    <Typography>{t('orders.name')}{order.orderDetails.fullName}</Typography>
                    <Typography>{t('orders.pickUpDate')}{order.orderDetails.pickUpDate}</Typography>
                    <Typography>{t('orders.pickUpTime')}{order.orderDetails.pickUpTime}</Typography>
                    {
                      order.orderDetails.screenId && order.orderDetails.seatNumber
                        ? (
                          <>
                            <Typography>{t('orders.screenId')}{order.orderDetails.screenId}</Typography>
                            <Typography>{t('orders.seatNumber')}{order.orderDetails.seatNumber}</Typography>
                          </>
                        ) : ''
                    }
                  </Stack>
                </ListItem>
                <ListItem>
                  {order.isDelivered ?
                    <Alert severity="success" variant='filled' sx={{ width: '100%' }}>{t('orders.delivered')}</Alert>
                    :
                    <Alert severity="warning" variant='filled' sx={{ width: '100%' }}>{t('orders.notDelivered')}</Alert>
                  }
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
                <ListItem>{t('orders.paymentMethod')}{order.paymentMethod}</ListItem>
                <ListItem>
                  {order.isPaid === true
                    ?
                    <Alert severity="success" variant='filled' sx={{ width: '100%' }}>{t('orders.paid')}</Alert>
                    :
                    <Alert severity="warning" variant='filled' sx={{ width: '100%' }}>{t('orders.notPaid')}</Alert>
                  }
                </ListItem>
              </List>
            </Card>

            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Typography component='h2' variant='h2'>
                    {t('orders.orderItems')}
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
                        {order.orderItems.map((item) => (
                          <TableRow key={item.slug.current}>
                            <TableCell >
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
                              <Typography>{item.price}{t('currency')}</Typography>
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
            <Card>
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
                      <Typography align='right'>{order.itemsPrice}{t('currency')}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>{t('orders.taxes')} </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>{order.taxPrice}{t('currency')}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography><strong>{t('orders.total')}</strong></Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'><strong>{order.totalPrice}{t('currency')}</strong></Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                {!order.isPaid && (
                  <ListItem style={{ width: '100%' }}>
                    {isPending ? (
                      <CircularProgress />
                    ) : isRejected ? (
                      <Alert severity='error'>
                        {t('orders.payPalError')}
                      </Alert>
                    ) : (
                      <div>
                        <PayPalButtons
                          {...paypalbuttonTransactionProps}
                        />
                        <Button onClick={testPayHandler}>Test</Button>
                      </div>
                    )}
                    {loadingPay && <CircularProgress />}
                  </ListItem>
                )}
                <ListItem>
                  <Stack direction='column' alignContent='center'>

                    <Typography align='center'>
                      {t('orders.pickupCode')}
                    </Typography>
                    {
                      showQR === true
                        ? (
                          <>
                            <QRCode
                              // id='pickUpQR'
                              size={200}
                              bgColor='white'
                              fgColor='black'
                              value={order.pickUpCode}
                            >
                            </QRCode>
                            <Typography
                              align='center'
                              fontFamily='monospace'
                              fontSize='30px'
                            >
                              {order.pickUpCode}
                            </Typography>
                          </>
                        ) : (
                          <>
                            {showQR === false ?
                              (
                                <Typography>
                                  {t('orders.seeCode')}
                                </Typography>) : (
                                <></>
                              )
                            }
                          </>
                        )
                    }
                  </Stack>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
      <Snackbar
        open={showSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        action={toCloseSnackBar}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <Alert
          onClose={handleCloseSnackBar}
          severity={result ? 'success' : 'error'}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </Layout>
  )
}
