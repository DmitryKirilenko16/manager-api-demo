import { NotFoundException } from '@nestjs/common'

export class TimeSheetNotFoundException extends NotFoundException {
    constructor() {
        super('Timesheet is not found!')
    }
}
