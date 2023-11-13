import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    Switch, Typography, Stack,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { setSnackBar } from '../../redux/actions';
import prepareSnackBarErrorObj from '../../helpers/prepareSnackBarErrorObj';
import { reqGetAppConfigs, reqPutAppConfigs } from '../../helpers/AppConfig';
import {format} from "date-fns";

const AppConfigView = () => {
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
                dispatch(setSnackBar(prepareSnackBarErrorObj(err)));
            })
            .finally(() => {
                dispatch({ type: 'HIDE_SPINNER' });
            });
    }, []);

    const handleInputChange = (key, value) => {
        setFormData((prevData) => ({ ...prevData, [key]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

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
                dispatch(setSnackBar({ type: 'success', message: 'Dane zostały zaktualizowane.', show: true }));
            } else {
                dispatch(setSnackBar({ type: 'info', message: 'Brak zmian do zapisania.', show: true }));
            }
        } catch (error) {
            dispatch(setSnackBar(prepareSnackBarErrorObj(error)));
        }
    };

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Typography variant="h4" gutterBottom className="page-title">
                    Konfiguracja aplikacji
                </Typography>
            </Stack>
            <form onSubmit={handleFormSubmit}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Key</TableCell>
                                <TableCell>Value</TableCell>
                                <TableCell>Updated At</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {configurations.map((config) => (
                                <TableRow key={config.id}>
                                    <TableCell>{config.key}</TableCell>
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
                                    <TableCell>
                                        { config.updatedAt !== "" && format(new Date(config.updatedAt), 'yyyy-MM-dd HH:mm:ss') }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    Zapisz zmiany
                </Button>
            </form>
        </Container>
    );
};

export default AppConfigView;
