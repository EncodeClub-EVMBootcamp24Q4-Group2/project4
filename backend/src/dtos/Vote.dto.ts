import { IsNumber, IsString } from 'class-validator';

export class VoteDto {
    @IsNumber()
    proposal: number;

    @IsString()
    amount: string;
}