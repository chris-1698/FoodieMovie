import { redirect, useNavigate } from 'react-router-dom';
import { Store } from '../utils/Store';
import React, { useContext, useState, useEffect } from 'react';
import Layout from '../layouts/Layout';
import CheckoutRequirements from '../components/CheckoutRequirements';
import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Grid,
} from '@mui/material';
import useTitle from '../components/useTitle';

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
    cart: { paymentMethod },
  } = state;
  const orderDetails = JSON.parse(localStorage.getItem('orderDetails')!);
  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || 'PayPal'
  );
  useTitle(title + subtitle);
  useEffect(() => {
    if (!orderDetails) {
      navigate('/orderDetails');
    }
  }, [orderDetails, navigate]);

  const submitHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeOrder');
  };

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  console.log('AAAAAAAAAAAAAA pago ', localStorage.getItem('orderDetails'));

  console.log('Nombre completo de la víctima: ', orderDetails?.fullName);
  //TODO: Empezar con esta página 20-7-2023
  return (
    <>
      {/* TODO: Continuar con esta página 22/7/2023 */}
      <Layout title="Payment method" description="payment method">
        <CheckoutRequirements activeStep={3} />
        <div>
          <h1>Payment Method</h1>
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
        </div>
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
