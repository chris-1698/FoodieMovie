import { Alert, Box, Button, CircularProgress, Grid, IconButton, Link, Table, TableBody, useTheme, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, Typography } from "@mui/material"
import { useGetOrderHistoryQuery } from "../hooks/orderHooks"
import useTitle from "../hooks/useTitle"
import Layout from "../layouts/Layout"
import { ApiError } from "../typings/ApiError"
import { getError } from "../utils/utils"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import QRHover from "../components/QRHover"
import { useState } from "react"
import { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions'
import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage } from "@mui/icons-material"

export default function OrderHistory(
  { title, subtitle }:
    { title: string, subtitle: string }) {

  useTitle(title + subtitle);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { data: orders, isLoading, error } = useGetOrderHistoryQuery();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const orderList = orders!;


  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orderList.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  return (
    <>
      <Layout title="order history" description="order history of the user">
        <Typography variant="h1">{t('orderHistory.orderHistory')}</Typography>
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{getError(error as ApiError)}</Alert>
        ) : (
          <Grid container spacing={2}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography>{t('orderHistory.code')}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{t('orderHistory.date')}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{t('orderHistory.total')}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{t('orderHistory.paid')}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{t('orderHistory.delivered')}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{t('orderHistory.pickupDate')}</Typography>
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
                        <Link>
                          <QRHover text={order.pickUpCode}></QRHover>
                        </Link>
                      </TableCell>
                      <TableCell>{order.createdAt.substring(0, 10)}</TableCell>
                      <TableCell>{order.totalPrice.toFixed(2)}{t('currency')}</TableCell>
                      <TableCell>{order.isPaid! && order.paidAt!
                        ? order.paidAt.substring(0, 10) : `${t('orderHistory.no')}`}</TableCell>
                      <TableCell>{order.isDelivered ? `${t('orderHistory.yes')}` : `${t('orderHistory.no')}`}</TableCell>
                      <TableCell>{order.orderDetails.pickUpDate.toString().substring(0, 10)}</TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="contained"
                          onClick={() => {
                            navigate(`/orderSummary/${order._id}`)
                          }}
                        >{t('orderHistory.details')}</Button>
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
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                      colSpan={7}
                      sx={{ justifyContent: 'center' }}
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
                      }>
                    </TablePagination>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Grid>
        )
        }
      </Layout>
    </>
  )
}
