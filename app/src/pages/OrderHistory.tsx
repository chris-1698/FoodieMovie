import { Alert, Button, CircularProgress, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useGetOrderHistoryQuery } from "../hooks/orderHooks"
import useTitle from "../hooks/useTitle"
import Layout from "../layouts/Layout"
import { ApiError } from "../typings/ApiError"
import { getError } from "../utils/utils"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import QRCode from "react-qr-code"
import POC from "../components/POC"

export default function OrderHistory(
  { title, subtitle }:
    { title: string, subtitle: string }) {

  useTitle(title + subtitle)

  const { data: orders, isLoading, error } = useGetOrderHistoryQuery()
  const navigate = useNavigate()
  const [isOver, setIsOver] = useState(false);

  // const handleMouseHover = () => {
  //   console.log('Por encima, por encima!');
  //   setIsOver(true)
  //   console.log(isOver);
  // }

  // const handleMouseHoverOff = () => {
  //   console.log('Por debajo, por debajo!');
  //   setIsOver(false)
  //   console.log(isOver);
  // }

  return (
    <>
      {/* TODO 30/9/2023: 
    1. Cambiar id por código de entrega.
    2. Ver si se puede poner el cursor por encima y que se vea el QR
    3. Traducciones! */}
      <Layout title="order history" description="order history of the user">
        <Typography variant="h1">Order history</Typography>
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
                      <Typography>CODE</Typography>
                      {/* TODO: Mostrar codigo de recogida, y ver si puedo mostrar
                      QR */}
                    </TableCell>
                    <TableCell>
                      <Typography>DATE</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>TOTAL</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>PAID</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>ACTIONS</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders!.map((order) => (
                    <TableRow key={order._id}>
                      {/* Hacer componente?
                      Podría pasarle un texto como parámetro y, cuando se pase el ratón por encima, 
                      que muestre el código QR correspondiente
                      Quizá sea mejor con un botón, de modo que al pulsar
                      */}
                      <TableCell><POC text={order.pickUpCode}></POC></TableCell>
                      {/* <TableCell onMouseOver={handleMouseHover} onMouseOut={handleMouseHoverOff}>{order.pickUpCode}</TableCell> */}
                      {/* { isOver && ( */}
                      {/* // <QRCode value={order._id}></QRCode> */}
                      {/* ) } */}
                      <TableCell>{order.createdAt.substring(0, 10)}</TableCell>
                      <TableCell>{order.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>{order.isPaid ? order.paidAt.substring(0, 10) : ' No'}</TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="contained"
                          onClick={() => {
                            navigate(`/order/${order._id}`)
                          }}
                        >Details</Button>
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