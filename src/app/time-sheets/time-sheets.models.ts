import { ERole } from '../users/users.constants'
import { IDateFilter } from '../../shared/shared.models'
import { ETimeSheetItemStatus } from './time-sheets.constants'

export interface ICurrentUserInfo {
  userRole: ERole,
  userId: number
}

export interface ITimeSheetsFilter extends IDateFilter {
  userId?: number,
  status?: ETimeSheetItemStatus
}
