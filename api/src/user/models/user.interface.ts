
export interface User{
    id? : number;
    name? :string,
    username? : string,
    email? : string,
    password? : string,
    role? : UserRole,
}

export enum UserRole {
    ADMIN='Admin',
    CHIEFEDITOR='Chiefeditor',
    EDITOR='Editor',
    USER='User'
}