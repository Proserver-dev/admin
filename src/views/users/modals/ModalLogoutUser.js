import {Button, Stack, TextField, Typography} from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import SocketEvents from "../../../constants/SocketEvents";


const ModalLogoutUser = ({open = false, setModalOpen = {}, selectedUser = {}}) => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');

    const handleConfirm = () => {
        dispatch({
            type: 'EMIT_SOCKET_EVENT',
            payload: {event: SocketEvents.EMIT_MESSAGE_TO_ONE_USER, data: {message: message, type: 'forceLogout', targetUserId: selectedUser.id}}
        })

        setModalOpen(false);
    }

    const handleCancel = () => {
        setModalOpen(false);
    }

    return (
        <CustomModal open={open} onClose={() => setModalOpen(false)}>
            <Typography variant="h6">Czy na pewno chcesz wylogować użytkownika?</Typography>
            {selectedUser && (
                <Typography variant="caption" paragraph={true}
                            style={{marginBottom: 0}}>Użytkownik <strong>{selectedUser.email}</strong> zostanie wylogowany
                </Typography>
            )}
            <Typography variant="caption" paragraph={true}
                        style={{marginBottom: 0}}>Możesz opcjonalnie podać powód wylogowania
            </Typography>

            <TextField
                label={t("APP_MESSAGE_TXT")}
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                margin="normal"
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end" style={{ marginTop: '15px' }}>
                <Button variant="contained" color="error" onClick={handleConfirm}>
                    {t("APP_YES_BTN_LABEL")}
                </Button>
                <Button variant="outlined" onClick={handleCancel}>
                    {t("APP_NO_BTN_LABEL")}
                </Button>
            </Stack>

        </CustomModal>
    )
}

export default ModalLogoutUser;