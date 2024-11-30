import { Module } from '@nestjs/common'; // import the Module decorator
import { AppController } from './app.controller'; // import the AppController
import { AppService } from './app.service'; // import the AppService
import { ConfigModule } from '@nestjs/config'; // import the ConfigModule

@Module({ 
    imports: [ConfigModule.forRoot()], 
    controllers: [AppController], 
    providers: [AppService], 
    })
export class AppModule {} 
