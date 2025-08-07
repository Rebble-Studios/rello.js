import EventEmitter from "eventemitter3";
import { WebSocketManager } from "../manager/WebSocketManager";

export interface ClientOptions {
    token: string;
}

export class Client extends EventEmitter {
    public token: string;
    private wsManager?: WebSocketManager;

    constructor(options: ClientOptions) {
        super();
        this.token = options.token;

        (async () => {
            try {
                await this.connect();
            } catch (error) {
                console.error('Failed to connect:', error);
            }
        })();
    }

    private async connect() {
        // const wsOptions = this.wsOptions || {};
        const url = 'ws://127.0.0.1:4455';

        // Create WebSocketManager instance
        this.wsManager = new WebSocketManager({
            "token": this.token,
            url,
            handler: this.handleWsMessages.bind(this)
        });
    }

    private handleWsMessages(t: string, d: any) {
        this.emit(t, d);
    }
}