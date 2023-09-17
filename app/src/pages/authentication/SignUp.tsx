import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Store } from "../../utils/Store";
import { useSignupMutation } from "../../hooks/userHooks";
import { Button, Container, Link, List, ListItem, TextField, Typography } from "@mui/material";
import Layout from "../../layouts/Layout";

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
  } //TODO: 4:11:59 https://www.youtube.com/watch?v=-ifcPnXHn8Q&ab_channel=CodingwithBasir
  //TODO: No se guardan los usuarios en la BBDD?
  return (
    <Layout title="Sign up" description="sign up page">
      <Container maxWidth="sm">
        <form onSubmit={submitHandler}>
          <Typography component='h1' variant='h1'>
            {/* TODO: Texto */}
            Sign up
          </Typography>
          <List>
            <ListItem>
              {/* TODO: Texto */}
              <TextField
                label="Name"
                fullWidth
                required
                type="text"
                onChange={(e) => setName(e.target.value)}
              ></TextField>
            </ListItem>
            <ListItem>
              {/* TODO: Texto */}
              <TextField
                label="Lastname"
                fullWidth
                required
                type="text"
                onChange={(e) => setLastName(e.target.value)}
              ></TextField>
            </ListItem>
            <ListItem>
              {/* TODO: Texto */}
              <TextField
                label="Email"
                fullWidth
                required
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              ></TextField>
            </ListItem>
            <ListItem>
              {/* TODO: Texto */}
              <TextField
                label="Day of birth"
                fullWidth
                required
                type="date"
                onChange={(e) => setDateOfBirth(e.target.value)}
              ></TextField>
            </ListItem>
            <ListItem>
              {/* TODO: Texto */}
              <TextField
                label="Password"
                fullWidth
                required
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              ></TextField>
            </ListItem>
            <ListItem>
              {/* TODO: Texto */}
              <TextField
                label="Confirm password"
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
                {/* TODO: Texto */}
                Sign up
              </Button>
            </ListItem>
            <ListItem>
              {/* TODO: Texto */}
              Already have an account? {' '}
              <Link href={`signin?redirect=${redirect}`}>Sign in</Link>
            </ListItem>
          </List>
        </form>
      </Container>
    </Layout>
  )
}