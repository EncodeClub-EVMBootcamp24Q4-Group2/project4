import { ApiProperty } from '@nestjs/swagger';
import {Address} from "viem";
import { IsEthereumAddress, IsString } from 'class-validator';

export class MintTokenDto {
  @IsEthereumAddress()
  address: string;

  @IsString()
  amount: string;
}