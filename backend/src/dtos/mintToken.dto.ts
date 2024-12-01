import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsString, IsNotEmpty } from 'class-validator';

export class MintTokenDto {
  @ApiProperty({
    description: 'Ethereum address of the recipient',
    example: '0xAbC1234567890DefABC1234567890DEFabc12345',
  })
  @IsEthereumAddress()
  address: string;
  @ApiProperty({
    description: 'Amount of tokens to mint',
    example: '100',
  })
  @IsString()
  @IsNotEmpty()
  amount: string;
}