import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class UpdateProfileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(2)
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(2)
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  @MinLength(4)
  phoneNumber: string;
}
