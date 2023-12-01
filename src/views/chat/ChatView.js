import {Container, Stack, Typography} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";


const ChatView = () => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const {userId} = useParams();

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Typography variant="h4" gutterBottom className="page-title">
                    Chat z userId {userId}
                </Typography>
            </Stack>
        </Container>
    )
}

export default ChatView;