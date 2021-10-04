import {Injectable} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {ERole} from '../../users/users.constants'
import {UserEntity} from '../../users/users.entity'

export interface IJwtPayload {
    id: number
    email: string,
    role: ERole
}

@Injectable()
export class JwtAuthService {
    constructor(
        private readonly jwtService: JwtService,
    ) {
    }

    async sign(user: UserEntity) {
        const payload: IJwtPayload = {
            id: user.id,
            email: user.email,
            role: user.role,
        }

        return {
            accessToken: this.jwtService.sign(payload, {expiresIn: '2h'}),
        }
    }
}
