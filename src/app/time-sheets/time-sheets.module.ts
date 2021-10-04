import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TimeSheetItemEntity } from './time-sheets.entity'
import { TimeSheetsController } from './time-sheets.controller'
import { TimeSheetsService } from './time-sheets.service'
import { UsersService } from '../users/users.service'

@Module({
    imports: [TypeOrmModule.forFeature([TimeSheetItemEntity])],
    controllers: [TimeSheetsController],
    providers: [TimeSheetsService, UsersService],
})
export class TimeSheetsModule {

}
