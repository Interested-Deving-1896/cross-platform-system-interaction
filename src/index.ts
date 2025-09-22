/**
 * @main
 * cross-platform-system-interaction
 *
 * Uma API unificada e simplificada para interagir com funcionalidades nativas
 * do sistema operacional (Windows, macOS, Linux) em ambientes Node.js.
 *
 * @author Fernando Martini
 * @license MIT
 */

// Importa todos os módulos de funcionalidade como namespaces.
// Isso agrupa todas as funções relacionadas sob um único objeto,
// criando uma API clara e organizada (ex: file.readJson, process.kill).
import * as clipboard from './clipboard';
import * as file from './file';
import * as process from './process';
import * as system from './system';

// Importa os tipos de erro para reexportá-los no nível raiz.
import { SystemInteractionError, FileError, ProcessError } from './utils/errors';

// Exporta cada módulo como um objeto nomeado.
// Esta é a API pública que os usuários do pacote irão consumir.
export {
  /**
   * Módulo para interagir com a área de transferência do sistema (copiar/colar).
   * @example
   * await clipboard.write('Olá!');
   * const text = await clipboard.read();
   */
  clipboard,

  /**
   * Módulo para gerenciamento avançado de arquivos e diretórios.
   * Inclui permissões, metadados, monitoramento, cópia, remoção e manipulação de JSON.
   * @example
   * const content = await file.readJson('./package.json');
   * console.log(content.name);
   */
  file,

  /**
   * Módulo para controle robusto de processos filhos.
   * Permite iniciar, monitorar, interagir e encerrar processos externos.
   * @example
   * try {
   *   const { stdout } = await process.execute('node', ['--version']).finished;
   *   console.log(`Node.js version: ${stdout.trim()}`);
   * } catch (e) {
   *   if (e instanceof process.ProcessError) console.error(e.stderr);
   * }
   */
  process,

  /**
   * Módulo para acessar informações detalhadas do sistema operacional.
   * Inclui uso de CPU/memória, informações de rede e detalhes da plataforma.
   * @example
   * console.log(`Plataforma: ${system.getPlatform()}`);
   * console.log(`Memória livre: ${system.getMemoryUsage().free} bytes`);
   */
  system,

  // Reexporta as classes de erro para que os usuários possam usá-las em `try/catch`.
  SystemInteractionError,
  FileError,
  ProcessError,
};

// Exportação padrão (opcional, mas útil)
// Permite que os usuários façam: import cpsi from 'cross-platform-system-interaction';
// E então acessem cpsi.file, cpsi.process, etc.
export default {
  clipboard,
  file,
  process,
  system,
  SystemInteractionError,
  FileError,
  ProcessError,
};
