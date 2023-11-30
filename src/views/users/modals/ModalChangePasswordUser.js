import {
    Button,
    FormControl,
    IconButton,
    InputAdornment, InputLabel, Link,
    OutlinedInput,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import CustomModal from "../../../components/CustomModal";
import getRandomPassword from "../../../helpers/functions/getRandomPassword";
import {reqPostChangePasswordUser} from "../../../helpers/API/User";
import {useDispatch} from "react-redux";
import {setSnackBar} from "../../../redux/actions";
import {
    hasLowercases, hasNumbers,
    hasSpecialCharacters,
    hasUppercases,
    isPasswordLengthValid
} from "../../../helpers/functions/passwordValidations";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const passwordWeaknessValidationDefault = {
    run: false,
    PASSWORD_MIN_CHARS: 0,
    PASSWORD_MIN_SMALL_LETTERS: 0,
    PASSWORD_MIN_BIG_LETTERS: 0,
    PASSWORD_MIN_DIGITS: 0,
    PASSWORD_MIN_SPECIAL_CHARS: 0
}

const passwordWeaknessValidationResultsDefault = {
    PASSWORD_MIN_CHARS: true,
    PASSWORD_MIN_SMALL_LETTERS: true,
    PASSWORD_MIN_BIG_LETTERS: true,
    PASSWORD_MIN_DIGITS: true,
    PASSWORD_MIN_SPECIAL_CHARS: true
}

const ModalChangePasswordUser = ({isModalOpen = false, setModalOpen = {}, selectedUser = {}}) => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [passwordWeaknessValidation, setPasswordWeaknessValidation] = useState(passwordWeaknessValidationDefault)
    const [passwordWeaknessValidationResults, setPasswordWeaknessValidationResults] = useState(passwordWeaknessValidationResultsDefault)

    useEffect(() => {
        setPassword('')
        setShowPassword(false)
        setPasswordWeaknessValidation(passwordWeaknessValidationDefault)
        setPasswordWeaknessValidationResults(passwordWeaknessValidationResultsDefault)
    }, [isModalOpen])

    useEffect(() => {
        if (passwordWeaknessValidation.run) {
            setPasswordWeaknessValidationResults({
                PASSWORD_MIN_CHARS: isPasswordLengthValid(password, passwordWeaknessValidation.PASSWORD_MIN_CHARS),
                PASSWORD_MIN_SMALL_LETTERS: hasLowercases(password, passwordWeaknessValidation.PASSWORD_MIN_SMALL_LETTERS),
                PASSWORD_MIN_BIG_LETTERS: hasUppercases(password, passwordWeaknessValidation.PASSWORD_MIN_BIG_LETTERS),
                PASSWORD_MIN_DIGITS: hasNumbers(password, passwordWeaknessValidation.PASSWORD_MIN_DIGITS),
                PASSWORD_MIN_SPECIAL_CHARS: hasSpecialCharacters(password, passwordWeaknessValidation.PASSWORD_MIN_SPECIAL_CHARS)
            })
        }
    }, [password])

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChangePassword = () => {
        if (password === "") {
            const message = t("ERR_PROVIDE_PASSWORD_FIELD")
            dispatch(setSnackBar({type: 'error', message: message, show: true}));
            return
        }

        dispatch({type: 'SHOW_SPINNER'});
        reqPostChangePasswordUser(selectedUser.id, password)
            .then(res => {
                dispatch(setSnackBar({type: 'success', message: t("APP_SUCCESS_CHANGE_PASSWORD"), show: true}));
                setModalOpen(false)
            })
            .catch(err => {
                const code = err?.response?.data?.error

                if (code === 'ERR_WEAK_PASSWORD') {
                    setPasswordWeaknessValidation({
                        run: true,
                        PASSWORD_MIN_CHARS: err?.response?.data?.PASSWORD_MIN_CHARS,
                        PASSWORD_MIN_SMALL_LETTERS: err?.response?.data?.PASSWORD_MIN_SMALL_LETTERS,
                        PASSWORD_MIN_BIG_LETTERS: err?.response?.data?.PASSWORD_MIN_BIG_LETTERS,
                        PASSWORD_MIN_DIGITS: err?.response?.data?.PASSWORD_MIN_DIGITS,
                        PASSWORD_MIN_SPECIAL_CHARS: err?.response?.data?.PASSWORD_MIN_SPECIAL_CHARS
                    })

                    setPasswordWeaknessValidationResults({
                        PASSWORD_MIN_CHARS: isPasswordLengthValid(password, err?.response?.data?.PASSWORD_MIN_CHARS),
                        PASSWORD_MIN_SMALL_LETTERS: hasLowercases(password, err?.response?.data?.PASSWORD_MIN_SMALL_LETTERS),
                        PASSWORD_MIN_BIG_LETTERS: hasUppercases(password, err?.response?.data?.PASSWORD_MIN_BIG_LETTERS),
                        PASSWORD_MIN_DIGITS: hasNumbers(password, err?.response?.data?.PASSWORD_MIN_DIGITS),
                        PASSWORD_MIN_SPECIAL_CHARS: hasSpecialCharacters(password, err?.response?.data?.PASSWORD_MIN_SPECIAL_CHARS)
                    })
                } else {
                    const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                    dispatch(setSnackBar({type: 'error', message: message, show: true}));
                }
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch({type: 'HIDE_SPINNER'});
                }, 250);
            })
    }

    const handleGeneratePassword = () => {
        setShowPassword(true)
        const newPassword = getRandomPassword();
        setPassword(newPassword)
    }

    const handleOnChangePassword = (e) => {
        const value = e.target.value
        setPassword(value)
    }

    const renderValidationItem = (isValid, text) => (
        <Typography
            variant="caption"
            paragraph
            style={{marginBottom: 0, marginTop: 0, color: isValid ? 'green' : 'red'}}
        >
            {isValid ? (
                <CheckCircleIcon style={{color: 'green', marginRight: '5px', fontSize: '11px'}}/>
            ) : (
                <CancelIcon style={{color: 'red', marginRight: '5px', fontSize: '11px'}}/>
            )}
            {text}
        </Typography>
    );

    const isSubmitBlocked = () => {
        return passwordWeaknessValidation.run && (
            !passwordWeaknessValidationResults.PASSWORD_MIN_CHARS ||
            !passwordWeaknessValidationResults.PASSWORD_MIN_SMALL_LETTERS ||
            !passwordWeaknessValidationResults.PASSWORD_MIN_BIG_LETTERS ||
            !passwordWeaknessValidationResults.PASSWORD_MIN_DIGITS ||
            !passwordWeaknessValidationResults.PASSWORD_MIN_SPECIAL_CHARS
        )
    }

    return (
        <CustomModal open={isModalOpen} onClose={() => setModalOpen(false)}>
            <Stack direction="column" spacing={2}>
                <Typography variant="h6" gutterBottom>
                    Wprowadź nowe hasło
                </Typography>

                {selectedUser && (
                    <Typography variant="caption" paragraph={true}
                                style={{marginBottom: 0}}>Dla konta <strong>{selectedUser.email}</strong>
                    </Typography>
                )}

                <FormControl variant="outlined">
                    <InputLabel htmlFor="password">{t('APP_PASSWORD_FIELD_LABEL')}</InputLabel>
                    <OutlinedInput
                        id="password"
                        label={t('APP_PASSWORD_FIELD_LABEL')}
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={handleOnChangePassword}
                        endAdornment={
                            <InputAdornment position="end">
                                <Tooltip
                                    title={showPassword ? t('APP_HIDE_PASSWORD_BTN_TOOLTIP') : t('APP_SHOW_PASSWORD_BTN_TOOLTIP')}>
                                    <IconButton
                                        aria-label={t('APP_CHANGE_VISIBILITY_PASSWORD')}
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <Stack direction="row" spacing={2}>
                    <Link onClick={handleGeneratePassword} component="button" variant="body2"
                          style={{display: 'inline'}}>
                        Wygeneruj hasło
                    </Link>
                </Stack>

                <Button variant="contained" color="primary" onClick={handleChangePassword} disabled={isSubmitBlocked()}>
                    Zmień hasło
                </Button>

                {passwordWeaknessValidation.run && (
                    <div style={{marginTop: '15px'}}>
                        {renderValidationItem(
                            passwordWeaknessValidationResults.PASSWORD_MIN_CHARS,
                            `Hasło powinno składać się przynajmniej z ${passwordWeaknessValidation.PASSWORD_MIN_CHARS} znaków`
                        )}
                        {renderValidationItem(
                            passwordWeaknessValidationResults.PASSWORD_MIN_SMALL_LETTERS,
                            `W tym przynajmniej ${passwordWeaknessValidation.PASSWORD_MIN_SMALL_LETTERS} małych liter`
                        )}
                        {renderValidationItem(
                            passwordWeaknessValidationResults.PASSWORD_MIN_BIG_LETTERS,
                            `W tym przynajmniej ${passwordWeaknessValidation.PASSWORD_MIN_BIG_LETTERS} wielkich liter`
                        )}
                        {renderValidationItem(
                            passwordWeaknessValidationResults.PASSWORD_MIN_DIGITS,
                            `W tym przynajmniej ${passwordWeaknessValidation.PASSWORD_MIN_DIGITS} cyfr`
                        )}
                        {renderValidationItem(
                            passwordWeaknessValidationResults.PASSWORD_MIN_SPECIAL_CHARS,
                            `W tym przynajmniej ${passwordWeaknessValidation.PASSWORD_MIN_SPECIAL_CHARS} znaków specjalnych`
                        )}
                    </div>
                )}
            </Stack>
        </CustomModal>
    )
}

export default ModalChangePasswordUser