import React, { useState, useEffect } from 'react';
import { Container, Stack, Typography, TextField, Button } from "@mui/material";
import {useDispatch} from "react-redux";
import {useNavigate, useParams} from 'react-router-dom';
import {setSnackBar} from "../../redux/actions";
import {reqGetLogs} from "../../helpers/Logs";
import {useTranslation} from "react-i18next";

const LogsView = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { name } = useParams();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(name || new Date().toISOString().split('T')[0]);

    const fetchData = () => {
        dispatch({ type: 'SHOW_SPINNER' });
        setLoading(true);
        reqGetLogs(selectedDate)
            .then(res => {
                console.log(res);
                setLogs(res);
            })
            .catch(err => {
                const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                dispatch(setSnackBar({ type: 'error', message: message, show: true }));
            })
            .finally(() => {
                setLoading(false);
                setTimeout(() => {
                    dispatch({ type: 'HIDE_SPINNER' });
                }, 250);
            });
    };

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const handleRefresh = () => {
        fetchData();
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    // <pre>{JSON.stringify(logs, null, 2)}</pre>

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Typography variant="h4" gutterBottom className="page-title">
                    {t("APP_MENU_LOGS")}
                </Typography>
                <Button variant="outlined" onClick={handleRefresh}>
                    {t("APP_REFRESH_BTN_LABEL")}
                </Button>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2} mt={3}>
                <Typography variant="h6">{t("APP_CHOOSE_DATE_BTN_LABEL")}</Typography>
                <TextField
                    type="date"
                    variant="outlined"
                    value={selectedDate}
                    onChange={handleDateChange}
                />
                <Button
                    variant="contained"
                    onClick={() => navigate(`/logs/${selectedDate}`)}
                >
                    {t("APP_SHOW_LOGS_BTN_LABEL")}
                </Button>
            </Stack>

            {loading ? (
                <Typography variant="body1">{t("APP_LOADING_DATA_TXT")}...</Typography>
            ) : (
                <>
                    <Typography variant="h6" style={{ marginTop: '25px' }}>{t("APP_LOGS_CONTENT_TXT")}:</Typography>
                    <div dangerouslySetInnerHTML={{ __html: logs }} style={{ marginTop: '25px' }}/>
                </>
            )}
        </Container>
    );
}

export default LogsView;
