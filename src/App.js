import React, {useEffect, useState} from 'react';
import {isLogged} from "./helpers/login";
import './App.css';
import LoginView from "./views/login/LoginView";
import Router from './routes';
import ScrollToTop from './components/ScrollToTop';

const App = () => {
  const [sessionLogin, setSessionLogin] = useState(isLogged())

  return (
      <>
        {
          sessionLogin === "zalogowany" ? (
              <>
                <ScrollToTop />
                <Router />
              </>
          ) : (
              <LoginView/>
          )
        }
      </>
  );
}

export default App;
