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
import {reqAddRole, reqGetRoles} from "../../helpers/Role";

const RolesView = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({name: ''});

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

    useEffect(() => {
        dispatch({type: 'SHOW_SPINNER'});
        reqGetRoles()
            .then(res => {
                setData(res)
                console.log(res)
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

    // TODO: tutaj dorobić aktualizowanie i kasowanie ról

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
                                                <EditIcon color="primary" style={{marginRight: '10px'}}/>
                                            </Tooltip>
                                            <Tooltip title="Usuń">
                                                <DeleteIcon color="error"/>
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
        </Container>
    );
};

export default RolesView;