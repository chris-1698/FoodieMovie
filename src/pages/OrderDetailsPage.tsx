import React, { useContext, useEffect, useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { Store } from '../utils/Store';
import { useSession, useUser } from '@clerk/clerk-react';
import CheckoutRequirements from '../components/CheckoutRequirements';
import { Button, Grid, Input, InputLabel, TextField } from '@mui/material';
import Layout from '../layouts/Layout';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import '../styles/App.css';
import { Container } from '@material-ui/core';
import * as dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/es.js';
import useTitle from '../components/useTitle';

export default function OrderDetailsPage({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  useTitle(title + subtitle);
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const session = useSession();
  const { user } = useUser();
  const userJson = localStorage.getItem('userInfo');
  const userData = userJson !== null ? JSON.parse(userJson) : '';
  const {
    userInfo,
    cart: { orderDetails, cartItems },
  } = state;

  //TODO: Revisar lo de dayjs 19-7-2023
  dayjs().format();
  dayjs.extend(customParseFormat);
  dayjs.locale('es');

  useEffect(() => {
    if (!session.isSignedIn && session.isLoaded) {
      navigate('/sign-in/?redirect_url=/orderDetails');
    }
  }, [session, navigate]);
  const user_id = user?.id;
  const [fullName, setFullName] = useState(userData.fullName || '');
  const [email, setEmail] = useState(userData.email || '');
  const [pickUpDate, setPickupDate] = useState(
    orderDetails?.pickUpDate || Date.now()
  );
  const [pickUpTime, setPickUpTime] = useState(
    orderDetails?.pickUpTime || Date.now()
  );
  console.log('Nombre: ', fullName);
  console.log(email);

  //   const today = dayjs();
  //   const twoPM = dayjs().set('hour', 14).startOf('hour');
  //   const twelveAM = dayjs().set('hour', 0).startOf('hour');

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    dispatch({
      type: 'SAVE_ORDER_DETAILS',
      payload: {
        user_id,
        fullName,
        pickUpDate,
        email,
        pickUpTime,
      },
    });
    localStorage.setItem(
      'orderDetails',
      JSON.stringify({
        user_id,
        fullName,
        email,
        pickUpDate,
        pickUpTime,
      })
    );
    navigate('/payment');
  };
  console.log('frcha:', dayjs(pickUpDate).get('hour'), 'aaaaaaa: ', pickUpTime);

  return (
    <>
      {/* TODO: Ver cómo hacer DateTimePicker required */}
      <Layout title="order details" description="order-details">
        <CheckoutRequirements activeStep={1} />
        <Container maxWidth="sm">
          <form onSubmit={handleSubmit}>
            <Grid sx={{ marginTop: '10%' }} container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Full Name"
                  fullWidth
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                  }}
                ></TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  fullWidth
                  value={email}
                  disabled
                ></TextField>
              </Grid>

              <Grid item xs={12} md={12}>
                <DateTimePicker
                  defaultValue={dayjs()}
                  onChange={(e) => {
                    setPickupDate(e);
                    setPickUpTime(e);
                  }}
                ></DateTimePicker>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={() => redirect('/payment')}
                >
                  Continue
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Layout>
    </>
  );
}
// TODO: Seguir con la página. Falta diseño. Falta gestionar los datos. Falta funcionalidad
// Video: 4:25:50
{
  /* TODO: Ver el tema de realizar pedido. Obtener info de usuario,
además continuar con la página de detalles de pedido: fecha y hora
 Nombre y apellido? correo, fecha, hora, método de pago, detalle de precios
 y cantidades etc. */
}
