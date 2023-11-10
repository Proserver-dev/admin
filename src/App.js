import React, {useEffect, useState} from 'react';
import {getLoginToken, refreshLoginToken, setLogOut} from "./helpers/Auth";
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
import { useSelector, useDispatch } from 'react-redux';
import {setCurrentUser, setSnackBar} from "./redux/actions";
import prepareSnackBarErrorObj from "./helpers/prepareSnackBarErrorObj";

const App = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.currentUser);
    const snackBar = useSelector((state) => state.snackBar);
    const showSpinner = useSelector((state) => state.showSpinner);


    // Endpoint /users/me (poniższy) na razie nie jest potrzebny, bo w /auth/login zwracany jest cały user
    /*

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await getMe();
                dispatch(setCurrentUser(user));
                dispatch({ type: 'CONNECT_SOCKET' });
            } catch (error) {
                if (error.code === ApiResults.ERR_TOKEN_EXPIRED.code) {
                    try {
                        dispatch({ type: 'DISCONNECT_SOCKET' });
                        const refreshResponse = await refreshLoginToken();
                        // setLoginToken(refreshResponse.token);

                        const userAfterRefresh = await getMe();
                        dispatch(setCurrentUser(userAfterRefresh));
                        dispatch({ type: 'CONNECT_SOCKET' });
                    } catch (refreshError) {
                        if (refreshError.code === ApiResults.ERR_REFRESH_TOKEN_EXPIRED.code) {
                            dispatch({ type: 'DISCONNECT_SOCKET' });
                            dispatch({ type: 'LOGOUT_CURRENT_USER' });
                            setLogOut()
                            dispatch(setSnackBar(prepareSnackBarErrorObj({ message: 'Refresh-Token wygasł. Zaloguj się ponownie' })));
                        } else {
                            dispatch({ type: 'DISCONNECT_SOCKET' });
                            dispatch({ type: 'LOGOUT_CURRENT_USER' });
                            setLogOut()
                            dispatch(setSnackBar(prepareSnackBarErrorObj({ message: 'Z jakiegoś nieoczekiwanego powodu nie udało się odświeżyć tokena. Zaloguj się ponownie' })));
                        }
                    }
                } else {
                    dispatch({ type: 'DISCONNECT_SOCKET' });
                    dispatch({ type: 'LOGOUT_CURRENT_USER' });
                    setLogOut()
                    dispatch(setSnackBar(prepareSnackBarErrorObj({ message: 'Nie udało się pobrać informacji o użytkowniku. Zaloguj się ponownie' })));
                }
            }
        };

        if (currentUser.id !== null) {
            fetchUserData().then(() => {});
        }
    }, [currentUser]);

     */

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        dispatch(setSnackBar({ ...snackBar, show: false }))
    };

    return (
        <>
            {
                currentUser.id !== null ? (
                    <>
                        <ScrollToTop />
                        <Router />
                    </>
                ) : (
                    <LoginView />
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
