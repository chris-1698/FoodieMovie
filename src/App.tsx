import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp,
  UserButton,
  RedirectToSignUp,
} from '@clerk/clerk-react';
import { Routes, Route, useNavigate, BrowserRouter } from 'react-router-dom';
import Combos from './components/Combos';
import { ROUTING_MANAGER } from './navigation/Router';
import MainPage from './pages/authentication/MainPage';
import ProductInfo, { getServerSideProps } from './pages/product/[slug]';
import Trial from './components/Trial';

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
        {/* TODO: Poner protegido el enlace de COMBO */}
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
        {/* <Route
          path={ROUTING_MANAGER.COMBO + '/'}
          element={
            <>
              <SignedIn> {/* <ProductInfo />{' '} /}</SignedIn>
              <SignedOut>
                
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        /> */}
      </Routes>
    </ClerkProvider>
  );
};

const App = () => {
  return (
    <>
      <BrowserRouter>
        <ClerkProviderWithRoutes />
      </BrowserRouter>
    </>
  );
};

export default App;
