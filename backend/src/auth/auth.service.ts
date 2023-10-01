import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/enitities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    //
  }
  async signIn(data: SignInDto) {
    try {
      let { email, password } = data;
      if (!email || !password) {
        throw new BadRequestException('Please provide email and password');
      }
      let user = await this.usersRepository.findOne({
        where: { email },
        relations: { role: true },
      });
      if (!user) throw new NotFoundException('User Not Found, please sign up');
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new UnauthorizedException('Authentication Failed');
      const payload = { id: user.id, email: user.email, role: user.role };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.log(error);
      // throw new Error(error);
    }
  }

  async signUp(data: SignUpDto) {
    try {
      let { email, password, firstName, lastName } = data;
      if (!email || !password || !firstName || !lastName) {
        throw new BadRequestException(
          'Please provide firstName, lastName, email and password',
        );
      }
      let user = await this.usersRepository.findOne({ where: { email } });
      console.log(user);
      if (user) throw new ConflictException('User Found, please sign in');
      let newUser = new User();
      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.password = await bcrypt.hash(
        password,
        parseInt(process.env.BCRYPT_SALT),
      );
      await this.usersRepository.save(newUser);
    } catch (error) {
      console.log(error);
      // throw Error(error);
    }
  }

  async getUser(id: number): Promise<User> {
    try {
      let user = await this.usersRepository.findOne({ where: { id } });
      if (!user) return null;
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
}
