import React, { useState, useEffect } from 'react';
import { Container, Stack, Typography, TextField, Button } from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import Settings from "../../constants/Settings";
import {reqGetRoles} from "../../helpers/Role";
import {setSnackBar} from "../../redux/actions";
import prepareSnackBarErrorObj from "../../helpers/prepareSnackBarErrorObj";
import {reqGetLogs} from "../../helpers/Logs";

const LogsView = () => {
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
                dispatch(setSnackBar(prepareSnackBarErrorObj(err)));
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
                    Logi
                </Typography>
                <Button variant="outlined" onClick={handleRefresh}>
                    Odśwież
                </Button>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={2} mt={3}>
                <Typography variant="h6">Wybierz datę:</Typography>
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
                    Pokaż logi
                </Button>
            </Stack>

            {loading ? (
                <Typography variant="body1">Ładowanie danych...</Typography>
            ) : (
                <>
                    <Typography variant="h6" style={{ marginTop: '25px' }}>Treść logów:</Typography>
                    <div dangerouslySetInnerHTML={{ __html: logs }} style={{ marginTop: '25px' }}/>
                </>
            )}
        </Container>
    );
}

export default LogsView;
