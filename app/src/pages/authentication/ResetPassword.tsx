import {
  Alert,
  Button,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  OutlinedInput,
  Snackbar,
  Typography
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "../../utils/Store";
import { useResetPasswordMutation } from "../../hooks/userHooks";
import { useTranslation } from "react-i18next";
import Layout from "../../layouts/Layout";
import CloseIcon from '@mui/icons-material/Close';
import { getError } from "../../utils/utils";
import { ApiError } from "../../typings/ApiError";
import useTitle from "../../hooks/useTitle";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

const REGEXP_PASSWORD = new RegExp('^[a-z0-9_-]{6,18}$')

export default function ResetPassword({
  title,
  subtitle
}: {
  title: string,
  subtitle: string
}) {
  const navigate = useNavigate();
  const { token } = useParams() || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('')
  const [valid, setValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { state } = useContext(Store);
  const { mutateAsync: resetPassword } = useResetPasswordMutation()
  const { userInfo } = state;
  const { t } = useTranslation();

  const handleClickShowPassword = () => setShowPassword((show => !show))

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () => setShowConfirmPassword((showConfirm => !showConfirm))


  // https://www.youtube.com/watch?v=mHDZBGa8mHg&ab_channel=jonmircha
  // https://www.youtube.com/watch?v=Wi7np3E_3q8&ab_channel=jonmircha
  useTitle(title + subtitle)

  // Prevent users to access this page by checking whether they
  // are already logged in or they don't have a token.
  useEffect(() => {
    if (userInfo || !token) {
      navigate('/')
    }
  }, [navigate, userInfo, token]);

  // Handle data submit. After checking if both passwords match,
  // call the reset password endpoint to change the previous password 
  // with the new one and then redirect the user back to the sign in page.
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setOpenSnackBar(true);
      setSnackBarMessage(`${t('resetPassword.notMatch')}`);
      return;
    }
    if (verifyPassword(password)) {
      try {
        //Endpoint call /api/users/reset-password
        await resetPassword({
          password,
          token,
        })
        navigate('/signin/changedPassword=true')
      } catch (err) {
        setOpenSnackBar(true);
        setSnackBarMessage(getError(err as ApiError));
      }
    }
    setOpenSnackBar(true);
    setSnackBarMessage(`${t('resetPassword.passwordFormat')}`)

  }

  const comparePasswords = (confirmPassword: string) => {
    if (confirmPassword === '') {
      setValid(true);
    } else {
      setValid(false);
      setConfirmPassword(confirmPassword);
    }
  }

  const verifyPassword = (password: string) => {
    return REGEXP_PASSWORD.test(password);
  }

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false)
  }

  const closeSnackBar = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-aria-label="Close"
        color="inherit"
        onClick={handleCloseSnackBar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  )

  return (
    <Layout title="reset password" description="reset password">
      <Container maxWidth='sm'>
        <form onSubmit={handleSubmit}>

          <List>
            <ListItem>
              <Typography>
                {t('resetPassword.newPassword')}
              </Typography>
            </ListItem>
            <ListItem>
              <FormControl sx={{ width: '100%' }} variant="outlined">
                <InputLabel htmlFor="outlined-new-password">
                  {t('resetPassword.newPassword')}
                </InputLabel>
                <OutlinedInput
                  id="outlined-new-password"
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
                  label={t('resetPassword.newPassword')}
                  onChange={(e) => setPassword(e.target.value)} />
              </FormControl>

            </ListItem>
            <ListItem>
              <Typography>
                {t('resetPassword.confirmNewPassword')}
              </Typography>
            </ListItem>
            <ListItem>
              <FormControl sx={{ width: '100%' }} variant="outlined">
                <InputLabel htmlFor="outlined-confirm-password">{t('resetPassword.confirmNewPassword')}</InputLabel>
                <OutlinedInput
                  id="outlined-confirm-password"
                  label={t('resetPassword.confirmNewPassword')}
                  fullWidth
                  required
                  type={
                    showConfirmPassword ? "text" : "password"
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  onChange={(e) => comparePasswords(e.target.value)}
                />
              </FormControl>
            </ListItem>
            <ListItem>
              <Button
                type="submit"
                disabled={valid}
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                {t('resetPassword.changePassword')}
              </Button>
            </ListItem>
          </List>
        </form>
      </Container>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        action={closeSnackBar}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
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
