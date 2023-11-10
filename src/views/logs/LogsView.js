import React, { useState, useEffect } from 'react';
import { Container, Stack, Typography, TextField, Button } from "@mui/material";
import { useSelector } from "react-redux";
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import Settings from "../../constants/Settings";

const LogsView = () => {
    const navigate = useNavigate();
    const { name } = useParams();
    const currentUser = useSelector((state) => state.currentUser);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(name || new Date().toISOString().split('T')[0]);

    // TODO: to trzeba przenieść do zewnętrznej funkcji, request do API
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${Settings.API}/logs/${selectedDate}`);
                setLogs(response.data);
            } catch (error) {
                console.error('Error fetching logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [selectedDate]);

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
