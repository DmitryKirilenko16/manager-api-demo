import { Module } from '@nestjs/common'
import { AuthService } from './services/auth.service'
import { AuthController } from './auth.controller'
import { GoogleStrategy } from './strategies/google.strategy'
import { UsersService } from '../users/users.service'
import { JwtModule } from '@nestjs/jwt'
import { JwtAuthService } from './services/auth-jwt.service'

@Module({
    controllers: [AuthController],
    providers: [AuthService, GoogleStrategy, UsersService, JwtAuthService],
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: parseInt(process.env.JWT_EXPIRES)
            }
        })
    ]
})
export class AuthModule {
}
