import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class userEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column({unique:true})
    username:string
    
    @Column()
    email:string

    @Column()
    password:string

    @BeforeInsert()
    emailToLowerCase(){
        this.email=this.email.toLowerCase();
    }
}