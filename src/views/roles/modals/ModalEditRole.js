import {Button, Stack, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {reqUpdateRole} from "../../../helpers/API/Role";
import {setSnackBar} from "../../../redux/actions";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import CustomModal from "../../../components/CustomModal";


const ModalEditRole = ({open = false, setModalOpen = {}, data = [], setData = {}, selectedRole = {}}) => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const [name, setName] = useState(selectedRole.name);

    useEffect(() => {
        setName(selectedRole.name)
    }, [open])

    const handleUpdateItem = () => {
        dispatch({type: 'SHOW_SPINNER'});
        reqUpdateRole(selectedRole.id, name)
            .then((res) => {
                setModalOpen(false);
                setData(data.map(item => (item.id === selectedRole.id ? {...res.role} : item)));
                dispatch(setSnackBar({type: 'success', message: t("APP_SUCCESS_EDITED_ROLE"), show: true}));
            })
            .catch(err => {
                const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                dispatch(setSnackBar({type: 'error', message: message, show: true}));
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch({type: 'HIDE_SPINNER'});
                }, 250);
            });
    };

    return (
        <CustomModal open={open} onClose={() => setModalOpen(false)}>
            <Stack direction="column" spacing={2}>
                <Typography variant="h6" gutterBottom>
                    {t("APP_TITLE_EDIT_USER_ROLE")}
                </Typography>
                <TextField
                    label={t("APP_NAME_TXT")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleUpdateItem}>
                    {t("APP_SAVE_BTN_LABEL")}
                </Button>
            </Stack>
        </CustomModal>
    )
}

export default ModalEditRole