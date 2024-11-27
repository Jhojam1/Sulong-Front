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


export interface UserRegistration {
    fullName: string;
    numberIdentification: string;
    mail: string;
    password: string;
    numberPhone: string;
    role: string;
    state: string;
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