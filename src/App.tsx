// Clerk resources
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
} from '@clerk/clerk-react';
import { esES } from '@clerk/localizations';
import { dark } from '@clerk/themes';

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
import Profile from './pages/Profile';
import PaymentPage from './pages/PaymentPage';

import { ROUTING_MANAGER } from './navigation/Router';
import { StoreProvider } from './utils/Store';
import '../../app/src/styles/App.css';

// Mui Date Picker resources
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';

// Translation resources
import { useTranslation } from 'react-i18next';

//Public key for Clerk use
const CLERK_PUB_KEY = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

const AppComponent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  //TODO: User: TrialUser pass: sh-SHSH-sh email: letmechooseanemail1135@gmail.com
  return (
    <ClerkProvider
      localization={esES}
      publishableKey={CLERK_PUB_KEY}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#208080',
          colorText: 'white',
        },
        layout: {
          //TODO: Ver cómo poner texto o diseñar un logo guapo
          logoImageUrl: '/src/assets/images/logo.png',
          logoPlacement: 'inside',
        },
      }}
      navigate={(to) => navigate(to)}
    >
      <Routes>
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
        <Route
          path={ROUTING_MANAGER.SIGN_IN}
          element={<SignIn signUpUrl={ROUTING_MANAGER.REGISTER} />}
        />

        {/* Sign up page */}
        <Route
          path={ROUTING_MANAGER.REGISTER}
          element={<SignUp signInUrl={ROUTING_MANAGER.SIGN_IN} />}
        />

        {/* Single product page */}
        <Route
          path={ROUTING_MANAGER.COMBO}
          element={<ProductInfo title={t('titles.brand')} subtitle={''} />}
        />

        {/* Cart page */}
        <Route
          path={ROUTING_MANAGER.CART}
          element={
            <CartPage title={t('titles.brand')} subtitle={t('titles.cart')} />
          }
        />
        <Route
          path={ROUTING_MANAGER.ORDER_DETAILS}
          element={
            <OrderDetailsPage
              title={t('titles.brand')}
              subtitle={t('titles.orderDetails')}
            />
          }
        />

        {/* User profile page */}
        <Route
          path={ROUTING_MANAGER.USER_PROFILE}
          element={
            <>
              <SignedIn>
                <Profile
                  title={t('titles.brand')}
                  subtitle={t('titles.profile')}
                />
              </SignedIn>
              <SignedOut>
                <SignIn signUpUrl={ROUTING_MANAGER.REGISTER} />
              </SignedOut>
            </>
          }
        />

        {/* Payment page */}
        <Route
          path={ROUTING_MANAGER.PAYMENT}
          element={
            <>
              <SignedIn>
                <PaymentPage
                  title={t('titles.brand')}
                  subtitle={t('titles.paymentMethod')}
                />
              </SignedIn>
              <SignedOut>
                <SignIn signUpUrl={ROUTING_MANAGER.REGISTER} />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </ClerkProvider>
  );
};

const App = () => {
  return (
    <>
      <BrowserRouter>
        <StoreProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <AppComponent />
          </LocalizationProvider>
        </StoreProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
