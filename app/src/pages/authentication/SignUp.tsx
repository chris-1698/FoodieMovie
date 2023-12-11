import {
  Alert,
  Button,
  Container,
  IconButton,
  Link,
  List,
  ListItem,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Store } from "../../utils/Store";
import { useSignupMutation } from "../../hooks/userHooks";
import Layout from "../../layouts/Layout";
import { useTranslation } from "react-i18next";
import useTitle from "../../hooks/useTitle";
import CloseIcon from '@mui/icons-material/Close'
import { getError } from "../../utils/utils";
import { ApiError } from "../../typings/ApiError";

const REGEXP_PASSWORD = new RegExp('^[a-z0-9_-]{6,18}$')

export default function SignUp({
  title,
  subtitle
}: {
  title: string;
  subtitle: string;
}
) {

  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect')
  const redirect = redirectInUrl ? redirectInUrl : '/'

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const { t } = useTranslation();

  useTitle(title + subtitle)

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, userInfo, redirect]);

  const { mutateAsync: signup, isLoading } = useSignupMutation()

  const verifyPassword = (password: string) => {
    return REGEXP_PASSWORD.test(password);
  }

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setSnackBarMessage(`${t('session.passwordsDontMatch')}`)
      setOpenSnackBar(true)

      return
    }
    if (verifyPassword(password)) {
      try {
        const data = await signup({
          name,
          lastName,
          email,
          password,
          dateOfBirth,
        })
        dispatch({ type: 'USER_SIGN_IN', payload: data })
        localStorage.setItem('userInfo', JSON.stringify(data))
        navigate(redirect || '/')
      } catch (err) {
        setSnackBarMessage(getError(err as ApiError))
        setOpenSnackBar(true)
      }
    } else {
      setSnackBarMessage(`${t('session.passwordFormat')}`)
      setOpenSnackBar(true)
    }

  }

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
    <Layout title="Sign up" description="sign up page">
      <Container maxWidth="sm">
        <form onSubmit={submitHandler}>
          <Typography component='h1' variant='h1'>
            {t('session.signUp')}
          </Typography>
          <List>
            <ListItem>
              <TextField
                label={t('session.name')}
                fullWidth
                required
                type="text"
                onChange={(e) => setName(e.target.value)}
              ></TextField>
            </ListItem>
            <ListItem>
              <TextField
                label={t('session.lastName')}
                fullWidth
                required
                type="text"
                onChange={(e) => setLastName(e.target.value)}
              ></TextField>
            </ListItem>
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
                label={t('session.dayOfBirth')}
                fullWidth
                required
                type="date"
                onChange={(e) => setDateOfBirth(e.target.value)}
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
              <TextField
                label={t('session.repeatPassword')}
                fullWidth
                required
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></TextField>
            </ListItem>
            <ListItem>
              <Button
                type="submit"
                disabled={isLoading}
                variant="contained"
                color="primary"
              >
                {t('session.signUp')}
              </Button>
            </ListItem>
            <ListItem>
              {t('session.hasAccount')} {' '}
              <Link style={{ paddingLeft: '5px' }} href={`signin?redirect=${redirect}`}>{t('session.goLogin')}</Link>
            </ListItem>
          </List>
        </form>
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
          <Alert onClose={handleCloseSnackBar} severity='error'>
            {snackBarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Layout >
  )
}