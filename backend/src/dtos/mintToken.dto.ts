import { ApiProperty } from '@nestjs/swagger';
import {Address} from "viem";

export class MintTokenDto {
  @ApiProperty({ type: String, required: true, default: 'My Address' })
  address: Address;
}
