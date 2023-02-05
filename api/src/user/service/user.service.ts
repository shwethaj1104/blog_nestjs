import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { match } from 'assert';
import { from, Observable,throwError } from 'rxjs';
import { map, switchMap,catchError} from 'rxjs/operators';
import { AuthService } from 'src/auth/services/auth.service';
import { Like, Repository } from 'typeorm';
import { userEntity } from '../models/user.entity';
import { User, UserRole } from '../models/user.interface';
import {
    paginate,
    Pagination,
    IPaginationOptions,
  } from 'nestjs-typeorm-paginate';

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
                // newUser.password = user.password;
                newUser.password = passwordHash;
                newUser.username = user.username;
                // newUser.role = user.role;
                newUser.role = UserRole.USER;

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
                // console.log("user",user)
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

    //paginate
    paginate(options: IPaginationOptions): Observable<Pagination<User>> {
        return from(paginate<User>(this.userRepository, options)).pipe(
            map((usersPageable:Pagination<User>)=>{
                usersPageable.items.forEach(function(v){delete v.password});
                return usersPageable;
            })
        )
      }

    //paginate and filter via username too
      paginateFilterByUsername(options:IPaginationOptions,user:User):Observable<Pagination<User>>{
        return from(this.userRepository.findAndCount({
            skip:options.page * options.limit || 0,
            take:options.limit || 10,
            order:{id:"ASC"},
            select:['id','email','name','username','role'],
            where:[
                {username:Like(`%${user.username}%`)}
            ]
        })).pipe(
            map(([users,totalUsers])=>{
                const usersPageable:Pagination<User>={
                    items:users,
                    links:{
                        first:options.route + `?limit=${options.limit}`,
                        previous:options.route+``,
                        next:options.route+`?limit=${options.limit}&page=${options.page+1}`,
                        last:options.route+`?limit=${options.limit}&page=${Math.ceil(totalUsers / options.limit)}`
                    },
                    meta:{
                        currentPage:options.page,
                        itemCount:users.length,
                        itemsPerPage:options.limit,
                        totalItems:totalUsers,
                        totalPages:Math.ceil(totalUsers / options.limit)
                    }
                };
                return usersPageable;
            })
        )
      }

    deleteOne(id:number):Observable<any>{
        return from(this.userRepository.delete(id));
    }

    updateOne(id:number,user:User):Observable<any>{
        //deleting email and password bcz we don't want anyone to update those 2 fields
        delete user.email;
        delete user.password;
        delete user.role;

        return from(this.userRepository.update(id,user)).pipe(
            switchMap(()=>this.findOne(id))
        );
    }

    updateRoleOfUser(id:number,user:User):Observable<any>{
        return from(this.userRepository.update(id,user));
    }

    login(user: User): Observable<string> {
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
            // switchMap((user: User) => this.authService.comparePasswords('gfdsagfagd', 'gfdsagfagd').pipe(
                switchMap((user: User) => this.authService.comparePasswords(password, user.password).pipe(
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

    findByMail(email: string): Observable<User> {
        return from(this.userRepository.findOneBy({email}));
    }
}
