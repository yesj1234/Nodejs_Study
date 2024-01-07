import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { SessionSerializer } from './session.serializer';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [UserService, PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [AuthService, SessionSerializer, LocalStrategy],
})
export class AuthModule {}
