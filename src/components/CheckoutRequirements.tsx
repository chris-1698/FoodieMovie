import { Step, StepLabel, Stepper } from '@mui/material';
import '../styles/App.css';

export default function CheckoutRequirements({ activeStep = 0 }) {
  //   step1 Login
  //   step2 Pick up details
  //   step3 Payment method
  //   step4 Place order
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {['Login', 'Shipping Address', 'Paying Method', 'Place Order'].map(
        (step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        )
      )}
    </Stepper>
  );
}
