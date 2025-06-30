export enum UserRole {
  ADMIN = "ADMIN",
  SELLER = "SELLER",
  MASTER = "MASTER",
}

export interface Company {
  id: string;
  accessCode: string;
  name: string;
  cnpj: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  companyId: string;
  username: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
