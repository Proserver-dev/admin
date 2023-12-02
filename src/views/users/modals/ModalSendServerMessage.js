import {Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography} from "@mui/material";
import CustomModal from "../../../components/CustomModal";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import SocketEvents from "../../../constants/SocketEvents";

const messageDefault = ''
const typeDefault = 'info'

const ModalSendServerMessage = ({open = false, setModalOpen = {}, selectedUser = {}}) => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const [message, setMessage] = useState(messageDefault);
    const [type, setType] = useState(typeDefault);
    
    useEffect(() => {
        setMessage(messageDefault)
        setType(typeDefault)
    }, [open])

    const handleSend = () => {
        if (!message) {
            dispatch({
                type: 'SET_SNACK_BAR',
                payload: {type: 'error', message: t("APP_MESSAGE_WITH_THIS_TYPE_CANNOT_BE_EMPTY"), show: true}
            })
            return;
        }

        dispatch({
            type: 'EMIT_SOCKET_EVENT',
            payload: {
                event: SocketEvents.EMIT_MESSAGE_TO_ONE_USER,
                data: {message: message, type: type, targetUserId: selectedUser.id}
            }
        })

        setModalOpen(false);
    }

    return (
        <CustomModal open={open} onClose={() => setModalOpen(false)}>
            <Stack direction="column" spacing={2}>
                <Typography variant="h6">Wyślij wiadomość serwerową</Typography>
                {selectedUser && (
                    <Typography variant="caption" paragraph={true}
                                style={{marginBottom: 0}}>Wiadomość zostanie wysłana
                        do <strong>{selectedUser.email}</strong>
                    </Typography>
                )}

                <FormControl fullWidth style={{marginTop: '15px'}}>
                    <InputLabel>{t("APP_TYPE_TXT")}</InputLabel>
                    <Select label={t("APP_TYPE_TXT")} value={type} onChange={(e) => setType(e.target.value)}>
                        <MenuItem value="info">{t("APP_TYPE_MESSAGE_INFO")}</MenuItem>
                        <MenuItem value="warning">{t("APP_TYPE_MESSAGE_WARNING")}</MenuItem>
                        <MenuItem value="error">{t("APP_TYPE_MESSAGE_ERROR")}</MenuItem>
                        <MenuItem value="success">{t("APP_TYPE_MESSAGE_SUCCESS")}</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    label={t("APP_MESSAGE_TXT")}
                    fullWidth
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    margin="normal"
                />

                <Button variant="contained" color="primary" onClick={handleSend}>
                    {t("APP_YES_BTN_LABEL")}
                </Button>
            </Stack>
        </CustomModal>
    )
}

export default ModalSendServerMessage;