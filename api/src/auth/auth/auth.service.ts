import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/models/user.interface';
import { Observable ,from,of} from 'rxjs';
import { format } from 'path';
import { off } from 'process';

const bcrypt = require('bcrypt')

@Injectable()
export class AuthService {

    constructor(private readonly jwtService:JwtService){}

    generateJWT(user:User):Observable <string> {
        return from(this.jwtService.signAsync({user}));
    }

    hashPassword(password:string):Observable <string> {
        return from<string>(bcrypt.hash(password,12));//bcryting password for 12 rounds--quick
    }

    comparePassword(newPassword:string,passwordHash:string):Observable <any | boolean>{
        return of<any | boolean>(bcrypt.compare(newPassword,passwordHash))
    }
}
