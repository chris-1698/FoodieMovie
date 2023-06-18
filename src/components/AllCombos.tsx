import { ThemeContext } from '@emotion/react';
import {
  Button,
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
  IconButton,
} from '@mui/material';
import NextLink from 'next/link';
import classes from '../styles/classes';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { UserButton } from '@clerk/clerk-react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// export default function AllCombos({ title, description, children }) {
function AllCombos() {
  const { t } = useTranslation();
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
      mode: 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });
  // User: UsuarioPrueba letmechooseanemail1135@gmail.com Pass:Password1234
  return (
    <>
      <Head>
        <title>{'Mmm..food'}</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" sx={classes.appbar}>
          <Toolbar>
            {/* <NextLink href="/" passHref> da error :(*/}
            <Link href="/">
              <Typography sx={classes.brand}>
                {t('dashboard.pageName')}
              </Typography>
            </Link>
            <Divider sx={classes.divider}>
              <UserButton />
            </Divider>
            <Divider>
              <Button>
                <ShoppingCartIcon sx={{ color: 'white' }} />
              </Button>
            </Divider>

            {/* </NextLink> */}
          </Toolbar>
        </AppBar>
        <Container component="main" sx={classes.main}>
          {/* Children */}
        </Container>
        <Box component="footer" sx={classes.footer}>
          <Typography>{t('dashboard.copyright')}</Typography>
        </Box>
      </ThemeProvider>
      {/* <h1>Prueba</h1>
      <Button>
        {' '}
        <Link>Combo 1</Link>
      </Button> */}
    </>
  );
}

//   const theme = createTheme({
//     typography: {
//       h1: {
//         fontSize: '1.6rem',
//         fontWeight: 400,
//         margin: '1rem 0',
//       },
//       h2: {
//         fontSize: '1.4rem',
//         fontWeight: 400,
//         margin: '1rem 0',
//       },
//     },
//     palette: {
//       mode: 'light',
//       primary: {
//         main: '#f0c000',
//       },
//       secondary: {
//         main: '#208080',
//       },
//     },
//   });
//   return (
//     <>
//       <Head>
//         <title>{'Foodie Movie'}</title>
//         {/* {description && <meta name="description" content={description}></meta>} */}
//       </Head>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <AppBar position="static" sx={Classes.appbar}>
//           <Toolbar sx={Classes.toolbar}>
//             <NextLink href="/" passHref>
//               <Link>
//                 <Typography>Foodie Movie</Typography>
//               </Link>
//             </NextLink>
//           </Toolbar>
//         </AppBar>
//         <Container component="main" sx={Classes.main}>
//           {/* {children} */}
//         </Container>
//         <Box component="footer" sx={Classes.footer}>
//           <Typography> Todos los derechos reservados. Foodie Movie.</Typography>
//         </Box>
//       </ThemeProvider>
//     </>
//   );

export default AllCombos;
