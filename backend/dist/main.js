"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: 'http://localhost:3001',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    const config = new swagger_1.DocumentBuilder()
        .setTitle("API Example")
        .setDescription("The API description")
        .setVersion("1.0")
        .addTag("example")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api", app, document);
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT);
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`🚀 Swagger docs available at http://localhost:${PORT}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map