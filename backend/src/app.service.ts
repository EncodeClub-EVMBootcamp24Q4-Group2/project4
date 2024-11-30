import { Injectable } from '@nestjs/common';
import * as tokenJson from './assets/MyToken.json';
import {
    Address,
    createPublicClient,
    createWalletClient,
    formatEther,
    http,
    parseEther,
} from 'viem';
import { sepolia } from 'viem/chains';
import { ConfigService } from '@nestjs/config';
import { privateKeyToAccount } from 'viem/accounts';

@Injectable()
export class AppService {
    publicClient;
    walletClient;

    constructor(private configService: ConfigService) {
        const rpcEndpoint = this.configService.get<string>('RPC_ENDPOINT_URL');
        const transport = http(rpcEndpoint);

        this.publicClient = createPublicClient({
            chain: sepolia,
            transport: transport,
        });

        const account = privateKeyToAccount(
            `0x${this.configService.get<string>('PRIVATE_KEY')}`,
        );

        this.walletClient = createWalletClient({
            transport: transport,
            chain: sepolia,
            account: account,
        });
    }

    getHello(): string {
        return 'Hello World! Test!';
    }

    getContractAddress(): Address {
        return this.configService.get<Address>('MYTOKEN_ADDRESS') as Address;
    }

    async getTokenName(): Promise<string> {
        const name = await this.publicClient.readContract({
            address: this.getContractAddress(),
            abi: tokenJson.abi,
            functionName: 'name',
        });
        return name as string;
    }

    async getTotalSupply(): Promise<string> {
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
        return `${formatEther(totalSupply as bigint)} ${symbol}`;
    }

    async getTokenBalance(address: Address) {
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
        return `${formatEther(balanceOf as bigint)} ${symbol}`;
    }

    async getTransactionReceipt(hash: string) {
        const tx = await this.publicClient.getTransactionReceipt({ hash });
        return `Transaction status: ${tx.status}, Block number ${tx.blockNumber}`;
    }

    getServerWalletAddress() {
        return this.walletClient.account.address;
    }

    async checkMinterRole(address: string) {
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

    async mintTokens(address: Address) {
        const txHash = await this.walletClient.writeContract({
            address: this.getContractAddress(),
            abi: tokenJson.abi,
            functionName: 'mint',
            args: [address, parseEther('0.07')],
        });
        return txHash;
    }
}