import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../utils/Store';
import { useGetOrderDetailsQuery } from '../hooks/orderHooks';
import { CircularProgress, Alert, CardMedia } from '@mui/material';
import { getError } from '../utils/utils';
import { ApiError } from '../typings/ApiError';
import {
  Grid,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { Card } from '@mui/material'
import useTitle from '../hooks/useTitle';
import classes from '../utils/classes';
import { urlForCart } from '../utils/image';
import Layout from '../layouts/Layout';

export default function OrderPage(
  { title, subtitle }: { title: string, subtitle: string }) {
  useTitle(title + subtitle)
  const navigate = useNavigate()
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;

  const { data: order, isLoading, error } = useGetOrderDetailsQuery(orderId!);


  useEffect(() => {
    if (!userInfo) {
      // navigate
      return navigate('/sign-in')
    }
  }, [])

  return (
    <Layout title='order' description='order'>
      <Typography component='h1' variant='h1'>Order {order?._id}</Typography>
      {isLoading ? (
        <CircularProgress></CircularProgress>
      ) : error ? (
        <Alert severity='info'>{getError(error as ApiError)}</Alert>
      ) : !order ? (
        <Alert severity='error'>Order Not Found</Alert>
      ) : (
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
                  {order.user.fullName},
                </ListItem>
                <ListItem>
                  Status: {' '}
                  {order.isPaid ? 'Yes' : 'No'}
                </ListItem>
              </List>
            </Card>

            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Typography component='h2' variant='h2'>
                    Payment Method
                  </Typography>
                </ListItem>
                <ListItem>{order.paymentMethod}</ListItem>
                <ListItem>
                  Status: {order.isPaid ? `paid at ${order.paidAt}` : 'not paid'}
                </ListItem>
              </List>
            </Card>

            <Card sx={classes.section}>
              <List>
                <ListItem>
                  <Typography component='h2' variant='h2'>
                    Order Items
                  </Typography>
                </ListItem>
                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell align='right'>Quantity</TableCell>
                          <TableCell align='right'>Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.orderItems.map((item) => (
                          <TableRow key={item.slug.current}>
                            <TableCell>
                              <CardMedia
                                component='img'
                                image={urlForCart(item.image)}
                                width={50}
                                height={50}
                              ></CardMedia>
                            </TableCell>
                            <TableCell>
                              <Typography>{item.name}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>{item.quantity}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography>{item.price}</Typography>
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
                  <Typography variant='h2'>Order Summary</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Items:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>${order.itemsPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Tax: </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>${order.taxPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Total Price:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align='right'>${order.totalPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>

  )

}
