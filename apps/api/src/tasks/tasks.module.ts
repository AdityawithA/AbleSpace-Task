import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-secret',
    }),
  ],
  controllers: [TasksController],
  providers: [TasksService, JwtStrategy],
})
export class TasksModule {}
