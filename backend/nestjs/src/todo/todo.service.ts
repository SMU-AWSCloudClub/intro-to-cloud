import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const user = await this.userRepository.findOne({
      where: { id: createTodoDto.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const todo = this.todoRepository.create({
      ...createTodoDto,
      user, // Associate the Todo with the User
    });

    return this.todoRepository.save(todo);
  }

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Todo> {
    return this.todoRepository.findOne({ where: { id } });
  }

  async update(
    id: number,
    updateTodoDto: Partial<CreateTodoDto>,
  ): Promise<Todo> {
    await this.todoRepository.update(id, updateTodoDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.todoRepository.delete(id);
  }
}
