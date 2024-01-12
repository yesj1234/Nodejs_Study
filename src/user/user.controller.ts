import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
@Controller('user')
export class UserController {
  constructor(private userSerivce: UserService) {}

  @Post('/create')
  createUser(@Body() user: CreateUserDto) {
    return this.userSerivce.createUser(user);
  }

  @Get('/getUser/:email')
  async getUser(@Param('email') email: string) {
    const user = await this.userSerivce.getUser(email);
    return user;
  }

  @Put('/update/:email')
  updateUser(@Param('email') email: string, @Body() user: CreateUserDto) {
    return this.userSerivce.updateUser(email, user);
  }

  @Delete('/delete/:email')
  deleteUser(@Param('email') email: string) {
    return this.userSerivce.deleteUser(email);
  }
}
