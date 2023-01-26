import {
    AircraftCommandName,
    AircraftCommands,
    RemoteClientCommandName,
    RemoteClientCommands,
    SharedCommandName
} from "../../shared/protocol";
import { ClientState } from "../../shared/client-state";
import { DataCommandProcessor } from "./DataCommandProcessor";
import { RemoteDataConsumer } from "./RemoteDataConsumer";

export class RemoteClient {
    private ws: WebSocket | null = null;

    public state = ClientState.Standby;

    private messageQueue: RemoteClientCommands.All[] = [];

    private dataCommandProcessor: DataCommandProcessor;

    constructor(
        private readonly dataConsumer: RemoteDataConsumer,
    ) {
        this.dataCommandProcessor = new DataCommandProcessor(this.dataConsumer);
    }

    connect(url: string) {
        this.ws = new WebSocket(url);

        this.ensureWsExists((ws) => {
            ws.addEventListener('open', () => {
                this.state = ClientState.Connected;

                ws.addEventListener('message', (message: MessageEvent) => this.processIncomingMessageRaw(message.data as string));

                this.sendMessageInternal([RemoteClientCommandName.LOGIN_AS_REMOTE_CLIENT]);
            });

            ws.addEventListener('close', () => {
                this.state = ClientState.Standby;
                this.ws = null;
            });
        })
    }

    private processIncomingMessageRaw(rawMessage: string): void {
        const parts = rawMessage.split(';');

        this.processMessage(parts as AircraftCommands.All);
    }

    private processMessage(parts: AircraftCommands.All): void {
        const [command, ...rest] = parts as readonly string[];

        switch (command) {
            default:
                throw new Error(`Unknown command string: ${command}`);
            case SharedCommandName.ACKNOWLEDGE: {
                if (this.isLoggedIn()) {
                    console.warn('Received ACKNOWLEDGE while logged in');
                } else {
                    this.state = ClientState.LoggedIn;

                    this.flushMessageQueue();
                }
                break;
            }
            case AircraftCommandName.SIMVAR_VALUES: {
                this.dataCommandProcessor.processSimVarValuesCommand(rest);
                break;
            }
        }
    }

    public sendMessage(message: RemoteClientCommands.All): void {
        if (this.isLoggedIn()) {
            this.doSendMessage(message);
        } else {
            this.messageQueue.push(message);
        }
    }

    private sendMessageInternal(message: RemoteClientCommands.All): void {
        if (this.isConnected()) {
            this.doSendMessage(message);
        } else {
            this.messageQueue.push(message)
        }
    }

    private doSendMessage(message: RemoteClientCommands.All): void {
        this.ensureWsExists((ws) => {
            const messageString = message.join(';');

            ws.send(messageString);
        });
    }

    private flushMessageQueue(): void {
        for (const queuedMessage of this.messageQueue) {
            this.doSendMessage(queuedMessage);
        }
    }

    private ensureWsExists(executor: (ws: WebSocket) => void): void {
        if (!this.ws) {
            throw new Error('Socket was requested but did not exist');
        }

        executor(this.ws);
    }

    private isConnected() {
        return this.state >= ClientState.Connected;
    }

    private isLoggedIn() {
        return this.state >= ClientState.LoggedIn;
    }
}
