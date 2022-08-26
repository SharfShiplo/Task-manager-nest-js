import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.interface';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const salt: string = await bcrypt.genSalt();
    try {
      const hashedPassword = await this.hashPassword(password, salt);

      await this.userRepository.save({
        username,
        password: hashedPassword,
        salt,
      });
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Userame already extist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;

    const user = await this.userRepository.findOneBy({ username: username });
    if (user && (await user.validatePassword(password))) {
      const payload: JwtPayload = { username };

      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
