import { Alert, Button, CircularProgress, Grid, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useGetOrderHistoryQuery } from "../hooks/orderHooks"
import useTitle from "../hooks/useTitle"
import Layout from "../layouts/Layout"
import { ApiError } from "../typings/ApiError"
import { getError } from "../utils/utils"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import QRHover from "../components/QRHover"

export default function OrderHistory(
  { title, subtitle }:
    { title: string, subtitle: string }) {

  useTitle(title + subtitle)

  const { data: orders, isLoading, error } = useGetOrderHistoryQuery()
  const navigate = useNavigate()
  const { t } = useTranslation();


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
                      {/* TODO: Texto */}
                      <Typography>Fecha recogida</Typography>
                    </TableCell>
                    <TableCell>
                      <></>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders!.map((order) => (
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
                      <TableCell>{new Date(order.orderDetails.pickUpDate).toLocaleDateString()}</TableCell>
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
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )
        }
      </Layout>
    </>
  )
}