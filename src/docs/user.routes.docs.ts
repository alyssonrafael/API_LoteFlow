/**
 * @swagger
 * tags:
 *   name: User
 *   description: Rotas relacionadas a edição e listagem de usuários todas sao protegidas
 */

/**
 * @swagger
 * /user/info:
 *   get:
 *     tags:
 *       - User
 *     summary: Lista dados do usuário logado
 *     description: Retorna dados de nome, email, criação e nome da empresa
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fullName:
 *                   type: string
 *                   example: admin
 *                 email:
 *                   type: string
 *                   example: adminteste@mail.com
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-07-23T00:43:08.726Z
 *                 company:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Minha Empresa
 *       401:
 *         description: Token inválido ou ausente
 *       403:
 *         description: Acesso proibido (usuário sem permissão)
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - User
 *     summary: Lista todos os usuários da empresa com base no usuario logado rota permitida apenas para ADMIN e MASTER
 *     description: Retorna todos os usuários da empresa. É possível filtrar por status de ativação.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive]
 *         description: Filtra usuários ativos ou inativos. Se não for informado, retorna todos.
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         example: JonhDoe@email.com
 *                       username:
 *                         type: string
 *                         example: JonhDoe123
 *                       fullName:
 *                         type: string
 *                         example: Jonh Doe
 *                       role:
 *                         type: string
 *                         example: ADMIN
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-06-30T15:09:04.285Z
 *                 total:
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Token inválido ou ausente
 *       403:
 *         description: Acesso proibido (usuário sem permissão)
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Retorna um usuário da empresa do usario logado especifico por ID  rota permitida apenas para ADMIN e MASTER
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 7dc9507f-643a-497e-a199-40c856ab9666
 *                     email:
 *                       type: string
 *                       example: JonhDoe@email.com
 *                     username:
 *                       type: string
 *                       example:  JonhDoe123
 *                     fullName:
 *                       type: string
 *                       example:  Jonh Doe
 *                     role:
 *                       type: string
 *                       example: MASTER
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-07-01T00:08:00.530Z
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Token inválido ou ausente
 *       403:
 *         description: Acesso proibido (usuário sem permissão)
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /user/me:
 *   patch:
 *     tags:
 *       - User
 *     summary: Atualiza os dados do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: usuario123
 *               fullName:
 *                 type: string
 *                 example: Nome Completo Atualizado
 *             additionalProperties: false
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Perfil atualizado com sucesso
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 7dc9507f-643a-497e-a199-40c856ab9866
 *                     email:
 *                       type: string
 *                       example: usuario@email.com
 *                     username:
 *                       type: string
 *                       example: usuario123
 *                     fullName:
 *                       type: string
 *                       example: Nome Completo Atualizado
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     role:
 *                       type: string
 *                       example: SELLER
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-07-01T00:08:00.530Z
 *       400:
 *         description: Erro de validação no corpo da requisição
 *       401:
 *         description: Token inválido ou ausente
 *       500:
 *         description: Erro interno no servidor
 */

/**
 * @swagger
 * /user/me/password:
 *   patch:
 *     tags:
 *       - User
 *     summary: Atualiza a senha do usuário autenticado
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: senhaAntiga123
 *               newPassword:
 *                 type: string
 *                 example: novaSenhaForte456
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Senha atualizada com sucesso
 *       400:
 *         description: Erro de validação ou senha atual incorreta
 *       401:
 *         description: Senha atual incorreta ou token inválido/ausente
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /user/{id}/role:
 *   patch:
 *     tags:
 *       - User
 *     summary: Atualiza o role (função) de um usuário pelo ID
 *     description: >
 *       Atualiza o perfil do usuário. **Admins não podem alterar o role de usuários Master.**
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 description: Novo perfil do usuário
 *                 enum: [CLIENT, SELLER, ADMIN, MASTER]
 *                 example: ADMIN
 *     responses:
 *       200:
 *         description: Função atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Função atualizada com sucesso
 *                 user:
 *                   type: object
 *                   properties:
 *                     fullName:
 *                       type: string
 *                       example: teste primeiro
 *                     username:
 *                       type: string
 *                       example: teste001
 *                     email:
 *                       type: string
 *                       example: teste@email.com
 *                     role:
 *                       type: string
 *                       example: ADMIN
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-06-30T13:06:45.354Z
 *       400:
 *         description: Parâmetro inválido ou body inválido
 *       401:
 *         description: Token inválido ou ausente
 *       403:
 *         description: Acesso proibido (Admins não podem alterar usuários MASTER) ou acesso negado permição insuficiente
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /user/{id}/status:
 *   patch:
 *     tags:
 *       - User
 *     summary: Ativa ou desativa um usuário
 *     description: Atualiza o campo `isActive` de um usuário. Acesso permitido apenas para Admins e Masters.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Status atualizado com sucesso
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 7d16052c-08b9-41b2-b8be-d56f3332d1ab
 *                     fullName:
 *                       type: string
 *                       example: teste primeiro
 *                     username:
 *                       type: string
 *                       example: teste002
 *                     email:
 *                       type: string
 *                       example: teste2@email.com
 *                     role:
 *                       type: string
 *                       example: SELLER
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-06-30T13:12:54.649Z
 *       400:
 *         description: Requisição mal formatada (body inválido ou ID inválido)
 *       401:
 *         description: Token inválido ou ausente
 *       403:
 *         description: Acesso proibido (usuário sem permissão) ou Admin não pode alterar master
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
