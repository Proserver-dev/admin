import React, { useState, useEffect } from 'react';
import {
    Container,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Switch,
    Typography,
    Stack,
    TextareaAutosize,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { setSnackBar } from '../../redux/actions';
import { reqGetAppConfigs, reqPutAppConfigs } from '../../helpers/AppConfig';
import { format } from 'date-fns';
import {useTranslation} from "react-i18next";

const AppConfigView = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [configurations, setConfigurations] = useState([]);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        dispatch({ type: 'SHOW_SPINNER' });
        reqGetAppConfigs()
            .then((res) => {
                setConfigurations(res);
                setFormData(
                    res.reduce((acc, item) => {
                        acc[item.key] = item.value;
                        return acc;
                    }, {})
                );
            })
            .catch((err) => {
                const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                dispatch(setSnackBar({ type: 'error', message: message, show: true }));
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch({ type: 'HIDE_SPINNER' });
                }, 250);
            });
    }, []);

    const handleInputChange = (key, value) => {
        setFormData((prevData) => ({ ...prevData, [key]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: 'SHOW_SPINNER' });
        try {
            const changedData = Object.entries(formData).reduce((acc, [key, value]) => {
                const originalValue = configurations.find((item) => item.key === key)?.value;
                if (originalValue !== value) {
                    acc[key] = value;
                }
                return acc;
            }, {});

            if (Object.keys(changedData).length > 0) {
                await reqPutAppConfigs(changedData);
                setConfigurations((prevConfigurations) =>
                    prevConfigurations.map((item) => ({
                        ...item,
                        value: changedData[item.key] || item.value,
                    }))
                );
                setTimeout(() => {
                    dispatch({ type: 'HIDE_SPINNER' });
                }, 250);
                dispatch(setSnackBar({ type: 'success', message: 'Dane zostały zaktualizowane.', show: true }));
            } else {
                setTimeout(() => {
                    dispatch({ type: 'HIDE_SPINNER' });
                }, 250);
                dispatch(setSnackBar({ type: 'info', message: 'Brak zmian do zapisania.', show: true }));
            }
        } catch (err) {
            setTimeout(() => {
                dispatch({ type: 'HIDE_SPINNER' });
            }, 250);
            const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
            dispatch(setSnackBar({ type: 'error', message: message, show: true }));
        }
    };

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Typography variant="h4" gutterBottom className="page-title">
                    {t("APP_MENU_APP_SETTINGS")}
                </Typography>
            </Stack>
            <form onSubmit={handleFormSubmit}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t("APP_TABLE_COL_KEY")}</TableCell>
                                <TableCell>{t("APP_TABLE_COL_VALUE")}</TableCell>
                                <TableCell>{t("APP_TABLE_COL_UPDATED_AT")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {configurations.map((config) => (
                                <TableRow key={config.id}>
                                    <TableCell>{t(config.key) || config.key}</TableCell>
                                    <TableCell>
                                        {config.key === 'REGISTRATION_ENABLED' ? (
                                            <Switch
                                                checked={formData[config.key] === '1'}
                                                onChange={() => handleInputChange(config.key, formData[config.key] === '1' ? '0' : '1')}
                                            />
                                        ) : config.key === 'LOGIN_ENABLED' ? (
                                            <Switch
                                                checked={formData[config.key] === '1'}
                                                onChange={() => handleInputChange(config.key, formData[config.key] === '1' ? '0' : '1')}
                                            />
                                        ) : config.key === 'REGISTRATION_DISABLED_REASON' || config.key === 'LOGIN_DISABLED_REASON' ? (
                                            <TextareaAutosize
                                                value={formData[config.key]}
                                                onChange={(e) => handleInputChange(config.key, e.target.value)}
                                                disabled={
                                                    (config.key === 'REGISTRATION_DISABLED_REASON' &&
                                                        formData['REGISTRATION_ENABLED'] === '1') ||
                                                    (config.key === 'LOGIN_DISABLED_REASON' && formData['LOGIN_ENABLED'] === '1')
                                                }
                                                style={{ minWidth: '300px', maxWidth: '300px' }}
                                                minRows={4}
                                            />
                                        ) : (
                                            <TextField
                                                type="text"
                                                value={formData[config.key]}
                                                onChange={(e) => handleInputChange(config.key, e.target.value)}
                                                disabled={
                                                    (config.key === 'REGISTRATION_DISABLED_REASON' &&
                                                        formData['REGISTRATION_ENABLED'] === '1') ||
                                                    (config.key === 'LOGIN_DISABLED_REASON' && formData['LOGIN_ENABLED'] === '1')
                                                }
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>{config.updatedAt !== '' && format(new Date(config.updatedAt), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    {t("APP_SAVE_CHANGES_BTN_LABEL")}
                </Button>
            </form>
        </Container>
    );
};

export default AppConfigView;
