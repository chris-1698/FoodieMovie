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
import OrderSummaryPage from './pages/OrderSummaryPage';
import PaymentMethodPage from './pages/PaymentMethodPage';
import PayOrderPage from './pages/PayOrderPage';
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
import Search from './pages/Search';
import PickupDetailsPage from './pages/PickupDetailsPage';
import ConfirmOrderPage from './pages/ConfirmOrderPage';
import Sandbox from './pages/Sandbox';
import { useGetPaypalClientIdQuery } from './hooks/orderHooks';

const AppComponent = () => {
  const { t } = useTranslation();
  const { data: paypalConfig } = useGetPaypalClientIdQuery();

  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalConfig?.clientId ?? '',
      }}
      deferLoading={true}
    >
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
              <PaymentMethodPage
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
            path={ROUTING_MANAGER.ORDER_SUMMARY}
            element={
              <OrderSummaryPage
                title={t('titles.brand')}
                subtitle={t('titles.orderDetails')}
              />
            }
          />

          {/* Place order */}
          <Route
            path={ROUTING_MANAGER.PAY_ORDER}
            element={
              <PayOrderPage
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
    </PayPalScriptProvider>
  );
};



const App = () => {
  const queryClient = new QueryClient();
  return (
    <>
      <BrowserRouter>
        <StoreProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <QueryClientProvider client={queryClient}>
              <AppComponent />
            </QueryClientProvider>
          </LocalizationProvider>
        </StoreProvider>
      </BrowserRouter>
    </>
  );
};

export default App;