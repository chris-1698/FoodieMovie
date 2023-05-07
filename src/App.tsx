import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Routes, Route } from 'react-router-dom'
import UserLogin from './pages/authentication/UserLogin';

function App() {

    return (
        <>
            <Routes>
                {/* Change "/" for "Login".  */}
                <Route path="/" element={<UserLogin />} />
                {/* <Route path="userUnauthorized" element={<UserUnauthorized />} /> */}

            </Routes>
        </>
    )
}

export default App;
