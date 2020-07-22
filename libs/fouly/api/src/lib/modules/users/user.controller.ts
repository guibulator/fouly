/// <reference types="node" />
import { Body, Controller, Delete, Headers, Param, Post } from '@nestjs/common';
import { UserCommand } from '@skare/fouly/data';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() userToSave: UserCommand, @Headers('user-lang') userLanguage: string) {
    return await this.userService.createUpdateUser(userToSave, userLanguage);
  }

  @Delete(':userId')
  async deleteUser(@Param() params) {
    return await this.userService.deleteUser(params.userId);
  }
}
