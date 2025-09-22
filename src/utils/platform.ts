import { platform } from 'os';

/**
 * @module PlatformUtils
 *
 * Este módulo utilitário interno detecta o sistema operacional atual e
 * fornece um conjunto de constantes booleanas para facilitar a escrita de
 * código específico da plataforma.
 *
 * Ele é projetado para ser usado apenas internamente por outros módulos do pacote,
 * e não deve ser exposto na API pública.
 *
 * @internal
 */

/**
 * A string que representa a plataforma atual, obtida diretamente de `os.platform()`.
 *
 * Valores comuns incluem:
 * - `'darwin'` para macOS
 * - `'win32'` para Windows (32-bit e 64-bit)
 * - `'linux'` para Linux
 *
 * @see https://nodejs.org/api/os.html#osplatform
 */
const currentPlatform: NodeJS.Platform = platform( );

/**
 * Verdadeiro se o sistema operacional atual for macOS.
 * `os.platform()` retorna 'darwin' para macOS.
 */
export const IS_MAC = currentPlatform === 'darwin';

/**
 * Verdadeiro se o sistema operacional atual for Windows.
 * `os.platform()` retorna 'win32' para todas as versões do Windows.
 */
export const IS_WINDOWS = currentPlatform === 'win32';

/**
 * Verdadeiro se o sistema operacional atual for Linux.
 */
export const IS_LINUX = currentPlatform === 'linux';

/**
 * Verdadeiro se o sistema operacional for do tipo Unix (como macOS ou Linux).
 *
 * Esta constante é extremamente útil para funcionalidades que se comportam de
 * maneira semelhante nesses sistemas, mas diferem no Windows (ex: comandos de
 * shell, estrutura de permissões de arquivo, sinais de processo).
 */
export const IS_UNIX = IS_MAC || IS_LINUX;

/**
 * Um objeto que agrupa todas as constantes de plataforma para importação e uso convenientes.
 *
 * @example
 * // Dentro de outro módulo do pacote:
 * import { platformInfo } from '../utils/platform';
 *
 * function getPathSeparator() {
 *   if (platformInfo.IS_WINDOWS) {
 *     return '\\';
 *   } else {
 *     return '/';
 *   }
 * }
 */
export const platformInfo = {
  IS_MAC,
  IS_WINDOWS,
  IS_LINUX,
  IS_UNIX,
  /** A string literal da plataforma atual (ex: 'darwin', 'win32', 'linux'). */
  current: currentPlatform,
};
