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
    Box, Container, Stack, Tooltip, TextField, Menu, IconButton, MenuList, ListItemText, ListItemIcon, InputAdornment,
} from '@mui/material';
import {format} from 'date-fns';
import {reqGetUsers, reqPostChangeUserRole, reqPutChangeUserIsActivated} from "../../helpers/API/User";
import {setSnackBar} from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import {FaCheckCircle, FaTimesCircle} from 'react-icons/fa';
import InfoIcon from '@mui/icons-material/Info';
import PasswordIcon from '@mui/icons-material/Key';
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/Chat';
import UploadIcon from '@mui/icons-material/Upload';
import SocketIcon from '@mui/icons-material/NetworkCheck';
import {useTranslation} from "react-i18next";
import Label from "../../components/Label";
import MenuItem from '@mui/material/MenuItem';
import {reqGetRoles} from "../../helpers/API/Role";
import RoutesPath from "../../constants/RoutesPath";
import ModalUserInfo from "./modals/ModalUserInfo";
import ModalChangePasswordUser from "./modals/ModalChangePasswordUser";
import ModalCreateUser from "./modals/ModalCreateUser";
import ModalDeleteUser from "./modals/ModalDeleteUser";
import ModalLogoutUser from "./modals/ModalLogoutUser";
import SocketEvents from "../../constants/SocketEvents";
import ModalSendServerMessage from "./modals/ModalSendServerMessage";

const itemsPerPage = 10; // Liczba elementów na stronę

const UserListView = () => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = useSelector((state) => state.currentUser);
    const socket = useSelector((state) => state.socket);
    const [page, setPage] = useState(1);
    const [data, setData] = useState({count: 0, rows: []});
    const [selectedUser, setSelectedUser] = useState(null);

    const [isModalInfoOpen, setModalInfoOpen] = useState(false);
    const [isModalChangePasswordOpen, setModalChangePasswordOpen] = useState(false);
    const [isModalCreateUserOpen, setModalCreateUserOpen] = useState(false);
    const [isModalDeleteUserOpen, setModalDeleteUserOpen] = useState(false);
    const [isModalLogoutUserOpen, setModalLogoutUserOpen] = useState(false);
    const [isModalSendServerMessageOpen, setModalSendServerMessageOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [contextMenuRolesAnchor, setContextMenuRolesAnchor] = useState(null);
    const [contextMenuMoreAnchor, setContextMenuMoreAnchor] = useState(null);
    const [roles, setRoles] = useState([{}]);

    useEffect(() => {
        if (socket) {
            socket.on(SocketEvents.LISTEN_CONNECTION_ACTION, (dataSocket) => {
                const userId = dataSocket?.userId;
                setData((prevData) => {
                    if(dataSocket.action === "connected") {
                        const updatedRows = prevData.rows.map((row) =>
                            row.id === userId ? {
                                ...row,
                                isLoggedIn: true,
                                socketId: dataSocket.socketId
                            } : row
                        );
                        return { ...prevData, rows: updatedRows };
                    }

                    if(dataSocket.action === "disconnected") {
                        const updatedRows = prevData.rows.map((row) =>
                            row.id === userId ? {
                                ...row,
                                isLoggedIn: false, // TODO: tutaj będzie musiało być (dataSocket.isLoggedIn || false), ale na backendzie trzeba będzie zrobić setTimeout, bo w przeciwnym razie prawie zawsze będzie tutaj true, bo user jeszcze nie zdąży się wylogować
                                socketId: null
                            } : row
                        );
                        return { ...prevData, rows: updatedRows };
                    }
                });
            });

            return () => {
                if (socket) {
                    socket.off(SocketEvents.LISTEN_CONNECTION_ACTION);
                }
            };
        }
    }, [socket, dispatch])

    useEffect(() => {
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

    const handleRoleChange = (role) => {
        reqPostChangeUserRole(selectedUser.id, role?.id)
            .then(res => {
                dispatch(setSnackBar({type: 'success', message: t(res.success), show: true}));
                getUsers();
            })
            .catch(err => {
                const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                dispatch(setSnackBar({type: 'error', message: message, show: true}));
            })
            .finally(() => {
                handleContextMenuRolesClose(); // Zamknięcie menu po wyborze roli.
            })
    };

    const handleContextMenuRolesClick = (event, user) => {
        if (currentUser.id === user.id) return;

        setContextMenuRolesAnchor(event.currentTarget);
        setSelectedUser(user);
    };

    const handleContextMenuRolesClose = () => {
        setContextMenuRolesAnchor(null);
        setTimeout(() => {
            setSelectedUser(null);
        }, 250);
    };

    const handleContextMenuMoreClick = (event, user) => {
        setContextMenuMoreAnchor(event.currentTarget);
        setSelectedUser(user);
    }

    const handleContextMenuMoreClose = () => {
        setContextMenuMoreAnchor(null);
        setTimeout(() => {
            setSelectedUser(null);
        }, 250);
    };

    const handleChangeUserActivation = (userId) => {
        reqPutChangeUserIsActivated(userId)
            .then(res => {
                dispatch(setSnackBar({type: 'success', message: t(res.success), show: true}));
                getUsers()
            })
            .catch(err => {
                const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                dispatch(setSnackBar({type: 'error', message: message, show: true}));
            })
    }

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Typography variant="h4" gutterBottom className="page-title">
                    {t("APP_MENU_USER_LIST")}
                </Typography>
                <Button variant="contained" onClick={() => {
                    setModalCreateUserOpen(true)
                }}>
                    {t("APP_ADD_NEW_USER_BTN_LABEL")}
                </Button>
            </Stack>
            <TextField
                label={t("APP_SEARCH_TXT")}
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleEnterKeyPress}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleSearchSubmit}>
                                <SearchIcon/>
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                style={{ marginBottom: '15px' }}
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
                        {data?.rows.length > 0 ? (
                            data.rows.map((user) => (
                                <TableRow key={user.id}
                                          style={currentUser.id === user.id ? {backgroundColor: '#edf5fd'} : {}}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>
                                        {user.isActivated ? (
                                            <Tooltip title="Dezaktywuj">
                                                <IconButton onClick={() => {
                                                    handleChangeUserActivation(user.id)
                                                }} disabled={currentUser.id === user.id}>
                                                    <FaCheckCircle style={{color: 'green', fontSize: 14}}/>
                                                </IconButton>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title="Aktywuj">
                                                <IconButton onClick={() => {
                                                    handleChangeUserActivation(user.id)
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
                                                    setSelectedUser(user);
                                                    setModalLogoutUserOpen(true)
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
                                        {user.socketId && (
                                            <Tooltip title={"Socket ID: "+user.socketId}>
                                                <SocketIcon style={{color: 'orange', fontSize: 14}} alt="socketIo"/>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.userName}</TableCell>
                                    <TableCell>{user.nameLastname}</TableCell>
                                    <TableCell>
                                        <div onClick={(event) => handleContextMenuRolesClick(event, user)}>
                                            {user.role?.short === "admin" ? (
                                                <Label variant="ghost" color="error"
                                                       style={currentUser.id !== user.id ? {cursor: 'pointer'} : {}}>
                                                    {user.role?.short}
                                                </Label>
                                            ) : user.role?.short === "user" ? (
                                                <Label variant="ghost" color="primary" style={{cursor: 'pointer'}}>
                                                    {user.role?.short}
                                                </Label>
                                            ) : user.role?.short === "blocked" ? (
                                                <Label variant="ghost" color="secondary" style={{cursor: 'pointer'}}>
                                                    {user.role?.short}
                                                </Label>
                                            ) : (
                                                <span style={{cursor: 'pointer'}}>
                                                    {user.role?.short}
                                                </span>
                                            )}
                                        </div>
                                        <Menu
                                            anchorEl={contextMenuRolesAnchor}
                                            open={Boolean(contextMenuRolesAnchor)}
                                            onClose={handleContextMenuRolesClose}
                                            PaperProps={{
                                                style: {
                                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                                },
                                            }}
                                        >
                                            {roles.map((roleItem) => (
                                                <MenuItem
                                                    key={roleItem?.id}
                                                    onClick={() => handleRoleChange(roleItem)}
                                                    style={{
                                                        fontWeight: selectedUser?.role?.short === roleItem?.short ? 'normal' : 'normal', // Zaznaczenie
                                                        pointerEvents: selectedUser?.role?.short === roleItem?.short ? 'none' : 'auto', // Blokowanie interakcji
                                                        color: selectedUser?.role?.short === roleItem?.short ? '#aaa' : 'inherit', // Kolor dla zablokowanego elementu
                                                    }}
                                                >
                                                    {roleItem?.short}
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={t("APP_SHOW_MORE_BTN_TOOLTIP")}>
                                            <IconButton onClick={() => {
                                                setSelectedUser(user);
                                                setModalInfoOpen(true);
                                            }}>
                                                <InfoIcon color="primary"/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t("APP_CHANGE_PASSWORD_BTN_TOOLTIP")}>
                                            <IconButton onClick={() => {
                                                setSelectedUser(user);
                                                setModalChangePasswordOpen(true)
                                            }}>
                                                <PasswordIcon color="warning"/>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t("APP_SHOW_AUTH_HISTORY_BTN_TOOLTIP")}>
                                            <IconButton onClick={() => {
                                                navigate(`${RoutesPath.AUTH_HISTORY}?userId=${user.id}`)
                                            }}>
                                                <HistoryIcon color="primary"/>
                                            </IconButton>
                                        </Tooltip>
                                        <IconButton onClick={(event) => handleContextMenuMoreClick(event, user)}>
                                            <MoreVertIcon color="primary"/>
                                        </IconButton>
                                        <Menu
                                            anchorEl={contextMenuMoreAnchor}
                                            open={Boolean(contextMenuMoreAnchor)}
                                            onClose={handleContextMenuMoreClose}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            PaperProps={{
                                                style: {
                                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                                                },
                                            }}
                                        >
                                            <MenuItem
                                                key="option1"
                                                onClick={() => {
                                                    setContextMenuMoreAnchor(null);
                                                    setModalSendServerMessageOpen(true)
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <UploadIcon fontSize="small"/>
                                                </ListItemIcon>
                                                <ListItemText>Wyślij wiadomość serwerową</ListItemText>
                                            </MenuItem>
                                            {currentUser.id !== selectedUser?.id && (
                                                <>
                                                    <MenuItem
                                                        key="option2"
                                                        onClick={() => {
                                                            setContextMenuMoreAnchor(null);
                                                            navigate(`${RoutesPath.CHAT}/${selectedUser?.id}`)
                                                        }}
                                                    >
                                                        <ListItemIcon>
                                                            <ChatIcon fontSize="small"/>
                                                        </ListItemIcon>
                                                        <ListItemText>Przejdź do czatu</ListItemText>
                                                    </MenuItem>
                                                    <MenuItem
                                                        key="option3"
                                                        onClick={() => {
                                                            setContextMenuMoreAnchor(null);
                                                            setModalDeleteUserOpen(true);
                                                        }}
                                                    >
                                                        <ListItemIcon>
                                                            <DeleteIcon fontSize="small"/>
                                                        </ListItemIcon>
                                                        <ListItemText>Usuń użytkownika</ListItemText>
                                                    </MenuItem>
                                                </>
                                            )}
                                        </Menu>
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

            <ModalUserInfo open={isModalInfoOpen} setModalOpen={setModalInfoOpen} selectedUser={selectedUser}/>
            <ModalChangePasswordUser open={isModalChangePasswordOpen} setModalOpen={setModalChangePasswordOpen}
                                     selectedUser={selectedUser}/>
            <ModalCreateUser open={isModalCreateUserOpen} setModalOpen={setModalCreateUserOpen} getUsers={getUsers}/>
            <ModalDeleteUser open={isModalDeleteUserOpen} setModalOpen={setModalDeleteUserOpen}
                             selectedUser={selectedUser} getUsers={getUsers}/>
            <ModalLogoutUser open={isModalLogoutUserOpen} setModalOpen={setModalLogoutUserOpen} selectedUser={selectedUser} getUsers={getUsers}/>
            <ModalSendServerMessage open={isModalSendServerMessageOpen} setModalOpen={setModalSendServerMessageOpen}
                                    selectedUser={selectedUser} />

        </Container>
    );
};

export default UserListView;
