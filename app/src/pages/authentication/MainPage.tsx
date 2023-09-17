import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Typography } from '@material-ui/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTING_MANAGER } from '../../navigation/Router';

const MainPage = () => {
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
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          sx={{
            width: '70%',
            height: 800,
            backgroundColor: 'lightblue',
          }}
          borderRadius="3%"
        >
          <Grid pt={20} container justifyContent="center" alignItems="center">
            <img
              src="/src/assets/images/logo.png"
              alt=""
              style={{ height: '100px', float: 'left', marginRight: '10px' }}
            />
            <Typography component="h3" variant="h3">
              {t('page_welcome_msg')}
            </Typography>
          </Grid>

          <br />
          <Grid container justifyContent="center" alignContent="center">
            <div className="buttonContainer">
              <Link to={ROUTING_MANAGER.ALL_COMBOS}>
                <Button className="inputButton" variant="contained">
                  {t('session.login')}
                </Button>
              </Link>
            </div>
          </Grid>

          <br />
          <Grid container justifyContent="center" alignContent="center">
            <Button
              variant="contained"
              onClick={() => {
                linkTo(ROUTING_MANAGER.REGISTER);
              }}
            >
              {t('session.signUpButton')}
            </Button>
          </Grid>
        </Box>
      </Grid>
    </>
  );
};

export default MainPage;
