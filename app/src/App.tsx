// React-router-dom resources
import {
  Routes,
  Route,
  useNavigate,
  BrowserRouter,
  Navigate,
} from 'react-router-dom';

// Project resources
import AllCombosPage from './pages/AllCombosPage';
import ProductInfo from './pages/product/[slug]';
import CartPage from './pages/CartPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import SignIn from './pages/authentication/SignIn';
import SignUp from './pages/authentication/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import OrderHistory from './pages/OrderHistory';
import ForgotPassword from './pages/authentication/ForgotPassword';
import ResetPassword from './pages/authentication/ResetPassword';

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


const AppComponent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Routes>
      {/* Main page redirection. All products */}
      <Route
        path={ROUTING_MANAGER.ROOT}
        element={<Navigate to={ROUTING_MANAGER.ALL_COMBOS} />}
      />

      {/* Main page. All products */}
      <Route
        path={ROUTING_MANAGER.ALL_COMBOS}
        element={
          <AllCombosPage
            title={t('titles.brand')}
            subtitle={t('titles.allCombos')}
          />
        }
      />

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
        path={ROUTING_MANAGER.COMBO}
        element={<ProductInfo title={t('titles.brand')} subtitle={''} />}
      />

      {/* Cart page */}
      <Route path={ROUTING_MANAGER.CART}
        element={<CartPage title={t('titles.brand')} subtitle={t('titles.cart')} />}
      />

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
          path={ROUTING_MANAGER.PLACE_ORDER}
          element={
            <PlaceOrderPage
              title={t('titles.brand')}
              subtitle={t('titles.placeOrder')}
            />
          }
        />

        {/* Order details page */}
        <Route
          path={ROUTING_MANAGER.ORDER_DETAILS}
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