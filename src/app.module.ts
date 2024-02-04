import { ConfigModule, ConfigService } from "@nestjs/config";
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from './users/users.module';
import { User } from "./users/user.entity";
import { ReportsModule } from './reports/reports.module';
import { Report } from "./reports/report.entity";
  
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: "sqlite",
        database: "db.sqlite",
        entities: [User,Report],
        synchronize: true,
        // type: "postgres",
        // host: configService.getOrThrow("POSTGRES_HOST"),
        // port: configService.getOrThrow("POSTGRES_PORT"),
        // database: configService.getOrThrow("POSTGRES_DATABASE"),
        // username: configService.getOrThrow("POSTGRES_USERNAME"),
        // password: configService.getOrThrow("POSTGRES_PASSWORD"),
        // autoLoadEntities: true,
        // synchronize: configService.getOrThrow("POSTGRES_SYNCHRONIZE"),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ReportsModule
  ],
  controllers: [
    AppController
  ], 
  providers: [
    AppService
  ],
})
export class AppModule {}
