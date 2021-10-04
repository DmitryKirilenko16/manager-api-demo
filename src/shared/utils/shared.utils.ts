import { IJwtPayload } from '../../app/auth/services/auth-jwt.service'
import { ERole } from '../../app/users/users.constants'

export interface ICurrentUserInfo {
    userId: number,
    userRole: ERole
}

export const getCurrentUserInfo = (jwtUser: IJwtPayload): ICurrentUserInfo => {
    return {
        userId: jwtUser.id,
        userRole: jwtUser.role,
    }
}

