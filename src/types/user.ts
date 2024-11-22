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