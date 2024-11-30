import { AppService } from './app.service';
import { Address } from 'viem';
import { MintTokenDto } from './dtos/MintToken.dto';
export declare class AppController {
    private readonly appService;
    logger: any;
    constructor(appService: AppService);
    getHello(): string;
    getContractAddress(): {
        result: `0x${string}`;
    };
    getTokenName(): Promise<{
        result: string;
    }>;
    getTotalSupply(): Promise<{
        result: string;
    }>;
    getTokenBalance(address: Address): Promise<{
        result: string;
    }>;
    getTransactionReceipt(hash: string): Promise<{
        result: string;
    }>;
    getServerWalletAddress(): {
        result: any;
    };
    checkMinterRole(address: Address): Promise<{
        result: string;
    }>;
    mintTokens(body: MintTokenDto): Promise<{
        result: any;
    }>;
}
