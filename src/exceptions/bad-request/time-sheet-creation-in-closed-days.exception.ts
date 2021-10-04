import { BadRequestException } from '@nestjs/common'

export class TimeSheetCreationInClosedDaysException extends BadRequestException {
    constructor() {
        super('Only an admin can create logs in closed calendar cells')
    }
}
