import { Body, Controller, Get, Param, Post, Query, HttpException, HttpStatus} from '@nestjs/common';
import { AppService } from './app.service';
import { Address } from 'viem';
import { MintTokenDto } from './dtos/MintToken.dto';
import { VoteDto } from './dtos/Vote.dto';

@Controller()
export class AppController {
  
  constructor(private readonly appService: AppService) {}

  // MyToken endpoints
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('contract-address')
  getContractAddress() {
    return { result: this.appService.getContractAddress() };
  }

  @Get('token-name')
  async getTokenName() {
      return { result: await this.appService.getTokenName() };
  }

  @Get('total-supply')
  async getTotalSupply() {
    return { result: await this.appService.getTotalSupply() };
  }

  @Get('token-balance/:address')
  async getTokenBalance(@Param('address') address: Address) {
    return { result: await this.appService.getTokenBalance(address) };
  }

  @Get('transaction-receipt')
  async getTransactionReceipt(@Query('hash') hash: string) {
    return { result: await this.appService.getTransactionReceipt(hash) };
  }

  @Get('server-wallet-address')
  getServerWalletAddress() {
    return { result: this.appService.getServerWalletAddress() };
  }

  @Get('check-minter-role')
  async checkMinterRole(@Query('address') address: Address) {
    return { result: await this.appService.checkMinterRole(address) };
  }

  @Post('mint-tokens')
  async mintTokens(@Body() mintTokenDto: MintTokenDto) {
    try {
      const txHash = await this.appService.mintTokens(mintTokenDto.address as Address, mintTokenDto.amount);
      return { txHash }; // Return txHash within an object
    } catch (error) {
      // Log the error for debugging
      console.error('Minting Error:', error);
      throw new HttpException(
        { error: error.message || 'Minting failed' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Voting endpoints
  @Post('vote')
  async vote(@Body() body: VoteDto) {
      const txHash = await this.appService.vote(body.proposal, body.amount);
      return { txHash };
  }

  @Get('winning-proposal')
  async getWinningProposal() {
      const result = await this.appService.getWinningProposal();
      return { result };
  }

  @Get('voting-results')
  async getVotingResults() {
      const results = await this.appService.getVotingResults();
      return { results };
  }
}