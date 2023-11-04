import React, {useEffect, useState} from 'react';
import {
    TextField,
    Button,
    FormControl,
    InputLabel,
    InputAdornment,
    OutlinedInput,
    IconButton, Snackbar, Tooltip,
} from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Settings from "../../constants/Settings"

const LoginView = () => {
    const [showLoader, setShowLoader] = useState(false)
    const [values, setValues] = useState({email: "", password: "", showPassword: false})

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
    }

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
        </>
    )
}

export default LoginView;