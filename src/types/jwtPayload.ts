import { UserRole } from "./types";

export interface JwtPayloadCustom {
  sub: string;
  role: UserRole;
  accessCode: string;
  companyId: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}
