export enum Role {
  Usuario = 'Usuario',
  Administrador = 'Administrador',
  Cajero = 'Cajero'
}

export interface Company {
  id: number;
  name: string;
}

export interface UserTemp {
  id?: number;
  fullName: string;
  numberIdentification: number;
  state: string;
  mail: string;
  password: string;
  numberPhone: string;
  role: Role;
  company: Company;
}