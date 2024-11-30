"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const tokenJson = require("./assets/MyToken.json");
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const config_1 = require("@nestjs/config");
const accounts_1 = require("viem/accounts");
let AppService = class AppService {
    constructor(configService) {
        this.configService = configService;
        const rpcEndpoint = this.configService.get('RPC_ENDPOINT_URL');
        const transport = (0, viem_1.http)(rpcEndpoint);
        this.publicClient = (0, viem_1.createPublicClient)({
            chain: chains_1.sepolia,
            transport: transport,
        });
        const account = (0, accounts_1.privateKeyToAccount)(`0x${this.configService.get('PRIVATE_KEY')}`);
        this.walletClient = (0, viem_1.createWalletClient)({
            transport: transport,
            chain: chains_1.sepolia,
            account: account,
        });
    }
    getHello() {
        return 'Hello World! Test!';
    }
    getContractAddress() {
        return this.configService.get('MYTOKEN_ADDRESS');
    }
    async getTokenName() {
        const name = await this.publicClient.readContract({
            address: this.getContractAddress(),
            abi: tokenJson.abi,
            functionName: 'name',
        });
        return name;
    }
    async getTotalSupply() {
        const symbol = await this.publicClient.readContract({
            address: this.getContractAddress(),
            abi: tokenJson.abi,
            functionName: 'symbol',
        });
        const totalSupply = await this.publicClient.readContract({
            address: this.getContractAddress(),
            abi: tokenJson.abi,
            functionName: 'totalSupply',
        });
        return `${(0, viem_1.formatEther)(totalSupply)} ${symbol}`;
    }
    async getTokenBalance(address) {
        const symbol = await this.publicClient.readContract({
            address: this.getContractAddress(),
            abi: tokenJson.abi,
            functionName: 'symbol',
        });
        const balanceOf = await this.publicClient.readContract({
            address: this.getContractAddress(),
            abi: tokenJson.abi,
            functionName: 'balanceOf',
            args: [address],
        });
        return `${(0, viem_1.formatEther)(balanceOf)} ${symbol}`;
    }
    async getTransactionReceipt(hash) {
        const tx = await this.publicClient.getTransactionReceipt({ hash });
        return `Transaction status: ${tx.status}, Block number ${tx.blockNumber}`;
    }
    getServerWalletAddress() {
        return this.walletClient.account.address;
    }
    async checkMinterRole(address) {
        const MINTER_ROLE = await this.publicClient.readContract({
            address: this.getContractAddress(),
            abi: tokenJson.abi,
            functionName: 'MINTER_ROLE',
        });
        const hasRole = await this.publicClient.readContract({
            address: this.getContractAddress(),
            abi: tokenJson.abi,
            functionName: 'hasRole',
            args: [MINTER_ROLE, address],
        });
        return `The address ${address} ${hasRole ? 'has' : 'does not have'} the role ${MINTER_ROLE}`;
    }
    async mintTokens(address, amount) {
        try {
            const txHash = await this.walletClient.writeContract({
                address: this.getContractAddress(),
                abi: tokenJson.abi,
                functionName: 'mint',
                args: [address, (0, viem_1.parseEther)(amount)],
            });
            return txHash;
        }
        catch (error) {
            throw error;
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppService);
//# sourceMappingURL=app.service.js.map