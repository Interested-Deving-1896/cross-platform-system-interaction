import { promises as fs } from 'fs';
import { FileError } from '../utils/errors';

/**
 * @module FilePermissions
 *
 * Este módulo contém a lógica para manipulação de permissões de arquivos
 * no sistema de arquivos.
 *
 * @internal
 */

/**
 * Altera as permissões de um arquivo ou diretório de forma multiplataforma.
 * A API é modelada a partir do comando `chmod` do Unix.
 *
 * **Nota sobre o Windows:** No Windows, o `fs.chmod` do Node.js só pode, de forma
 * confiável, alterar a permissão de escrita de um arquivo. As permissões de
 * leitura e execução geralmente seguem as regras do sistema de arquivos (NTFS)
 * e podem não se comportar como esperado em um ambiente Unix.
 *
 * @param filePath O caminho para o arquivo ou diretório.
 * @param mode O modo de permissão a ser aplicado. Pode ser um número octal
 *             (ex: `0o755`) ou uma string (`'755'`).
 * @returns Uma Promise que resolve quando a operação é concluída.
 *
 * @example
 * // Importado e reexportado através de `src/file/index.ts`
 * import { file } from 'cross-platform-system-interaction';
 *
 * // Torna um script shell executável no Linux/macOS
 * await file.setPermissions('./meu_script.sh', 0o755);
 */
export async function setPermissions(filePath: string, mode: number | string): Promise<void> {
  if (!filePath) {
    throw new FileError('O caminho do arquivo não pode ser vazio.', filePath);
  }

  try {
    await fs.chmod(filePath, mode);
  } catch (error: any) {
    // Captura o erro nativo e o relança como um erro customizado e mais detalhado.
    throw new FileError(`Falha ao alterar permissões para o modo "${mode}"`, filePath);
  }
}
