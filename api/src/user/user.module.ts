import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './controller/user.controller';
import { userEntity } from './models/user.entity';
import { UserService } from './service/user.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([userEntity]),
    AuthModule
  ],
  providers: [UserService],
  controllers:[UserController]
})
export class UserModule {}
