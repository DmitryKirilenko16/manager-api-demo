import {ForbiddenException} from '@nestjs/common'

export class RoleException extends ForbiddenException {
    constructor() {
        super('Forbidden')
    }
}
