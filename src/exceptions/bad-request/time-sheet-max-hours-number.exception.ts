import { BadRequestException } from '@nestjs/common'

export class TimeSheetMaxHoursNumberException extends BadRequestException {
    constructor(sum: number, newHoursValue: number) {
        super(`You can not create a timeSheet log cause max hours number is 24 in this day. Current sum: ${sum}, current value: ${newHoursValue}` )
    }
}
