import { useNavigate } from 'react-router-dom';
import { Store } from '../utils/Store';
import React, { useContext, useState, useEffect } from 'react';
import Layout from '../layouts/Layout';
import CheckoutRequirements from '../components/CheckoutRequirements';
import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  List,
  ListItem,
  Alert,
} from '@mui/material';
import useTitle from '../hooks/useTitle';
import jsCookie from 'js-cookie';
import { Snackbar } from '@material-ui/core';

export default function PaymentPage({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { orderDetails, paymentMethod },
  } = state;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // const orderDetails = JSON.parse(localStorage.getItem('orderDetails')!);
  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || ''
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(false)

  useTitle(title + subtitle);
  useEffect(() => {
    if (!orderDetails) {
      navigate('/orderDetails');
    } else {
      setPaymentMethodName(jsCookie.get('paymentMethod') || '')
    }
  }, [orderDetails, navigate]);


  const handleSetPaymentMethodName = (paymentMethod: string) => {
    setPaymentMethodName(paymentMethod)
    setSelectedPaymentMethod(true)
  }

  const submitHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();

    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeOrder');
  };
  //TODO: 06/08/2023 Revisar que funcione correctamente
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  console.log('AAAAAAAAAAAAAA pago ', localStorage.getItem('orderDetails'));
  console.log('Nombre completo de la víctima: ', orderDetails?.fullName);

  return (
    <>
      <Layout title="Payment method" description="payment method">
        <CheckoutRequirements activeStep={2} />
        <form onSubmit={submitHandler}>
          <Typography component="h1" variant="h1">
            Payment Method
          </Typography>
          <List>
            <ListItem>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label='Payment Method'
                  name="paymentMethod"
                  value={paymentMethodName}
                  onChange={(e) => handleSetPaymentMethodName(e.target.value)}
                >
                  <FormControlLabel
                    label="PayPal"
                    value="PayPal"
                    control={<Radio onChange={(e) => handleSetPaymentMethodName(e.target.value)} />}
                  ></FormControlLabel>
                  <FormControlLabel
                    label="Stripe"
                    value="Stripe"
                    control={<Radio />}
                  ></FormControlLabel>
                  <FormControlLabel
                    label="Efectivo"
                    value="Efectivo"
                    control={<Radio />}
                  ></FormControlLabel>
                </RadioGroup>
              </FormControl>
            </ListItem>
            <ListItem>
              <Button
                fullWidth
                type='submit'
                variant='contained'
                color='primary'
                disabled={!selectedPaymentMethod}
              >
                Continue
              </Button>
            </ListItem>
            <ListItem>
              <Button
                fullWidth
                type='button'
                variant='contained'
                color='secondary'
                onClick={() => navigate('/orderDetails')}
              >
                Back
              </Button>
            </ListItem>
          </List>


        </form>



        {/* 
          <Container maxWidth="md">
            <form onSubmit={submitHandler}>
              <Grid
                container
                spacing={1}
                sx={{ border: '1px solid grey', borderRadius: '5px' }}
              >
                <RadioGroup name="paymentMethod">
                  <Stack
                    direction="column"
                    sx={{
                      marginLeft: '50%',
                      marginTop: '30%',
                      marginBottom: '30%',
                    }}
                  >
                    <Grid item xs={12}>
                      <FormControlLabel
                        value="PayPal"
                        checked={paymentMethodName === 'PayPal'}
                        control={<Radio />}
                        label="PayPal"
                        onChange={(e) => setPaymentMethodName(e.target)}
                      />
                      <Button>a</Button>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        value="Stripe"
                        checked={paymentMethodName === 'Stripe'}
                        control={<Radio />}
                        label="Stripe"
                        onChange={(e) => setPaymentMethodName(e.target)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        value="Efectivo"
                        checked={paymentMethodName === 'Efectivo'}
                        control={<Radio />}
                        label="Efectivo"
                        onChange={(e) => setPaymentMethodName(e.target)}
                      />
                    </Grid>
                    <Button
                      type="submit"
                      variant="contained"
                      onClick={() => redirect('/placeOrder')}
                    >
                      Continue
                    </Button>
                  </Stack>
                </RadioGroup>
              </Grid>
            </form>
          </Container>
        </div> */}
      </Layout>
    </>
  );
  //   const [paymentmethod, setPaymentMethod] = useState(paymentMethod || 'PayPal');

  //   const submitHandler = (e: React.SyntheticEvent) => {
  //     e.preventDefault();
  //     dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentmethod });
  //     localStorage.setItem('paymentMethod', paymentmethod);
  //     navigate('/placingorder');
  //   };

  //   return <div></div>;
}
