import { Step, StepLabel, Stepper } from '@mui/material';
import '../styles/App.css';
import { useTranslation } from 'react-i18next';

export default function CheckoutRequirements({ activeStep = 0 }) {
  const { t } = useTranslation();
  //   1 User has to be logged in
  //   2 User has to input pick up details
  //   3 User has to input payment method
  //   4 User places order
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {[
        t('checkoutRequirements.login'),
        t('checkoutRequirements.orderDetails'),
        t('checkoutRequirements.paymentMethod'),
        t('checkoutRequirements.placeOrder'),
      ].map(
        (step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        )
      )}
    </Stepper>
  );
}
