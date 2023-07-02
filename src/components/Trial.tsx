import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTING_MANAGER } from '../../navigation/Router';

const Trial = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();
  const { t } = useTranslation();

  const navigate = useNavigate();

  const linkTo = (url: string) => {
    navigate(url);
    //window.location.reload;
  };

  return (
    <>
      <h1>
        {' '}
        Hola Trial me gustan las tetas el furbo los coches las motos el aceite
        de motos las tetas messi y los pinchos de tortilla
      </h1>
    </>
  );
};

export default Trial;
