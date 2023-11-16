import React, {useEffect} from 'react';
import {Button, Stack, Typography} from "@mui/material";
import { Container } from '@mui/material';
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

const HomeView = () => {
    const { t, i18n } = useTranslation();
    const currentUser = useSelector((state) => state.currentUser);
    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Typography variant="h4" gutterBottom className="page-title">
                    {t("APP_MENU_HOME")}
                </Typography>
            </Stack>
            <p>{t("APP_LOGGED_AS")}: {currentUser?.email}</p>
        </Container>
    )
}

export default HomeView;