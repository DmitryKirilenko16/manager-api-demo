import {Injectable} from '@nestjs/common'
import {UsersService} from '../../users/users.service'
import {Request, Response} from 'express'
import {JwtAuthService} from './auth-jwt.service'
import {IGoogleUser} from '../../users/users.models'
import {ERole} from '../../users/users.constants'
import {UserEntity} from '../../users/users.entity'
import {CO_WORKER_EMAIL_DOMAIN} from '../../../shared/shared.constants'

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtAuthService: JwtAuthService,
    ) {
    }

    static tokenRedirect(redirectCb: (url: string) => void, token: string, isSuccess = true) {
        return redirectCb(`${process.env.CLIENT_URL}/login/${isSuccess ? 'success' : 'failure'}/?token=${token}`)
    }

    private async redirectToClientWithToken(
        user: UserEntity,
        redirectCb: (token: string) => void,
    ) {
        const {accessToken} = await this.jwtAuthService.sign(user)

        return AuthService.tokenRedirect(redirectCb, accessToken, !!accessToken)
    }

    private async createUser(candidate: IGoogleUser) {
        return await this.usersService.save(
            {
                ...candidate,
                role: candidate.email.includes(CO_WORKER_EMAIL_DOMAIN) ? ERole.CO_WORKER : ERole.VISITOR,
            } as UserEntity,
        )
    }

    async login(req: Request, res: Response) {
        const currentUser = req?.user as unknown as IGoogleUser

        if (!currentUser) {
            return 'No user from google'
        }

        const loginUser = async (candidate: UserEntity | IGoogleUser, createNew?: boolean) => {
            let resultUser: UserEntity

            if (createNew) {
                resultUser = await this.createUser(candidate)
            } else {
                resultUser = candidate as UserEntity
            }

            return this.redirectToClientWithToken(resultUser, res.redirect.bind(res))
        }

        if (currentUser?.accessToken) {
            const candidate = await this.usersService.findOneWithoutChecks({email: currentUser.email})

            if (candidate) {
                return loginUser(candidate)

            } 
            return loginUser(currentUser, true)
            
        } 
        return loginUser(currentUser, true)
        
    }
}
