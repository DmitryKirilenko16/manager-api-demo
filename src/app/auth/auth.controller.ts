import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './services/auth.service'
import { Request, Response } from 'express'
import { AUTH_ROUTES } from './auth.routes'
import { GOOGLE_STRATEGY } from './strategies/google.strategy'
import {ApiTags} from '@nestjs/swagger'

@ApiTags('OAuth 2.0')
@Controller(AUTH_ROUTES.google.path)
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

  @Get('/')
  @UseGuards(AuthGuard(GOOGLE_STRATEGY))
    async googleAuth(@Req() req) {
    }

  @Get(AUTH_ROUTES.google.subRouting.redirect.path)
  @UseGuards(AuthGuard(GOOGLE_STRATEGY))
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
      return this.authService.login(req, res)
  }
}
