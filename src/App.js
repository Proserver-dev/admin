import React, {useEffect, useState} from 'react';
import './App.css';
import { useTranslation } from 'react-i18next';
import LoginView from "./views/login/LoginView";
import Router from './routes';
import ScrollToTop from './components/ScrollToTop';
import Fade from "@mui/material/Fade";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {Backdrop, Box, Button, CircularProgress, Menu, MenuItem} from "@mui/material";
import {useSelector, useDispatch} from 'react-redux';
import {setCurrentUser, setSnackBar} from "./redux/actions";
import {getMe} from "./helpers/User";
import {getLoginToken} from "./helpers/Auth";
import {useNavigate} from "react-router-dom";
import RoutesPath from "./constants/RoutesPath";
import Cookies from 'js-cookie';
import Countries from "./constants/lang/Countries";
import Settings from './constants/Settings'
import i18n from './constants/lang/i18n';

const App = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.currentUser);
    const snackBar = useSelector((state) => state.snackBar);
    const showSpinner = useSelector((state) => state.showSpinner);
    const socket = useSelector((state) => state.socket);

    const [anchorEl, setAnchorEl] = useState(null);
    const [currentLang, setCurrentLang] = useState(Cookies.get('currentLang') || Settings.DEFAULT_LANG);

    useEffect(() => {
        i18n.changeLanguage(currentLang).then(() => {});
    },[currentLang])

    const handleLanguageMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLanguageMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (lang) => {
        setCurrentLang(lang);
        Cookies.set('currentLang', lang, { expires: 365 });
        handleLanguageMenuClose();
    };

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
                    dispatch(setSnackBar({type: 'warning', message: t("APP_SOMEONE_LOGGED_INTO_YOUR_ACCOUNT"), show: true}))
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

    useEffect(() => {
        if(getLoginToken() !== null) {
            dispatch({type: 'SHOW_SPINNER'});
            getMe()
                .then(res => {
                    dispatch(setCurrentUser(res));
                    dispatch({type: 'CONNECT_SOCKET'});
                })
                .catch((err) => {
                    const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                    dispatch(setSnackBar({ type: 'error', message: message, show: true }));
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
        dispatch({ type: 'DISCONNECT_SOCKET' });
    };

    const handleUnload = async (event) => {
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
            <Box sx={{ position: 'fixed', top: '10px', right: '10px', zIndex: 999 }}>
                <Button color="primary" onClick={handleLanguageMenuOpen} sx={{ textTransform: 'none' }}>
                    <img
                        src={Countries[currentLang].flag}
                        alt={t(Countries[currentLang].nameKey)}
                        style={{ width: '1.5em', height: '1.5em', marginRight: '0.5em' }}
                    />
                    {t(Countries[currentLang].nameKey)}
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleLanguageMenuClose}
                >
                    {Object.keys(Countries).map((countryCode) => (
                        <MenuItem
                            key={countryCode} onClick={() => handleLanguageChange(countryCode)}
                            disabled={countryCode === currentLang}
                        >
                            <img
                                src={Countries[countryCode].flag}
                                alt={countryCode}
                                style={{ width: '1.5em', height: '1.5em', marginRight: '0.5em' }}
                            />
                            {t(Countries[countryCode].nameKey)}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
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
