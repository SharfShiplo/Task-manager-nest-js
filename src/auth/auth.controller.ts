import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
// import { UserEntity } from './entities/user.entity';
// import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return await this.authService.signUp(authCredentialsDto);
  }

  @Post('signin')
  async signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signIn(authCredentialsDto);
  }

  // Custom decorator demo
  // @Post('test')
  // @UseGuards(AuthGuard())
  // async test(
  //   @GetUser() user: UserEntity,
  // ): Promise<{ username: string; id: number }> {
  //   const appUser = {
  //     ...user,
  //     salt: undefined,
  //     password: undefined,
  //   };
  //   return appUser;
  // }
}
