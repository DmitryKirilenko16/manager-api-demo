import { Injectable } from '@nestjs/common'
import { Connection, Repository } from 'typeorm'
import { UserEntity } from './users.entity'
import { UserNotFoundException } from '../../exceptions/not-found/user-not-found.exception'
import { UserQueryUtils } from './utils/user.query.utils'
import { UpdateUserDto } from './dto/update-user.dto'
import { RoleException } from '../../exceptions/role/role.exception'
import { ICurrentUserInfo } from '../time-sheets/time-sheets.models'
import { ERole } from './users.constants'
import { DefaultResponse } from '../../exceptions/default-response'
import { isNumber } from '../../shared/utils/js/number.util'
import { IncorrectRoleException } from '../../exceptions/role/incorrect-role.exception'
import { IPager } from '../../shared/middlewares/pagination.middleware'

interface IFindOneSearchKeys {
  email?: string,
  id?: number
}

interface IUserSearchOptions {
  isAdmin?: boolean,
  relations?: string[]
}

@Injectable()
export class UsersService {
  private readonly usersRepository: Repository<UserEntity>;

  constructor(
    private readonly connection: Connection
  ) {
      this.usersRepository = this.connection.getRepository(UserEntity)
  }

  public async checkExistence(searchKeys: IFindOneSearchKeys, userSearchOptions?: IUserSearchOptions): Promise<UserEntity> {
      const currentUser = await this.usersRepository.findOne(
          searchKeys,
          {
              ...(userSearchOptions?.isAdmin ? {} : { select: UserQueryUtils.coWorkerAccessibleUserFields }),
              relations: userSearchOptions?.relations || [],
          },
      )

      if (!currentUser) throw new UserNotFoundException()

      return currentUser
  }

  public async findAll(isAdmin?: boolean, pager?: IPager) {
      return await this.usersRepository.findAndCount(
          isAdmin ?
              { ...pager } :
              {
                  select: UserQueryUtils.coWorkerAccessibleUserFields,
                  ...pager,
              },
      )
  }

  public async save(user: UserEntity) {
      return await this.usersRepository.save(user)
  }

  public async update(id: number, body: UpdateUserDto, currentUserInfo: ICurrentUserInfo) {
      if (currentUserInfo.userRole !== ERole.ADMIN) {
          throw new RoleException()
      }

      if (isNumber(body?.role) && ![ERole.CO_WORKER, ERole.VISITOR].includes(body?.role)) {
          throw new IncorrectRoleException()
      }

      const updatesUser = await this.usersRepository.update(id, body)

      return new DefaultResponse(!!updatesUser.affected)
  }

  public async findOne(searchKeys: IFindOneSearchKeys, isAdmin?: boolean) {
      return await this.checkExistence(searchKeys, { isAdmin })
  }

  public async findOneWithoutChecks(searchKeys: IFindOneSearchKeys) {
      return await this.usersRepository.findOne(searchKeys)
  }
}
