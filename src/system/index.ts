import os from 'os';
import { SystemInteractionError } from '../utils/errors';

/**
 * @module System
 *
 * Este módulo fornece uma API abrangente para acessar informações nativas do
 * sistema operacional, incluindo detalhes de hardware, rede, sistema operacional
 * e uso de recursos em tempo real.
 *
 * @example
 * import { system } from 'cross-platform-system-interaction';
 *
 * function logSystemInfo() {
 *   console.log(`Plataforma: ${system.getPlatform()}`);
 *   console.log(`Hostname: ${system.getHostname()}`);
 *
 *   const mem = system.getMemoryUsage();
 *   console.log(`Uso de Memória: ${(mem.usedPercent * 100).toFixed(2)}%`);
 * }
 *
 * logSystemInfo();
 */

// --- Reexporta funcionalidades do submódulo de uso de recursos ---
// Isso importa e exporta getMemoryUsage, getCpuInfo, getLoadAverage, getUptime.
export * from './usage';

// --- Informações Gerais do Sistema Operacional ---

/**
 * Retorna a plataforma do sistema operacional, como 'darwin' (macOS),
 * 'win32' (Windows), ou 'linux'.
 *
 * @returns A string que identifica a plataforma.
 */
export function getPlatform(): NodeJS.Platform {
  return os.platform();
}

/**
 * Retorna o nome do host (hostname) do sistema operacional.
 *
 * @returns O hostname como uma string.
 */
export function getHostname(): string {
  try {
    return os.hostname();
  } catch (error: any) {
    throw new SystemInteractionError(`Falha ao obter o hostname: ${error.message}`);
  }
}

/**
 * Retorna o diretório home do usuário atual.
 *
 * @returns O caminho absoluto para o diretório home.
 */
export function getHomeDirectory(): string {
  try {
    return os.homedir();
  } catch (error: any) {
    throw new SystemInteractionError(`Falha ao obter o diretório home: ${error.message}`);
  }
}

/**
 * Retorna a arquitetura da CPU do sistema operacional para o qual o
 * binário do Node.js foi compilado (ex: 'x64', 'arm64').
 *
 * @returns A string da arquitetura.
 */
export function getArch(): string {
  return os.arch();
}

/**
 * Retorna informações sobre a versão do sistema operacional como uma string.
 *
 * @returns A versão do SO.
 */
export function getRelease(): string {
  return os.release();
}

// --- Informações de Rede ---

/**
 * Interface que descreve uma única entrada de interface de rede.
 * Corresponde à interface nativa do Node.js.
 */
export type NetworkInterfaceInfo = os.NetworkInterfaceInfo;

/**
 * Retorna um dicionário contendo as interfaces de rede do sistema.
 * A chave do objeto é o nome da interface (ex: 'eth0', 'Wi-Fi').
 * O valor é um array de objetos, um para cada endereço de rede atribuído à interface.
 *
 * @returns Um dicionário de interfaces de rede.
 */
export function getNetworkInterfaces(): Record<string, NetworkInterfaceInfo[] | undefined> {
  try {
    return os.networkInterfaces();
  } catch (error: any) {
    throw new SystemInteractionError(`Falha ao obter as interfaces de rede: ${error.message}`);
  }
}
