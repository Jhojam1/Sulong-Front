export interface Customer {
    id: number;
    fullName: string;
    numberIdentification: number;
    state: 'Activo' | 'Inactivo';
    mail: string;
    role: string;
    phone?: string;
    address?: string;
    orders?: number;
    totalSpent?: number;
    lastOrder?: Date;
}