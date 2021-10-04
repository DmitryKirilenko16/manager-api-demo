import { RoleException } from './role.exception'
import { ICurrentUserInfo } from '../../app/time-sheets/time-sheets.models'
import { ERole } from '../../app/users/users.constants'

export class RoleUtils {
    static hasRestrictionProp<Prop = string>(obj: any, props: Prop[]): boolean {
        for (let i = 0; i < props.length; i++) {
            if (obj.hasOwnProperty(props[i])) {
                return true
            }
        }

        return false
    }

    static accessRestriction(requestedId: number, currentUserInfo: ICurrentUserInfo) {
        if ((currentUserInfo.userRole !== ERole.ADMIN) && (requestedId !== currentUserInfo.userId)) {
            throw new RoleException()
        }
    }
}
