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
var AppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const tokenJson = require("./assets/MyToken.json");
const ballotJson = require("./assets/TokenizedBallot.json");
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const config_1 = require("@nestjs/config");
const accounts_1 = require("viem/accounts");
const ethers_1 = require("ethers");
let AppService = AppService_1 = class AppService {
    constructor(configService) {
        this.configService = configService;
        this.proposalCount = 3;
        this.logger = new common_1.Logger(AppService_1.name);
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
        return 'Hello World from Fang10000!';
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
    async vote(proposal, amount) {
        try {
            const txHash = await this.walletClient.writeContract({
                address: this.configService.get('TOKENIZED_BALLOT_ADDRESS'),
                abi: ballotJson.abi,
                functionName: 'vote',
                args: [proposal, (0, viem_1.parseEther)(amount)],
            });
            return txHash;
        }
        catch (error) {
            this.logger.error('Vote Error:', error);
            throw new Error(`Vote failed: ${error.message}`);
        }
    }
    async getWinningProposal() {
        try {
            const ballotAddress = this.configService.get('TOKENIZED_BALLOT_ADDRESS');
            this.logger.log(`Fetching winning proposal from: ${ballotAddress}`);
            const winningProposal = await this.publicClient.readContract({
                address: ballotAddress,
                abi: ballotJson.abi,
                functionName: 'winningProposal',
                args: [],
            });
            const winnerName = await this.publicClient.readContract({
                address: this.configService.get('TOKENIZED_BALLOT_ADDRESS'),
                abi: ballotJson.abi,
                functionName: 'winnerName',
                args: [],
            });
            return {
                winningProposal: Number(winningProposal),
                winnerName: ethers_1.ethers.utils.parseBytes32String(winnerName),
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch winning proposal: ${error.message}`);
        }
    }
    async getVotingResults() {
        try {
            const ballotAddress = this.configService.get('TOKENIZED_BALLOT_ADDRESS');
            const ballotABI = ballotJson.abi;
            this.logger.log(`Fetching voting results from: ${ballotAddress}`);
            const results = [];
            for (let i = 0; i < this.proposalCount; i++) {
                this.logger.log(`Fetching proposal ID: ${i}`);
                const proposal = await this.publicClient.readContract({
                    address: ballotAddress,
                    abi: ballotABI,
                    functionName: 'proposals',
                    args: [i],
                });
                const proposalString = JSON.stringify(proposal, (key, value) => typeof value === 'bigint' ? value.toString() : value);
                this.logger.log(`Proposal ${i}: ${proposalString}`);
                const nameBytes32 = proposal[0];
                const voteCountBigInt = proposal[1];
                const name = ethers_1.ethers.utils.parseBytes32String(nameBytes32);
                const voteCount = voteCountBigInt.toString();
                this.logger.log(`Parsed Proposal ${i} Name: ${name}, Vote Count: ${voteCount}`);
                results.push({ proposalId: i, name, voteCount });
                this.logger.log(`Type of proposal[0]: ${typeof proposal[0]}`);
                this.logger.log(`Type of proposal[1]: ${typeof proposal[1]}`);
            }
            const resultsString = JSON.stringify(results, (key, value) => typeof value === 'bigint' ? value.toString() : value);
            this.logger.log(`Voting Results: ${resultsString}`);
            return results;
        }
        catch (error) {
            this.logger.error(`Failed to fetch voting results: ${error.message}`, error.stack);
            throw new Error(`Failed to fetch voting results: ${error.message}`);
        }
    }
};
exports.AppService = AppService;
exports.AppService = AppService = AppService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppService);
//# sourceMappingURL=app.service.js.map