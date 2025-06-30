export interface JwtPayloadCustom {
  sub: string;
  role: string;
  accessCode: string;
  companyId: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}
