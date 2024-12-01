import { AppService } from './app.service';
import { Address } from 'viem';
import { MintTokenDto } from './dtos/MintToken.dto';
import { VoteDto } from './dtos/Vote.dto';
export declare class AppController {
    private readonly appService;
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
    mintTokens(mintTokenDto: MintTokenDto): Promise<{
        txHash: any;
    }>;
    vote(body: VoteDto): Promise<{
        txHash: any;
    }>;
    getWinningProposal(): Promise<{
        result: {
            winningProposal: number;
            winnerName: string;
        };
    }>;
    getVotingResults(): Promise<{
        results: any[];
    }>;
}
