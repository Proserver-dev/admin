import React, {useEffect} from 'react';
import {Button, Stack, Typography} from "@mui/material";
import { Container } from '@mui/material';

const HomeView = ({ currentUser }) => {

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Typography variant="h4" gutterBottom className="page-title">
                    Strona główna
                </Typography>
            </Stack>
            <p>Zalogowany jako: {currentUser?.email}</p>
        </Container>
    )
}

export default HomeView;