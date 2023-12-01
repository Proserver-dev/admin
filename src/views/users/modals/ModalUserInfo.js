import {Typography} from "@mui/material";
import {format} from "date-fns";
import React from "react";
import {useTranslation} from "react-i18next";
import CustomModal from "../../../components/CustomModal";


const ModalUserInfo = ({open = false, setModalOpen = {}, selectedUser = {}}) => {
    const {t, i18n} = useTranslation();

    return (
        <CustomModal open={open} onClose={() => setModalOpen(false)}>
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
        </CustomModal>
    )
}

export default ModalUserInfo