import { BadRequestException } from '@nestjs/common'

export class TimeSheetInvalidHoursException extends BadRequestException {
    constructor() {
        super('Hours number must be more or equal 1')
    }
}

