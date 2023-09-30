import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Store } from "../../utils/Store";
import { useSignupMutation } from "../../hooks/userHooks";
import { Button, Container, Link, List, ListItem, TextField, Typography } from "@mui/material";
import Layout from "../../layouts/Layout";
import { useTranslation } from "react-i18next";

export default function SignUp() {

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

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const { t } = useTranslation();

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, userInfo, redirect]);

  const { mutateAsync: signup, isLoading } = useSignupMutation()

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      //TODO: Passwords do not match with SnackBar
      console.log('passwords do not match');

      return
    }
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
      //TODO: SnackBar with the error message
      console.log(err);
    }
  }
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
                onClick={() => {
                  console.log(lastName);

                }}
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
      </Container>
    </Layout >
  )
}