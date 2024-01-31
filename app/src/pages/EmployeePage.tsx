import {
  Alert,
  Typography,
  CircularProgress,
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
  Grid
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getError } from '../utils/utils'
import { ApiError } from '../typings/ApiError'
import QRHover from '../components/QRHover'
import Layout from '../layouts/Layout'
import useTitle from '../hooks/useTitle'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useConfirmOrderMutation, useDeliverOrderMutation, useGetAllOrdersQuery } from '../hooks/orderHooks'
import { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions'
import {
  LastPage,
  FirstPage,
  Search,
  KeyboardArrowRight,
  KeyboardArrowLeft,
  Close
} from '@mui/icons-material'

const REGEXP = new RegExp('^[A-Za-z0-9]{1,12}$')

export default function EmployeePage(
  { title, subtitle }
    : { title: string, subtitle: string }
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');

  const { data: orders, isLoading, error } = useGetAllOrdersQuery();
  const orderList = orders!

  const { t } = useTranslation();
  const { mutateAsync: deliverOrder } = useDeliverOrderMutation();
  const { mutateAsync: confirmOrder } = useConfirmOrderMutation();
  const navigate = useNavigate();

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
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
      await (deliverOrder({ id })).then(() =>
        setTimeout(function () { window.location = window.location }, 100)
      );
    } catch (err) {
      alert(getError(err as ApiError));
    }
  }
  const handleConfirmOrder = async (id: string) => {
    try {
      confirmOrder({ id })
    } catch (err) {
      alert(getError(err as ApiError));
    }
  }

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
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

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orderList.length) : 0;

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
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error"> {getError(error as ApiError)}</Alert>
      ) : (
        <>
          <Grid container maxWidth='sm' sx={{ paddingBottom: '3%' }}>
            <TextField size='small' sx={{ width: '90%' }} onChange={(e) => setSearchTerm(e.target.value)}></TextField>
            <IconButton disabled={searchTerm === ''} onClick={() => {
              if (REGEXP.test(searchTerm)) {
                navigate(`/employeePage/search/?filter=${searchTerm}`)
              } else {
                setSnackBarMessage(`${t('allOrders.verifySearch')}`)
                setOpenSnackBar(true)
              }
            }}>
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
                  {/* <TableCell>
                    <Typography fontWeight={'bold'}>{t('allOrders.isPaid')}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={'bold'}>{t('allOrders.isDelivered')}</Typography>
                  </TableCell> */}
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
                {(rowsPerPage > 0
                  ? orderList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : orderList
                ).map((order) => (
                  <TableRow key={order._id}>
                    <TableCell sx={order.pickUpCode ? { color: 'inherit' } : { color: 'primary' }}>
                      <QRHover text={order.pickUpCode}></QRHover>
                    </TableCell>
                    <TableCell
                      sx={{
                        // paddingRight: '20px'
                      }}>
                      {`${days[new Date(order.orderDetails.pickUpDate).getDay()]} `}
                      {new Date(order.orderDetails.pickUpDate).toLocaleDateString()}<br></br>
                      {new Date(order.orderDetails.pickUpDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {order.paymentMethod === 'Cash' ?
                          'Efectivo' : 'PayPal'}
                      </Typography>
                    </TableCell>
                    {/* <TableCell>
                      <Typography>
                        {
                          order.isPaid ?
                            t('allOrders.delivered')
                            : t('allOrders.notDelivered')
                        }
                      </Typography>
                    </TableCell>
                    <TableCell key={order._id}>
                      <Typography>
                        {order.isDelivered ?
                          t('allOrders.delivered')
                          : t('allOrders.notDelivered')
                        }
                      </Typography>
                    </TableCell> */}
                    <TableCell>
                      <Typography>
                        {order.orderDetails.screenId && order.orderDetails.seatNumber
                          ? `${t('allOrders.screen')} ${order.orderDetails.screenId}, 
                          ${t('allOrders.seat')} ${order.orderDetails.seatNumber}`
                          : `${t('allOrders.bar')}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {order.isCancelled
                        ? t('allOrders.cancelled')
                        : order.isPaid && order.isDelivered ? t('allOrders.paidDelivered')
                          : !order.isPaid && !order.isDelivered ? t('allOrders.pendingPaymentDelivery')
                            : order.isPaid && !order.isDelivered ? t('allOrders.pendingDelivery')
                              : '-----'}
                    </TableCell>
                    <TableCell>
                      {order.paymentMethod === 'Cash' ?
                        <Button
                          variant='contained'
                          color='secondary'
                          //TODO:  Si ha sido entregado y pagado ya, o
                          // está cancelado, disabled
                          disabled={order.isDelivered && order.isPaid || order.isCancelled}
                          onClick={() => {
                            handleConfirmOrder(order._id.toString())
                          }}>
                          {t('allOrders.confirm')}
                        </Button>
                        :
                        <Button variant='contained'
                          // TODO: Si el método es PayPal pero no está pagado o ya fue entregado, 
                          // disabled
                          disabled={order.isDelivered || !order.isPaid}
                          onClick={() => {
                            handleDeliverOrder(order._id.toString())
                          }}>
                          {t('allOrders.deliver')}
                        </Button>
                      }
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              {/* <TableFooter> */}
              <TableRow>
                <TablePagination
                  colSpan={7}
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  count={orderList.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                  labelDisplayedRows={
                    ({ from, to, count }) => {
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
              {/* </TableFooter> */}
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
    </Layout >
  )
}

