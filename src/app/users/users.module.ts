import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './users.entity'
import {TimeSheetsService} from '../time-sheets/time-sheets.service'

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UsersService, TimeSheetsService],
    controllers: [UsersController]
})
export class UsersModule {
}
