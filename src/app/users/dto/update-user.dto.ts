import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator'
import { EEmployeeStatus, ERole } from '../users.constants'

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(15)
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(30)
  position?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(ERole.ADMIN)
  @Max(ERole.VISITOR)
  role?: ERole;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(1000)
  ratePerHour?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(1000000)
  ratePerMonth?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(EEmployeeStatus.PRIVATE_ENTREPRENEUR)
  @Max(EEmployeeStatus.TRAINEE)
  employeeStatus?: EEmployeeStatus;
}
