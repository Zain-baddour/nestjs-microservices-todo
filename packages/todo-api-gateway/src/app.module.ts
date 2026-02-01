import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback_secret',
      verifyOptions: { ignoreExpiration: false },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
