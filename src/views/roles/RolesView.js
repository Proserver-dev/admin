import React, {useEffect, useState} from 'react';
import {
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Paper,
    Button,
    Modal,
    TextField,
    Stack,
    Typography,
    Container,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import prepareSnackBarErrorObj from "../../helpers/prepareSnackBarErrorObj";
import {setSnackBar} from "../../redux/actions";
import {useDispatch} from "react-redux";
import {reqAddRole, reqDeleteRole, reqGetRoles, reqUpdateRole} from "../../helpers/Role";

const RolesView = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({name: ''});
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState({ id: '', name: '', short: '' });

    useEffect(() => {
        dispatch({type: 'SHOW_SPINNER'});
        reqGetRoles()
            .then(res => {
                setData(res)
            })
            .catch(err => {
                dispatch(setSnackBar(prepareSnackBarErrorObj(err)))
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch({type: 'HIDE_SPINNER'});
                }, 250);
            })
    }, [])

    const handleAddItem = () => {
        dispatch({type: 'SHOW_SPINNER'});
        reqAddRole(newItem)
            .then(res => {
                setNewItem({name: ''});
                setData([...data, res.role]);
                setIsModalOpen(false);
                dispatch(setSnackBar({type: 'success', message: 'Pomyślnie utworzono nową rolę', show: true}))
            })
            .catch(err => {
                dispatch(setSnackBar(prepareSnackBarErrorObj(err)))
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch({type: 'HIDE_SPINNER'});
                }, 250);
            })
    };

    const handleEdit = (role) => {
        setSelectedRole(role);
        setIsEditModalOpen(true);
    };

    const handleUpdateItem = () => {
        dispatch({ type: 'SHOW_SPINNER' });
        reqUpdateRole(selectedRole.id, selectedRole)
            .then((res) => {
                setIsEditModalOpen(false);
                setData(data.map(item => (item.id === selectedRole.id ? { ...res.role } : item)));
                dispatch(setSnackBar({ type: 'success', message: 'Pomyślnie zaktualizowano rolę', show: true }));
            })
            .catch(err => {
                dispatch(setSnackBar(prepareSnackBarErrorObj(err)));
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch({ type: 'HIDE_SPINNER' });
                }, 250);
            });
    };

    const handleDelete = (role) => {
        setSelectedRole(role);
        setIsDeleteConfirmationOpen(true);
    };

    const handleConfirmDelete = () => {
        dispatch({ type: 'SHOW_SPINNER' });
        reqDeleteRole(selectedRole.id)
            .then(() => {
                setIsDeleteConfirmationOpen(false);
                setData(data.filter(item => item.id !== selectedRole.id));
                dispatch(setSnackBar({ type: 'success', message: 'Pomyślnie usunięto rolę', show: true }));
            })
            .catch(err => {
                dispatch(setSnackBar(prepareSnackBarErrorObj(err)));
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch({ type: 'HIDE_SPINNER' });
                }, 250);
            });
    };

    const handleCancelDelete = () => {
        setIsDeleteConfirmationOpen(false);
    };


    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Typography variant="h4" gutterBottom className="page-title">
                    Role użytkowników
                </Typography>
                <Button variant="contained" onClick={() => setIsModalOpen(true)}>
                    Dodaj nową pozycję
                </Button>
            </Stack>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Short</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.short}</TableCell>
                                <TableCell>
                                    {item.short !== 'admin' && item.short !== 'user' && item.short !== 'blocked' && (
                                        <>
                                            <Tooltip title="Edytuj">
                                                <EditIcon
                                                    color="primary"
                                                    onClick={() => handleEdit(item)}
                                                    style={{marginRight: '10px'}}
                                                />
                                            </Tooltip>
                                            <Tooltip title="Usuń">
                                                <DeleteIcon
                                                    color="error"
                                                    onClick={() => handleDelete(item)}
                                                />
                                            </Tooltip>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}
                   style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Container style={{background: 'white', padding: '20px', borderRadius: '4px', maxWidth: '300px'}}>
                    <Stack direction="column" spacing={2}>
                        <Typography variant="h6" gutterBottom>
                            Dodaj nową rolę
                        </Typography>
                        <TextField
                            label="Name"
                            value={newItem.name}
                            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                        />
                        <Button variant="contained" color="primary" onClick={handleAddItem}>
                            Dodaj
                        </Button>
                    </Stack>
                </Container>
            </Modal>

            <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}
                   style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Container style={{ background: 'white', padding: '20px', borderRadius: '4px', maxWidth: '300px' }}>
                    <Stack direction="column" spacing={2}>
                        <Typography variant="h6" gutterBottom>
                            Edytuj rolę
                        </Typography>
                        <TextField
                            label="Name"
                            value={selectedRole.name}
                            onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                        />
                        <Button variant="contained" color="primary" onClick={handleUpdateItem}>
                            Zapisz
                        </Button>
                    </Stack>
                </Container>
            </Modal>

            <Modal open={isDeleteConfirmationOpen} onClose={handleCancelDelete}
                   style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Container style={{ background: 'white', padding: '20px', borderRadius: '4px', maxWidth: '300px' }}>
                    <Stack direction="column" spacing={2}>
                        <Typography variant="h6" gutterBottom>
                            Czy na pewno chcesz usunąć?
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                                Tak
                            </Button>
                            <Button variant="outlined" onClick={handleCancelDelete}>
                                Nie
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Modal>
        </Container>
    );
};

export default RolesView;