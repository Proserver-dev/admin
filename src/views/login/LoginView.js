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
import SweetAlert from 'react-bootstrap-sweetalert';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Settings from "../../constants/Settings"
import {authenticate} from "../../helpers/Auth";
import Routes from "../../constants/RoutesPath";
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';

const LoginView = ({setLoginToken}) => {
    const [showLoader, setShowLoader] = useState(false)
    const [values, setValues] = useState({email: "", password: "", showPassword: false})
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
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
        authenticate(values).then((res) => {
            setLoginToken(res.token);
            navigate(Routes.HOME);
        }).catch(errorMessage => {
            setErrorMessage(errorMessage);
            setShowError(true);
        });
    }

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleCloseSnackBar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowError(false)
    };

    return (
        <>
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
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={showError}
                autoHideDuration={6000}
                TransitionComponent={Fade}
                onClose={handleCloseSnackBar}
                key={'bottomcenter'}
            >
                <Alert onClose={handleCloseSnackBar} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </>
    )
}

export default LoginView;