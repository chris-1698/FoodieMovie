import React, { useContext, useEffect, useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { Store } from '../utils/Store';
import CheckoutRequirements from '../components/CheckoutRequirements';
import { Button, Grid, TextField } from '@mui/material';
import Layout from '../layouts/Layout';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import '../styles/App.css';
import { Container } from '@material-ui/core';
import * as dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/es.js';
import useTitle from '../hooks/useTitle';
import { useTranslation } from 'react-i18next';

export default function OrderDetailsPage({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const { t } = useTranslation();
  useTitle(title + subtitle);
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { orderDetails, cartItems },
  } = state;

  dayjs().format();
  dayjs.extend(customParseFormat);
  dayjs.locale('es');

  useEffect(() => {
    if (!userInfo) {
      navigate('/sign-in/?redirect_url=/orderDetails');
    }
  }, [userInfo, navigate]);

  // const user_id = user?.id;
  const [fullName, setFullName] = useState(orderDetails.fullName || '');
  const [email, setEmail] = useState(userInfo!.email || '');
  const [pickUpDate, setPickupDate] = useState(orderDetails.pickUpDate);
  const [pickUpTime, setPickUpTime] = useState(orderDetails.pickUpTime);
  const [disableContinue, setDisableContinue] = useState(true)
  const days = [
    t('days.monday'),
    t('days.tuesday'),
    t('days.wednesday'),
    t('days.thursday'),
    t('days.friday'),
    t('days.saturday'),
    t('days.sunday'),
  ]
  const [dateAsObj, setDateAsObj] = useState(new Date() || null);

  const handleSetPickUpDate = (e: React.SyntheticEvent) => {
    const dateAsObject = e.$d as Date;
    setDateAsObj(dateAsObject)
    var parsedDate = `
      ${days[dateAsObject.getDay() - 1]}
      ${dateAsObject.toLocaleDateString('es', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })}
      `
    setPickupDate(parsedDate)
  }

  const handleSetPickUpTime = (e) => {
    const timeAsObject = e.$d as Date;
    const parsedTime = timeAsObject.toLocaleTimeString('es', {
      hour: '2-digit',
      minute: '2-digit',
    })
    setPickUpTime(parsedTime)
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch({
      type: 'SAVE_ORDER_DETAILS',
      payload: {
        fullName,
        email,
        pickUpDate,
        pickUpTime,
      },
    });
    localStorage.setItem(
      'orderDetails',
      JSON.stringify({
        fullName,
        email,
        pickUpDate,
        pickUpTime,
      })
    );
    localStorage.setItem('dateAsObj', dateAsObj.toString())
    navigate('/payment');
  };

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
                  label={t('orderDetails.fullName')}
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
                  label={t('orderDetails.email')}
                  fullWidth
                  value={email}
                  disabled
                ></TextField>
              </Grid>
              <Grid item xs={12} md={12}>
                <DateTimePicker
                  disablePast
                  defaultValue={dayjs(localStorage.getItem('dateAsObj'))}
                  onAccept={(e) => {
                    handleSetPickUpDate(e);
                    handleSetPickUpTime(e);
                    setDisableContinue(false)
                  }}
                  onChange={(e) => {
                    handleSetPickUpDate(e);
                    handleSetPickUpTime(e);
                  }}
                  slotProps={{
                    textField: {
                      required: true,
                    }
                  }}
                ></DateTimePicker>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  disabled={disableContinue}
                  variant="contained"
                  onClick={() => redirect('/payment')}
                >
                  {t('continueButton')}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Layout>
    </>
  );
}
