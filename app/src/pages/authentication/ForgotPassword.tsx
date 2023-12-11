import {
  Alert,
  Button,
  CircularProgress,
  Container,
  IconButton,
  List,
  ListItem,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../../utils/Store";
import { useForgotPasswordMutation } from "../../hooks/userHooks";
import Layout from "../../layouts/Layout";
import useTitle from "../../hooks/useTitle";
import emailjs from "@emailjs/browser"
import { getError } from "../../utils/utils";
import { ApiError } from "../../typings/ApiError";
import { useTranslation } from "react-i18next";
import CloseIcon from '@mui/icons-material/Close'

const EMAIL_REGEXP = new RegExp('^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-]+)(\\.[a-zA-Z]{2,5}){1,2}$')

export default function ForgotPassword({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [valid, setValid] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [result, setResult] = useState(false);

  const { state } = useContext(Store);
  const { userInfo } = state;
  const { t } = useTranslation();

  const { mutateAsync: forgotPassword, isLoading } = useForgotPasswordMutation()

  useTitle(title + subtitle)

  useEffect(() => {
    setValid(false)
    if (userInfo) {
      navigate('/')
    }
  }, [navigate, userInfo])

  const sendEmail = (name: string, link: string, email: string) => {
    try {
      emailjs
        .send(
          'service_rpirl1w',
          'template_ezxfupf',
          {
            to_name: name,
            link: link,
            to_email: email,
          },
          'ElU7Zz_Kk2wIl9-bY'
        )
        .then(
          function (result) {
            console.log(`Resultado: ${result.text}`);
          },
          function (error) {
            console.log(`Error: ${getError(error as ApiError)}`);
          }
        );
    } catch (mailError) {
      setSnackBarMessage(getError(mailError as ApiError));
      setResult(false);
      setOpenSnackBar(true);
    }
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const data = await forgotPassword({
        email
      })
      localStorage.setItem('forgotPasswordInfo', JSON.stringify(data))
      const info = JSON.parse(localStorage.getItem('forgotPasswordInfo')!)

      sendEmail(
        info.name,
        info.link,
        email)
      setSnackBarMessage(`${t('forgotPassword.sentEmail')}`);
      setResult(true);
      setOpenSnackBar(true);

    } catch (err) {
      setSnackBarMessage(getError(err as ApiError));
      setResult(false);
      setOpenSnackBar(true);
    }
  }

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  }

  const validateEmail = (email: string) => {
    setEmail(email)
    if (EMAIL_REGEXP.test(email)) {
      setValid(true)
    } else {
      setValid(false)
    }
  }

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
  )

  return (
    <Layout title="Forgot password" description="forgot password page">
      <Container maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <Typography>
            {t('forgotPassword.inputEmail')}
          </Typography>
          <List>
            <ListItem>
              <TextField
                label={'Email'}
                fullWidth
                required
                type="email"
                onChange={(e) => validateEmail(e.target.value)}>
              </TextField>
            </ListItem>
            <ListItem>
              {isLoading ?
                <CircularProgress></CircularProgress>
                :
                <></>}
              <Button
                type="submit"
                disabled={!valid}
                variant="contained"
                color="primary"
              >
                {t('forgotPassword.resetPassword')}
              </Button>
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
          horizontal: 'center',
        }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={result ? 'success' : 'error'}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </Layout>
  )
}
