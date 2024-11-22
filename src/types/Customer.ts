export interface Customer {
    id: number;
    fullName: string;
    numberIdentification: number;
    state: 'Activo' | 'Inactivo';
    mail: string;
    role: string;
    numberPhone?: string;
    password?: string;
}