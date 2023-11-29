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
    Box, Container, Stack, Tooltip, TextField, Menu, IconButton,
} from '@mui/material';
import {format} from 'date-fns';
import {reqGetUsers, reqPostChangeUserRole} from "../../helpers/User";
import {setSnackBar} from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {FaCheckCircle, FaTimesCircle} from 'react-icons/fa';
import InfoIcon from '@mui/icons-material/Info';
import PasswordIcon from '@mui/icons-material/Key';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import {useTranslation} from "react-i18next";
import Label from "../../components/Label";
import MenuItem from '@mui/material/MenuItem';
import {reqGetRoles} from "../../helpers/Role";

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
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [contextMenuAnchor, setContextMenuAnchor] = useState(null);
    const [selectedUserForMenu, setSelectedUserForMenu] = useState(null);
    const [roles, setRoles] = useState([{}]);

    useEffect(() => {
        // Pobranie listy ról.
        reqGetRoles()
            .then(res => {
                setRoles(res);
            })
            .catch(err => {
                setRoles([
                    {id: 1, name: 'Admin', short: 'admin'},
                    {id: 2, name: 'User', short: 'user'},
                    {id: 3, name: 'Blocked', short: 'blocked'},
                ])
            })
    }, [])

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pageParam = parseInt(searchParams.get('page'), 10) || 1;
        setPage(pageParam);
    }, [location.search]);

    useEffect(() => {
        getUsers()
    }, [page]);

    const getUsers = () => {
        dispatch({type: 'SHOW_SPINNER'});
        reqGetUsers(itemsPerPage, itemsPerPage * (page - 1), searchTerm)
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
    }

    const handleEnterKeyPress = (event) => {
        if (event.key === 'Enter') {
            getUsers();
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        getUsers()
    };

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

    const handleRoleChange = (role) => {
        reqPostChangeUserRole(selectedUserForMenu.id, role?.id)
            .then(res => {
                dispatch(setSnackBar({type: 'success', message: t(res.success), show: true}));
                getUsers();
            })
            .catch(err => {
                const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                dispatch(setSnackBar({type: 'error', message: message, show: true}));
            })
            .finally(() => {
                handleContextMenuClose(); // Zamknięcie menu po wyborze roli.
            })
    };

    const handleContextMenuClick = (event, user) => {
        if (currentUser.id === user.id) return;

        setContextMenuAnchor(event.currentTarget);
        setSelectedUserForMenu(user);
    };

    const handleContextMenuClose = () => {
        setContextMenuAnchor(null);
        setSelectedUserForMenu(null);
    };

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
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5} gap={2}
                   onSubmit={handleSearchSubmit}>
                <TextField
                    label={t("APP_SEARCH_TXT")}
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={handleEnterKeyPress}
                />
                <Button type="submit" variant="contained" startIcon={<SearchIcon/>} onClick={handleSearchSubmit}/>
            </Stack>
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
                        {data.rows.length > 0 ? (
                            data.rows.map((user) => (
                                <TableRow key={user.id}
                                          style={currentUser.id === user.id ? {backgroundColor: '#edf5fd'} : {}}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>
                                        {user.isActivated ? (
                                            <Tooltip title="Dezaktywuj">
                                                <IconButton onClick={() => {
                                                }} disabled={currentUser.id === user.id}>
                                                    <FaCheckCircle style={{color: 'green', fontSize: 14}}/>
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="Aktywuj">
                                                <IconButton onClick={() => {
                                                }} disabled={currentUser.id === user.id}>
                                                    <FaTimesCircle style={{color: 'red', fontSize: 14}}/>
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {user.isLoggedIn ? (
                                            <Tooltip title="Wyloguj">
                                                <IconButton onClick={() => {
                                                }} disabled={currentUser.id === user.id}>
                                                    <FaCheckCircle style={{color: 'green', fontSize: 14}}/>
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <IconButton onClick={() => {
                                            }} disabled={true}>
                                                <FaTimesCircle style={{color: 'red', fontSize: 14}}/>
                                            </IconButton>
                                        )}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.userName}</TableCell>
                                    <TableCell>{user.nameLastname}</TableCell>
                                    <TableCell>
                                        <div onClick={(event) => handleContextMenuClick(event, user)}>
                                            {user.role?.short === "admin" ? (
                                                <Label variant="ghost" color="error" style={{ cursor: 'pointer' }}>
                                                    {user.role?.short}
                                                </Label>
                                            ) : user.role?.short === "user" ? (
                                                <Label variant="ghost" color="primary" style={{ cursor: 'pointer' }}>
                                                    {user.role?.short}
                                                </Label>
                                            ) : user.role?.short === "blocked" ? (
                                                <Label variant="ghost" color="secondary" style={{ cursor: 'pointer' }}>
                                                    {user.role?.short}
                                                </Label>
                                            ) : (
                                                <span style={{ cursor: 'pointer' }}>
                                                    {user.role?.short}
                                                </span>
                                            )}
                                        </div>
                                        <Menu anchorEl={contextMenuAnchor} open={Boolean(contextMenuAnchor)}
                                              onClose={handleContextMenuClose}>
                                            {roles.map((roleItem) => (
                                                <MenuItem
                                                    key={roleItem?.id}
                                                    onClick={() => handleRoleChange(roleItem)}
                                                    style={{
                                                        fontWeight: selectedUserForMenu?.role?.short === roleItem?.short ? 'bold' : 'normal', // Zaznaczenie
                                                        pointerEvents: selectedUserForMenu?.role?.short === roleItem?.short ? 'none' : 'auto', // Blokowanie interakcji
                                                        color: selectedUserForMenu?.role?.short === roleItem?.short ? '#aaa' : 'inherit', // Kolor dla zablokowanego elementu
                                                    }}
                                                >
                                                    {roleItem?.short}
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={t("APP_SHOW_MORE_BTN_TOOLTIP")}>
                                            <IconButton onClick={() => handleViewDetails(user)}>
                                                <InfoIcon color="primary"/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t("APP_CHANGE_PASSWORD_BTN_TOOLTIP")}>
                                            <IconButton onClick={() => {
                                            }}>
                                                <PasswordIcon color="warning"/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t("APP_SHOW_AUTH_HISTORY_BTN_TOOLTIP")}>
                                            <IconButton onClick={() => {
                                            }}>
                                                <HistoryIcon color="primary"/>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} style={{textAlign: 'center'}}>
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
