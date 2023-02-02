import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { match } from 'assert';
import { from, Observable,throwError } from 'rxjs';
import { map, switchMap,catchError} from 'rxjs/operators';
import { AuthService } from 'src/auth/auth/auth.service';
import { Repository } from 'typeorm';
import { userEntity } from '../models/user.entity';
import { User } from '../models/user.interface';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(userEntity) private readonly userRepository:Repository<userEntity>,
        private authService:AuthService
    ){}

    create(user:User):Observable<User>{
        //create user with jwt interceptor
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash:string)=>{
                const newUser= new userEntity();
                newUser.email = user.email;
                newUser.name = user.name;
                newUser.password = user.password;
                newUser.username = user.username;

                return from(this.userRepository.save(newUser)).pipe(
                    map((user:User)=>{
                        const {password,...result}=user;
                        return result
                    }),
                    catchError(err=>throwError(err))
                )
            })
        )

        //create user without jwt interceptor
        // return from(this.userRepository.save(user));
    }
    findOne(id:number):Observable<User>{
        return from(this.userRepository.findOneBy({id})).pipe(
            map((user:User)=>{
                const {password,...result}=user;
                return result;
            })
        )
        // return from(this.userRepository.findOneBy({id}))
        // return from(this.userRepository.findOne({id}));
    }
    findAll():Observable<User[]>{
        return from(this.userRepository.find()).pipe(
            map((users:User[])=>{
                users.forEach(function(v){delete v.password});
                return users;
            })
        )
        // return from(this.userRepository.find())
    }
    deleteOne(id:number):Observable<any>{
        return from(this.userRepository.delete(id));
    }
    updateOne(id:number,user:User):Observable<any>{
        //deleting email and password bcz we don't want anyone to update those 2 fields
        delete user.email;
        delete user.password;

        return from(this.userRepository.update(id,user));
    }
    login(user: User): Observable<string> {
        console.log("user",user)
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) => {
                if(user) {
                    return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));
                } else {
                    return 'Wrong Credentials';
                }
            })
        )
    }
    validateUser(email: string, password: string): Observable<User> {
        return this.findByMail(email).pipe(
            switchMap((user: User) => this.authService.comparePassword(password, user.password).pipe(
                map((match: boolean) => {
                    if(match) {
                        const {password, ...result} = user;
                        return result;
                    } else {
                        throw Error;
                    }
                })
            ))
        )

    }
    findByMail(email:string):Observable<User>{
        return from(this.userRepository.findOneBy({email}))
    }
}
