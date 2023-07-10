import { useNavigate } from 'react-router-dom';
import { Store } from '../utils/Store';
import React, { useContext, useState } from 'react';

export default function PaymentPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { paymentMethod },
  } = state;

  //   const [paymentmethod, setPaymentMethod] = useState(paymentMethod || 'PayPal');

  //   const submitHandler = (e: React.SyntheticEvent) => {
  //     e.preventDefault();
  //     dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentmethod });
  //     localStorage.setItem('paymentMethod', paymentmethod);
  //     navigate('/placingorder');
  //   };

  //   return <div></div>;
}
