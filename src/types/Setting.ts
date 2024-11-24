export type EntityState = 'Activo' | 'Inactivo';

export interface Company {
    id?: number;
    name: string;
    state: EntityState;
}

export interface Headquarter {
    id?: number;
    name: string;
    state: EntityState;
}