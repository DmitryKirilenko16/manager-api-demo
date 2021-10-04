import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { AuthModule } from './app/auth/auth.module'
import { UsersModule } from './app/users/users.module'
import { JwtMiddleware } from './app/auth/middlewares/jwt.middleware'
import { APP_ROUTES } from './app.routes'
import { SharedModule } from './shared/shared.module'
import ORMConfig from '../ormconfig'
import { TimeSheetsModule } from './app/time-sheets/time-sheets.module'
import { RoleMiddleware } from './app/auth/middlewares/role.middleware'
import { PagerMiddleware } from './shared/middlewares/pagination.middleware'
import { USER_PROJECT_ENDPOINT, USERS_ROUTES } from './app/users/users.routes'
import { TIME_SHEETS_ROUTES } from './app/time-sheets/time-sheets.routes'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [
        SharedModule,
        UsersModule,
        AuthModule,
        TimeSheetsModule,
        TypeOrmModule.forRoot(ORMConfig),
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtMiddleware).forRoutes(APP_ROUTES.api.path)
        consumer.apply(RoleMiddleware).forRoutes(APP_ROUTES.api.path)
        consumer.apply(PagerMiddleware).forRoutes(
            { path: USERS_ROUTES.users.path, method: RequestMethod.GET },
            { path: TIME_SHEETS_ROUTES.timeSheets.path, method: RequestMethod.GET },
            { path: `${USERS_ROUTES.users.path}${USER_PROJECT_ENDPOINT}`, method: RequestMethod.GET },
        )
    }
}
