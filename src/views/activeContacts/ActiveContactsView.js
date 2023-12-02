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
import {reqGetActiveContacts} from "../../helpers/API/PrivateMessages";
import {setSnackBar} from "../../redux/actions";
import ChatIcon from '@mui/icons-material/Chat';
import Label from "../../components/Label";

const itemsPerPage = 5; // Liczba elementów na stronę

const ActiveContactsView = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.currentUser);
    const [data, setData] = useState({count: 0, rows: []});
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch({type: 'SHOW_SPINNER'});
        reqGetActiveContacts(itemsPerPage, itemsPerPage * (page - 1))
            .then((res) => {
                setData(res)
            })
            .catch((err) => {
                const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN")
                dispatch(setSnackBar({type: 'error', message: message, show: true}));
            })
            .finally(() => {
                setTimeout(() => {
                    dispatch({type: 'HIDE_SPINNER'});
                }, 250);
            })
    }, []);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const renderMessage = (message) => {
        const isCurrentUserMessage = currentUser.id === message.sourceUserId;
        const isRead = message?.lastMessage.isRead;

        return (
            <Card key={message.id} variant="outlined" style={{marginBottom: '16px'}}>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center">
                            <Avatar {...stringAvatar(message.nameLastname || message.userName || message.email)}/>
                            <Box marginLeft="10px">
                                <Typography variant="body1">
                                    {message.nameLastname || message.userName || message.email}
                                </Typography>
                                <Typography variant="caption">
                                    {message.lastMessage.sourceUserId === currentUser.id ? (
                                        <Label variant="ghost" color="primary">
                                            Ty:
                                        </Label>
                                    ) : (
                                        <Label variant="ghost" color="secondary">
                                            {message.nameLastname}:
                                        </Label>
                                    )}
                                    {` ${message?.lastMessage?.message.slice(0, 50)}...`}
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
                        <Box>
                            <IconButton
                                onClick={() => navigate(`/chat/${message.id}`)}
                            >
                                <ChatIcon/>
                            </IconButton>
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
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Typography variant="caption">Tutaj jeszcze nie ma realtime odświeżania</Typography>
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