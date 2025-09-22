/**
 * @module CustomErrors
 *
 * Este módulo define classes de erro personalizadas para a biblioteca,
 * permitindo um tratamento de erros mais robusto e específico por parte do consumidor do pacote.
 *
 * @internal
 */

/**
 * Classe de erro base para todos os erros específicos gerados por este pacote.
 *
 * Capturar esta classe de erro permite lidar com qualquer falha originada
 * pela biblioteca `cross-platform-system-interaction`, ignorando outros erros
 * que possam ocorrer na aplicação.
 *
 * @example
 * try {
 *   await file.remove('/non-existent-path');
 * } catch (error) {
 *   if (error instanceof SystemInteractionError) {
 *     console.error('Ocorreu um erro na biblioteca de sistema:', error.message);
 *   }
 * }
 */
export class SystemInteractionError extends Error {
    constructor(message: string) {
      super(message);
      // Define o nome do erro, útil para depuração.
      this.name = 'SystemInteractionError';
      // Mantém o stack trace correto para a V8 (Node.js, Chrome).
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, SystemInteractionError);
      }
    }
  }
  
  /**
   * Erro lançado quando uma operação relacionada ao sistema de arquivos falha.
   *
   * Contém opcionalmente o caminho do arquivo (`filePath`) que causou o erro,
   * fornecendo mais contexto para a depuração.
   */
  export class FileError extends SystemInteractionError {
    public filePath?: string;
  
    constructor(message: string, filePath?: string) {
      // Constrói uma mensagem de erro mais descritiva se o caminho do arquivo for fornecido.
      const fullMessage = filePath ? `${message} (path: ${filePath})` : message;
      super(fullMessage);
      this.name = 'FileError';
      this.filePath = filePath;
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, FileError);
      }
    }
  }
  
  /**
   * Erro lançado quando uma operação de gerenciamento de processo falha.
   *
   * Pode conter o comando que foi executado (`command`) e o código de saída
   * (`exitCode`) do processo, informações vitais para diagnosticar falhas.
   */
  export class ProcessError extends SystemInteractionError {
    public command?: string;
    public exitCode?: number | null;
    public stderr?: string;
  
    constructor(message: string, details?: { command?: string; exitCode?: number | null; stderr?: string }) {
      let fullMessage = message;
      if (details?.command) {
        fullMessage += ` (command: ${details.command})`;
      }
      if (details?.exitCode !== undefined && details.exitCode !== null) {
        fullMessage += ` (exitCode: ${details.exitCode})`;
      }
  
      super(fullMessage);
      this.name = 'ProcessError';
      this.command = details?.command;
      this.exitCode = details?.exitCode;
      this.stderr = details?.stderr;
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ProcessError);
      }
    }
  }
  