import {
  Alert,
  Typography,
  CircularProgress,
  Grid,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  IconButton,
  Snackbar
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getError } from '../utils/utils'
import { ApiError } from '../typings/ApiError'
import QRHover from '../components/QRHover'
import Layout from '../layouts/Layout'
import useTitle from '../hooks/useTitle'
import React, { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { useNavigate } from 'react-router-dom'
import {
  useDeliverOrderMutation,
  useGetAllOrdersQuery
} from '../hooks/orderHooks'
import CloseIcon from '@mui/icons-material/Close'

const REGEXP = new RegExp('^[A-Za-z0-9]{1,12}$')

export default function EmployeePage(
  { title, subtitle }
    : { title: string, subtitle: string }
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const { data: orders, isLoading, error } = useGetAllOrdersQuery();
  const { t } = useTranslation();
  const { mutateAsync: deliverOrder } = useDeliverOrderMutation();
  const navigate = useNavigate();

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

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
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
              <SearchIcon />
            </IconButton>
          </Grid>
          <Grid container spacing={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography>{t('allOrders.code')}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{t('allOrders.time')}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{t('allOrders.isPaid')}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{t('allOrders.isDelivered')}</Typography>
                  </TableCell>
                  <TableCell>
                    <></>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  isLoading ? (
                    <TableCell colSpan={5}>
                      <CircularProgress />
                    </TableCell>
                  ) : error ? (
                    <TableCell colSpan={5}>
                      <Alert severity='error'>{getError(error as ApiError)}</Alert>
                    </TableCell>
                  ) : orders?.length === 0 ? (
                    <TableCell colSpan={5}>
                      <Alert severity='info'>{t('allOrders.noOrders')}</Alert>
                    </TableCell>
                  ) : (
                    <>
                      {orders!.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>
                            <QRHover text={order.pickUpCode}></QRHover>
                          </TableCell>
                          <TableCell>
                            {order.orderDetails.pickUpDate}<br></br>
                            {order.orderDetails.pickUpTime}
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {order.isPaid ?
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
                          </TableCell>
                          <TableCell>
                            <Button variant='contained'
                              disabled={order.isDelivered}
                              onClick={() => {
                                handleDeliverOrder(order._id.toString())
                              }}>
                              {t('allOrders.deliver')}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )
                }
              </TableBody>
            </Table>
          </Grid>
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
