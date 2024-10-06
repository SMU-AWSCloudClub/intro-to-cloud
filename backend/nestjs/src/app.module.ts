import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TodoModule } from './todo/todo.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    TodoModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
