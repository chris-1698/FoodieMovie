import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { useConfirmOrderMutation, useDeliverOrderMutation, useGetSomeOrdersQuery } from '../hooks/orderHooks';
import useTitle from '../hooks/useTitle';
import Layout from '../layouts/Layout';
import { ApiError } from '../typings/ApiError';
import { getError } from '../utils/utils';
import QRHover from '../components/QRHover';
import CloseIcon from '@mui/icons-material/Close'


const REGEXP = new RegExp('^[A-Za-z0-9]{1,12}$')

export default function Search({ title, subtitle }: { title: string, subtitle: string }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('')
  const a = query.get('filter') || ''

  const { data: orders, isLoading, error } = useGetSomeOrdersQuery(a);
  const { t } = useTranslation();
  const { mutateAsync: deliverOrder } = useDeliverOrderMutation();
  const { mutateAsync: confirmOrder } = useConfirmOrderMutation();

  const days = [
    t('days.monday'),
    t('days.tuesday'),
    t('days.wednesday'),
    t('days.thursday'),
    t('days.friday'),
    t('days.saturday'),
    t('days.sunday'),
  ]
  useTitle(title + subtitle)

  const handleDeliverOrder = async (id: string) => {
    try {
      await (deliverOrder({ id })).then(() => setTimeout(function () { window.location = window.location }, 100)
      );
    } catch (err) {
      alert(getError(err as ApiError))
    }
  }

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  }

  const handleConfirmOrder = async (id: string) => {
    try {
      confirmOrder({ id })
      // await confirmOrder({ id }).then(() =>
      // setTimeout(function () { window.location = window.location }, 100)
      // );
    } catch (err) {
      alert(getError(err as ApiError));
    }
  }

  const closeSnackBar = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-aria-label='close'
        color='inherit'
        onClick={handleCloseSnackBar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  )
  return (
    <Layout title='order search screen' description='order search screen'>
      <>
        <Grid container maxWidth='mx' sx={{ paddingBottom: '3%' }}>
          <TextField
            size='small'
            sx={{ width: '50%' }}
            onChange={(e) => setSearchTerm(e.target.value)} />
          <IconButton onClick={() => {
            if (REGEXP.test(searchTerm)) {
              navigate(`/employeePage/search/?filter=${searchTerm}`)
            } else {
              setSnackBarMessage(`${t('allOrders.verifySearch')}`)
              setOpenSnackBar(true)
            }
          }}>
            <SearchIcon />
          </IconButton>
          <Button
            sx={
              { marginLeft: '25%' }
            }
            variant='contained' onClick={() => {
              navigate('/employeePage')
            }}>{t('allOrders.removeFilter')}</Button>
        </Grid>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography fontWeight={'bold'}>{t('allOrders.code')}</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={'bold'}>{t('allOrders.time')}</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={'bold'}>{t('allOrders.isPaid')}</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={'bold'}>{t('allOrders.isDelivered')}</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={'bold'}>
                    {/* TODO: Texto */}
                    Entregar en
                  </Typography>

                </TableCell>
                <TableCell>
                  <Typography fontWeight={'bold'}>
                    {/* TODO: Texto */}
                    Estado
                  </Typography>

                </TableCell>
                <TableCell>
                  <></>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                // If resource is loading
                isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                  // If resource is not available
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Alert severity='error'>{getError(error as ApiError)}</Alert>
                    </TableCell>
                  </TableRow>
                  // If there are no orders with the specified pickup code
                ) : orders?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Alert severity='info'>{t('allOrders.noOrders')}</Alert>
                    </TableCell>
                  </TableRow>
                  // If there are orders
                ) : (
                  <>
                    {orders!.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>
                          <QRHover text={order.pickUpCode}></QRHover>
                        </TableCell>
                        <TableCell>
                          {`${days[new Date(order.orderDetails.pickUpDate).getDay()]} `}
                          {new Date(order.orderDetails.pickUpDate).toLocaleDateString()}<br></br>
                          {new Date(order.orderDetails.pickUpDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell>
                          <Typography>{order.isPaid ? t('allOrders.delivered') : t('allOrders.notDelivered')}</Typography>
                        </TableCell>
                        <TableCell key={order._id}>
                          <Typography>{order.isDelivered ? t('allOrders.delivered') : t('allOrders.notDelivered')}</Typography>
                        </TableCell>
                        <TableCell>
                          {order.isCancelled
                            ? 'Anulado'
                            : order.isPaid && order.isDelivered ? 'Pagado y entregado'
                              : !order.isPaid && !order.isDelivered ? 'Pendiente de pago y entrega'
                                : order.isPaid && !order.isDelivered ? 'Pendiente de entrega'
                                  : ''}
                        </TableCell>
                        <TableCell>
                          {order.paymentMethod === 'Cash' ?
                            <Button
                              variant='contained'
                              color='secondary'
                              disabled={order.isDelivered && order.isPaid}
                              onClick={() => {
                                handleConfirmOrder(order._id.toString())
                              }}>
                              Confirmar
                            </Button>
                            :
                            <Button variant='contained'
                              disabled={order.isDelivered || !order.isPaid}
                              onClick={() => {
                                handleDeliverOrder(order._id.toString())
                              }}>
                              {/* {t('allOrders.deliver')} */}
                              Entregado
                            </Button>
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )
              }
            </TableBody>
          </Table>
        </TableContainer>
      </>
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
          severity='warning'
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </Layout>
  )
}
