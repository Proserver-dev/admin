import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    TextField,
    Button,
    FormControl,
    InputLabel,
    InputAdornment,
    OutlinedInput,
    IconButton, Tooltip,
} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Settings from "../../constants/Settings"
import {reqAuthenticate} from "../../helpers/API/Auth";
import Routes from "../../constants/RoutesPath";
import {useDispatch} from "react-redux";
import {setSnackBar} from "../../redux/actions";
import videoBackground from '../../assets/login_view.mp4';
import Logo from "../../assets/ride_club_full_white.png";
import {useTranslation} from "react-i18next";

const LoginView = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [values, setValues] = useState({email: "", password: "", showPassword: false})
    const navigate = useNavigate();

    const handleChange = (prop) => (event) => {
        setValues({...values, [prop]: event.target.value});
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleLogin = () => {
        dispatch({type: 'SHOW_SPINNER'});
        reqAuthenticate(values)
            .then(res => {
                dispatch({type: 'SET_CURRENT_USER', payload: res.user})
                dispatch({type: 'CONNECT_SOCKET'});
                navigate(Routes.HOME);
            })
            .catch(err => {
                const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                dispatch(setSnackBar({ type: 'error', message: message, show: true }));
            })
            .finally(() => {
                dispatch({type: 'HIDE_SPINNER'});
            })
    }

    const handleEnterKeyPress = (event) => {
        if (event.key === 'Enter' && values.email !== "" && values.password !== "") {
            handleLogin();
        }
    };

    return (
        <>
            <video autoPlay loop muted className="video-background">
                <source src={videoBackground} type="video/mp4"/>
                {t('APP_YOUR_BROWSER_NOT_SUPPORTS_VIDEO_TAG')}
            </video>
            <div className="overlay"></div>
            <div className="login-view">
                <img src={Logo} alt={Settings.TITLE} className="login-logo"/>
                <div className="login-container">
                    <TextField id="email" label={t('APP_EMAIL_FIELD_LABEL')} variant="outlined" className="login-input" value={values.email}
                               onChange={handleChange('email')}/>

                    <FormControl variant="outlined" className="password-input">
                        <InputLabel htmlFor="password">{t('APP_PASSWORD_FIELD_LABEL')}</InputLabel>
                        <OutlinedInput
                            id="password"
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange('password')}
                            onKeyPress={handleEnterKeyPress}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Tooltip title={values.showPassword ? t('APP_HIDE_PASSWORD_BTN_TOOLTIP') : t('APP_SHOW_PASSWORD_BTN_TOOLTIP')}>
                                        <IconButton
                                            aria-label={t('APP_CHANGE_VISIBILITY_PASSWORD')}
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {values.showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            }
                            label={t('APP_PASSWORD_FIELD_LABEL')}
                        />
                    </FormControl>
                    <div
                        className={values.email === "" || values.password === "" ? "container-login-button run-button" : "container-login-button"}>
                        <Button variant="contained" className="login-button" onClick={handleLogin}>{t('APP_LOGIN_SUBMIT_BTN_LABEL')}</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginView;