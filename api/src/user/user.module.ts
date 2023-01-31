import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { userEntity } from './models/user.entity';
import { UserService } from './service/user.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([userEntity])
  ],
  providers: [UserService],
  controllers:[UserController]
})
export class UserModule {}
