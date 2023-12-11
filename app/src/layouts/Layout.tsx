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
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { Store } from '../utils/Store';
import jsCookie from 'js-cookie';
import ProfileSettings from '../components/ProfileSettings';
import ShoppingCart from '../components/ShoppingCart';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Popcorn } from '@phosphor-icons/react'

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
	const { darkMode, userInfo } = state;
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

	const darkModeChangeHandler = () => {
		dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
		const newDarkMode = !darkMode;
		jsCookie.set('darkMode', newDarkMode ? 'ON' : 'OFF',);
	};

	return (
		<>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<AppBar position="static" sx={classes.appbar}>
					<Toolbar sx={classes.toolbar}>
						<Box display="flex" alignItems="center">
							<Link
								aria-label={title}
								aria-details={description}
								href={
									userInfo && userInfo.isAdmin === true
										?
										'/adminPage'
										:
										'/'}>
								<Typography sx={classes.brand}>
									{t('dashboard.pageName')}{' '}
									<Popcorn size={22} weight="duotone" />
								</Typography>

							</Link>
						</Box>
						<Stack direction="row">
							<Divider sx={classes.divider}>
								<ProfileSettings />
							</Divider>
							{
								userInfo && userInfo.isAdmin === true
									?
									<Divider></Divider> :
									<Divider>
										<ShoppingCart />
									</Divider>
							}
						</Stack>
					</Toolbar>
				</AppBar>
				<Container component="main" sx={classes.main}>
					<Divider sx={classes.switchDivider}>
						<Switch
							checked={darkMode}
							onChange={darkModeChangeHandler}
						/>
						{darkMode === true
							? <LightModeIcon
								fontSize='small'
								style={{ marginBottom: '-6%' }}
							/>
							: <DarkModeIcon
								fontSize='small'
								style={{ marginBottom: '-6%' }}
							/>
						}
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
