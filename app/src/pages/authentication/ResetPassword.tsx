import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "../../utils/Store";
import { useResetPasswordMutation } from "../../hooks/userHooks";
import { useTranslation } from "react-i18next";
import Layout from "../../layouts/Layout";
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Button, Container, FormControl, IconButton, InputAdornment, InputLabel, List, ListItem, OutlinedInput, Snackbar, TextField, Typography } from "@mui/material";
import { getError } from "../../utils/utils";
import { ApiError } from "../../typings/ApiError";
import useTitle from "../../hooks/useTitle";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

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
  const { mutateAsync: resetPassword, isLoading } = useResetPasswordMutation()

  const { userInfo } = state;
  const { t } = useTranslation();

  const handleClickShowPassword = () => setShowPassword((show => !show))

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () => setShowConfirmPassword((showConfirm => !showConfirm))


  const handleCloseSnackBar = () => {
    setOpenSnackBar(false)
  }
  // TODO: Revisar el tema de parámetros por URL en signin. 
  // changedPassword
  // https://www.youtube.com/watch?v=mHDZBGa8mHg&ab_channel=jonmircha
  // https://www.youtube.com/watch?v=Wi7np3E_3q8&ab_channel=jonmircha
  useTitle(title + subtitle)

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

  // Prevent users to access this page by checking whether they
  // are already logged in or they don't have a token.
  useEffect(() => {
    if (userInfo || !token) {
      navigate('/')
    }
  }, [navigate, userInfo, token]);

  // TODO 18/11/2023: Implementar funcionalidad junto con la vista de esta página.
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
    try {
      //Llamada al endpoint /api/users/reset-password
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

  const comparePasswords = (confirmPassword: string) => {
    if (confirmPassword === '') {
      setValid(true);
    } else {
      setValid(false);
      setConfirmPassword(confirmPassword);
    }

  }

  return (
    <Layout title="reset password" description="reset password">
      <Container maxWidth='sm'>
        <form onSubmit={handleSubmit}>

          <List>
            <ListItem>
              <Typography>
                {/* TODO: Texto */}
                Nueva contraseña
              </Typography>
            </ListItem>
            <ListItem>
              <FormControl sx={{ width: '100%' }} variant="outlined">
                {/* TODO: Texto */}
                <InputLabel htmlFor="outlined-new-password">Nueva contraseña</InputLabel>
                {/* TODO: Cambiar para poder mostrar constraseña */}
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
                  // TODO: Texto
                  label="Nueva contraseña"
                  onChange={(e) => setPassword(e.target.value)} />
              </FormControl>

            </ListItem>
            <ListItem>
              <Typography>
                {/* Texto */}
                Confirma la nueva contraseña
              </Typography>
            </ListItem>
            <ListItem>
              <FormControl sx={{ width: '100%' }} variant="outlined">
                {/* TODO: Texto */}
                <InputLabel htmlFor="outlined-confirm-password">Confirma la nueva contraseña</InputLabel>
                <OutlinedInput
                  id="outlined-confirm-password"
                  // TODO: Texto
                  label={'Confirma la nueva contraseña'}
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
                        {showPassword ? <VisibilityOff /> : <Visibility />}
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
                {/* TODO: Texto */}
                Cambiar contraseña
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
