import {
  Link,
  Container,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Toolbar,
  AppBar,
  Typography,
  Box,
  Divider,
  Switch,
  Stack,
} from '@mui/material';
import classes from '../utils/classes';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import React, { useContext } from 'react';
import { Store } from '../utils/Store';
import jsCookie from 'js-cookie';
import ProfileSettings from '../components/ProfileSettings';
import ShoppingCart from '../components/ShoppingCart';

function Layout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
}) {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(Store);
  const { darkMode } = state;

  const theme = createTheme({
    components: {
      MuiLink: {
        defaultProps: {
          underline: 'hover',
        },
      },
    },
    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#208080',
      },
      secondary: {
        main: '#f0c000',
      },
    },
  });
  //TODO: User: UsuarioPrueba letmechooseanemail1135@gmail.com Pass:Password1234

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    jsCookie.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };

  return (
    <>
      <Head>
        <title>{title ? `${title} - Foodie Movie` : 'Foodie Movie'}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" sx={classes.appbar}>
          <Toolbar sx={classes.toolbar}>
            <Box display="flex" alignItems="center">
              <Link href="/">
                <Typography sx={classes.brand}>
                  {t('dashboard.pageName')}
                </Typography>
              </Link>
            </Box>
            <Stack direction="row">
              <Divider sx={classes.divider}>
                <ProfileSettings />
              </Divider>
              <Divider>
                <ShoppingCart />
              </Divider>
            </Stack>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={classes.main}>
          <Divider sx={classes.switchDivider}>
            <Switch
              checked={darkMode}
              onChange={darkModeChangeHandler}
            ></Switch>
          </Divider>
          {children}
        </Container>
        <Box component="footer" sx={classes.footer}>
          <Typography>{t('dashboard.copyright')}</Typography>
        </Box>
      </ThemeProvider>
    </>
  );
}
export default Layout;
