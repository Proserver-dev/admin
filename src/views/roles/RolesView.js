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
import {setSnackBar} from "../../redux/actions";
import {useDispatch} from "react-redux";
import {reqAddRole, reqDeleteRole, reqGetRoles, reqUpdateRole} from "../../helpers/Role";
import {useTranslation} from "react-i18next";

const RolesView = () => {
    const { t, i18n } = useTranslation();
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
                const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                dispatch(setSnackBar({ type: 'error', message: message, show: true }));
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
                dispatch(setSnackBar({type: 'success', message: t("APP_SUCCESS_CREATE_NEW_ROLE"), show: true}))
            })
            .catch(err => {
                const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                dispatch(setSnackBar({ type: 'error', message: message, show: true }));
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
                dispatch(setSnackBar({ type: 'success', message: t("APP_SUCCESS_EDITED_ROLE"), show: true }));
            })
            .catch(err => {
                const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                dispatch(setSnackBar({ type: 'error', message: message, show: true }));
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
                dispatch(setSnackBar({ type: 'success', message: t("APP_SUCCESS_DELETED_ROLE"), show: true }));
            })
            .catch(err => {
                const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                dispatch(setSnackBar({ type: 'error', message: message, show: true }));
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
                    {t("APP_MENU_USER_ROLES")}
                </Typography>
                <Button variant="contained" onClick={() => setIsModalOpen(true)}>
                    {t("APP_ADD_NEW_USER_ROLE_BTN_LABEL")}
                </Button>
            </Stack>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("APP_TABLE_COL_ID")}</TableCell>
                            <TableCell>{t("APP_NAME_TXT")}</TableCell>
                            <TableCell>{t("APP_TABLE_COL_SLUG")}</TableCell>
                            <TableCell>{t("APP_TABLE_COL_ACTIONS")}</TableCell>
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
                                            <Tooltip title={t("APP_EDIT_BTN_TOOLTIP")}>
                                                <EditIcon
                                                    color="primary"
                                                    onClick={() => handleEdit(item)}
                                                    style={{marginRight: '10px'}}
                                                />
                                            </Tooltip>
                                            <Tooltip title={t("APP_DELETE_BTN_TOOLTIP")}>
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
                            {t("APP_TITLE_ADD_NEW_USER_ROLE")}
                        </Typography>
                        <TextField
                            label={t("APP_NAME_TXT")}
                            value={newItem.name}
                            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                        />
                        <Button variant="contained" color="primary" onClick={handleAddItem}>
                            {t("APP_ADD_BTN_LABEL")}
                        </Button>
                    </Stack>
                </Container>
            </Modal>

            <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}
                   style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Container style={{ background: 'white', padding: '20px', borderRadius: '4px', maxWidth: '300px' }}>
                    <Stack direction="column" spacing={2}>
                        <Typography variant="h6" gutterBottom>
                            {t("APP_TITLE_EDIT_USER_ROLE")}
                        </Typography>
                        <TextField
                            label={t("APP_NAME_TXT")}
                            value={selectedRole.name}
                            onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                        />
                        <Button variant="contained" color="primary" onClick={handleUpdateItem}>
                            {t("APP_SAVE_BTN_LABEL")}
                        </Button>
                    </Stack>
                </Container>
            </Modal>

            <Modal open={isDeleteConfirmationOpen} onClose={handleCancelDelete}
                   style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Container style={{ background: 'white', padding: '20px', borderRadius: '4px', maxWidth: '300px' }}>
                    <Stack direction="column" spacing={2}>
                        <Typography variant="h6" gutterBottom>
                            {t("APP_ARE_YOU_SURE_YOU_WANT_TO_DELETE")}
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                                {t("APP_YES_BTN_LABEL")}
                            </Button>
                            <Button variant="outlined" onClick={handleCancelDelete}>
                                {t("APP_NO_BTN_LABEL")}
                            </Button>
                        </Stack>
                    </Stack>
                </Container>
            </Modal>
        </Container>
    );
};

export default RolesView;