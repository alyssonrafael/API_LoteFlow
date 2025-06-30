// Classe base para erros personalizados da aplicação
export class AppError extends Error {
  // Código HTTP associado ao erro
  public readonly statusCode: number;

  // Indica se o erro é operacional (controlado) ou inesperado
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    // Inicializa a classe pai (Error) com a mensagem
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Corrige a cadeia de protótipos para manter instanceof funcionando corretamente
    Object.setPrototypeOf(this, new.target.prototype);

    // Captura o stack trace (rastro de chamadas) omitindo o construtor atual
    Error.captureStackTrace(this);
  }
}
