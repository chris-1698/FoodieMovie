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
  TableFooter,
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
import {
  useDeliverOrderMutation,
  useGetAllOrdersQuery
} from '../hooks/orderHooks'
import CloseIcon from '@mui/icons-material/Close'
import { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions'
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import SearchIcon from '@mui/icons-material/Search'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'


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
  const navigate = useNavigate();

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
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
      <Box sx={{ flexShrink: 0, m1: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label='primera página'
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
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
          {theme.direction == 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
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
        // https://www.youtube.com/watch?v=6hUUOZxVVCo&ab_channel=FaztCode
        // Revisar este vídeo para la paginación.
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
                    <Typography fontWeight={'bold'}>{t('allOrders.isPaid')}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={'bold'}>{t('allOrders.isDelivered')}</Typography>
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
                {(rowsPerPage > 0
                  ? orderList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : orderList
                ).map((order) => (
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
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {order.orderDetails.screenId && order.orderDetails.seatNumber
                          ? ('Sala ' + order.orderDetails.screenId + ', butaca ' + order.orderDetails.seatNumber)
                          : ('Bar')}
                      </Typography>
                    </TableCell>
                    <TableCell>a</TableCell>
                    <TableCell>
                      {/* TODO: Cambiar por Select? */}
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
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, { label: 'All', value: -1 }]}
                    colSpan={3}
                    count={orderList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  >
                  </TablePagination>
                </TableRow>
              </TableFooter>
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

// <>
//   <Grid container maxWidth='sm' sx={{ paddingBottom: '3%' }}>
//     <TextField size='small' sx={{ width: '90%' }} onChange={(e) => setSearchTerm(e.target.value)}></TextField>
//     <IconButton disabled={searchTerm === ''} onClick={() => {
//       if (REGEXP.test(searchTerm)) {
//         navigate(`/employeePage/search/?filter=${searchTerm}`)
//       } else {
//         setSnackBarMessage(`${t('allOrders.verifySearch')}`)
//         setOpenSnackBar(true)
//       }
//     }}>
//       <SearchIcon />
//     </IconButton>
//   </Grid>
//   <Grid container spacing={2}>
//     <Table
//       // TODO: Cambiar si tal
//       size='small'>
//       <TableHead>
//         <TableRow>
//           <TableCell>
//             <Typography>{t('allOrders.code')}</Typography>
//           </TableCell>
//           <TableCell>
//             <Typography>{t('allOrders.time')}</Typography>
//           </TableCell>
//           <TableCell>
//             <Typography>{t('allOrders.isPaid')}</Typography>
//           </TableCell>
//           <TableCell>
//             <Typography>{t('allOrders.isDelivered')}</Typography>
//           </TableCell>
//           <TableCell>
//             <Typography>Entregar en</Typography>
//           </TableCell>
//           <TableCell>
//             <Typography>Estado</Typography>
//           </TableCell>
//           <TableCell>
//             <></>
//           </TableCell>
//         </TableRow>
//       </TableHead>
//       <TableBody>
//         {
//           isLoading ? (
//             <TableCell colSpan={5}>
//               <CircularProgress />
//             </TableCell>
//           ) : error ? (
//             <TableCell colSpan={5}>
//               <Alert severity='error'>{getError(error as ApiError)}</Alert>
//             </TableCell>
//           ) : orders?.length === 0 ? (
//             <TableCell colSpan={5}>
//               <Alert severity='info'>{t('allOrders.noOrders')}</Alert>
//             </TableCell>
//           ) : (
//             <>
//               {orders!.map((order) => (
//                 <TableRow key={order._id}>
//                   <TableCell>
//                     <QRHover text={order.pickUpCode}></QRHover>
//                   </TableCell>
//                   <TableCell>
//                     {order.orderDetails.pickUpDate}<br></br>
//                     {order.orderDetails.pickUpTime}
//                   </TableCell>
//                   <TableCell>
//                     <Typography>
//                       {order.isPaid ?
//                         t('allOrders.delivered')
//                         : t('allOrders.notDelivered')
//                       }
//                     </Typography>
//                   </TableCell>
//                   <TableCell key={order._id}>
//                     <Typography>
//                       {order.isDelivered ?
//                         t('allOrders.delivered')
//                         : t('allOrders.notDelivered')
//                       }
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography>
//                       {order.screenId && order.seatNumber ? ('Sala ' + order.screenId + ' butaca' + order.seatNumber) : ('Bar')}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>a</TableCell>
//                   <TableCell>
//                     {/* TODO: Cambiar por Select? */}
//                     <Button variant='contained'
//                       disabled={order.isDelivered}
//                       onClick={() => {
//                         handleDeliverOrder(order._id.toString())
//                       }}>
//                       {t('allOrders.deliver')}
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </>
//           )
//         }
//       </TableBody>
//     </Table>
//   </Grid>
//   <Grid container spacing={1}>
//     <TablePagination
//       rowsPerPageOptions={[10, 25]}
//       component="div"
//       count={orderList.length}
//       rowsPerPage={10}
//       page={page}
//       onPageChange={handleChangePage}

//     />

//   </Grid>
// </>
