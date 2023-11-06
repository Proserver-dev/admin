import React, {useEffect, useState} from 'react';
import {getLoginToken} from "./helpers/Auth";
import './App.css';
import LoginView from "./views/login/LoginView";
import Router from './routes';
import ScrollToTop from './components/ScrollToTop';

const App = () => {
    const [loginToken, setLoginToken] = useState(getLoginToken())

    return (
        <>
            {
                loginToken !== null ? (
                    <>
                        <ScrollToTop/>
                        <Router setLoginToken={setLoginToken}/>
                    </>
                ) : (
                    <LoginView setLoginToken={setLoginToken}/>
                )
            }
        </>
    );
}

export default App;
