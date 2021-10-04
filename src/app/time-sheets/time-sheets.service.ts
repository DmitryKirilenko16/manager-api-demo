import { Injectable } from '@nestjs/common'
import { Between, Connection, Equal, Repository } from 'typeorm'
import { TimeSheetItemEntity } from './time-sheets.entity'
import { UsersService } from '../users/users.service'
import { CreateTimeSheetItemDto } from './dto/create-time-sheet.dto'
import { TimeSheetNotFoundException } from '../../exceptions/not-found/time-sheet-not-found.exception'
import { RoleException } from '../../exceptions/role/role.exception'
import { ICurrentUserInfo, ITimeSheetsFilter } from './time-sheets.models'
import { getDateWhereFilterCondition } from '../../shared/utils/db/get-date-where-filter-condition.util'
import { UpdateTimeSheetItemDto } from './dto/update-time-sheet.dto'
import { DefaultResponse } from '../../exceptions/default-response'
import { ERole } from '../users/users.constants'
import { getMonthStartEndDates, setBeginAndEndOfTwoDates } from '../../shared/utils/dates/month-start-end-dates.util'
import * as dayjs from 'dayjs'
import * as isBetween from 'dayjs/plugin/isBetween'
import { IPager, Pager } from '../../shared/middlewares/pagination.middleware'
import { TimeSheetQueryUtils } from './utils/timesheet.query.utils'
import { camelCase } from '../../shared/utils/code/camel-case.util'
import { TimeSheetMaxHoursNumberException } from '../../exceptions/bad-request/time-sheet-max-hours-number.exception'
import { ONE_DAY_HOURS_NUMBER } from '../../shared/utils/dates/dates.constants'
import { ETimeSheetItemStatus } from './time-sheets.constants'
import { TimeSheetClosedStatusRoleException } from '../../exceptions/role/time-sheet-status-role.exception'
import { UpdateTimeSheetsStatusesDto } from './dto/update-time-sheets-statuses.dto'
import { TimeSheetCreationInClosedDaysException } from '../../exceptions/bad-request/time-sheet-creation-in-closed-days.exception'

dayjs.extend(isBetween)

@Injectable()
export class TimeSheetsService {
  private readonly timeSheetsRepository: Repository<TimeSheetItemEntity>;

  constructor(
    private readonly connection: Connection,
    private readonly usersService: UsersService
  ) {
      this.timeSheetsRepository = this.connection.getRepository(TimeSheetItemEntity)
  }

  public async checkExistence(id: number): Promise<TimeSheetItemEntity> {
      const timeSheet = await this.timeSheetsRepository.findOne(id)

      if (!timeSheet) {
          throw new TimeSheetNotFoundException()
      }

      return timeSheet
  }

  private async checkPossibilityToModify(timeSheetId: number, currentUser: ICurrentUserInfo) {
      const currentTimeSheetItem = await this.checkExistence(timeSheetId)

      if (+currentUser.userRole !== ERole.ADMIN) {
          if (+currentTimeSheetItem.user_id !== +currentUser.userId) {
              throw new RoleException()
          } else {
              if (+currentTimeSheetItem.status === ETimeSheetItemStatus.CLOSED) {
                  throw new TimeSheetClosedStatusRoleException()
              }
          }
      }
  }

  private async throwErrorIfHoursNumberIsInvalid(userId: number, hoursNumber: number, date: Date, prevHours?: number /** For updates */) {
      const [userTimesSheets] = await this.getAllTimeSheets({
          startDate: date,
          endDate: date,
          userId: userId,
      })
      const hoursSum = userTimesSheets.reduce((prev, current) => prev + current.hours, 0)

      if ((((hoursSum + hoursNumber) - (prevHours || 0)) > ONE_DAY_HOURS_NUMBER)) {
          throw new TimeSheetMaxHoursNumberException(hoursSum, hoursNumber)
      }
  }

  public async save(body: CreateTimeSheetItemDto, currentUserInfo: ICurrentUserInfo): Promise<{ timeSheetId: number }> {
      const userIdForCreation =  body.userId || currentUserInfo.userId

      if(currentUserInfo.userRole !== ERole.ADMIN) {
          /** Only an admin can create logs for any user */
          if(body.userId) {
              throw new RoleException()
          }
      }

      if(currentUserInfo.userRole !== ERole.ADMIN) {
          /** Only an admin can create logs in closed calendar cells */
          const {firstDayDate, lastDayDate} = getMonthStartEndDates(body.date)

          const [userTimesSheets] = await this.getAllTimeSheets({
              startDate: firstDayDate,
              endDate: lastDayDate,
              userId: userIdForCreation,
          })

          if(userTimesSheets?.length && userTimesSheets.some(item => item.status === ETimeSheetItemStatus.CLOSED)) {
              throw new TimeSheetCreationInClosedDaysException()
          }

      }

      if(currentUserInfo.userRole !== ERole.ADMIN) {
          /** Only an admin can set up log's status */
          if(body.hasOwnProperty('status')) {
              throw new RoleException()
          }
      }


      const currentUser = await this.usersService.checkExistence({ id: userIdForCreation })

      await this.throwErrorIfHoursNumberIsInvalid(currentUser.id, body.hours, body.date)

      const createdTimeSheet = await this.timeSheetsRepository.save({
          ...body,
          user: currentUser,
          status: ETimeSheetItemStatus.OPENED,
      })

      return {
          timeSheetId: createdTimeSheet.id,
      }
  }

  public async getAllTimeSheetsSafe(currentUserInfo: ICurrentUserInfo, timeSheetFilter: ITimeSheetsFilter, pager?: Pager) {
      const throwRoleException = () => {
          if (currentUserInfo.userRole !== ERole.ADMIN) {
              throw new RoleException()
          }
      }

      if (timeSheetFilter.userId) {
          if (+timeSheetFilter.userId !== +currentUserInfo.userId) {
              throwRoleException()
          }
      } else {
          throwRoleException()
      }

      return await this.getAllTimeSheets(timeSheetFilter, pager)
  }

  private async getAllTimeSheets(timeSheetFilter: ITimeSheetsFilter, pager?: IPager): Promise<[TimeSheetItemEntity[], number]> {
      if (timeSheetFilter.userId) {
          await this.usersService.checkExistence({ id: timeSheetFilter.userId })
      }

      const getWhereStatement = (withNullAsStatus = false) => ({
          ...getDateWhereFilterCondition(timeSheetFilter),
          ...(timeSheetFilter?.userId ? { user_id: timeSheetFilter.userId } : {}),
          ...(timeSheetFilter?.status ? { status: withNullAsStatus ? null : timeSheetFilter.status } : {}),
      })

      const timeSheets = await this.timeSheetsRepository.find({
          where: [
              getWhereStatement(), /** OR */ getWhereStatement(true),
          ],
          ...(pager ? { ...pager } : {}),
          select: TimeSheetQueryUtils.timeSheetAccessibleFields,
      })

      const getUserTimeSheetsCount = async () => await this.timeSheetsRepository
          .createQueryBuilder('timeSheets')
          .where('timeSheets.user_id = :id')
          .setParameters({id: timeSheetFilter.userId})
          .getCount()

      const getTimeSheetsCount = async () => await this.timeSheetsRepository
          .createQueryBuilder('timeSheets')
          .getCount()

      const count = await (timeSheetFilter?.userId ? getUserTimeSheetsCount() : getTimeSheetsCount())

      return [
          timeSheets.map(timeSheetItem => camelCase<TimeSheetItemEntity>(timeSheetItem)),
          count
      ]
  }

  public async updateSafe(id: number, body: UpdateTimeSheetItemDto, currentUser: ICurrentUserInfo): Promise<DefaultResponse> {
      if (body.status && currentUser.userRole !== ERole.ADMIN) {
          throw new RoleException()
      }

      await this.checkPossibilityToModify(id, currentUser)

      const timeSheet = await this.checkExistence(id)

      await this.throwErrorIfHoursNumberIsInvalid(timeSheet.user_id, body.hours, timeSheet.date, timeSheet.hours)

      const updateData = await this.timeSheetsRepository.update(timeSheet.id, body)

      return new DefaultResponse(!!updateData.affected)
  }

  public async deleteByIdSafe(id: number, currentUserInfo: ICurrentUserInfo): Promise<DefaultResponse> {
      await this.checkPossibilityToModify(id, currentUserInfo)

      const deleteData = await this.timeSheetsRepository.delete(id)

      return new DefaultResponse(!!deleteData.affected)
  }

  public async updateStatuses(body: UpdateTimeSheetsStatusesDto, currentUserInfo: ICurrentUserInfo): Promise<DefaultResponse> {
      if (currentUserInfo.userRole !== ERole.ADMIN) {
          throw new RoleException()
      }

      const [startDate, endDate] = setBeginAndEndOfTwoDates(body.startDate, body.endDate)

      const updatedInfo = await this.timeSheetsRepository.update(
          {
              date: Between(startDate, endDate),
              user_id: Equal(body.userId)
          },
          {
              status: body.status
          }
      )

      return new DefaultResponse(!!updatedInfo.affected)

  }
}
