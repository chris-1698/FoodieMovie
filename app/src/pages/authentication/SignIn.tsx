import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  Button,
  OutlinedInput,
  InputAdornment,
  InputLabel,
  FormControl
} from "@mui/material";
import { getError } from "../../utils/utils";
import { ApiError } from "../../typings/ApiError";
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from "react-i18next";
import useTitle from "../../hooks/useTitle";
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

const REGEXP_PASSWORD = new RegExp('^[a-z0-9_-]{6,18}$')

export default function SignIn({
  title,
  subtitle
}: {
  title: string;
  subtitle: string;
}) {
  const navigate = useNavigate()
  const { search } = useLocation()
  const redirectInUrl = new URLSearchParams(search).get('redirect')
  const redirect = redirectInUrl ? redirectInUrl : '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [snackBarMessage, setSnackBarMessage] = useState('')
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { state, dispatch } = useContext(Store)
  const { userInfo } = state
  const { mutateAsync: signin, isLoading } = useSigninMutation()
  const { t } = useTranslation()

  const fpInfo = {
    token: '',
    name: '',
    link: ''
  }
  const { changedPassword } = useParams();

  useTitle(title + subtitle)

  const handleClickShowPassword = () => setShowPassword((show => !show))

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const verifyPassword = (password: string) => {
    return REGEXP_PASSWORD.test(password);
  }

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (verifyPassword(password)) {
      try {
        const data = await signin({
          email, password,
        })
        dispatch({ type: 'USER_SIGN_IN', payload: data })
        localStorage.setItem('userInfo', JSON.stringify(data))

        if (JSON.parse(localStorage.getItem('userInfo')!).isEmployee === true) {
          navigate('/employeePage')
        } else {
          navigate(redirect)

        }
      } catch (error) {
        setSnackBarMessage(getError(error as ApiError))
        setOpenSnackBar(true)
      }
    } else {
      setSnackBarMessage(`${t('session.passwordFormat')}`)
      setOpenSnackBar(true)
    }

  }

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
    if (localStorage.getItem('forgotPasswordInfo')) {
      localStorage.setItem('forgotPasswordInfo', JSON.stringify(fpInfo))
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
              <FormControl sx={{ width: '100%' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">{t('session.password')}</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  fullWidth
                  required
                  type={
                    showPassword ? "text" : "password"
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label={t('session.password')}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
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
            <ListItem>
              <Typography fontSize={'small'}>
                <Link href={`/forgot-password`}>
                  {t('session.passwordForgor')}
                </Link>
              </Typography>
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
        <Alert onClose={handleCloseSnackBar} severity='error'>
          {snackBarMessage}
        </Alert>
      </Snackbar>
      {/* If password has been changed: */}
      {changedPassword
        ? <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={handleCloseSnackBar}
          action={toCloseSnackBar}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          <Alert onClose={handleCloseSnackBar} severity='success'>
            {t('session.passwordChanged')}
          </Alert>
        </Snackbar>
        : <></>
      }
    </Layout>
  )
}