import { Router } from "express";
import {
  accessCompany,
  createCompany,
  createUser,
  login,
  requestPasswordReset,
  resertPassword,
} from "./auth.controller";
import { validate } from "../middlewares/validate";
import {
  createCompanySchema,
  createUserSchema,
  loginSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  verifyAccessCodeSchema,
} from "../validations";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rotas relacionadas a autenticação e recuperação de senha
 */

/**
 * @swagger
 * /auth/register/company:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registra uma nova empresa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accessCode
 *               - name
 *               - cnpj
 *             properties:
 *               accessCode:
 *                 type: string
 *                 example: ABC123
 *               name:
 *                 type: string
 *                 example: Minha Empresa
 *               cnpj:
 *                 type: string
 *                 example: "12345678000190"
 *     responses:
 *       201:
 *         description: Empresa criada com sucesso
 *       400:
 *         description: Erro de validação
 *       409:
 *         description: Erro de conflito
 *       500:
 *         description: Erro interno no servidor
 */
router.post("/register/company", validate(createCompanySchema), createCompany);

/**
 * @swagger
 * /auth/access/company:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Acessa uma empresa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accessCode
 *             properties:
 *               accessCode:
 *                 type: string
 *                 example: ABC123
 *     responses:
 *       200:
 *         description: Entrou na empresa
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Erro Empresa não encontrada
 *       500:
 *         description: Erro interno no servidor
 */
router.post("/access/company", validate(verifyAccessCodeSchema), accessCompany);

/**
 * @swagger
 * /auth/register/user:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Registra um usuário vinculado a uma empresa pelo accessCode
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accessCode
 *               - fullName
 *               - email
 *               - userName
 *               - password
 *             properties:
 *               accessCode:
 *                 type: string
 *                 example: ALL001
 *               fullName:
 *                 type: string
 *                 example: Jonh Doe
 *               email:
 *                 type: string
 *                 example: JonhDoe@email.com
 *               userName:
 *                 type: string
 *                 example: JonhDoe123
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Empresa não encontrada
 *       409:
 *         description: Conflito username ou email
 *       500:
 *         description: Erro interno no servidor
 */
router.post("/register/user", validate(createUserSchema), createUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Realiza o login e recebe o token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accessCode
 *               - password
 *             optional:
 *               - username
 *               - email
 *             properties:
 *               accessCode:
 *                 type: string
 *                 example: ALL001
 *               email:
 *                 type: string
 *                 example: JonhDoe@email.com
 *               userName:
 *                 type: string
 *                 example: JonhDoe123
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Credenciais invalidas ou aguardando autorização
 *       500:
 *         description: Erro interno no servidor
 */
router.post("/login", validate(loginSchema), login);

/**
 * @swagger
 * /auth/request/password-reset:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Realiza a solicitação de recuperação de senha
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accessCode
 *               - email
 *             properties:
 *               accessCode:
 *                 type: string
 *                 example: ALL001
 *               email:
 *                 type: string
 *                 example: JonhDoe@email.com
 *     responses:
 *       200:
 *         description: Email enviado com sucesso
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Não encontrou empresa ou usuário
 *       500:
 *         description: Erro interno no servidor
 */
router.post(
  "/request/password-reset",
  validate(requestPasswordResetSchema),
  requestPasswordReset
);

/**
 * @swagger
 * /auth/password-reset:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Faz a troca da senha com o codigo enviado no e-mail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *               - tokenOrCode
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: 123456
 *               tokenOrCode:
 *                 type: string
 *                 example: xxxxxxx
 *     responses:
 *       200:
 *         description: Senha redefinida com succeso
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Token ou códigos inválidos ou expirados
 *       500:
 *         description: Erro interno no servidor
 */
router.post("/password-reset", validate(resetPasswordSchema), resertPassword);

export default router;
