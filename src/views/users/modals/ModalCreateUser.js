import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel, IconButton, InputAdornment,
    InputLabel, Link,
    MenuItem, OutlinedInput,
    Select, Stack,
    TextField, Tooltip,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import CustomModal from "../../../components/CustomModal";
import {reqGetRoles} from "../../../helpers/API/Role";
import getRandomPassword from "../../../helpers/functions/getRandomPassword";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {reqPostCreateNewAccount} from "../../../helpers/API/User";
import {
    hasLowercases,
    hasNumbers, hasSpecialCharacters,
    hasUppercases,
    isPasswordLengthValid
} from "../../../helpers/functions/passwordValidations";
import {setSnackBar} from "../../../redux/actions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import validateEmail from "../../../helpers/functions/validateEmail";

const formDefault = {
    email: '',
    password: '',
    userName: '',
    nameLastname: '',
    roleId: 2,
    isActivated: true,
    sendEmail: false
}

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
const ModalCreateUser = ({open = false, setModalOpen = {}, getUsers = {}}) => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const [form, setForm] = React.useState(formDefault)
    const [roles, setRoles] = useState([{}]);
    const [showPassword, setShowPassword] = useState(false)
    const [passwordWeaknessValidation, setPasswordWeaknessValidation] = useState(passwordWeaknessValidationDefault)
    const [passwordWeaknessValidationResults, setPasswordWeaknessValidationResults] = useState(passwordWeaknessValidationResultsDefault)

    useEffect(() => {
        setForm(formDefault)
        setShowPassword(false)
        setPasswordWeaknessValidation(passwordWeaknessValidationDefault)
        setPasswordWeaknessValidationResults(passwordWeaknessValidationResultsDefault)
    }, [open])

    useEffect(() => {
        if (passwordWeaknessValidation.run) {
            setPasswordWeaknessValidationResults({
                PASSWORD_MIN_CHARS: isPasswordLengthValid(form.password, passwordWeaknessValidation.PASSWORD_MIN_CHARS),
                PASSWORD_MIN_SMALL_LETTERS: hasLowercases(form.password, passwordWeaknessValidation.PASSWORD_MIN_SMALL_LETTERS),
                PASSWORD_MIN_BIG_LETTERS: hasUppercases(form.password, passwordWeaknessValidation.PASSWORD_MIN_BIG_LETTERS),
                PASSWORD_MIN_DIGITS: hasNumbers(form.password, passwordWeaknessValidation.PASSWORD_MIN_DIGITS),
                PASSWORD_MIN_SPECIAL_CHARS: hasSpecialCharacters(form.password, passwordWeaknessValidation.PASSWORD_MIN_SPECIAL_CHARS)
            })
        }
    }, [form.password])

    useEffect(() => {
        reqGetRoles()
            .then(res => {
                setRoles(res);
            })
            .catch(err => {
                setRoles([
                    {id: 1, name: 'Admin', short: 'admin'},
                    {id: 2, name: 'User', short: 'user'},
                    {id: 3, name: 'Blocked', short: 'blocked'},
                ])
            })
    }, [])

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleGeneratePassword = () => {
        setShowPassword(true)
        const newPassword = getRandomPassword();
        handleInputChange('password', newPassword)
    }

    const handleInputChange = (field, value) => {
        setForm(prevForm => ({...prevForm, [field]: value}));
    };

    const handleSubmit = () => {
        if (form.email === "" || form.password === "") {
            dispatch(setSnackBar({type: 'error', message: t("ERR_PROVIDE_LOGIN_DATA"), show: true}));
            return
        }

        if (!validateEmail(form.email)) {
            dispatch(setSnackBar({type: 'error', message: t("ERR_INVALID_EMAIL_ADDRESS"), show: true}));
            return
        }

        dispatch({type: 'SHOW_SPINNER'});
        reqPostCreateNewAccount(form)
            .then(res => {
                dispatch({type: 'HIDE_SPINNER'});
                getUsers()
                setModalOpen(false)
            })
            .catch(err => {
                dispatch({type: 'HIDE_SPINNER'});
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
                        PASSWORD_MIN_CHARS: isPasswordLengthValid(form.password, err?.response?.data?.PASSWORD_MIN_CHARS),
                        PASSWORD_MIN_SMALL_LETTERS: hasLowercases(form.password, err?.response?.data?.PASSWORD_MIN_SMALL_LETTERS),
                        PASSWORD_MIN_BIG_LETTERS: hasUppercases(form.password, err?.response?.data?.PASSWORD_MIN_BIG_LETTERS),
                        PASSWORD_MIN_DIGITS: hasNumbers(form.password, err?.response?.data?.PASSWORD_MIN_DIGITS),
                        PASSWORD_MIN_SPECIAL_CHARS: hasSpecialCharacters(form.password, err?.response?.data?.PASSWORD_MIN_SPECIAL_CHARS)
                    })
                } else if(code === 'ERR_SEND_EMAIL') {
                    const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                    dispatch(setSnackBar({type: 'error', message: message, show: true}));
                    getUsers()
                    setModalOpen(false)
                } else {
                    const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                    dispatch(setSnackBar({type: 'error', message: message, show: true}));
                }
            })
    };

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
        <CustomModal open={open} onClose={() => setModalOpen(false)}>
            <Typography variant="h6">Utwórz użytkownika</Typography>
            <TextField
                label={t("APP_TABLE_COL_EMAIL")}
                fullWidth
                value={form.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                margin="normal"
            />
            <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel htmlFor="password">{t('APP_PASSWORD_FIELD_LABEL')}</InputLabel>
                <OutlinedInput
                    label={t('APP_PASSWORD_FIELD_LABEL')}
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
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

            <TextField
                label={t("APP_TABLE_COL_USER_NAME")}
                fullWidth
                value={form.userName}
                onChange={(e) => handleInputChange('userName', e.target.value)}
                margin="normal"
            />
            <TextField
                label={t("APP_TABLE_COL_NAME_LASTNAME")}
                fullWidth
                value={form.nameLastname}
                onChange={(e) => handleInputChange('nameLastname', e.target.value)}
                margin="normal"
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">{t("APP_TABLE_COL_ROLE")}</InputLabel>
                <Select
                    labelId="role-label"
                    id="role"
                    label={t("APP_TABLE_COL_ROLE")}
                    value={form.roleId}
                    onChange={(e) => handleInputChange('roleId', e.target.value)}
                >
                    {roles.map(role => (
                        <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="column" spacing={2}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={form.isActivated}
                                onChange={(e) => handleInputChange('isActivated', e.target.checked)}
                            />
                        }
                        label={t("APP_TABLE_COL_IS_ACTIVATED")}
                        style={{marginBottom: 0, marginTop: 0}}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={form.sendEmail}
                                onChange={(e) => handleInputChange('sendEmail', e.target.checked)}
                            />
                        }
                        label={t("APP_SEND_EMAIL_TXT")}
                        style={{marginBottom: 0, marginTop: 0}}
                    />
                </Stack>
                <Stack direction="column" spacing={2} justifyContent="center">
                    <Button type="submit"
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={isSubmitBlocked()}>{t("APP_CREATE_USER_TXT")}</Button>
                </Stack>
            </Stack>

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
        </CustomModal>
    )
}

export default ModalCreateUser