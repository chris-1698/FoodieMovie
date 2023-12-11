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
} from '@mui/material';
import useTitle from '../hooks/useTitle';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation()

  useTitle(title + subtitle);
  useEffect(() => {

    if (!orderDetails) {
      navigate('/orderDetails');
    }
  }, [orderDetails, navigate]);


  const handleSetPaymentMethodName = (paymentMethod: string) => {
    setPaymentMethodName(paymentMethod)
  }

  const submitHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeOrder');
  };

  return (
    <>
      <Layout title="Payment method" description="choose payment method">
        <CheckoutRequirements activeStep={2} />
        <form onSubmit={submitHandler}>
          <Typography component="h1" variant="h1">
            {t('paymentMethod.choosePaymentMethod')}
          </Typography>
          <List>
            <ListItem>
              <FormControl component="fieldset">
                <RadioGroup
                  defaultChecked={false}
                  aria-label='Payment Method'
                  name="paymentMethod"
                  value={paymentMethodName}
                  onChange={(e) => handleSetPaymentMethodName(e.target.value)}
                >

                  <FormControlLabel
                    disabled
                    label={t('orders.stripe')}
                    value="Stripe"
                    control={<Radio onChange={(e) => handleSetPaymentMethodName(e.target.value)} />}
                  ></FormControlLabel>
                  <FormControlLabel
                    label="PayPal"
                    value="PayPal"
                    control={
                      <Radio onChange={(e) => handleSetPaymentMethodName(e.target.value)} />}
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
                disabled={localStorage.getItem('paymentMethod') === ''}
              >
                {t('continueButton')}
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
                {t('backButton')}
              </Button>
            </ListItem>
          </List>
        </form>
      </Layout>
    </>
  );
}
