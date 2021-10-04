import { BadRequestException } from '@nestjs/common'

export class IncorrectRoleException extends BadRequestException {
    constructor() {
        super('Incorrect Role!')
    }
}
