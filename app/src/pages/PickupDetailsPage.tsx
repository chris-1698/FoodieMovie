import React, { useContext, useEffect, useState } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { Store } from '../utils/Store';
import CheckoutRequirements from '../components/CheckoutRequirements';
import { Alert, Button, Container, Grid, IconButton, Snackbar, TextField } from '@mui/material';
import Layout from '../layouts/Layout';
import '../styles/App.css';
import * as dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/es.js';
import useTitle from '../hooks/useTitle';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close'
import { StaticDateTimePicker } from '@mui/x-date-pickers';

const REGEXP = new RegExp('^[A-Za-z0-9]{3,16}$')

export default function PickupDetailsPage({
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
    cart: { orderDetails },
  } = state;

  dayjs().format();
  dayjs.extend(customParseFormat);
  dayjs.locale('es');

  useEffect(() => {
    if (!userInfo) {
      navigate('/sign-in/?redirect_url=/orderDetails');
    }
  }, [userInfo, navigate]);

  const [fullName, setFullName] = useState(orderDetails.fullName || '');
  const [email, setEmail] = useState(userInfo!.email || '');
  const [pickUpDate, setPickupDate] = useState(orderDetails.pickUpDate);
  const [pickUpTime, setPickUpTime] = useState(orderDetails.pickUpTime);
  const [disableContinue, setDisableContinue] = useState(true);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
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
    if (REGEXP.test(fullName)) {
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
    } else {
      setOpenSnackBar(true);
      setSnackBarMessage(`${t('pickupDetails.nameFormat')}`)
    }

  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  }

  const closeSnackBar = (
    <React.Fragment>
      <IconButton
        size='small'
        aria-aria-label='Close'
        color='inherit'
        onClick={handleCloseSnackBar}
      >
        <CloseIcon fontSize='small' />
      </IconButton>
    </React.Fragment>
  )

  return (
    <>
      <Layout title="order details" description="order-details">
        <CheckoutRequirements activeStep={1} />
        <Container maxWidth="sm">
          <form onSubmit={handleSubmit}>
            <Grid sx={{ marginTop: '10%' }} container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label={t('pickupDetails.fullName')}
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
                  label={t('pickupDetails.email')}
                  fullWidth
                  value={email}
                  disabled
                ></TextField>
              </Grid>
              <Grid item xs={12} md={12}>
                <StaticDateTimePicker
                  disablePast
                  ampm
                  onAccept={(e) => {
                    handleSetPickUpDate(e);
                    handleSetPickUpTime(e);
                    setDisableContinue(false)
                  }}
                  orientation='landscape'
                  reduceAnimations
                  onChange={(e) => {
                    handleSetPickUpDate(e);
                    handleSetPickUpTime(e);
                  }} />
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
            severity='error'
          >
            {snackBarMessage}
          </Alert>
        </Snackbar>
      </Layout>
    </>
  );
}
