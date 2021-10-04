import { ForbiddenException } from '@nestjs/common'
import { ETimeSheetItemStatus } from '../../app/time-sheets/time-sheets.constants'

export class TimeSheetClosedStatusRoleException extends ForbiddenException {
    constructor() {
        super(`Only an admin can modify a timeSheet log with ${ETimeSheetItemStatus.CLOSED} status`)
    }
}
