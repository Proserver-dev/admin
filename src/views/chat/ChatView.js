import React, {useState, useEffect, useRef} from "react";
import {
    Container,
    Stack,
    Typography,
    TextField,
    Button,
    Paper, Tooltip, Link
} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {reqGetPrivateMessages, reqPostPrivateMessage} from "../../helpers/API/PrivateMessages";
import {setSnackBar} from "../../redux/actions";
import SocketEvents from "../../constants/SocketEvents";
import RoutesPath from "../../constants/RoutesPath";

const itemsPerPage = 20; // Liczba elementów na stronę
const messagesInit = {count: 0, rows: []}

const ChatView = () => {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.currentUser);
    const socket = useSelector((state) => state.socket);
    const {userId} = useParams();

    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState(messagesInit)

    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const paperRef = useRef(null);
    const [initLoad, setInitLoad] = useState(true);
    const [lastScrollTop, setLastScrollTop] = useState(0);

    const loadMoreData = async (page) => {
        if (loading)
            return;

        try {
            setLoading(true);
            const res = await reqGetPrivateMessages(userId, itemsPerPage, itemsPerPage * (page - 1));

            const sortedMessages = res.rows.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setMessages((prevMessages) => ({
                count: res.count,
                rows: [...sortedMessages, ...prevMessages.rows],
            }));
            setHasMore(res.count > (page * itemsPerPage));
            setPage((prevPage) => prevPage + 1);

        } catch (err) {
            const message = t(err?.response?.data?.error) || err?.response?.data?.error || t("ERR_UNKNOWN");
            dispatch(setSnackBar({type: 'error', message: message, show: true}));
        } finally {
            setLoading(false);
        }
    };

    // załadowanie pierwszej porcji wiadomości
    useEffect(() => {
        setMessages(messagesInit)
        setLoading(false)
        setHasMore(false)
        setPage(1)
        setInitLoad(true)
        setLastScrollTop(0)
        loadMoreData(1)
            .then(() => {
            })
            .catch(() => {
            })
    }, [userId]);

    // przescrolowanie do samego dołu po przejściu do widoku chatu (tylko raz, na początku)
    useEffect(() => {
        if (initLoad && messages.count > 0) {
            paperRef.current.scrollTo({
                top: paperRef.current.scrollHeight,
                behavior: 'smooth',
            });
            setInitLoad(false);
        }
    }, [messages])

    useEffect(() => {
        const handleScroll = async () => {
            if (!loading && hasMore && messages.count > ((page - 1) * itemsPerPage)) {
                const container = paperRef?.current;
                const {scrollTop} = container;
                if (scrollTop < 50 && scrollTop <= lastScrollTop) {
                    // const distanceFromBottom = container.scrollHeight - (container.scrollTop + container.clientHeight);

                    loadMoreData(page);

                    await new Promise((resolve) => setTimeout(resolve, 0));
                    container.scrollTo({
                        top: container.scrollTop + container.clientHeight,
                        behavior: 'smooth',
                    });
                }
                if (scrollTop > 50) {
                    setLastScrollTop(scrollTop);
                }


                /*
                const container = paperRef?.current;
                const distanceFromBottom =
                    container.scrollHeight -
                    (container.scrollTop + container.clientHeight);
                if (distanceFromBottom < 250) {
                    loadMoreData();
                }

                 */
            }
        };

        if (paperRef.current) {
            paperRef.current.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (paperRef.current) {
                paperRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [loading, page, lastScrollTop]);


    useEffect(() => {
        if (socket) {
            socket.on(SocketEvents.LISTEN_PRIVATE_MESSAGE, (data) => {
                if (data.sourceUserId === parseInt(userId)) {
                    setMessages((prevState) => ({
                        count: prevState.count + 1,
                        rows: [...prevState.rows, data],
                    }));
                } else {
                    const message = (
                        <>
                            Dostałeś wiadomość od innego użytkownika id {data.sourceUserId} -{' '}
                            <Link onClick={() => {
                                navigate(`${RoutesPath.CHAT}/${data.sourceUserId}`)
                                dispatch({type: 'HIDE_SNACK_BAR'});
                            }}
                                  component="button"
                                  variant="body2"
                                  style={{ color: '#FFF', textDecoration: 'underline' }}>przejdź do chatu</Link>
                        </>
                    );
                    dispatch(setSnackBar({
                        type: 'info',
                        message: message,
                        show: true
                    }));
                }
            })
        }

        return () => {
            if (socket) {
                socket.off(SocketEvents.LISTEN_PRIVATE_MESSAGE);
            }
        };
    }, [socket])


    const handleSendMessage = async () => {
        dispatch({type: "SHOW_SPINNER"});

        try {
            const res = await reqPostPrivateMessage(userId, messageInput);
            setMessages((prevMessages) => ({
                count: prevMessages.count + 1,
                rows: [...prevMessages.rows, res],
            }));

            dispatch({
                type: "EMIT_SOCKET_EVENT",
                payload: {
                    event: SocketEvents.EMIT_PRIVATE_MESSAGE_CREATED_VIA_API,
                    data: res,
                },
            });

            setMessageInput("");
        } catch (err) {
            const message =
                t(err?.response?.data?.error) ||
                err?.response?.data?.error ||
                t("ERR_UNKNOWN");
            dispatch(setSnackBar({type: "error", message: message, show: true}));
        } finally {
            dispatch({type: "HIDE_SPINNER"});
        }

        await new Promise((resolve) => setTimeout(resolve, 0));

        paperRef.current.scrollTo({
            top: paperRef.current.scrollHeight,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        const paperContainer = paperRef.current;

        if (loading) {
            dispatch({type: 'SHOW_SPINNER'});
            paperContainer.style.overflowY = "hidden";
        } else {
            dispatch({type: 'HIDE_SPINNER'});
            paperContainer.style.overflowY = "scroll";
        }
    }, [loading])

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} marginTop={5}>
                <Typography variant="h4" gutterBottom className="page-title">
                    {t("Chat with userId")} {userId}
                </Typography>
                <Typography variant="caption" paragraph={true} style={{marginBottom: 0}}>Wymienionych
                    wiadomości: {messages.count}</Typography>
            </Stack>
            <Stack
                direction="column"
                alignItems="flex-start"
                justifyContent="flex-start"
                mb={5}
                marginTop={5}
            >

                <Paper
                    ref={paperRef}
                    elevation={3}
                    style={{
                        padding: "20px",
                        width: "100%",
                        height: "500px",
                        overflowY: "scroll",
                    }}
                >
                    {messages.rows.map((message) => (
                        <div
                            key={message.id}
                            style={{
                                textAlign: currentUser.id === message.sourceUserId ? "right" : "left",
                                marginBottom: "10px",
                            }}
                        >
                            <Tooltip title={`Message ID: ${message.id}`} followCursor>
                                <div
                                    style={{
                                        display: "inline-block",
                                        padding: "10px",
                                        borderRadius: "11px",
                                        maxWidth: '80%',
                                        textAlign: 'left',
                                        backgroundColor:
                                            currentUser.id === message.sourceUserId ? "#2196F3" : "#f1f0f0",
                                        color:
                                            currentUser.id === message.sourceUserId ? "#FFF" : "#000",
                                    }}
                                >
                                    {message.message}
                                </div>
                            </Tooltip>
                        </div>
                    ))}
                </Paper>

                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mt={3}
                    spacing={2}
                    fullWith
                    style={{width: '100%'}}
                >
                    <TextField
                        label={t("Type your message")}
                        variant="outlined"
                        fullWidth
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                    />
                    <Button variant="contained" onClick={handleSendMessage}>
                        {t("Send")}
                    </Button>
                </Stack>
            </Stack>
        </Container>
    );
};

export default ChatView;
