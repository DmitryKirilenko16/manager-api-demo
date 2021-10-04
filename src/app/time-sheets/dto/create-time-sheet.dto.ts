import { IsDateString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { UpdateTimeSheetItemDto } from './update-time-sheet.dto'

export class CreateTimeSheetItemDto extends UpdateTimeSheetItemDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  projectId: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(1)
  userId?: number;
}
