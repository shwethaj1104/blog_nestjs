import { BlogEntry } from "src/blog/model/blog-entry.interface";

export interface User{
    id? : number;
    name? :string,
    username? : string,
    email? : string,
    password? : string,
    role? : UserRole,
    profileImage? : string,
    blogEntries?: BlogEntry[]
}

export enum UserRole {
    ADMIN='Admin',
    CHIEFEDITOR='Chiefeditor',
    EDITOR='Editor',
    USER='User'
}