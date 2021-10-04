import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Put,
    Query,
    Req,
    ValidationPipe,
} from '@nestjs/common'
import { APP_ROUTES } from '../../app.routes'
import { UsersService } from './users.service'
import {
    USER_ENDPOINT,
    USERS_ROUTES,
} from './users.routes'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { ERole } from './users.constants'
import { UpdateUserDto } from './dto/update-user.dto'
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator'
import { getCurrentUserInfo } from '../../shared/utils/shared.utils'

export const USERS_ENDPOINT = `${APP_ROUTES.api.path}${USERS_ROUTES.users.path}`

@ApiTags('Users')
@Controller(USERS_ENDPOINT)
export class UsersController {
    constructor(
    private readonly usersService: UsersService
    ) {
    }

  @ApiImplicitQuery({
      name: 'take',
      required: false,
      type: String,
  })
  @ApiImplicitQuery({
      name: 'skip',
      required: false,
      type: String,
  })
  @ApiBearerAuth()
  @Get('/')
    async users(@Req() req: Request, @Query('take') take: string, @Query('skip') skip: string) {
        return await this.usersService.findAll(req.jwtUser.role === ERole.ADMIN, { take: +take, skip: +skip })
    }

  @ApiBearerAuth()
  @Get(USER_ENDPOINT)
  async getUser(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
      return await this.usersService.findOne({ id }, req.jwtUser.role === ERole.ADMIN)
  }

  @ApiBearerAuth()
  @Put(USER_ENDPOINT)
  async updateUser(@Param('id', ParseIntPipe) id: number, @Req() req: Request, @Body(new ValidationPipe({ transform: true })) body: UpdateUserDto) {
      return await this.usersService.update(id, body, getCurrentUserInfo(req.jwtUser))
  }
}
