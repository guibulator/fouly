/// <reference types="node" />
import { Body, Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserCommand } from '@skare/fouly/data';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService, private configService: ConfigService) {}

  @Get('getById/:userId')
  async getById(@Param() params, @Res() res: any) {
    this.userService.getUser({ userId: params.userId }, function(err: any, data: any) {
      res.send(data);
    });
  }

  @Get('getByEmail/:email')
  async getByEmail(@Param() params, @Res() res: any) {
    this.userService.getUser({ email: params.email }, function(err: any, data: any) {
      res.send(data);
    });
  }

  @Post('create')
  async createUser(@Body() userToSave: UserCommand, @Res() res: any) {
    this.userService.createUpdateUser(userToSave, function(err: any, data: any) {
      res.send(data);
    });
  }

  @Delete('delete/:userId')
  async deleteUser(@Param() params, @Res() res: any) {
    this.userService.deleteUser(params.userId, (err: any, data: any) => {
      res.send(true);
    });
  }
}
