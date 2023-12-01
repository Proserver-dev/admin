import {Button, Stack, Typography} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import CustomModal from "../../../components/CustomModal";
import {reqDeleteUser} from "../../../helpers/API/User";
import {setSnackBar} from "../../../redux/actions";


const ModalDeleteUser = ({open = false, setModalOpen = {}, selectedUser = {}, getUsers = {}}) => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();

    const handleCancelDelete = () => {
        setModalOpen(false);
    };

    const handleConfirmDelete = () => {
        reqDeleteUser(selectedUser.id)
            .then(res => {
                getUsers()
                dispatch(setSnackBar({type: 'success', message: t("APP_SUCCESS_DELETE_USER"), show: true}));
                setModalOpen(false)
            })
            .catch(err => {
                dispatch({type: 'HIDE_SPINNER'});
                dispatch(setSnackBar({type: 'error', message: t("APP_ERR_CANNOT_DELETE_USER"), show: true}));
                setModalOpen(false)
            });
    }

    return (
        <CustomModal open={open} onClose={() => setModalOpen(false)}>
            <Typography variant="h6">Czy na pewno chcesz usunąć konto?</Typography>
            {selectedUser && (
                <Typography variant="caption" paragraph={true}
                            style={{marginBottom: 0}}>Konto o adresie <strong>{selectedUser.email}</strong> zostanie trwale usunięte
                </Typography>
            )}
            <Stack direction="row" spacing={2} justifyContent="flex-end" style={{ marginTop: '15px' }}>
                <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                    {t("APP_YES_BTN_LABEL")}
                </Button>
                <Button variant="outlined" onClick={handleCancelDelete}>
                    {t("APP_NO_BTN_LABEL")}
                </Button>
            </Stack>

        </CustomModal>
    )
}

export default ModalDeleteUser