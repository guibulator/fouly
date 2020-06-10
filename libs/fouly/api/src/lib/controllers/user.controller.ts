import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserCommand } from '@skare/fouly/data';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService, private configService: ConfigService) {}

  @Get('getById/:userId')
  async getById(@Param() params) {
    return this.userService.getUser(params.userId);
  }

  @Get('getByEmail/:email')
  async getByEmail(@Param() params) {
    return this.userService.getUser(params.email);
  }

  @Post('create')
  async createUser(@Body() userToSave: UserCommand) {
    const test = await this.userService.updateUser(userToSave);
    let t = test;
    return t;
  }

  @Delete('delete/:userId')
  async deleteUser(@Param() params) {
    return this.userService.deleteUser(params.userId);
  }
}
