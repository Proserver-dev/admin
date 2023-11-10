import React, {useEffect, useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Pagination,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem, Container, Grid,
} from '@mui/material';
import {getMessagesToAll} from "../../helpers/MessagesToAll";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useLocation} from "react-router-dom";
import {format} from "date-fns";

const initialMessage = ''; // Domyślna wiadomość
const itemsPerPage = 10; // Liczba elementów na stronę

function SendToAllView() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = useSelector((state) => state.currentUser);
    const [message, setMessage] = useState(initialMessage);
    const [type, setType] = useState('forceLogout');
    const [page, setPage] = useState(1);
    const [data, setData] = useState({ count: 0, rows: []})

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pageParam = parseInt(searchParams.get('page'), 10) || 1;
        setPage(pageParam);
    }, [location.search]);

    // TODO: może zrobić jeszcze jakiś event dodatkowy dla "messageToAll" np. "messageToAllError", nasłuchiwać na nim i jak przyjdzie error to wyświetlić snackbara
    const handleSend = () => {
        if(type !== 'forceLogout' && message === '') {
            dispatch({ type: 'SET_SNACK_BAR', payload: { type: 'error', message: 'Wiadomość dla tego typu nie może być pusta', show: true }})
            return;
        }

        dispatch({ type: 'EMIT_SOCKET_EVENT', payload: { event: 'messageToAll', data: { message: message, type: type }}})
        setData({
            count: data.count + 1,
            rows: [
                { id: '', sendBy: currentUser?.id, message: message, type: type, createdAt: ''},
                ...data.rows
            ]
        })
    }

    useEffect(() => {
        dispatch({ type: 'SHOW_SPINNER' });
        getMessagesToAll(itemsPerPage, itemsPerPage*(page-1))
            .then((res) => {
                setData(res)
            })
            .catch(() => {
                // TODO: tutaj dorobić obsługę błędu i wygaśniętego tokena

            })
            .finally(() => {
                setTimeout(() => {
                    dispatch({ type: 'HIDE_SPINNER' });
                }, 250);
            })
    }, [page])

    const handleChangeMessage = (event) => {
        setMessage(event.target.value);
    };

    const handleChangeType = (event) => {
        setType(event.target.value);
    };

    const handlePageChange = (event, value) => {
        navigate(`?page=${value}`)
    };

    const startItem = (page - 1) * itemsPerPage;
    const endItem = page * itemsPerPage;

    return (
        <Container>
            <Typography variant="h6">Wiadomość do wszystkich:</Typography>
            <Grid container spacing={2} style={{ marginTop: '15px', marginBottom: '15px' }}>
                <Grid item xs={2}>
                    <FormControl fullWidth>
                        <InputLabel>Typ</InputLabel>
                        <Select value={type} onChange={handleChangeType}>
                            <MenuItem value="forceLogout">Force logout all</MenuItem>
                            <MenuItem value="info">Info</MenuItem>
                            <MenuItem value="warning">Warning</MenuItem>
                            <MenuItem value="error">Error</MenuItem>
                            <MenuItem value="success">Success</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Wiadomość"
                        variant="outlined"
                        fullWidth
                        value={message}
                        onChange={handleChangeMessage}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleSend(message, type)}
                    >
                        Wyślij
                    </Button>
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Wysłane przez</TableCell>
                            <TableCell>Wiadomość</TableCell>
                            <TableCell>Typ</TableCell>
                            <TableCell>Utworzone</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.rows.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.sendBy}</TableCell>
                                <TableCell>{row.message}</TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>
                                    { row.createdAt !== "" && format(new Date(row.createdAt), 'yyyy-MM-dd HH:mm:ss') }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Pagination
                count={Math.ceil(data.count / itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                style={{ marginTop: '15px' }}
            />
        </Container>
    );
}

export default SendToAllView;
