import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Req,
    ValidationPipe,
} from '@nestjs/common'
import { TIME_SHEETS_ENDPOINT, TIME_SHEETS_ITEM_ENDPOINT, TIME_SHEETS_ITEM_STATUS_ENDPOINT } from './time-sheets.routes'
import { TimeSheetsService } from './time-sheets.service'
import { CreateTimeSheetItemDto } from './dto/create-time-sheet.dto'
import { Request } from 'express'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator'
import { getCurrentUserInfo } from '../../shared/utils/shared.utils'
import { UpdateTimeSheetItemDto } from './dto/update-time-sheet.dto'
import { DefaultResponse } from '../../exceptions/default-response'
import { TimeSheetItemEntity } from './time-sheets.entity'
import { UpdateTimeSheetsStatusesDto } from './dto/update-time-sheets-statuses.dto'
import { Pager } from '../../shared/middlewares/pagination.middleware'

@ApiTags('TimeSheets')
@Controller(TIME_SHEETS_ENDPOINT)
export class TimeSheetsController {
    constructor(private readonly timeSheetsService: TimeSheetsService) {
    }

  @ApiBearerAuth()
  @Put(TIME_SHEETS_ITEM_STATUS_ENDPOINT)
    async updateTimeSheetsStatuses(
    @Req() req: Request,
    @Body(new ValidationPipe({ transform: true })) body: UpdateTimeSheetsStatusesDto,
    ): Promise<DefaultResponse> {
        return await this.timeSheetsService.updateStatuses(body, getCurrentUserInfo(req.jwtUser))
    }

    @ApiImplicitQuery({
        name: 'take',
        required: false,
        type: String,
    })
  @ApiImplicitQuery({
      name: 'skip',
      required: false,
      type: String,
  })
  @ApiImplicitQuery({
      name: 'startDate',
      required: false,
      type: String,
  })
  @ApiImplicitQuery({
      name: 'endDate',
      required: false,
      type: String,
  })
  @ApiImplicitQuery({
      name: 'userId',
      required: false,
      type: String,
  })
  @ApiBearerAuth()
  @Get('/')
  async getTimeSheets(
    @Req() req: Request,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('userId') userId?: number,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ): Promise<[TimeSheetItemEntity[], number]> {

      return await this.timeSheetsService.getAllTimeSheetsSafe(
          getCurrentUserInfo(req.jwtUser),
          {
              startDate: startDate ? new Date(startDate) : undefined,
              endDate: endDate ? new Date(endDate) : undefined,
              userId: userId ? userId : undefined,
          },
          new Pager(+take, +skip)
      )
  }

  @ApiBearerAuth()
  @Post('/')
    async createTimeSheet(@Body(new ValidationPipe({ transform: true })) body: CreateTimeSheetItemDto, @Req() req: Request): Promise<{timeSheetId: number}> {
        return await this.timeSheetsService.save(body, getCurrentUserInfo(req.jwtUser))
    }

  @ApiBearerAuth()
  @Delete(TIME_SHEETS_ITEM_ENDPOINT)
  async deleteTimeSheet(@Req() req: Request, @Param('id', ParseIntPipe) id: number): Promise<DefaultResponse> {
      return await this.timeSheetsService.deleteByIdSafe(id, getCurrentUserInfo(req.jwtUser))
  }

  @ApiBearerAuth()
  @Put(TIME_SHEETS_ITEM_ENDPOINT)
  async updateTimeSheet(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ transform: true })) body: UpdateTimeSheetItemDto,
  ): Promise<DefaultResponse> {
      return await this.timeSheetsService.updateSafe(id, body, getCurrentUserInfo(req.jwtUser))
  }

}
