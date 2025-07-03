import { JwtPayloadCustom } from "./jwtPayload";

//extendendo o tipo para que seja possivel acessar as propriedades de usuario na req
declare global {
  namespace Express {
    interface Request {
      user: JwtPayloadCustom;
    }
  }
}