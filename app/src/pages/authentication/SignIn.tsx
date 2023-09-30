import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Store } from "../../utils/Store";
import { useSigninMutation } from "../../hooks/userHooks";
import Layout from "../../layouts/Layout";
import {
  Alert,
  CircularProgress,
  Container,
  IconButton,
  Link,
  List,
  ListItem,
  Snackbar,
  TextField,
  Typography,
  Button
} from "@mui/material";
import { getError } from "../../utils/utils";
import { ApiError } from "../../typings/ApiError";
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from "react-i18next";

export default function SignIn() {
  const navigate = useNavigate()
  const { search } = useLocation()

  const redirectInUrl = new URLSearchParams(search).get('redirect')
  const redirect = redirectInUrl ? redirectInUrl : '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [snackBarMessage, setSnackBarMessage] = useState('')
  const [openSnackBar, setOpenSnackBar] = useState(false)

  const { state, dispatch } = useContext(Store)
  const { userInfo } = state
  const { mutateAsync: signin, isLoading } = useSigninMutation()
  const { t } = useTranslation()

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      const data = await signin({
        email, password,
      })
      // TODO: Revisar aquí. Al crear usuario el apellido como que no se guarda
      // y en ProfileSettings sale como undefined
      dispatch({ type: 'USER_SIGN_IN', payload: data })
      localStorage.setItem('userInfo', JSON.stringify(data))
      navigate(redirect)
    } catch (error) {
      // console.error('Error es: ', getError(error as ApiError))
      setSnackBarMessage(getError(error as ApiError))
      setOpenSnackBar(true)

      //Mostrar error en un snackbar de esos como los de cart
      //función que modifique una variable de estado y esta misma se reinicie cuando se
      //cierra el snackbar¿
    }
    // console.log('Email: ', email, '\nPassword: ', password);

  }

  useEffect(() => {
    // console.log('user info: ', userInfo);
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, redirect, userInfo])

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  const toCloseSnackBar = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="Close"
        color="inherit"
        onClick={handleCloseSnackBar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Layout title="sign in" description="sign in" >
      <Container maxWidth="sm" >
        <form onSubmit={submitHandler}>
          <Typography component="h1" variant="h1">
            {t('session.signIn')}
          </Typography>
          <List>
            <ListItem>
              <TextField
                label={t('session.email')}
                fullWidth
                required
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              ></TextField>
            </ListItem>
            <ListItem>
              <TextField
                label={t('session.password')}
                fullWidth
                required
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              ></TextField>
            </ListItem>
            <ListItem>
              <Button
                disabled={isLoading}
                variant="contained"
                type="submit"
                color="primary"
              >
                {t('session.signIn')}
              </Button>
              {isLoading && <CircularProgress />}
            </ListItem>
            <ListItem>
              {t('session.noAccount')}
              <Link style={{ paddingLeft: '5px' }} href={`/register?redirect=${redirect}`}>{t('session.signUp')}</Link>
            </ListItem>
          </List>
        </form>
      </Container>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        action={toCloseSnackBar}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity="error"
        >
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </Layout>
  )

}

// <ListItem>
{/* <Controller name="email" control={control}
defaultValue=""
rules={{
  required: true,
  pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
}}
render={({ field }) => (
  <TextField
    variant="outlined"
    fullWidth id="email"
    label="Email"
    inputProps={{ type: "email" }}
    error={Boolean(errors.email)}
    helperText={errors.email
      ? errors.email.type === 'pattern'
        ? 'Email not valid'
        : 'email is required'
      : ''
    }
    {...field}
    onChange={(e) => setEmail(e.target.value)}
  ></TextField>
)}
></Controller>
</ListItem>
<ListItem>
<Controller name="password" control={control}
defaultValue=""
rules={{
  required: true,
  minLength: 6
}}
render={({ field }) => (
  <TextField
    variant="outlined"
    fullWidth id="password"
    label="Password"
    inputProps={{ type: "password" }}
    error={Boolean(errors.password)}
    helperText={errors.password
      ? errors.password.type === 'minLength'
        ? 'Password length has to be more than 5 characters'
        : 'Password is required'
      : ''
    }
    {...field}
    onChange={(e) => setPassword(e.target.value)}
  ></TextField>
)}
></Controller>
</ListItem> */}