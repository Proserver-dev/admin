import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
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
import {authenticate} from "../../helpers/Auth";
import Routes from "../../constants/RoutesPath";
import prepareSnackBarErrorObj from "../../helpers/prepareSnackBarErrorObj";
import {useDispatch} from "react-redux";
import {setSnackBar} from "../../redux/actions";
import videoBackground from '../../assets/login_view.mp4';

const LoginView = () => {
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
        dispatch({ type: 'SHOW_SPINNER' });
        authenticate(values).then((res) => {
            // nie musimy robić nic z tokenem, bo jest on zapisywany w localStorage
            dispatch({ type: 'SET_CURRENT_USER', payload: res.user })
            dispatch({ type: 'CONNECT_SOCKET' });
            navigate(Routes.HOME);
            dispatch({ type: 'HIDE_SPINNER' });
            dispatch(setSnackBar({ type: 'success', message: 'Zalogowano pomyślnie', show: true }))
        }).catch(errorMessage => {
            dispatch({ type: 'HIDE_SPINNER' });
            dispatch(setSnackBar(prepareSnackBarErrorObj(errorMessage)))
        });
    }

    const handleEnterKeyPress = (event) => {
        if (event.key === 'Enter' && values.email !== "" && values.password !== "") {
            handleLogin();
        }
    };

    return (
        <>
            <video autoPlay loop muted className="video-background">
                <source src={videoBackground} type="video/mp4" />
                Twoja przeglądarka nie obsługuje odtwarzacza video.
            </video>
            <div className="overlay"></div>
            <div className="login-view">
                <h1>{Settings.TITLE}</h1>
                <div className="login-container">
                    <TextField id="email" label="E-mail" variant="outlined" className="login-input" value={values.email}
                               onChange={handleChange('email')}/>

                    <FormControl variant="outlined" className="password-input">
                        <InputLabel htmlFor="password">Hasło</InputLabel>
                        <OutlinedInput
                            id="password"
                            type={values.showPassword ? 'text' : 'password'}
                            value={values.password}
                            onChange={handleChange('password')}
                            onKeyPress={handleEnterKeyPress}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Tooltip title={values.showPassword ? "Ukryj hasło" : "Pokaż hasło"}>
                                        <IconButton
                                            aria-label="zmień widoczność hasła"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {values.showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            }
                            label="Hasło"
                        />
                    </FormControl>
                    <div
                        className={values.email === "" || values.password === "" ? "container-login-button run-button" : "container-login-button"}>
                        <Button variant="contained" className="login-button" onClick={handleLogin}>Logowanko</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginView;