import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Query, UseGuards } from '@nestjs/common/decorators';
import { get } from 'http';
import { Pagination } from 'nestjs-typeorm-paginate';
import { catchError, map, Observable, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles-guard';
import { User, UserRole } from '../models/user.interface';
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
    login(@Body() user: User): Observable<Object> {
        return this.userService.login(user).pipe(
            map((jwt: string) => {
                return { access_token: jwt };
            })
        )
    }

    // http://localhost:3000/user/1
    @Get(':id')
    findOne(@Param() param): Observable<User> {
        return this.userService.findOne(param.id);
    }

    // // http://localhost:3000/user
    // @Get()
    // findAll(): Observable<User[]> {
    //     return this.userService.findAll();
    // }

    //find all with pagination
    @Get()
    index(@Query('page') page:number=1, 
    @Query('limit') limit:number=10,
    @Query('username') username:string,
    ):Observable<Pagination<User>>{
        limit=limit>100? 100:limit;
        console.log("username",username)
        if(!username){
            return this.userService.paginate({page:Number(page),limit:Number(limit),route:'http://localhost:3000/users'})
        }else{
            return this.userService.paginateFilterByUsername({
                page:Number(page),
                limit:Number(limit),
                route:'http://localhost:3000/users'},
                {username})
        }
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

     // http://localhost:3000/user/3/role
     @hasRoles(UserRole.ADMIN)
     @UseGuards(JwtAuthGuard,RolesGuard) //jwtauthguard--> check if we have valid jwt token
     @Put(':id/role')
     updateRoleOfUser(@Param('id') id:string,@Body() user:User):Observable<User>{
         return this.userService.updateRoleOfUser(Number(id),user);
     }

}
