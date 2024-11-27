import {Company} from "./UserRegister.ts";

export enum Role {
    Usuario = 'Usuario',
    Administrador = 'Administrador',
    Cajero = 'Cajero'
}

export interface TempUser {
    id: number;
    fullName: string;
    numberIdentification: string;
    mail: string;
    password: string;
    numberPhone: string;
    role: string;
}


export interface BaseUser {
    id: number;
    fullName: string;
    numberIdentification: number;
    mail: string;
    password: string;
    numberPhone: string;
    role: Role;
    state: string;
    company: Company | null;
}

export interface User {
    id: number;
    fullName: string;
    numberIdentification: number;
    state: string;
    mail: string;
    numberPhone: string;
    role: 'ADMIN' | 'USER';
    createdAt: string;
}

export interface UpdateUserDto {
    fullName?: string;
    mail?: string;
    numberPhone?: string;
    currentPassword?: string;
    newPassword?: string;
}