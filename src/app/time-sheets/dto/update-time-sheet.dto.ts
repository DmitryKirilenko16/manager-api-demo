import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ETimeSheetItemStatus } from '../time-sheets.constants'

export class UpdateTimeSheetItemDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(24)
  hours: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  taskDescription: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(ETimeSheetItemStatus.OPENED)
  @Max(ETimeSheetItemStatus.CLOSED)
  status: number;
}
