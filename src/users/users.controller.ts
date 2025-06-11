import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getUsers() {
    return this.userService.users({});
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.user({ id: Number(id) });
  }
}
