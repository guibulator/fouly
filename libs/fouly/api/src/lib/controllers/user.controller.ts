import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserCommand } from '@skare/fouly/data';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService, private configService: ConfigService) {}

  @Get('user/:userId')
  async getMsgHistory(@Param() params) {
    return this.userService.getUser(params.userId);
  }

  @Post('create')
  async postUser(@Body() userToSave: UserCommand) {
    return this.userService.createUser(userToSave);
  }

  @Delete('user/:userId')
  async deleteUser(@Param() params) {
    return this.userService.deleteUser(params.userId);
  }
}
