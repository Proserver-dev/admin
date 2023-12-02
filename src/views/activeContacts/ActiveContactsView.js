import React, {useState, useEffect} from 'react';
import {
    Container,
    Stack,
    Typography,
    Card,
    CardContent,
    Avatar,
    Divider,
    Pagination,
    Box,
    Badge,
    IconButton,
    Collapse,
} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {stringAvatar} from "../../helpers/functions/avatarFunctions";

const itemsPerPage = 5; // Liczba elementów na stronę

const ActiveContactsView = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.currentUser);
    const [data, setData] = useState({count: 0, rows: []});
    const [page, setPage] = useState(1);

    useEffect(() => {
        const exampleData = {
            count: 1,
            rows: [
                {
                    id: 1,
                    isActivated: true,
                    email: 'john@doe.dev',
                    userName: 'john123',
                    nameLastname: 'John Doe',
                    role: {
                        id: 2,
                        name: 'User',
                        short: 'user',
                    },
                    isLoggedIn: true,
                    updatedAt: '2023-11-15T04:17:54.000Z',
                    createdAt: '2023-11-07T20:16:13.000Z',
                    lastMessage: {
                        id: 1,
                        sourceUserId: 1,
                        targetUserId: 8,
                        message: 'Example message',
                        isRead: false,
                        updatedAt: '2023-11-15T04:17:54.000Z',
                        createdAt: '2023-11-15T04:17:54.000Z',
                        attachments: [
                            {
                                url: 'https://backend.proserver.dev/uploads/messages/365d5d73-7be9-40cb-8497-e5baecb4fb28.jpg',
                                type: 'image',
                            },
                        ],
                    },
                },
            ],
        };

        setData(exampleData);
    }, []);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const renderMessage = (message) => {
        const isCurrentUserMessage = currentUser.id === message.sourceUserId;
        const isRead = message.isRead;

        return (
            <Card key={message.id} variant="outlined" style={{marginBottom: '16px'}}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center">
                            <Avatar {...stringAvatar(message.nameLastname || message.userName || message.email)}/>
                            <Box marginLeft="10px">
                                <Typography variant="body1">
                                    {`${message?.lastMessage?.message.slice(0, 50)}...`}
                                </Typography>
                                <Typography variant="caption">
                                    {isCurrentUserMessage ? t('You') : message.nameLastname}
                                </Typography>
                            </Box>
                        </Box>
                        <Box>
                            {isCurrentUserMessage && (
                                <Badge color="secondary" variant="dot" invisible={isRead}>
                                    <Typography variant="caption">{t('Unread')}</Typography>
                                </Badge>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    };

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Typography variant="h4" gutterBottom className="page-title">
                    {t('APP_MENU_ACTIVE_CONTACTS')}
                </Typography>
            </Stack>
            {data.rows
                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map((item) => renderMessage(item))}
            <Divider style={{marginTop: '16px', marginBottom: '16px'}}/>
            <Pagination
                count={Math.ceil(data.count / itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
            />
        </Container>
    );
};

export default ActiveContactsView;