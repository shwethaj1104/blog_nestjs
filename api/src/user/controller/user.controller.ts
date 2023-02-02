import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from '../models/user.interface';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    // http://localhost:3000/user
    @Post()
    create(@Body() user: User): Observable<User | Object> {
        return this.userService.create(user).pipe(
            map((user:User)=>user),
            catchError(err=>of({error:err.message}))
        );
    }

    @Post('login')
    login(@Body() user:User):Observable<Object>{
        return this.userService.login(user).pipe(
            map((jwt:string)=>{
                return {access_token:jwt}
            })
        )
    }

    // http://localhost:3000/user/1
    @Get(':id')
    findOne(@Param() param): Observable<User> {
        return this.userService.findOne(param.id);
    }

    // http://localhost:3000/user
    @Get()
    findAll(): Observable<User[]> {
        return this.userService.findAll();
    }

    // http://localhost:3000/user/1
    @Delete(':id')
    deleteOne(@Param('id') id: string): Observable<User> {
        return this.userService.deleteOne(Number(id));
    }

    
    // http://localhost:3000/user/3
    @Put(':id')
    updateOne(@Param('id') id:string,@Body() user:User):Observable<any>{
        return this.userService.updateOne(Number(id),user);
    }

}
