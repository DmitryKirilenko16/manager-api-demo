import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, IsNumber, Max, Min } from 'class-validator'
import { ETimeSheetItemStatus } from '../time-sheets.constants'

export class UpdateTimeSheetsStatusesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(ETimeSheetItemStatus.OPENED)
  @Max(ETimeSheetItemStatus.CLOSED)
  status: ETimeSheetItemStatus;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  userId: number;
}
