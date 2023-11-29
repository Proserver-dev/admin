import React, {useEffect, useState} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
    Typography,
    Container,
    Stack,
} from '@mui/material';
import {format} from 'date-fns';
import {useLocation, useNavigate} from "react-router-dom";
import {setSnackBar} from "../../redux/actions";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {getSendEmailHistory} from "../../helpers/API/SendEmailHistory";

const itemsPerPage = 10; // Liczba elementów na stronę

const SendEmailHistoryView = () => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState({count: 0, rows: []});
    const [page, setPage] = useState(1);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pageParam = parseInt(searchParams.get('page'), 10) || 1;
        setPage(pageParam);
    }, [location.search]);

    useEffect(() => {
        dispatch({type: 'SHOW_SPINNER'});
        getSendEmailHistory(itemsPerPage, itemsPerPage * (page - 1))
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

    const handlePageChange = (event, value) => {
        navigate(`?page=${value}`)
    };

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Typography variant="h4" className="page-title">{t("APP_MENU_SEND_EMAIL_HISTORY")}</Typography>
            </Stack>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Is Read</TableCell>
                            <TableCell>From</TableCell>
                            <TableCell>To</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>HTML</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Response</TableCell>
                            <TableCell>Created At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.rows.length > 0 ? (
                            data.rows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.isRead.toString()}</TableCell>
                                    <TableCell>{row.from}</TableCell>
                                    <TableCell>{row.to}</TableCell>
                                    <TableCell>{row.subject}</TableCell>
                                    <TableCell>{row.html}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>{row.errorLog.toString()}</TableCell>
                                    <TableCell>
                                        {row.createdAt !== '' &&
                                            format(new Date(row.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} style={{textAlign: 'center'}}>
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
        </Container>
    );
};

export default SendEmailHistoryView;
