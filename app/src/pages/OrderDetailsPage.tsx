import { useParams } from 'react-router-dom';
import { useGetOrderDetailsQuery } from '../hooks/orderHooks';
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


export default function OrderDetailsPage({ title, subtitle }: { title: string, subtitle: string }) {
  useTitle(title + subtitle)
  // Revisar esto. No pilla el id de la url! HECHO. Revisar página y quitar lo que
  // no haga falta
  // Revisar también lo del correo, crear otra cuenta en emailjs y probar.
  const params = useParams();
  const { id: orderId } = params;
  const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId!);
  const { t } = useTranslation();

  return (
    <Layout title='order' description='order'>
      <Typography component='h2' variant='h2'>{t('orders.order')} {order?._id}</Typography>
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
                <ListItem>
                  <Stack direction='column' alignContent='center'>
                    <Typography align='center'>
                      {t('orders.pickupCode')}
                    </Typography>
                    <QRCode
                      size={200}
                      bgColor='white'
                      fgColor='black'
                      value={order.pickUpCode} />
                    <Typography
                      align='center'
                      fontFamily='monospace'
                      fontSize='30px'>
                      {order.pickUpCode}
                    </Typography>
                  </Stack>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  )
}
