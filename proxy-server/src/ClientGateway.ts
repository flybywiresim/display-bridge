export interface ClientGateway {
    sendMessageRawTo(clientID: string, message: string);
}
