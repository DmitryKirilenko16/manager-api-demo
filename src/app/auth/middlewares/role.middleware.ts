import {HttpStatus, Injectable, NestMiddleware} from '@nestjs/common'
import {NextFunction, Request, Response} from 'express'
import {ERole} from '../../users/users.constants'

@Injectable()
export class RoleMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (req.jwtUser.role === ERole.VISITOR) {
            return res.status(HttpStatus.FORBIDDEN).json({error: 'The resource is forbidden for visitors.'})
        }
        return next()

    }
}
