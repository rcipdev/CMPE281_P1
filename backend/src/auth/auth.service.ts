import {
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
      let user = await this.usersRepository.findOne({ where: { email } });
      if (!user) throw new NotFoundException('User Not Found, please sign up');
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new UnauthorizedException('Authentication Failed');
      const payload = { sub: user.id, email: user.email };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.log(error);
    }
  }

  async signUp(data: SignUpDto) {
    try {
      let { email, password, firstName, lastName } = data;
      let user = this.usersRepository.findOne({ where: { email } });
      if (user) throw new NotFoundException('User Found, please sign in');
      let newUser = new User();
      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.password = await bcrypt.hash(password, process.env.BCRYPT_SALT);
      await this.usersRepository.save(newUser);
      //   newUser.role=
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Signup failed');
    }
  }
}
