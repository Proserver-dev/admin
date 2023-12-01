import {Container, Stack, Typography} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";


const ActiveContactsView = () => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Typography variant="h4" gutterBottom className="page-title">
                    {t("APP_MENU_ACTIVE_CONTACTS")}
                </Typography>
            </Stack>
        </Container>
    )
}

export default ActiveContactsView;