import { Injectable, Logger} from '@nestjs/common';
import * as tokenJson from './assets/MyToken.json';
import * as ballotJson from './assets/TokenizedBallot.json';
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
import { ethers } from 'ethers';

@Injectable()
export class AppService {
    publicClient;
    walletClient;
    // tokenizedBallotClient;

    // Number of prposals in the ballot 
    private readonly proposalCount: number = 3;
    private readonly logger = new Logger(AppService.name);
    // logger: any;

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
        return 'Hello World from Fang10000!';
    }

    // MyToken methods
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

    async mintTokens(address: Address, amount: string) {
        try {
            const txHash = await this.walletClient.writeContract({
                address: this.getContractAddress(),
                abi: tokenJson.abi,
                functionName: 'mint',
                args: [address, parseEther(amount)],
            });
            return txHash;
        } catch (error) {
            throw error;
        }
    }

    // TokenizedBallot methods
    // Cast vote for a proposal
    async vote(proposal: number, amount: string) {
        try {
            const txHash = await this.walletClient.writeContract({
                address: this.configService.get<string>('TOKENIZED_BALLOT_ADDRESS') as Address,
                abi: ballotJson.abi,
                functionName: 'vote', // **Added:** Specify function name
                args: [proposal, parseEther(amount)],
            });
            return txHash;
        } catch (error) {
            this.logger.error('Vote Error:', error);
            throw new Error(`Vote failed: ${error.message}`);
        }
    }

    // Get the winning proposal
    async getWinningProposal() {
        try {
            const ballotAddress = this.configService.get<string>('TOKENIZED_BALLOT_ADDRESS') as Address;
            this.logger.log(`Fetching winning proposal from: ${ballotAddress}`);
            
            const winningProposal = await this.publicClient.readContract({
                address: ballotAddress,
                abi: ballotJson.abi,
                functionName: 'winningProposal',
                args: [],
            });

            const winnerName = await this.publicClient.readContract({
                address: this.configService.get<string>('TOKENIZED_BALLOT_ADDRESS') as Address,
                abi: ballotJson.abi,
                functionName: 'winnerName',
                args: [],
            });

            return {
                winningProposal: Number(winningProposal),
                winnerName: ethers.utils.parseBytes32String(winnerName as string),
            };
        } catch (error) {
            throw new Error(`Failed to fetch winning proposal: ${error.message}`);
        }
    }

    // Get the current voting results
    async getVotingResults() {
        try {
            const ballotAddress = this.configService.get<string>('TOKENIZED_BALLOT_ADDRESS') as Address;
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
    
                // Log the raw proposal array
                const proposalString = JSON.stringify(proposal, (key, value) =>
                    typeof value === 'bigint' ? value.toString() : value
                );
                this.logger.log(`Proposal ${i}: ${proposalString}`);
    
                // Access proposal elements by index
                const nameBytes32 = proposal[0] as string;
                const voteCountBigInt = proposal[1] as bigint;
    
                // Parse the bytes32 string to a readable string
                const name = ethers.utils.parseBytes32String(nameBytes32);
                const voteCount = voteCountBigInt.toString();
    
                this.logger.log(`Parsed Proposal ${i} Name: ${name}, Vote Count: ${voteCount}`);
    
                results.push({ proposalId: i, name, voteCount });
                this.logger.log(`Type of proposal[0]: ${typeof proposal[0]}`);
                this.logger.log(`Type of proposal[1]: ${typeof proposal[1]}`);
            }
    
            // Handle results serialization if needed
            const resultsString = JSON.stringify(results, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            );
            this.logger.log(`Voting Results: ${resultsString}`);
            return results;
        } catch (error) {
            this.logger.error(`Failed to fetch voting results: ${error.message}`, error.stack);
            throw new Error(`Failed to fetch voting results: ${error.message}`);
        }
    }
}