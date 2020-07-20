/// <reference types="node" />
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserCommand } from '@skare/fouly/data';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('getById/:userId')
  async getById(@Param() params) {
    return await this.userService.getUser({ userId: params.userId });
  }

  @Get('getByEmail/:email')
  async getByEmail(@Param() params) {
    return await this.userService.getUser({ email: params.email });
  }

  @Post('create')
  async createUser(@Body() userToSave: UserCommand) {
    return await this.userService.createUpdateUser(userToSave);
  }

  @Delete('delete/:userId')
  async deleteUser(@Param() params) {
    return await this.userService.deleteUser(params.userId);
  }
}
