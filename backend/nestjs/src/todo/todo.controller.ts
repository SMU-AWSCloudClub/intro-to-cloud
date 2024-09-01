import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Todo } from './entities/todo.entity';

@ApiTags('Todo')
@Controller('api/v1/todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Todo item' })
  @ApiBody({ type: CreateTodoDto })
  @ApiResponse({
    status: 201,
    description: 'The todo has been successfully created.',
    type: Todo,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all Todo items' })
  @ApiResponse({
    status: 200,
    description: 'Array of todo items',
    type: [Todo],
  })
  findAll() {
    return this.todoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single Todo item by ID' })
  @ApiParam({ name: 'id', description: 'ID of the todo item', type: String })
  @ApiResponse({ status: 200, description: 'The found todo item', type: Todo })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Todo item by ID' })
  @ApiParam({ name: 'id', description: 'ID of the todo item', type: String })
  @ApiBody({ type: UpdateTodoDto })
  @ApiResponse({
    status: 200,
    description: 'The updated todo item',
    type: Todo,
  })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(+id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Todo item by ID' })
  @ApiParam({ name: 'id', description: 'ID of the todo item', type: String })
  @ApiResponse({ status: 200, description: 'The todo item has been deleted' })
  @ApiResponse({ status: 404, description: 'Todo not found' })
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
