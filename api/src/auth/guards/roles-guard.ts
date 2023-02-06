import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/user/models/user.interface';
import { UserService } from 'src/user/service/user.service';
import { map} from 'rxjs/operators';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector,@Inject(forwardRef(()=>UserService)) private userService:UserService ) {}
  canActivate(context: ExecutionContext): boolean|Promise<boolean> |Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return this.userService.findOne(user.id).pipe(
        map((user:User)=>{
            const hasRole=()=>roles.indexOf(user.role)>-1;
            let hasPermission:boolean=false;
            // console.log("hasRole()",hasRole)

            if(hasRole()){console.log("if hasRole is true");hasPermission=true}
            return user && hasPermission
        })
    )
  }
}