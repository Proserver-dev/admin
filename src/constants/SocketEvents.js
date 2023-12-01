const SocketEvents = {
    EMIT_MESSAGE_TO_ALL: 'messageToAll',
    EMIT_MESSAGE_TO_ONE_USER: 'messageToOneUser',

    LISTEN_MESSAGE_FROM_SERVER: 'messageToAll', // TODO: później zmienić nazwę na messageFromServer
    LISTEN_NEW_SOCKET_CONNECTION: 'newSocketConnection',
    LISTEN_RESPONSE_FROM_SOCKET: 'responseFromSocket',
    LISTEN_CONNECTION_ACTION: 'connectionAction',
}

export default SocketEvents;