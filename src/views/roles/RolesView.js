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
    Container, IconButton,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import {setSnackBar} from "../../redux/actions";
import {useDispatch} from "react-redux";
import {reqAddRole, reqDeleteRole, reqGetRoles, reqUpdateRole} from "../../helpers/API/Role";
import {useTranslation} from "react-i18next";
import ModalAddNewRole from "./modals/ModalAddNewRole";
import ModalEditRole from "./modals/ModalEditRole";
import ModalPreventDeleteRole from "./modals/ModalPreventDeleteRole";

const RolesView = () => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

    const [selectedRole, setSelectedRole] = useState({id: '', name: '', short: ''});

    useEffect(() => {
        dispatch({type: 'SHOW_SPINNER'});
        reqGetRoles()
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
    }, [])

    const handleEdit = (role) => {
        setSelectedRole(role);
        setIsEditModalOpen(true);
    };

    const handleDelete = (role) => {
        setSelectedRole(role);
        setIsDeleteConfirmationOpen(true);
    };

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Typography variant="h4" gutterBottom className="page-title">
                    {t("APP_MENU_USER_ROLES")}
                </Typography>
                <Button variant="contained" onClick={() => setIsCreateModalOpen(true)}>
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
                        {data.length > 0 ? (
                            data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.short}</TableCell>
                                    <TableCell>
                                        {item.short !== 'admin' && item.short !== 'user' && item.short !== 'blocked' && (
                                            <>
                                                <Tooltip title={t("APP_EDIT_BTN_TOOLTIP")}>
                                                    <IconButton onClick={() => handleEdit(item)}>
                                                        <EditIcon color="primary"/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={t("APP_DELETE_BTN_TOOLTIP")}>
                                                    <IconButton onClick={() => handleDelete(item)}>
                                                        <DeleteIcon color="error"/>
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} style={{textAlign: 'center'}}>
                                    {t('APP_NO_DATA')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <ModalAddNewRole open={isCreateModalOpen} setModalOpen={setIsCreateModalOpen} data={data} setData={setData} />
            <ModalEditRole open={isEditModalOpen} setModalOpen={setIsEditModalOpen} data={data} setData={setData} selectedRole={selectedRole} />
            <ModalPreventDeleteRole open={isDeleteConfirmationOpen} setModalOpen={setIsDeleteConfirmationOpen} data={data} setData={setData} selectedRole={selectedRole} />

        </Container>
    );
};

export default RolesView;