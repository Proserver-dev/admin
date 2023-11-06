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
import {addRole, getRoles} from "../../helpers/Role";
import {getMe} from "../../helpers/User";
import ApiResults from "../../constants/ApiResults";
import {refreshLoginToken} from "../../helpers/Auth";
import handleTokenExpiration from "../../helpers/handleTokenExpiration";
import prepareSnackBarErrorObj from "../../helpers/prepareSnackBarErrorObj";

const RolesView = ({setShowSpinner, setSnackBar, setCurrentUser, setLoginToken}) => {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({name: ''});

    const handleAddItem = () => {
        const addRoleData = async () => {
            await setShowSpinner(true)
            try {
                const res = await addRole(newItem)
                setNewItem({name: ''});
                setData([...data, res.role]);
                setIsModalOpen(false);
                setSnackBar({type: 'success', message: 'Pomyślnie utworzono nową rolę', show: true})
            } catch (error) {
                if (error.code === ApiResults.ERR_TOKEN_EXPIRED.code) {
                    try {
                        const refreshResponse = await refreshLoginToken();
                        // setLoginToken(refreshResponse.token);

                        const rolesAfterRefresh = await addRole(newItem)
                        setNewItem({name: ''});
                        setData([...data, rolesAfterRefresh.role]);
                        setIsModalOpen(false);
                        setSnackBar({type: 'success', message: 'Pomyślnie utworzono nową rolę', show: true})
                    } catch (refreshError) {
                        if (refreshError.code === ApiResults.ERR_REFRESH_TOKEN_EXPIRED.code) {
                            handleTokenExpiration('Refresh-Token wygasł. Zaloguj się ponownie', setCurrentUser, setLoginToken, setSnackBar);
                        } else {
                            setSnackBar(prepareSnackBarErrorObj(refreshError))
                        }
                    }
                } else {
                    setSnackBar(prepareSnackBarErrorObj(error))
                }
            }
            setTimeout(() => {
                setShowSpinner(false);
            }, 250);
        }

        addRoleData().then(() => {
        });
    };

    useEffect(() => {
        const fetchRolesData = async () => {
            await setShowSpinner(true)
            try {
                const roles = await getRoles()
                setData(roles)
            } catch (error) {
                if (error.code === ApiResults.ERR_TOKEN_EXPIRED.code) {
                    try {
                        const refreshResponse = await refreshLoginToken();
                        // setLoginToken(refreshResponse.token);

                        const rolesAfterRefresh = await getRoles()
                        setData(rolesAfterRefresh)
                    } catch (refreshError) {
                        if (refreshError.code === ApiResults.ERR_REFRESH_TOKEN_EXPIRED.code) {
                            handleTokenExpiration('Refresh-Token wygasł. Zaloguj się ponownie', setCurrentUser, setLoginToken, setSnackBar);
                        } else {
                            setSnackBar(prepareSnackBarErrorObj(refreshError))
                        }
                    }
                } else {
                    setSnackBar(prepareSnackBarErrorObj(error))
                }
            }
            setTimeout(() => {
                setShowSpinner(false);
            }, 250);
        }
        fetchRolesData().then(() => {
        });
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
                                                <EditIcon color="primary" style={{ marginRight: '10px' }} />
                                            </Tooltip>
                                            <Tooltip title="Usuń">
                                                <DeleteIcon color="error" />
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