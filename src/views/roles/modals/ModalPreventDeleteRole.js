import CustomModal from "../../../components/CustomModal";
import {Button, Stack, Typography} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {reqDeleteRole} from "../../../helpers/API/Role";
import {setSnackBar} from "../../../redux/actions";


const ModalPreventDeleteRole = ({open = false, setModalOpen = {}, data = [], setData = {}, selectedRole = {}}) => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();

    const handleCancelDelete = () => {
        setModalOpen(false);
    };

    const handleConfirmDelete = () => {
        dispatch({type: 'SHOW_SPINNER'});
        reqDeleteRole(selectedRole.id)
            .then(() => {
                setModalOpen(false);
                setData(data.filter(item => item.id !== selectedRole.id));
                dispatch(setSnackBar({type: 'success', message: t("APP_SUCCESS_DELETED_ROLE"), show: true}));
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
                    {t("APP_ARE_YOU_SURE_YOU_WANT_TO_DELETE")}
                </Typography>
                <Typography variant="caption" paragraph={true}
                            style={{marginBottom: 0}}>Rola o nazwie "{selectedRole.name}" zostanie trwale usunięta.
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
        </CustomModal>
    )
}

export default ModalPreventDeleteRole