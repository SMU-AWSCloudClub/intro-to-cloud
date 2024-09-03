import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
    content: {
      'application/json': {
        example: {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: 200,
    description: 'Array of users',
    type: [User],
    content: {
      'application/json': {
        example: [
          {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
          },
        ],
      },
    },
  })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single user by ID' })
  @ApiParam({ name: 'id', description: 'ID of the user', type: String })
  @ApiResponse({
    status: 200,
    description: 'The found user',
    type: User,
    content: {
      'application/json': {
        example: {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'ID of the user', type: String })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The updated user',
    type: User,
    content: {
      'application/json': {
        example: {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'ID of the user', type: String })
  @ApiResponse({
    status: 204,
    description: 'The user has been deleted',
    content: {
      'application/json': {
        example: {
          message: 'User successfully deleted',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(+id);
  }
}
