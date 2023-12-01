import CustomModal from "../../../components/CustomModal";
import {Button, Stack, Typography} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";


const ModalPreventForceLogoutAll = ({open = false, setModalOpen = {}, sendToAll = {}}) => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();

    const handleConfirmationDialogClose = () => {
        setModalOpen(false);
    };

    const handleConfirmationDialogConfirm = () => {
        setModalOpen(false);
        sendToAll();
    };

    return (
        <CustomModal open={open} onClose={() => setModalOpen(false)}>
            <Stack direction="column" spacing={2}>
                <Typography variant="h6" gutterBottom>
                    {t("APP_ARE_YOU_SURE_YOU_WANT_TO_LOGOUT_ALL")}
                </Typography>

                <Stack direction="row" spacing={2} justifyContent="end">
                    <Button variant="contained" color="error" onClick={handleConfirmationDialogConfirm} autoFocus>
                        {t("APP_YES_BTN_LABEL")}
                    </Button>
                    <Button variant="outlined" onClick={handleConfirmationDialogClose}>
                        {t("APP_NO_BTN_LABEL")}
                    </Button>
                </Stack>
            </Stack>
        </CustomModal>
    )
}

export default ModalPreventForceLogoutAll