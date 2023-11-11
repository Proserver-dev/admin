import React, {useEffect} from 'react';
import './App.css';
import LoginView from "./views/login/LoginView";
import Router from './routes';
import ScrollToTop from './components/ScrollToTop';
import Fade from "@mui/material/Fade";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {Backdrop, CircularProgress} from "@mui/material";
import {useSelector, useDispatch} from 'react-redux';
import {setCurrentUser, setSnackBar} from "./redux/actions";
import {getMe} from "./helpers/User";
import prepareSnackBarErrorObj from "./helpers/prepareSnackBarErrorObj";
import {getLoginToken} from "./helpers/Auth";
import {useNavigate} from "react-router-dom";
import RoutesPath from "./constants/RoutesPath";

const App = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.currentUser);
    const snackBar = useSelector((state) => state.snackBar);
    const showSpinner = useSelector((state) => state.showSpinner);
    const socket = useSelector((state) => state.socket);

    useEffect(() => {
        if (socket) {
            socket.on('messageToAll', (data) => {
                if (data && data.message && data.type) {
                    let messageType = 'info';

                    if (data.type !== 'forceLogout') {
                        messageType = data.type
                    }

                    // nasłuchuje na messageToAll i jak coś przyjdzie, to pokazuje wszystkim zalogowanym adminom snackbara
                    dispatch(setSnackBar({type: messageType, message: data.message + " | " + data.type, show: true}));
                }
            });

            socket.on('newSocketConnection', (data) => {
                if (data && data.logout) {
                    // tutaj nie robimy requesta do /auth/logout , bo przyczyną wylogowania jest zalogowanie się na innym urządzeniu
                    navigate(RoutesPath.HOME)
                    dispatch({type: 'SHOW_SPINNER'});
                    dispatch({type: 'DISCONNECT_SOCKET'});
                    dispatch({type: 'LOGOUT_CURRENT_USER'});
                    localStorage.clear();
                    setTimeout(() => {
                        dispatch({type: 'HIDE_SPINNER'});
                    }, 250);
                    dispatch(setSnackBar({type: 'warning', message: 'Ktoś zalogował się na Twoje konto!', show: true}))
                }
            });
        }

        return () => {
            if (socket) {
                socket.off('messageToAll');
                socket.off('newSocketConnection');
                dispatch({ type: 'DISCONNECT_SOCKET' });
            }
        };
    }, [socket, dispatch]);

    // Endpoint /users/me (poniższy) na razie nie jest potrzebny, bo w /auth/login zwracany jest cały user
    useEffect(() => {
        if(getLoginToken() !== null) {
            dispatch({type: 'SHOW_SPINNER'});
            getMe()
                .then(res => {
                    dispatch(setCurrentUser(res));
                    dispatch({type: 'CONNECT_SOCKET'});
                })
                .catch(() => {
                    // obsługa błędów jest w axiosWithToken.js
                })
                .finally(() => {
                    setTimeout(() => {
                        dispatch({type: 'HIDE_SPINNER'});
                    }, 250);
                })
        }

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('unload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('unload', handleUnload);
        };
    }, []);

    const handleBeforeUnload = async (event) => {
        // przed zamknięciem strony
        // event.preventDefault(); // TODO: to trzeba przerobić, przez to wymaga potwierdzenia zamknięcia okna. Bez tego też jest ok, bo jest zabezpieczenie po stronie serwera
        // event.returnValue = '';
        dispatch({ type: 'DISCONNECT_SOCKET' });
    };

    const handleUnload = async (event) => {
        // przed odświeżeniem strony
        // event.preventDefault(); // TODO: to trzeba przerobić, przez to wymaga potwierdzenia zamknięcia okna. Bez tego też jest ok, bo jest zabezpieczenie po stronie serwera
        // event.returnValue = '';
        dispatch({ type: 'DISCONNECT_SOCKET' });
    };


    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        dispatch(setSnackBar({...snackBar, show: false}))
    };

    return (
        <>
            {
                getLoginToken() !== null ? (
                    <>
                        <ScrollToTop/>
                        <Router/>
                    </>
                ) : (
                    <LoginView/>
                )
            }

            <Snackbar
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                open={snackBar.show}
                autoHideDuration={6000}
                TransitionComponent={Fade}
                onClose={handleCloseSnackBar}
                key={'bottomcenter'}
            >
                <Alert onClose={handleCloseSnackBar} severity={snackBar.type} sx={{width: '100%'}}>
                    {snackBar.message}
                </Alert>
            </Snackbar>
            <Backdrop
                sx={{color: '#fff', zIndex: '999999'}}
                open={showSpinner}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        </>
    );
}

export default App;
