// React-router-dom resources
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
} from 'react-router-dom';

// Project resources
import AllProductsPage from './pages/AllProductsPage';
import ProductInfo from './pages/product/[slug]';
import CartPage from './pages/CartPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import PaymentPage from './pages/PaymentPage';
import OrderPage from './pages/OrderPage';
import SignIn from './pages/authentication/SignIn';
import SignUp from './pages/authentication/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import OrderHistory from './pages/OrderHistory';
import ForgotPassword from './pages/authentication/ForgotPassword';
import ResetPassword from './pages/authentication/ResetPassword';
import EmployeePage from './pages/EmployeePage';

import { ROUTING_MANAGER } from './navigation/Router';
import { StoreProvider } from './utils/Store';
import '../../app/src/styles/App.css';

// Mui Date Picker resources
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';

// Translation resources
import { useTranslation } from 'react-i18next';

// PayPal resources
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

// Tanstack resources (or queries)
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Search from './pages/Search';
import PickupDetailsPage from './pages/PickupDetailsPage';
import ConfirmOrderPage from './pages/ConfirmOrderPage';
import Sandbox from './pages/Sandbox';

// import { google } from 'googleapis'
// import nodemailer from 'nodemailer';
// import accountTransport from '../account_transport.json'

// const OAuth2 = google.auth.OAuth2;
// const accountTransport = require('../account_transport.json')
// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     type: 'OAuth2',
//     user: process.env.MAIL_USER,
//     clientId: process.env.OAUTH_CLIENT_ID,
//     clientSecret: process.env.OAUTH_CLIENT_SECRET,
//     refreshToken: process.env.OAUTH_REFRESH_TOKEN
//   }
// });

// let mailOptions = {
//   from: 'foodiemoviecontact@gmail.com',
//   to: "",
//   subject: "Prueba",
//   text: "Hola desde nodemailer",
// }

// transporter.sendMail(mailOptions, function(err, data) {
//   if (err) {
//     console.log('Error ', err);
//   } else {
//     console.log('Email sent successfully!');
//   }
// })

// const mail_fm = async (callback: Function) => {
//   const oauth2Client = new OAuth2(
//     accountTransport.auth.clientId,
//     accountTransport.auth.clientSecret,
//     'https://developers.google.com/oauthplayground',
//   );
//   oauth2Client.setCredentials({
//     refresh_token: accountTransport.auth.refreshToken,

//   })
//   oauth2Client.getAccessToken((err, token) => {
//     if (err)
//       return console.log(err);
//     accountTransport.auth.accessToken = token || '';
//     callback(nodemailer.createTransport(accountTransport))

//   })
// }

const AppComponent = () => {
  const { t } = useTranslation();

  return (
    <Routes>
      {/* Main page redirection. All products */}
      <Route
        path={ROUTING_MANAGER.ROOT}
        element={<Navigate to={ROUTING_MANAGER.ALL_PRODUCTS} />}
      />

      {/* Main page. All products */}
      <Route
        path={ROUTING_MANAGER.ALL_PRODUCTS}
        element={
          <AllProductsPage
            title={t('titles.brand')}
            subtitle={t('titles.allCombos')}
          />
        }
      />
      {/*TODO:  Cambiar todo lo de admin por employee*/}
      {/* Employee page */}
      <Route path={ROUTING_MANAGER.EMPLOYEE_PAGE} element={<EmployeePage title={t('titles.brand')} subtitle={t('titles.employee')}></EmployeePage>}></Route>

      <Route path={ROUTING_MANAGER.EMPLOYEE_PAGE_SEARCH} element={<Search title={t('titles.brand')} subtitle={t('titles.employee')}></Search>}></Route>

      {/* Sign in page */}
      <Route path={ROUTING_MANAGER.SIGN_IN} element={<SignIn title={t('titles.brand')} subtitle={t('titles.signIn')} />} />

      {/* Sign in page after changing password */}
      <Route path={ROUTING_MANAGER.SIGN_IN_PASSWORD} element={<SignIn title={t('titles.brand')} subtitle={t('titles.signIn')} />} />

      {/* Sign up page */}
      <Route path={ROUTING_MANAGER.REGISTER} element={<SignUp title={t('titles.brand')} subtitle={t('titles.signUp')} />} />

      {/* Forgot password page */}
      <Route path={ROUTING_MANAGER.FORGOT_PASSWORD} element={<ForgotPassword title={t('titles.brand')} subtitle={t('titles.forgotPassword')} />} />

      {/* Reset password page */}
      <Route path={ROUTING_MANAGER.RESET_PASSWORD} element={<ResetPassword title={t('titles.brand')} subtitle={t('titles.resetPassword')} />} />

      {/* Single product page */}
      <Route
        path={ROUTING_MANAGER.PRODUCT}
        element={<ProductInfo title={t('titles.brand')} subtitle={''} />}
      />

      {/* Cart page */}
      <Route path={ROUTING_MANAGER.CART}
        element={<CartPage title={t('titles.brand')} subtitle={t('titles.cart')} />}
      />

      <Route path={ROUTING_MANAGER.SANDBOX}
        element={<Sandbox></Sandbox>}></Route>

      {/* Protected routes */}
      <Route path="" element={<ProtectedRoute />}>

        {/* Payment page */}
        <Route
          path={ROUTING_MANAGER.PAYMENT}
          element={
            <PaymentPage
              title={t('titles.brand')}
              subtitle={t('titles.paymentMethod')} />
          }
        />

        {/* Place order page */}
        <Route
          path={ROUTING_MANAGER.CONFIRM_ORDER}
          element={
            <ConfirmOrderPage
              title={t('titles.brand')}
              subtitle={t('titles.placeOrder')}
            />
          }
        />

        {/* Pickup details page */}
        <Route
          path={ROUTING_MANAGER.ORDER_DETAILS}
          element={
            <PickupDetailsPage
              title={t('titles.brand')}
              subtitle={t('titles.orderDetails')}
            />
          }
        />
        {/* Single order page */}
        <Route
          path={ROUTING_MANAGER.SINGLE_ORDER}
          element={
            <OrderDetailsPage
              title={t('titles.brand')}
              subtitle={t('titles.orderDetails')}
            />
          }
        />

        {/* Place order */}
        <Route
          path={ROUTING_MANAGER.ORDER}
          element={
            <OrderPage
              title={t('titles.brand')}
              subtitle={t('titles.order')}
            />
          }
        />
        <Route
          path={ROUTING_MANAGER.ORDER_HISTORY}
          element={
            <OrderHistory
              title={t('titles.brand')}
              subtitle={t('titles.orderHistory')}
            />
          }
        ></Route>
      </Route>
    </Routes>
  );
};



const queryClient = new QueryClient();

const App = () => {
  return (
    <>
      <BrowserRouter>
        <StoreProvider>
          <PayPalScriptProvider options={{ 'clientId': 'AVuLXo6syrtx1op9D9_9IcIq7N901hT4txnrWf_NGYfnGBQS2It28f2SPSJ0QqGwCMBgWYzUY6ijmNqU' }}
            deferLoading={true}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                <AppComponent />
              </QueryClientProvider>
            </LocalizationProvider>
          </PayPalScriptProvider>
        </StoreProvider>
      </BrowserRouter>
    </>
  );
};

export default App;