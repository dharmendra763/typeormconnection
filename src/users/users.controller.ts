import { Controller, Post, Body, Session, Get, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('auth')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) { }

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    const { email, password } = body;
    return this.authService.signup(email, password);
  }

  @Serialize(UserDto)
  @Post('/signin')
  signIn(@Body() body: CreateUserDto) {
    const { email, password } = body;
    return this.authService.signin(email, password);
  }

  @Get("/color/:color")
  setColor(
    @Param("color") color: string,
    @Session() session: any
  ) {
    session.color = color;
  }

  @Get("/color")
  getColor(
    @Session() session: any
  ) {
    return session?.color || "";
  }

}
 