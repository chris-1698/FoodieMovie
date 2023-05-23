import { 
    ClerkProvider, 
    SignedIn,
    SignedOut,
    RedirectToSignIn,
    SignIn,
    SignUp,
    UserButton,
    RedirectToSignUp
} from '@clerk/clerk-react'
import { Routes, Route, useNavigate, BrowserRouter } from 'react-router-dom'
import AllCombos from './components/AllCombos';
import { ROUTING_MANAGER } from './navigation/Router';
import MainPage from './pages/authentication/MainPage';

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

const ClerkProviderWithRoutes = () => {
    const navigate = useNavigate();
//User: TrialUser pass: sh-SHSH-sh email: letmechooseanemail1135@gmail.com
    return (
        <ClerkProvider
            publishableKey={clerkPubKey}
            navigate={(to) => navigate(to)}
        >
                <Routes>
                    <Route path={ROUTING_MANAGER.ROOT} element={<MainPage />} />
                    <Route path={ROUTING_MANAGER.SIGN_IN} element={<RedirectToSignIn />}/>
                    <Route path={ROUTING_MANAGER.REGISTER} element={<RedirectToSignUp/>}/>
                    <Route path={ROUTING_MANAGER.ALL_COMBOS} element={
                        <>
                            <SignedIn>
                                <AllCombos />
                            </SignedIn>
                            <SignedOut>
                                <RedirectToSignIn />
                            </SignedOut>
                        </>
                    }/>
                </Routes>
        </ClerkProvider>
    )
}

const App = () => {
    return (
        <>
            <BrowserRouter>
                <ClerkProviderWithRoutes />
            </BrowserRouter>

            {/* {/* <Routes>
                {/* Change "/" for "Login".  */}
                {/* <Route path="/"  */}
                    {/* element={<UserLogin />} */}
                {/* /> */}
                {/* <Route path="register"  */}
                    {/* element={<UserRegister />}  */}
                {/* /> */}
                {/* <Route path="/menus"  */}
                    {/* element={<Menus />}  */}
                {/* /> */} 
                {/* </Routes>  */}



                
                {/* <Route path="userUnauthorized" element={<UserUnauthorized />} /> */}

        </>
    )
}

export default App;
