"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const WebSocketManager_1 = require("../manager/WebSocketManager");
class Client extends eventemitter3_1.default {
    constructor(options) {
        super();
        this.token = options.token;
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connect();
            }
            catch (error) {
                console.error('Failed to connect:', error);
            }
        }))();
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            // const wsOptions = this.wsOptions || {};
            const url = 'ws://127.0.0.1:4455';
            // Create WebSocketManager instance
            this.wsManager = new WebSocketManager_1.WebSocketManager({
                "token": this.token,
                url,
                handler: this.handleWsMessages.bind(this)
            });
        });
    }
    handleWsMessages(t, d) {
        this.emit(t, d);
    }
}
exports.Client = Client;
