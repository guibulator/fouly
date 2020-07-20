/// <reference types="node" />
import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { UserCommand } from '@skare/fouly/data';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() userToSave: UserCommand) {
    return await this.userService.createUpdateUser(userToSave);
  }

  @Delete(':userId')
  async deleteUser(@Param() params) {
    return await this.userService.deleteUser(params.userId);
  }
}
