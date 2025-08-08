"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketManager = void 0;
class WebSocketManager {
    constructor(options) {
        this.options = options;
        this.websocket = new WebSocket(options.url);
        this.handleMessages();
    }
    handleMessages() {
        this.websocket.addEventListener("open", (ev) => {
            console.log("WebSocket connected", ev);
        });
        this.websocket.addEventListener("message", (ev) => {
            const { op, d, t } = JSON.parse(ev.data);
            console.log(op, d, t);
            switch (op) {
                case 10: // Hello
                    setInterval(() => {
                        this.websocket.send(JSON.stringify({
                            op: 1, // Heartbeat
                        }));
                    }, d.heartbeat_interval);
                    this.websocket.send(JSON.stringify({
                        op: 2, // Identify
                        d: {
                            token: this.options.token,
                            properties: {
                                os: "linux",
                                browser: "rello.js",
                                device: "rello.js"
                            },
                            intents: 513 // Example intents
                        }
                    }));
                case 0:
                    this.options.handler(t, d);
                    break;
            }
            // this.options.handler();
        });
        this.websocket.addEventListener("close", (ev) => {
            console.log("WebSocket disconnected", ev);
        });
    }
}
exports.WebSocketManager = WebSocketManager;
