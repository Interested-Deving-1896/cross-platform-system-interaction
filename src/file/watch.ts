import chokidar from 'chokidar';
import { SystemInteractionError } from '../utils/errors';

/**
 * @module FileWatcher
 *
 * Este módulo fornece uma função robusta para monitorar o sistema de arquivos
 * em tempo real. É um wrapper em torno do `chokidar` para garantir consistência
 * e comportamento previsível.
 *
 * @internal
 */

/**
 * Monitora um arquivo ou diretório para mudanças em tempo real (criação, alteração, exclusão).
 * Utiliza `chokidar` internamente para uma performance e consistência multiplataforma superiores
 * ao `fs.watch` nativo.
 *
 * @param watchPath O caminho (ou array de caminhos) a ser monitorado.
 * @param options Opções de configuração do `chokidar` (opcional). Se não for fornecido,
 *                serão usados padrões inteligentes.
 * @returns Uma instância do `FSWatcher` do chokidar, que é um EventEmitter.
 *          Você pode ouvir eventos como 'add', 'change', 'unlink'.
 *
 * @example
 * // Importado e reexportado através de `src/file/index.ts`
 * import { file } from 'cross-platform-system-interaction';
 *
 * const watcher = file.watch('./src', { depth: 1 }); // Monitora apenas 1 nível de profundidade
 *
 * watcher
 *   .on('add', path => console.log(`Arquivo ${path} foi adicionado`))
 *   .on('change', path => console.log(`Arquivo ${path} foi alterado`))
 *   .on('error', error => console.error(`Erro no watcher: ${error}`))
 *   .on('ready', () => console.log('Monitoramento inicial concluído.'));
 *
 * // Para parar de monitorar:
 * // await watcher.close();
 */
export function watch(watchPath: string | readonly string[], options?: chokidar.WatchOptions): chokidar.FSWatcher {
  try {
    // Define opções padrão para garantir um comportamento robusto e previsível.
    const defaultOptions: chokidar.WatchOptions = {
      // Mantém o processo Node.js rodando enquanto o watcher estiver ativo.
      persistent: true,

      // Ignora os eventos 'add' e 'addDir' que são disparados durante a varredura inicial.
      // O evento 'ready' é o sinal de que a varredura inicial terminou.
      ignoreInitial: true,

      // Expressão regular para ignorar arquivos e diretórios ocultos (ex: .git, .DS_Store).
      ignored: /(^|[\/\\])\../,

      // Define uma profundidade padrão para evitar o monitoramento excessivo de grandes árvores de diretórios.
      // O usuário pode sobrescrever isso com `options.depth`.
      depth: 99,

      // Permite que o usuário forneça suas próprias opções, que sobrescreverão os padrões.
      ...options,
    };

    // Inicia o monitoramento e retorna a instância do watcher.
    const watcher = chokidar.watch(watchPath, defaultOptions);
    return watcher;

  } catch (error: any) {
    // Captura erros que possam ocorrer na inicialização do chokidar.
    throw new SystemInteractionError(`Falha ao iniciar o monitoramento de arquivos: ${error.message}`);
  }
}
