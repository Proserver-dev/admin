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
    Stack, Link, Skeleton, InputLabel, Select, MenuItem, FormControl,
} from '@mui/material';
import {format} from 'date-fns';
import {useLocation, useNavigate} from "react-router-dom";
import {setSnackBar} from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import RoutesPath from "../../constants/RoutesPath";
import {reqGetAuthHistory, reqGetOneUser} from "../../helpers/API/User";
import ChevronLeft from '@mui/icons-material/ChevronLeft';

const itemsPerPage = 10; // Liczba elementów na stronę

const AuthHistoryView = () => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState({count: 0, rows: []});
    const [page, setPage] = useState(1);
    const [user, setUser] = useState({});
    const [type, setType] = useState('');

    useEffect(() => {
        handleGetUserById()
    }, [])

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pageParam = parseInt(searchParams.get('page'), 10) || 1;
        handleGetAuthHistory(pageParam)
    }, [type])

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pageParam = parseInt(searchParams.get('page'), 10) || 1;
        setPage(pageParam);
        handleGetUserById()
        handleGetAuthHistory(pageParam)
    }, [location.search]);

    const handleGetAuthHistory = (page) => {
        const searchParams = new URLSearchParams(location.search);
        const userIdParam = parseInt(searchParams.get('userId'), 10) || 0;

        if(userIdParam === 0) {
            handleGoBack()
        }

        dispatch({type: 'SHOW_SPINNER'});
        reqGetAuthHistory(userIdParam, itemsPerPage, itemsPerPage * (page - 1), type)
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
    }

    const handleGetUserById = () => {
        const searchParams = new URLSearchParams(location.search);
        const userIdParam = parseInt(searchParams.get('userId'), 10) || 0;

        if(userIdParam === 0) {
            handleGoBack()
        }

        reqGetOneUser(userIdParam)
            .then(res => {
                setUser(res)
            })
            .catch(err => {
                const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                dispatch(setSnackBar({type: 'error', message: message, show: true}));
                handleGoBack()
            })
    }

    const handlePageChange = (event, value) => {
        const searchParams = new URLSearchParams(location.search);
        const userIdParam = parseInt(searchParams.get('userId'), 10) || 0;

        if(userIdParam === 0) {
            handleGoBack()
        }

        navigate(`?userId=${userIdParam}&page=${value}`)
    };

    const handleGoBack = () => {
        navigate(RoutesPath.USER_LIST);
    };

    const handleChangeType = (event) => {
        const searchParams = new URLSearchParams(location.search);
        const userIdParam = parseInt(searchParams.get('userId'), 10) || 0;

        if(userIdParam === 0) {
            handleGoBack()
        }

        setType(event.target.value);
        navigate(`?userId=${userIdParam}&page=1`)
    };

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Typography variant="h4" className="page-title">{t("APP_MENU_AUTH_HISTORY")}</Typography>
                {user.id ? (
                    <Typography variant="caption" paragraph={true} style={{marginBottom: 0}}>#{user.id} {user.email}</Typography>
                ) : (
                    <Skeleton animation="wave" height={10}/>
                )}
            </Stack>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Link onClick={handleGoBack} component="button" variant="body2" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <ChevronLeft/> Wróć do listy użytkowników
                </Link>
                <FormControl style={{ maxWidth: '300px', width: '100%' }}>
                    <InputLabel>{t("APP_TYPE_TXT")}</InputLabel>
                    <Select label={t("APP_TYPE_TXT")} value={type} onChange={handleChangeType}>
                        <MenuItem value="">Wszystkie</MenuItem>
                        <MenuItem value="register">Rejestracja</MenuItem>
                        <MenuItem value="login">Logowanie</MenuItem>
                        <MenuItem value="logout">Wylogowanie</MenuItem>
                        <MenuItem value="activate">Aktywacja</MenuItem>
                        <MenuItem value="resend">Ponowna wysyłka</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Content</TableCell>
                            <TableCell>Created At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.rows.length > 0 ? (
                            data.rows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell>{row.content}</TableCell>
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

export default AuthHistoryView;
