import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UseFilters } from '@nestjs/common';
import { MicroserviceExceptionFilter } from './exception.filter';

@Controller()
@UseFilters(new MicroserviceExceptionFilter())
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @MessagePattern('register_user')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(@Payload() data: RegisterDto) {
    const { email, password, name } = data;
    return this.usersService.register(email, password, name);
  }

  @MessagePattern('login_user')
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Payload() data: LoginDto) {
    const { email, password } = data;
    return this.usersService.login(email, password);
  }

  @MessagePattern('verify_token')
  async verifyToken(@Payload() data: any) {
    try {
      const { token } = data;
      const decoded = this.usersService.verifyToken(token);
      return { valid: true, user: decoded };
    } catch (error) {
      return { valid: false, error: 'Invalid token' };
    }
  }
}