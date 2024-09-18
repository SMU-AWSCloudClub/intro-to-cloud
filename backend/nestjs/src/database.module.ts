import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { Todo } from './todo/entities/todo.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql', // or 'postgres' for PostgreSQL
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Todo],
        // usually recommended to be set to false in favour of migrations, set to true here for convenience when starting up mysql
        // ref: https://orkhan.gitbook.io/typeorm/docs/faq#how-do-i-update-a-database-schema
        synchronize: configService.get<boolean>('DATABASE_SYNC') || true,
        retryAttempts: 10, // this ensures the db will be up upon fresh starts (ie: local docker compose)
        retryDelay: 3000,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
