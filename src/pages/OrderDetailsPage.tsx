import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../utils/Store';
import { useUser } from '@clerk/clerk-react';
import CheckoutRequirements from '../components/CheckoutRequirements';
import dayjs from 'dayjs';
import { Button, FormControl, Grid, Input, TextField } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';

export default function OrderDetailsPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { orderDetails },
  } = state;

  useEffect(() => {
    if (!userInfo) {
      navigate('/sign-in?redirect=/orderDetails');
    }
  }, [userInfo, navigate]);
  //TODO: El problema es que orderDetails aún no se ha declarado siquiera,
  // entonces hace falta darle valores. Ahora mismo sale como undefined
  const [fullName, setFullName] = useState(orderDetails.fullName || '');
  const [pickUpDate, setPickupDate] = useState(orderDetails.pickUpDate || '');
  const [pickUpTime, setPickupTime] = useState(orderDetails.pickUpTime || '');

  const today = dayjs();
  const twoPM = dayjs().set('hour', 14).startOf('hour');
  const twelveAM = dayjs().set('hour', 0).startOf('hour');

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log('aaaaa');

    dispatch({
      type: 'SAVE_ORDER_DETAILS',
      payload: {
        fullName,
        pickUpDate,
        pickUpTime,
      },
    });
    localStorage.setItem(
      'orderDetails',
      JSON.stringify({
        fullName,
        pickUpDate,
        pickUpTime,
      })
    );
    navigate('/payment');
  };

  return (
    <div>
      <h1>Hola</h1>
    </div>
  );
}
{
  /* <title>Order Details</title> */
}
{
  /* Login and current step: order details */
}
{
  /* <CheckoutRequirements step1 step2></CheckoutRequirements>
      <div className="container small-container">
        <h1 className="my-3">Order Details</h1>
        <Grid>
          <FormControl onSubmit={submitHandler}>
            <TextField
              type="text"
              variant="outlined"
              label="Full name"
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              fullWidth
              required
            />
            <TextField
              type="date"
              variant="outlined"
              label="Pick up date"
              onChange={(e) => setPickupDate(e.target.value)}
              value={pickUpDate}
              fullWidth
              required
              defaultValue={today}
              sx={{ mb: 4 }}
            />
            <TimePicker
              maxTime={twelveAM}
              minTime={twoPM}
              label="Pick up time"
              onChange={(e) => setPickupTime(e.target.value as string)}
              value={pickUpTime}
            ></TimePicker>
            <div className="mb-3">
              <Button variant="contained" color="primary" type="submit">
                Continue
              </Button>
            </div>
          </FormControl>
        </Grid>
      </div> 
    </div>
  ); */
}
//   const {
//   const { user } = useUser();
//   user?.firstName;
// }
/* TODO: Ver el tema de realizar pedido. Obtener info de usuario,
 *además continuar con la página de detalles de pedido: fecha y hora
 * Nombre y apellido? correo, fecha, hora, método de pago, detalle de precios
 * y cantidades etc.
 *
 * */
