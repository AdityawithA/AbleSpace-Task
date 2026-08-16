import { IsEnum, IsISO8601, IsOptional, IsString, Length } from 'class-validator';
import { TaskPriority, TaskStatus } from '../task-enums';

export class CreateTaskDto {
  @IsString()
  @Length(1, 120)
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsISO8601()
  dueDate?: string;
}
