import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./user.interface";


@Entity()
export class userEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;
    @Column({unique:true})
    username:string;
    
    //adding {nullable:true--> since there was already column in db and values was null, was not able to proceed with that
    // was facing issue--> Unable to connect to the database. QueryFailedError: column "email" contains null values}
    @Column({nullable: true})
    email:string;

    @Column({nullable: true})
    password:string;

    @Column({type:'enum',enum:UserRole,default:UserRole.USER})
    role:UserRole;

    @BeforeInsert()
    emailToLowerCase(){
        this.email=this.email.toLowerCase();
    }
}