import { BlogEntryEntity } from "src/blog/model/blog-entry.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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
    
    //select false==> in response we won't see password

    @Column({nullable: true,select:false})
    password:string;

    @Column({type:'enum',enum:UserRole,default:UserRole.USER})
    role:UserRole;

    @Column({nullable: true})
    profileImage:string;

    @OneToMany(type => BlogEntryEntity, blogEntryEntity => blogEntryEntity.author)
    blogEntries: BlogEntryEntity[];

    @BeforeInsert()
    emailToLowerCase(){
        this.email=this.email.toLowerCase();
    }
}