export enum Role {
    Administrador = 'Administrador',
    Usuario = 'Usuario',
    Cajero = 'Cajero'
}

export interface TempUser {
    id: number;
    fullName: string;
    numberIdentification: string;
    mail: string;
    password: string;
    numberPhone: string;
    role: Role;
}

export interface UserRegistration {
    fullName: string;
    numberIdentification: string;
    mail: string;
    password: string;
    numberPhone: string;
    role: Role;
    state: string;
}