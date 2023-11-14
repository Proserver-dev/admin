import React, { useState, useEffect } from 'react';
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
import { format } from 'date-fns';
import {reqGetUsers} from "../../helpers/User";
import {setSnackBar} from "../../redux/actions";
import prepareSnackBarErrorObj from "../../helpers/prepareSnackBarErrorObj";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import { RiQuestionLine, RiKeyLine } from 'react-icons/ri';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import InfoIcon from '@mui/icons-material/Info';
import PasswordIcon from '@mui/icons-material/Key';
import HistoryIcon from '@mui/icons-material/History';

const itemsPerPage = 10; // Liczba elementów na stronę

const UserListView = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = useSelector((state) => state.currentUser);
    const [page, setPage] = useState(1);
    const [data, setData] = useState({ count: 0, rows: [] });
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const pageParam = parseInt(searchParams.get('page'), 10) || 1;
        setPage(pageParam);
    }, [location.search]);

    useEffect(() => {
        dispatch({ type: 'SHOW_SPINNER' });
        reqGetUsers(itemsPerPage, itemsPerPage*(page-1))
            .then(res => {
                setData(res)
            })
            .catch(err => {
                dispatch(setSnackBar(prepareSnackBarErrorObj(err)))
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch({ type: 'HIDE_SPINNER' });
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
                    Lista użytkowników
                </Typography>
                <Button variant="contained" onClick={() => {}}>
                    Dodaj nowego użytkownika
                </Button>
            </Stack>
            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                value=""
                onChange={(e) => {}}
                sx={{marginBottom: 2}}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>isActivated</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>Name Lastname</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.rows.map((user) => (
                            <TableRow key={user.id} style={currentUser.id === user.id ? {backgroundColor: '#edf5fd'} : {}}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>
                                    {user.isActivated ? (
                                        <FaCheckCircle style={{ color: 'green' }} />
                                    ) : (
                                        <FaTimesCircle style={{ color: 'red' }} />
                                    )}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.userName}</TableCell>
                                <TableCell>{user.nameLastname}</TableCell>
                                <TableCell>{user.role?.short}</TableCell>
                                <TableCell>
                                    <Tooltip title="Zobacz więcej">
                                        <InfoIcon
                                            color="primary"
                                            onClick={() => handleViewDetails(user)}
                                            style={{ marginRight: '10px', cursor: 'pointer' }}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Zmień hasło">
                                        <PasswordIcon
                                            color="warning"
                                            onClick={() => {}}
                                            style={{ marginRight: '10px', cursor: 'pointer' }}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Pokaż Auth History">
                                        <HistoryIcon
                                            color="primary"
                                            onClick={() => {}}
                                            style={{ marginRight: '10px', cursor: 'pointer' }}
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
                style={{ marginTop: '15px' }}
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
                    <Typography variant="h6">User Details</Typography>
                    {selectedUser && (
                        <div>
                            <p>ID: {selectedUser.id}</p>
                            <p>Email: {selectedUser.email}</p>
                            <p>User Name: {selectedUser.userName}</p>
                            <p>Name Lastname: {selectedUser.nameLastname}</p>
                            <p>Role name: {selectedUser.role?.name}</p>
                            <p>Role short: {selectedUser.role?.short}</p>
                            <p>Updated At: {format(new Date(selectedUser.updatedAt), 'yyyy-MM-dd HH:mm:ss')}</p>
                            <p>Created At: {format(new Date(selectedUser.createdAt), 'yyyy-MM-dd HH:mm:ss')}</p>
                        </div>
                    )}
                </Box>
            </Modal>
        </Container>
    );
};

export default UserListView;
