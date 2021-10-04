import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

const ORMConfig: PostgresConnectionOptions = {
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    type: 'postgres',
    port: parseInt(process.env.PG_PORT),
    host: process.env.PG_HOST,
    logging: true,
    database: process.env.PG_DATABASE_NAME,
    synchronize: false,
    migrationsTableName: 'migrations',
    migrationsRun: false,
    maxQueryExecutionTime: 1000,
    entities: ['dist/src/app/**/*.entity.js'],
    migrations: ['dist/src/db/migrations/*.js'],
    ssl: process.env.SLL === 'true' ? { rejectUnauthorized: false } : false,
    cli: {
        migrationsDir: './src/db/migrations',
    },
    namingStrategy: new SnakeNamingStrategy(),
}

export default ORMConfig
