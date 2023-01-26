import { WebSocketServer, WebSocket } from 'ws';
import { DisplayBridgeProxyServer } from '../../proxy-server/src/DisplayBridgeProxyServer';
import { ClientGateway } from '../../proxy-server/src/ClientGateway';
import { v4 } from "uuid";

const clientMap = new Map<string, WebSocket>();

const server = new WebSocketServer({ port: 8069 });

const gateway: ClientGateway = {
    sendMessageRawTo(clientID: string, message: string) {
        const socket = clientMap.get(clientID);

        if (!socket) {
            throw new Error(`[ProxyBridge] Could not find socket for clientID=${clientID}`)
        }

        console.log(`[ProxyBridge] -> ${clientID.substring(0, 7)}: ${message}`)

        socket.send(message);
    }
}

const proxy = new DisplayBridgeProxyServer(gateway);

server.on('listening', () => console.log('[ProxyBridge] Server listening on port :8069'))

server.on('connection', (socket) => {
    const uuid = v4();

    console.log(`[ProxyBridge] New connection assigning UUID ${uuid.substring(0, 7)}`)

    clientMap.set(uuid, socket);

    socket.on('close', () => {
        clientMap.delete(uuid);

        proxy.removeClientConnection(uuid);
    });

    socket.on('message', (message) => {
        console.log(`[ProxyBridge] <- ${uuid.substring(0, 7)}: ${message.toString()}`);

        proxy.processMessageFromClientRaw(uuid, message.toString());
    })
});

