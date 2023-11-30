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
    MenuItem, Container, Grid, Stack, Dialog, DialogTitle, DialogActions,
} from '@mui/material';
import {getMessagesToAll} from "../../helpers/API/MessagesToAll";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useLocation} from "react-router-dom";
import {format} from "date-fns";
import {setSnackBar} from "../../redux/actions";
import {useTranslation} from "react-i18next";
import SocketEvents from "../../constants/SocketEvents";

const initialMessage = ''; // Domyślna wiadomość
const itemsPerPage = 10; // Liczba elementów na stronę

function SendToAllView() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = useSelector((state) => state.currentUser);
    const [message, setMessage] = useState(initialMessage);
    const [type, setType] = useState('info');
    const [page, setPage] = useState(1);
    const [data, setData] = useState({count: 0, rows: []})
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pageParam = parseInt(searchParams.get('page'), 10) || 1;
        setPage(pageParam);
    }, [location.search]);

    const handleSend = () => {
        if (type !== 'forceLogout' && message === '') {
            dispatch({
                type: 'SET_SNACK_BAR',
                payload: {type: 'error', message: t("APP_MESSAGE_WITH_THIS_TYPE_CANNOT_BE_EMPTY"), show: true}
            })
            return;
        }

        if (type === 'forceLogout') {
            setOpenConfirmationDialog(true);
        } else {
            sendToAll();
        }
    };

    // TODO: może zrobić jeszcze jakiś event dodatkowy dla "messageToAll" np. "messageToAllError", nasłuchiwać na nim i jak przyjdzie error to wyświetlić snackbara
    const sendToAll = () => {
        dispatch({
            type: 'EMIT_SOCKET_EVENT',
            payload: {event: SocketEvents.EMIT_MESSAGE_TO_ALL, data: {message: message, type: type}}
        })
        setData({
            count: data.count + 1,
            rows: [
                {id: '', sendBy: currentUser, message: message, type: type, createdAt: ''},
                ...data.rows
            ]
        })
    }

    useEffect(() => {
        dispatch({type: 'SHOW_SPINNER'});
        getMessagesToAll(itemsPerPage, itemsPerPage * (page - 1))
            .then((res) => {
                setData(res)
            })
            .catch((err) => {
                const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                dispatch(setSnackBar({type: 'error', message: message, show: true}));
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch({type: 'HIDE_SPINNER'});
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

    const handleConfirmationDialogClose = () => {
        setOpenConfirmationDialog(false);
    };

    const handleConfirmationDialogConfirm = () => {
        setOpenConfirmationDialog(false);
        sendToAll();
    };

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Typography variant="h4" className="page-title">{t("APP_MENU_MESSAGES_TO_ALL")}</Typography>
            </Stack>
            <Grid container spacing={2} style={{marginTop: '15px', marginBottom: '15px'}}>
                <Grid item xs={3}>
                    <FormControl fullWidth>
                        <InputLabel>{t("APP_TYPE_TXT")}</InputLabel>
                        <Select label={t("APP_TYPE_TXT")} value={type} onChange={handleChangeType}>
                            <MenuItem value="forceLogout">{t("APP_TYPE_MESSAGE_FORCE_LOGOUT_ALL")}</MenuItem>
                            <MenuItem value="info">{t("APP_TYPE_MESSAGE_INFO")}</MenuItem>
                            <MenuItem value="warning">{t("APP_TYPE_MESSAGE_WARNING")}</MenuItem>
                            <MenuItem value="error">{t("APP_TYPE_MESSAGE_ERROR")}</MenuItem>
                            <MenuItem value="success">{t("APP_TYPE_MESSAGE_SUCCESS")}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label={t("APP_MESSAGE_TXT")}
                        variant="outlined"
                        fullWidth
                        value={message}
                        onChange={handleChangeMessage}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleSend(message, type)}
                    >
                        {t("APP_SEND_BTN_LABEL")}
                    </Button>
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("APP_TABLE_COL_ID")}</TableCell>
                            <TableCell>{t("APP_TABLE_COL_SEND_BY")}</TableCell>
                            <TableCell>{t("APP_MESSAGE_TXT")}</TableCell>
                            <TableCell>{t("APP_TABLE_COL_TYPE")}</TableCell>
                            <TableCell>{t("APP_TABLE_COL_CREATED_AT")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.rows.length > 0 ? (
                            data.rows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.sendBy.email}</TableCell>
                                    <TableCell>{row.message}</TableCell>
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell>
                                        {row.createdAt !== "" && format(new Date(row.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} style={{textAlign: 'center'}}>
                                    {t('APP_NO_DATA')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Pagination
                count={Math.ceil(data.count / itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                style={{marginTop: '15px'}}
            />
            <Dialog
                open={openConfirmationDialog}
                onClose={handleConfirmationDialogClose}
                aria-labelledby="confirmation-dialog-title"
            >
                <DialogTitle>{t("APP_ARE_YOU_SURE_YOU_WANT_TO_LOGOUT_ALL")}</DialogTitle>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleConfirmationDialogConfirm} autoFocus>
                        {t("APP_YES_BTN_LABEL")}
                    </Button>
                    <Button variant="outlined" onClick={handleConfirmationDialogClose}>
                        {t("APP_NO_BTN_LABEL")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default SendToAllView;
