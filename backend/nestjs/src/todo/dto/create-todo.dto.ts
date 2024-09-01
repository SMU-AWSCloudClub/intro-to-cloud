import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty({ message: 'Description should not be empty' })
  description: string;

  @IsBoolean({ message: 'Completed must be a boolean value' })
  @IsNotEmpty()
  completed: boolean;

  @IsNumber({}, { message: 'User ID must be a number ' })
  userId: number;
}
