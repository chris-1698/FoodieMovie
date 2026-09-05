import {
  Alert,
  Typography,
  Skeleton,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  Snackbar,
  TablePagination,
  useTheme,
  Box,
  TableContainer,
  Paper,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getError } from '../utils/utils'
import { ApiError } from '../typings/ApiError'
import QRHover from '../components/QRHover'
import Layout from '../layouts/Header'
import useTitle from '../hooks/useTitle'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConfirmOrderMutation, useDeliverOrderMutation, useGetAllOrdersQuery } from '../hooks/orderHooks'
import { useQueryClient } from '@tanstack/react-query'
import { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions'
import {
  LastPage,
  FirstPage,
  Search,
  KeyboardArrowRight,
  KeyboardArrowLeft,
  Close
} from '@mui/icons-material'
import ConfirmActionDialog from '../fragments/eCommerce/ConfirmProcessModal'

const REGEXP = new RegExp('^[A-Za-z0-9]{1,12}$')

export default function EmployeePage(
  { title, subtitle }
    : { title: string, subtitle: string }
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selectedOrder, setSelectedOrder] = useState<typeof orderList[number] | null>(null)
  const [pendingAction, setPendingAction] = useState<
    {
      order: typeof orderList[number];
      type: 'confirm' | 'deliver' | null
    } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // NOTA: useGetAllOrdersQuery ahora recibe page y rowsPerPage y pide
  // solo esa página al backend. Debe devolver { orders, totalCount }.
  // Ajusta el nombre de los campos si tu backend usa otros (p.ej. "items", "total").
  const { data, isLoading, error } = useGetAllOrdersQuery(page, rowsPerPage)
  const orderList = data?.orders ?? []
  const totalCount = data?.totalCount ?? 0

  const { t } = useTranslation();
  const { mutateAsync: deliverOrder } = useDeliverOrderMutation();
  const { mutateAsync: confirmOrder } = useConfirmOrderMutation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const days = [
    t('days.monday'),
    t('days.tuesday'),
    t('days.wednesday'),
    t('days.thursday'),
    t('days.friday'),
    t('days.saturday'),
    t('days.sunday'),
  ]
  useTitle(title + subtitle);

  const executeDeliverOrder = async (id: string) => {
    try {
      setIsProcessing(true);;
      await deliverOrder({ id });
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
    } catch (err) {
      alert(getError(err as ApiError));
    } finally {
      setIsProcessing(false);
      setPendingAction(null);
    }
  }

  const executeConfirmOrder = async (id: string) => {
    try {
      setIsProcessing(true);
      await confirmOrder({ id });
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
    } catch (err) {
      alert(getError(err as ApiError))
    } finally {
      setIsProcessing(false);
      setPendingAction(null)
    }
  }

  const handleRequestDeliverOrder = (order: typeof orderList[number]) => {
    setPendingAction({ order, type: 'deliver' })
  }

  const handleRequestConfirmOrder = (order: typeof orderList[number]) => {
    setPendingAction({ order, type: 'confirm' })
  }

  const handleClosePendingAction = () => {
    if (isProcessing) return
    setPendingAction(null)
  }

  const handleConfirmPendingAction = () => {
    if (!pendingAction) return
    const id = pendingAction.order?._id.toString();
    if (pendingAction.type === 'confirm') {
      executeConfirmOrder(id);
    } else {
      executeDeliverOrder(id);
    }
  }



  // const handleDeliverOrder = async (id: string) => {
  //   try {
  //     await deliverOrder({ id });
  //     queryClient.invalidateQueries({ queryKey: ['all-orders'] });
  //   } catch (err) {
  //     alert(getError(err as ApiError));
  //   }
  // }
  // const handleConfirmOrder = async (id: string) => {
  //   try {
  //     await confirmOrder({ id });
  //     queryClient.invalidateQueries({ queryKey: ['all-orders'] });
  //   } catch (err) {
  //     alert(getError(err as ApiError));
  //   }
  // }

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  }

  const handleOpenOrderDetail = (order: typeof orderList[number]) => {
    setSelectedOrder(order)
  }

  const handleCloseOrderDetail = () => {
    setSelectedOrder(null)
  }

  const handleSearch = () => {
    if (searchTerm === '') return
    if (REGEXP.test(searchTerm)) {
      navigate(`/employeePage/search/?filter=${searchTerm}`)
    } else {
      setSnackBarMessage(`${t('allOrders.verifySearch')}`)
      setOpenSnackBar(true)
    }
  }

  function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, 0);
    }

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page - 1)
    }

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page + 1)
    }

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    }

    return (
      <Box maxWidth={'sm'} sx={{ flexShrink: 0, m1: 2.5, alignContent: 'center' }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label='primera página'
        >
          {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label='página anterior'
        >
          {theme.direction == 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='siguiente página'
        >
          {theme.direction == 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='última página'
        >
          {theme.direction == 'rtl' ? <FirstPage /> : <LastPage />}
        </IconButton>
      </Box>
    )
  }

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  const closeSnackBar = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-aria-label='close'
        color='inherit'
        onClick={handleCloseSnackBar}
      >
        <Close fontSize="small" />
      </IconButton>
    </React.Fragment>
  )

  return (
    <Layout title='employee page' description='page for user with employee rights'>
      {error ? (
        <Alert severity="error"> {getError(error as ApiError)}</Alert>
      ) : (
        <>
          <Grid container maxWidth='sm' sx={{ paddingBottom: '3%' }}>
            <TextField
              size='small'
              sx={{ width: '90%' }}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
            ></TextField>
            <IconButton disabled={searchTerm === ''} onClick={handleSearch}>
              <Search />
            </IconButton>
          </Grid>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 500 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight={'bold'}>{t('allOrders.code')}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={'bold'}>{t('allOrders.time')}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={'bold'}>Metodo de pago</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={'bold'}>Entregar en</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={'bold'}>Estado</Typography>
                  </TableCell>
                  <TableCell>
                    <></>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: rowsPerPage }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell><Skeleton variant="text" width={80} /></TableCell>
                      <TableCell><Skeleton variant="text" width={100} /></TableCell>
                      <TableCell><Skeleton variant="text" width={70} /></TableCell>
                      <TableCell><Skeleton variant="text" width={120} /></TableCell>
                      <TableCell><Skeleton variant="text" width={100} /></TableCell>
                      <TableCell><Skeleton variant="rounded" width={90} height={36} /></TableCell>
                    </TableRow>
                  ))
                ) : orderList.map((order) => (
                  <TableRow key={order?._id}>
                    <TableCell
                      sx={order?.pickUpCode ? { color: 'inherit', cursor: 'pointer' } : { color: 'primary', cursor: 'pointer' }}
                      onClick={() => handleOpenOrderDetail(order)}
                    >
                      <QRHover text={order?.pickUpCode}></QRHover>
                    </TableCell>
                    <TableCell>
                      {`${days[new Date(order?.orderDetails?.pickUpDate).getDay()]} `}
                      {new Date(order?.orderDetails?.pickUpDate).toLocaleDateString()}<br></br>
                      {new Date(order?.orderDetails?.pickUpDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {order?.paymentMethod === 'Cash' ?
                          'Efectivo' : 'PayPal'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {order?.orderDetails?.screenId && order?.orderDetails?.seatNumber
                          ? `${t('allOrders.screen')} ${order?.orderDetails?.screenId}, 
                          ${t('allOrders.seat')} ${order?.orderDetails?.seatNumber}`
                          : `${t('allOrders.bar')}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {order?.isCancelled
                        ? t('allOrders.cancelled')
                        : order?.isPaid && order?.isDelivered ? t('allOrders.paidDelivered')
                          : !order?.isPaid && !order?.isDelivered ? t('allOrders.pendingPaymentDelivery')
                            : order?.isPaid && !order?.isDelivered ? t('allOrders.pendingDelivery')
                              : '-----'}
                    </TableCell>
                    <TableCell>
                      {order?.paymentMethod === 'Cash' ?
                        <Button
                          variant='contained'
                          color='secondary'
                          disabled={order?.isDelivered && order?.isPaid || order?.isCancelled}
                          onClick={() => {
                            // handleConfirmOrder(order?._id.toString())
                            handleRequestConfirmOrder(order)
                          }}>
                          {t('allOrders.confirm')}
                        </Button>
                        :
                        <Button variant='contained'
                          disabled={order?.isDelivered || !order?.isPaid}
                          onClick={() => {
                            // handleDeliverOrder(order?._id.toString())
                            handleRequestDeliverOrder(order)
                          }}>
                          {t('allOrders.deliver')}
                        </Button>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableRow>
                <TablePagination
                  colSpan={7}
                  rowsPerPageOptions={[5, 10, 25]}
                  count={totalCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  nextIconButtonProps={{ disabled: isLoading }}
                  backIconButtonProps={{ disabled: isLoading }}
                  ActionsComponent={TablePaginationActions}
                  labelDisplayedRows={
                    ({ from, to, count }) => {
                      if (isLoading) return t('pagination.loading')
                      return t('pagination.orders')
                        + from + t('pagination.to')
                        + to + t('pagination.of') + count
                    }
                  }
                  labelRowsPerPage={
                    t('pagination.rowsPerPage')
                  }
                >
                </TablePagination>
              </TableRow>
            </Table>
          </TableContainer>
        </>
      )
      }
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
      <Dialog
        open={selectedOrder !== null}
        onClose={handleCloseOrderDetail}
        fullWidth
        maxWidth='xs'
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              {t('allOrders.code')}: {selectedOrder?.pickUpCode}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant='caption' color='text.secondary'>
                    {t('allOrders.time')}
                  </Typography>
                  <Typography>
                    {`${days[new Date(selectedOrder?.orderDetails?.pickUpDate).getDay()]} `}
                    {new Date(selectedOrder?.orderDetails?.pickUpDate).toLocaleDateString()}
                    {' - '}
                    {new Date(selectedOrder?.orderDetails?.pickUpDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant='caption' color='text.secondary'>
                    Método de pago
                  </Typography>
                  <Typography>
                    {selectedOrder?.paymentMethod === 'Cash' ? 'Efectivo' : 'PayPal'}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant='caption' color='text.secondary'>
                    Entregar en
                  </Typography>
                  <Typography>
                    {selectedOrder?.orderDetails?.screenId && selectedOrder?.orderDetails?.seatNumber
                      ? `${t('allOrders.screen')} ${selectedOrder?.orderDetails?.screenId}, ${t('allOrders.seat')} ${selectedOrder?.orderDetails?.seatNumber}`
                      : `${t('allOrders.bar')}`}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant='caption' color='text.secondary'>
                    Estado
                  </Typography>
                  <Typography>
                    {selectedOrder?.isCancelled
                      ? t('allOrders.cancelled')
                      : selectedOrder?.isPaid && selectedOrder?.isDelivered ? t('allOrders.paidDelivered')
                        : !selectedOrder?.isPaid && !selectedOrder?.isDelivered ? t('allOrders.pendingPaymentDelivery')
                          : selectedOrder?.isPaid && !selectedOrder?.isDelivered ? t('allOrders.pendingDelivery')
                            : '-----'}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant='caption' color='text.secondary'>
                    Cliente
                  </Typography>
                  <Typography>
                    {selectedOrder?.orderDetails?.fullName}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {selectedOrder?.orderDetails?.email}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant='caption' color='text.secondary'>
                    Artículos
                  </Typography>
                  <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                    {selectedOrder?.orderItems.map((item) => (
                      <Box
                        key={item._id}
                        sx={{ display: 'flex', justifyContent: 'space-between' }}
                      >
                        <Typography variant='body2'>
                          {item.quantity} x {item.name}
                        </Typography>
                        <Typography variant='body2'>
                          {(item.price * item.quantity).toFixed(2)} €
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='body2' color='text.secondary'>
                      Subtotal
                    </Typography>
                    <Typography variant='body2'>
                      {selectedOrder?.itemsPrice.toFixed(2)} €
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='body2' color='text.secondary'>
                      Impuestos
                    </Typography>
                    <Typography variant='body2'>
                      {selectedOrder?.taxPrice.toFixed(2)} €
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography fontWeight='bold'>
                      Total
                    </Typography>
                    <Typography fontWeight='bold'>
                      {selectedOrder?.totalPrice.toFixed(2)} €
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseOrderDetail}>Cerrar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      {pendingAction &&
        <ConfirmActionDialog
          open={pendingAction !== null}
          title={
            pendingAction?.type === 'confirm'
              ? t('allOrders.orderConfirm')
              : t('allOrders.deliveryConfirm')
          }
          description={
            pendingAction?.type === 'confirm'
              ? `${t('allOrders.confirmMessage_1')} ${pendingAction?.order?.pickUpCode}. ${t('allOrders.confirmMessage_2')}`
              : `${t('allOrders.deliverMessage_1')} ${pendingAction?.order?.pickUpCode}. ${t('allOrders.confirmMessage_2')}`
          }
          confirmColor={pendingAction?.type === 'confirm' ? 'secondary' : 'primary'}
          isProcessing={isProcessing}
          onConfirm={handleConfirmPendingAction}
          onClose={handleClosePendingAction}
        />}
    </Layout >
  )
}