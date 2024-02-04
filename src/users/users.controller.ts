import { 
  Controller, 
  Post, 
  Body, 
  Session, 
  Get,
  UseGuards, 
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { User } from './user.entity';
import { CurrentUser } from './decorators/current-user.decorators';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    ) { }
    
    @Get("whoami")
    @UseGuards(AuthGuard)
    whoAmI(
      @CurrentUser()user: User
      ) {
        return user;
      }
      
      @Post('/signup')
      async createUser(
        @Body() body: CreateUserDto,
        @Session() session: any
        ) {
          const { email, password } = body;
          const user = await this.authService.signup(email, password);;
    session.userId = user.id;
    return user;
  }


  @Post('/signin')
  async signIn(
    @Body() body: CreateUserDto,
    @Session() session: any
  ) {
    const { email, password } = body;
    const user = await this.authService.signin(email, password);
    if (user instanceof User) {
      session.userId = user.id;
    }
    return user;
  }

  @Post("signout")
  async signOut(
    @Session() session: any
  ) {
    session.userId = null;
  }
}
