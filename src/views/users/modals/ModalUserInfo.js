import {Box, Modal, Typography} from "@mui/material";
import {format} from "date-fns";
import React from "react";
import {useTranslation} from "react-i18next";


const ModalUserInfo = ({isModalOpen = false, setModalOpen = {}, selectedUser = {}}) => {
    const {t, i18n} = useTranslation();

    return (
        <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6">{t("APP_TITLE_USER_DETAILS")}</Typography>
                {selectedUser && (
                    <>
                        <Typography variant="caption" paragraph={true}
                                    style={{marginBottom: 0}}><strong>{t("APP_TABLE_COL_ID")}</strong>: {selectedUser.id}
                        </Typography>
                        <Typography variant="caption" paragraph={true}
                                    style={{marginBottom: 0}}><strong>{t("APP_TABLE_COL_EMAIL")}</strong>: {selectedUser.email}
                        </Typography>
                        <Typography variant="caption" paragraph={true}
                                    style={{marginBottom: 0}}><strong>{t("APP_TABLE_COL_USER_NAME")}</strong>: {selectedUser.userName}
                        </Typography>
                        <Typography variant="caption" paragraph={true}
                                    style={{marginBottom: 0}}><strong>{t("APP_TABLE_COL_NAME_LASTNAME")}</strong>: {selectedUser.nameLastname}
                        </Typography>
                        <Typography variant="caption" paragraph={true}
                                    style={{marginBottom: 0}}><strong>{t("APP_TABLE_COL_ROLE")}</strong>: {selectedUser.role?.name} ({selectedUser.role?.short})</Typography>
                        {selectedUser.updatedAt && (
                            <Typography variant="caption" paragraph={true}
                                        style={{marginBottom: 0}}><strong>{t("APP_TABLE_COL_UPDATED_AT")}</strong>: {format(new Date(selectedUser?.updatedAt), 'yyyy-MM-dd HH:mm:ss')}
                            </Typography>
                        )}
                        {selectedUser.createdAt && (
                            <Typography variant="caption" paragraph={true}
                                        style={{marginBottom: 0}}><strong>{t("APP_TABLE_COL_CREATED_AT")}</strong>: {format(new Date(selectedUser?.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                            </Typography>
                        )}
                    </>
                )}
            </Box>
        </Modal>
    )
}

export default ModalUserInfo