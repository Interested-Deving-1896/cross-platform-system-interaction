import { promises as fs, Stats } from 'fs';
import * as path from 'path';
import chokidar from 'chokidar';
import { FileError } from '../utils/errors';

/**
 * @module File
 *
 * Módulo para gerenciamento avançado de arquivos e diretórios.
 * Oferece uma API unificada para manipulação e monitoramento de arquivos
 * de forma multiplataforma.
 */

// --- Funções de Verificação e Metadados ---

/**
 * Verifica se um caminho (arquivo ou diretório) existe no sistema de arquivos.
 * @param filePath O caminho a ser verificado.
 * @returns Uma Promise que resolve para `true` se o caminho existir, e `false` caso contrário.
 */
export async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Obtém os metadados de um arquivo ou diretório.
 * @param filePath O caminho para o arquivo ou diretório.
 * @returns Uma Promise que resolve com o objeto `fs.Stats` contendo os metadados.
 */
export async function getMetadata(filePath: string): Promise<Stats> {
  try {
    return await fs.stat(filePath);
  } catch (error: any) {
    throw new FileError(`Falha ao obter metadados`, filePath);
  }
}

// --- Funções de Manipulação ---

/**
 * Altera as permissões de um arquivo ou diretório.
 * @param filePath O caminho para o arquivo ou diretório.
 * @param mode O modo de permissão a ser aplicado (ex: `0o755`).
 */
export async function setPermissions(filePath: string, mode: number | string): Promise<void> {
  try {
    await fs.chmod(filePath, mode);
  } catch (error: any) {
    throw new FileError(`Falha ao alterar permissões para o modo "${mode}"`, filePath);
  }
}

/**
 * Remove um arquivo ou diretório.
 * @param targetPath O caminho a ser removido.
 * @param options Opções. Defina `recursive: true` para remover diretórios não vazios.
 */
export async function remove(targetPath: string, options: { recursive?: boolean } = {}): Promise<void> {
  try {
    await fs.rm(targetPath, { recursive: options.recursive ?? false, force: options.recursive ?? false });
  } catch (error: any) {
    throw new FileError(`Falha ao remover`, targetPath);
  }
}

/**
 * Copia um arquivo ou diretório de um local para outro.
 * @param source O caminho de origem.
 * @param destination O caminho de destino.
 * @param options Opções. Defina `recursive: true` para copiar diretórios.
 */
export async function copy(source: string, destination: string, options: { recursive?: boolean } = {}): Promise<void> {
  try {
    await fs.cp(source, destination, { recursive: options.recursive ?? false });
  } catch (error: any) {
    throw new FileError(`Falha ao copiar de "${source}" para "${destination}"`, source);
  }
}

// --- Funções de Leitura/Escrita ---

/**
 * Lê e analisa um arquivo JSON.
 * @param filePath O caminho para o arquivo JSON.
 * @returns O objeto JavaScript analisado.
 */
export async function readJson<T = any>(filePath: string): Promise<T> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error: any) {
    throw new FileError(`Falha ao ler ou analisar o arquivo JSON`, filePath);
  }
}

/**
 * Escreve um objeto JavaScript em um arquivo JSON formatado.
 * @param filePath O caminho do arquivo a ser criado/sobrescrito.
 * @param data O objeto a ser serializado.
 * @param options Opções para formatação. `space` define a indentação.
 */
export async function writeJson(filePath: string, data: any, options: { space?: number | string } = { space: 2 }): Promise<void> {
  try {
    const content = JSON.stringify(data, null, options.space);
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error: any) {
    throw new FileError(`Falha ao escrever o arquivo JSON`, filePath);
  }
}

// --- Função de Monitoramento ---

/**
 * Monitora um arquivo ou diretório para mudanças em tempo real.
 * @param watchPath O caminho (ou array de caminhos) a ser monitorado.
 * @param options Opções de configuração do `chokidar`.
 * @returns Uma instância do `FSWatcher` do chokidar.
 */
export function watch(watchPath: string | readonly string[], options?: chokidar.WatchOptions): chokidar.FSWatcher {
  const defaultOptions: chokidar.WatchOptions = {
    persistent: true,
    ignoreInitial: true,
    ignored: /(^|[\/\\])\../,
    ...options,
  };
  return chokidar.watch(watchPath, defaultOptions);
}
