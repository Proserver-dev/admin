import React, {useState, useEffect} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Pagination,
    Typography,
    Modal,
    Box, Container, Stack, Tooltip, TextField,
} from '@mui/material';
import {format} from 'date-fns';
import {reqGetUsers} from "../../helpers/User";
import {setSnackBar} from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {FaCheckCircle, FaTimesCircle} from 'react-icons/fa';
import InfoIcon from '@mui/icons-material/Info';
import PasswordIcon from '@mui/icons-material/Key';
import HistoryIcon from '@mui/icons-material/History';
import {useTranslation} from "react-i18next";
import Label from "../../components/Label";

const itemsPerPage = 10; // Liczba elementów na stronę

const UserListView = () => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = useSelector((state) => state.currentUser);
    const [page, setPage] = useState(1);
    const [data, setData] = useState({count: 0, rows: []});
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pageParam = parseInt(searchParams.get('page'), 10) || 1;
        setPage(pageParam);
    }, [location.search]);

    useEffect(() => {
        dispatch({type: 'SHOW_SPINNER'});
        reqGetUsers(itemsPerPage, itemsPerPage * (page - 1))
            .then(res => {
                setData(res)
            })
            .catch(err => {
                const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                dispatch(setSnackBar({type: 'error', message: message, show: true}));
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch({type: 'HIDE_SPINNER'});
                }, 250);
            })
    }, [page]);

    const handlePageChange = (event, value) => {
        navigate(`?page=${value}`)
    };

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const startItem = (page - 1) * itemsPerPage;
    const endItem = page * itemsPerPage;

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Typography variant="h4" gutterBottom className="page-title">
                    {t("APP_MENU_USER_LIST")}
                </Typography>
                <Button variant="contained" onClick={() => {
                }}>
                    {t("APP_ADD_NEW_USER_BTN_LABEL")}
                </Button>
            </Stack>
            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                value=""
                onChange={(e) => {
                }}
                sx={{marginBottom: 2}}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("APP_TABLE_COL_ID")}</TableCell>
                            <TableCell>{t("APP_TABLE_COL_IS_ACTIVATED")}</TableCell>
                            <TableCell>{t("APP_TABLE_COL_IS_LOGGED_IN")}</TableCell>
                            <TableCell>{t("APP_TABLE_COL_EMAIL")}</TableCell>
                            <TableCell>{t("APP_TABLE_COL_USER_NAME")}</TableCell>
                            <TableCell>{t("APP_TABLE_COL_NAME_LASTNAME")}</TableCell>
                            <TableCell>{t("APP_TABLE_COL_ROLE")}</TableCell>
                            <TableCell>{t("APP_TABLE_COL_ACTIONS")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.rows.map((user) => (
                            <TableRow key={user.id}
                                      style={currentUser.id === user.id ? {backgroundColor: '#edf5fd'} : {}}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>
                                    {user.isActivated ? (
                                        <FaCheckCircle style={{color: 'green'}}/>
                                    ) : (
                                        <FaTimesCircle style={{color: 'red'}}/>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {user.isLoggedIn ? (
                                        <FaCheckCircle style={{color: 'green'}}/>
                                    ) : (
                                        <FaTimesCircle style={{color: 'red'}}/>
                                    )}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.userName}</TableCell>
                                <TableCell>{user.nameLastname}</TableCell>
                                <TableCell>
                                    {user.role?.short === "admin" ? (
                                        <Label variant="ghost" color="error">
                                            {user.role?.short}
                                        </Label>
                                    ) : user.role?.short === "user" ? (
                                        <Label variant="ghost" color="primary">
                                            {user.role?.short}
                                        </Label>
                                    ) : user.role?.short === "blocked" ? (
                                        <Label variant="ghost" color="secondary">
                                            {user.role?.short}
                                        </Label>
                                    ) : (
                                        <>
                                            {user.role?.short}
                                        </>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Tooltip title={t("APP_SHOW_MORE_BTN_TOOLTIP")}>
                                        <InfoIcon
                                            color="primary"
                                            onClick={() => handleViewDetails(user)}
                                            style={{marginRight: '10px', cursor: 'pointer'}}
                                        />
                                    </Tooltip>
                                    <Tooltip title={t("APP_CHANGE_PASSWORD_BTN_TOOLTIP")}>
                                        <PasswordIcon
                                            color="warning"
                                            onClick={() => {
                                            }}
                                            style={{marginRight: '10px', cursor: 'pointer'}}
                                        />
                                    </Tooltip>
                                    <Tooltip title={t("APP_SHOW_AUTH_HISTORY_BTN_TOOLTIP")}>
                                        <HistoryIcon
                                            color="primary"
                                            onClick={() => {
                                            }}
                                            style={{marginRight: '10px', cursor: 'pointer'}}
                                        />
                                    </Tooltip>
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
                style={{marginTop: '15px'}}
            />

            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6">{t("APP_TITLE_USER_DETAILS")}</Typography>
                    {selectedUser && (
                        <div>
                            <p>{t("APP_TABLE_COL_ID")}: {selectedUser.id}</p>
                            <p>{t("APP_TABLE_COL_EMAIL")}: {selectedUser.email}</p>
                            <p>{t("APP_TABLE_COL_USER_NAME")}: {selectedUser.userName}</p>
                            <p>{t("APP_TABLE_COL_NAME_LASTNAME")}: {selectedUser.nameLastname}</p>
                            <p>{t("APP_TABLE_COL_ROLE")}: {selectedUser.role?.name} ({selectedUser.role?.short})</p>
                            <p>{t("APP_TABLE_COL_UPDATED_AT")}: {format(new Date(selectedUser.updatedAt), 'yyyy-MM-dd HH:mm:ss')}</p>
                            <p>{t("APP_TABLE_COL_CREATED_AT")}: {format(new Date(selectedUser.createdAt), 'yyyy-MM-dd HH:mm:ss')}</p>
                        </div>
                    )}
                </Box>
            </Modal>
        </Container>
    );
};

export default UserListView;
