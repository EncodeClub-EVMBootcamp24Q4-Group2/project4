import { Address } from 'viem';
import { ConfigService } from '@nestjs/config';
export declare class AppService {
    private configService;
    publicClient: any;
    walletClient: any;
    constructor(configService: ConfigService);
    getHello(): string;
    getContractAddress(): Address;
    getTokenName(): Promise<string>;
    getTotalSupply(): Promise<string>;
    getTokenBalance(address: Address): Promise<string>;
    getTransactionReceipt(hash: string): Promise<string>;
    getServerWalletAddress(): any;
    checkMinterRole(address: string): Promise<string>;
    mintTokens(address: Address): Promise<any>;
}
