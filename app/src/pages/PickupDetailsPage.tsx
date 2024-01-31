import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../utils/Store';
import CheckoutRequirements from '../components/CheckoutRequirements';
import { Alert, Button, Checkbox, Collapse, Container, FormControlLabel, TextField, FormGroup, Grid, IconButton, Snackbar, Typography, MenuItem, Select } from '@mui/material';
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
const SEATREGEXP = new RegExp('^[A-Za-z]([1-9]|1[0-4])$')
const MIN_SCREEN = 1;
const MAX_SCREEN = 10;

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
  const email = userInfo!.email || '';
  const [pickUpDate, setPickupDate] = useState(new Date() || null);
  const [disableContinue, setDisableContinue] = useState(true);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [screenId, setScreenId] = useState(1);
  const [seatNumber, setSeatNumber] = useState('');
  const [seatDeliver, setSeatDeliver] = useState(false);

  const handleSetPickUpDate = (e: React.SyntheticEvent) => {
    const dateAsObject = e.$d as Date;
    setPickupDate(dateAsObject)
    console.log('La auténtica fecha: ', dateAsObject);
  }

  const handleChange = () => {
    setSeatDeliver((deliver) => !deliver)
    if (seatDeliver === false) {
      setSeatNumber('')
    } else {
    }
  }

  const isOneHourBefore = (dateA: Date, dateB: Date): boolean => {
    const timeDifference = dateB.getTime() - dateA.getTime();

    const hoursDifference = timeDifference / (1000 * 60 * 60)
    return hoursDifference >= 1;
  }

  {/* TODO: Probar esto mañana 24-1-2024 */ }
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!isOneHourBefore(new Date(), pickUpDate)) {
      setSnackBarMessage(`${t('orders.confirmError')}`);
      setOpenSnackBar(true);
      return
    } else {
      // Entrega en asiento
      if (seatDeliver) {
        if (REGEXP.test(fullName) && SEATREGEXP.test(seatNumber)) {
          // console.log('Nombre y asiento bien. Entrega en butaca');
          dispatch({
            type: 'SAVE_ORDER_DETAILS',
            payload: {
              fullName,
              email,
              pickUpDate,
              screenId,
              seatNumber,
            },
          });
          localStorage.setItem(
            'orderDetails',
            JSON.stringify({
              fullName,
              email,
              pickUpDate,
              screenId,
              seatNumber,
            })
          );
          navigate('/payment');
        } else {
          // Nombre o asiento mal
          // console.log('Nombre o asiento mal');
          setOpenSnackBar(true);
          setSnackBarMessage(`${t('pickupDetails.seatNameFormat')}`)
        }
      } else {
        // Entrega en bar
        if (REGEXP.test(fullName)) {
          console.log('Nombre bien. Entrega en bar');
          dispatch({
            type: 'SAVE_ORDER_DETAILS',
            payload: {
              fullName,
              email,
              pickUpDate,
            },
          });
          localStorage.setItem(
            'orderDetails',
            JSON.stringify({
              fullName,
              email,
              pickUpDate,
            })
          );
          navigate('/payment');
        } else {
          // Nombre mal
          // console.log('Nombre mal');
          setOpenSnackBar(true);
          setSnackBarMessage(`${t('pickupDetails.nameFormat')}`)
        }
      }
    }
  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
    setSnackBarMessage('')
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
              <Grid
                item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleChange} />}
                  label={t('pickupDetails.deliverSeat')} />
              </Grid>
              <Grid item xs={12}>
                <Collapse orientation='vertical'
                  in={seatDeliver}>
                  <Grid item xs={12}>
                    <TextField
                      label={t('pickupDetails.screen')}
                      value={screenId}
                      type='number'
                      onChange={(e) => {
                        var value = parseInt(e.target.value, 10);

                        if (value > MAX_SCREEN) value = MAX_SCREEN;
                        if (value < MIN_SCREEN) value = MIN_SCREEN;
                        setScreenId(value)
                      }}
                    >
                    </TextField>
                  </Grid>
                </Collapse>
              </Grid>

              <Grid item xs={12}>
                <Collapse orientation='vertical'
                  in={seatDeliver}>
                  <Grid item xs={12}>
                    <TextField
                      label={t('pickupDetails.seat')}
                      onChange={(e) => {
                        setSeatNumber(e.target.value.toUpperCase());
                      }}
                    >
                    </TextField>

                  </Grid>
                </Collapse>
              </Grid>

              <Grid item xs={12} md={12}>
                <StaticDateTimePicker
                  disablePast
                  ampm
                  onAccept={(e) => {
                    handleSetPickUpDate(e);
                    setDisableContinue(false)
                  }}
                  orientation='landscape'
                  reduceAnimations
                  onChange={(e) => {
                    handleSetPickUpDate(e);
                  }} />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  disabled={disableContinue}
                  variant="contained"
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
            sx={{ fontWeight: 'bold' }}
            onClose={handleCloseSnackBar}
            severity='error'
          >
            {snackBarMessage}
          </Alert>
        </Snackbar>
      </Layout >
    </>
  );
}
