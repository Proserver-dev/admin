import CustomModal from "../../../components/CustomModal";
import {Button, Stack, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {reqAddRole} from "../../../helpers/API/Role";
import {setSnackBar} from "../../../redux/actions";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";

const ModalAddNewRole = ({ open = false, setModalOpen = {}, data = [],  setData = {} }) => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const [name, setName] = useState( '');

    useEffect(() => {
        setName('')
    }, [open])

    const handleAddItem = () => {
        dispatch({type: 'SHOW_SPINNER'});
        reqAddRole(name)
            .then(res => {
                setName('')
                setData([...data, res.role]);
                setModalOpen(false);
                dispatch(setSnackBar({type: 'success', message: t("APP_SUCCESS_CREATE_NEW_ROLE"), show: true}))
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
    };

    return (
        <CustomModal open={open} onClose={() => setModalOpen(false)}>
            <Stack direction="column" spacing={2}>
                <Typography variant="h6" gutterBottom>
                    {t("APP_TITLE_ADD_NEW_USER_ROLE")}
                </Typography>
                <TextField
                    label={t("APP_NAME_TXT")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleAddItem}>
                    {t("APP_ADD_BTN_LABEL")}
                </Button>
            </Stack>
        </CustomModal>
    )
}

export default ModalAddNewRole