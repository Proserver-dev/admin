import React, {useEffect, useState} from 'react';
import {getLoginToken, refreshLoginToken} from "./helpers/Auth";
import './App.css';
import LoginView from "./views/login/LoginView";
import Router from './routes';
import ScrollToTop from './components/ScrollToTop';
import Fade from "@mui/material/Fade";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {Backdrop, CircularProgress} from "@mui/material";
import Routes from "./constants/RoutesPath";
import {getMe} from "./helpers/User";
import ApiResults from "./constants/ApiResults";

const App = () => {
    const [loginToken, setLoginToken] = useState(getLoginToken())
    const [currentUser, setCurrentUser] = useState({})
    const [snackBar, setSnackBar] = useState({ type: 'error', message: '', show: false})
    const [showSpinner, setShowSpinner] = useState(false)

    const handleTokenExpiration = (errorMessage) => {
        setCurrentUser({});
        setLoginToken(null);
        setSnackBar({
            type: 'error',
            message: errorMessage,
            show: true
        });
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await getMe();
                setCurrentUser(user);
            } catch (error) {
                if (error.code === ApiResults.ERR_TOKEN_EXPIRED.code) {
                    try {
                        const refreshResponse = await refreshLoginToken();
                        // setLoginToken(refreshResponse.token);

                        const userAfterRefresh = await getMe();
                        setCurrentUser(userAfterRefresh);
                    } catch (refreshError) {
                        if (refreshError.code === ApiResults.ERR_REFRESH_TOKEN_EXPIRED.code) {
                            handleTokenExpiration('Refresh-Token wygasł. Zaloguj się ponownie');
                        } else {
                            handleTokenExpiration('Z jakiegoś nieoczekiwanego powodu nie udało się odświeżyć tokena. Zaloguj się ponownie');
                        }
                    }
                } else {
                    handleTokenExpiration('Nie udało się pobrać informacji o użytkowniku. Zaloguj się ponownie');
                }
            }
        };

        if (loginToken !== null) {
            fetchUserData().then(() => {});
        }
    }, [loginToken]);

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackBar({ ...snackBar, show: false })
    };

    return (
        <>
            {
                loginToken !== null ? (
                    <>
                        <ScrollToTop/>
                        <Router setLoginToken={setLoginToken} setSnackBar={setSnackBar} setShowSpinner={setShowSpinner} currentUser={currentUser} setCurrentUser={setCurrentUser}/>
                    </>
                ) : (
                    <LoginView setLoginToken={setLoginToken} setSnackBar={setSnackBar} setShowSpinner={setShowSpinner}/>
                )
            }

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={snackBar.show}
                autoHideDuration={6000}
                TransitionComponent={Fade}
                onClose={handleCloseSnackBar}
                key={'bottomcenter'}
            >
                <Alert onClose={handleCloseSnackBar} severity={snackBar.type} sx={{ width: '100%' }}>
                    {snackBar.message}
                </Alert>
            </Snackbar>
            <Backdrop
                sx={{ color: '#fff', zIndex: '999999'}}
                open={showSpinner}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default App;
