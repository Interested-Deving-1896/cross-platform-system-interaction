import clipboardy from 'clipboardy';
import { SystemInteractionError } from '../utils/errors';

/**
 * @module Clipboard
 *
 * Módulo para interagir com a área de transferência do sistema (copiar/colar).
 * Fornece uma API simples e multiplataforma para ler e escrever texto.
 *
 * @example
 * import { clipboard } from 'cross-platform-system-interaction';
 *
 * async function example() {
 *   await clipboard.write('Copiado via Node.js!');
 *   const content = await clipboard.read();
 *   console.log(content); // "Copiado via Node.js!"
 * }
 */

/**
 * Escreve (copia) um texto para a área de transferência do sistema.
 *
 * Esta função é assíncrona e retorna uma Promise que é resolvida
 * quando a operação de escrita é concluída.
 *
 * @param text O texto que será copiado para a área de transferência.
 * @returns Uma Promise que resolve para `void`.
 * @throws {SystemInteractionError} Se a operação de escrita falhar, por exemplo,
 *         em um ambiente sem interface gráfica (como um servidor SSH).
 */
export async function write(text: string): Promise<void> {
  try {
    await clipboardy.write(text);
  } catch (error: any) {
    // Captura o erro do clipboardy e o encapsula em nosso erro padrão.
    throw new SystemInteractionError(`Falha ao escrever na área de transferência: ${error.message}`);
  }
}

/**
 * Lê (cola) o texto atualmente na área de transferência do sistema.
 *
 * Esta função é assíncrona e retorna uma Promise que é resolvida
 * com o conteúdo textual da área de transferência.
 *
 * @returns Uma Promise que resolve com o texto contido na área de transferência.
 * @throws {SystemInteractionError} Se a operação de leitura falhar.
 */
export async function read(): Promise<string> {
  try {
    return await clipboardy.read();
  } catch (error: any) {
    // Captura o erro do clipboardy e o encapsula em nosso erro padrão.
    throw new SystemInteractionError(`Falha ao ler da área de transferência: ${error.message}`);
  }
}
