import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  RedirectToSignUp,
} from '@clerk/clerk-react';
import { Routes, Route, useNavigate, BrowserRouter } from 'react-router-dom';
import Combos from './components/Combos';
import { ROUTING_MANAGER } from './navigation/Router';
import MainPage from './pages/authentication/MainPage';
import ProductInfo from './pages/product/[slug]';
import { StoreProvider } from './utils/Store';
import CartPage from './pages/CartPage';
// import App from '../../styles/App.css';
// import OrderDetailsPage from './pages/OrderDetailsPage';
//TODO: El problema creo que lo la la librería de Time Picker. Ver otra opción.
const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

const ClerkProviderWithRoutes = () => {
  const navigate = useNavigate();
  //User: TrialUser pass: sh-SHSH-sh email: letmechooseanemail1135@gmail.com
  return (
    <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
      <Routes>
        <Route path={ROUTING_MANAGER.ROOT} element={<MainPage />} />
        <Route path={ROUTING_MANAGER.SIGN_IN} element={<RedirectToSignIn />} />
        <Route path={ROUTING_MANAGER.REGISTER} element={<RedirectToSignUp />} />
        <Route path={ROUTING_MANAGER.COMBO} element={<ProductInfo />} />
        <Route path={ROUTING_MANAGER.CART} element={<CartPage />} />
        {/* <Route path={ROUTING_MANAGER.CHECKOUT} element={<OrderDetailsPage />} /> */}
        {/* <Route path={ROUTING_MANAGER.CHECKOUT} element={<CheckoutPage />} /> */}
        {/* TODO: Poner protegido el enlace de COMBO, CART? */}
        <Route
          path={ROUTING_MANAGER.ALL_COMBOS}
          element={
            <>
              <SignedIn>
                <Combos />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
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
          <ClerkProviderWithRoutes />
        </StoreProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
