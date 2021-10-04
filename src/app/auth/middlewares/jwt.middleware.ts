import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { IJwtPayload } from '../services/auth-jwt.service'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      jwtUser?: IJwtPayload
    }
  }
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const unauthorize = () => res.status(HttpStatus.UNAUTHORIZED).json({ error: 'unauthorized' })

        if (!req.headers.authorization) return unauthorize()

        const token = req.headers.authorization.split(' ')[1]

        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
                return unauthorize()
            }

            if (decoded) {
                req.jwtUser = decoded as IJwtPayload

                next()
            }
        })
    }
}
