import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

const PORT = (process.env.SLL === 'true' ? process.env.PORT : process.env.SERVER_PORT) || 8080

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.enableCors()

    const config = new DocumentBuilder()
        .setTitle('manager api')
        .setDescription('manager api')
        .setVersion('1.0')
        .addBearerAuth(
            { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        )
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)

    await app.listen(PORT)
}

bootstrap().then(() => console.log(`Api Port: ${PORT}`))
