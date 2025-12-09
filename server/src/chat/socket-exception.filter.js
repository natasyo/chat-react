"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
let SocketExceptionFilter = class SocketExceptionFilter {
    catch(exception, host) {
        console.log('exception');
        const ctx = host.switchToWs();
        const client = ctx.getClient();
        client.emit('exception', { message: exception.message });
        console.log('------------exception');
    }
};
exports.SocketExceptionFilter = SocketExceptionFilter;
exports.SocketExceptionFilter = SocketExceptionFilter = __decorate([
    (0, common_1.Catch)(websockets_1.WsException)
], SocketExceptionFilter);
//# sourceMappingURL=socket-exception.filter.js.map