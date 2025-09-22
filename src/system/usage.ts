import os from 'os';
import { SystemInteractionError } from '../utils/errors';

/**
 * @module SystemUsage
 *
 * Fornece funções para obter informações sobre o uso de recursos do sistema,
 * como CPU, memória e tempo de atividade. Este é um módulo interno consumido
 * pelo `src/system/index.ts`.
 *
 * @internal
 */

// --- Funções de Memória ---

/**
 * Interface que descreve a utilização da memória do sistema.
 */
export interface MemoryUsage {
  /** A quantidade total de memória do sistema em bytes. */
  total: number;
  /** A quantidade de memória livre do sistema em bytes. */
  free: number;
  /** A quantidade de memória usada, calculada como (total - free), em bytes. */
  used: number;
  /** A porcentagem de memória usada (um valor entre 0.0 e 1.0). */
  usedPercent: number;
}

/**
 * Retorna informações detalhadas sobre o uso de memória RAM do sistema.
 * Os valores são fornecidos em bytes.
 *
 * @returns Um objeto `MemoryUsage` com o total, memória livre, usada e a porcentagem de uso.
 *
 * @example
 * const mem = getMemoryUsage();
 * console.log(`Memória Total: ${(mem.total / 1024 / 1024 / 1024).toFixed(2)} GB`);
 * console.log(`Memória Usada: ${(mem.usedPercent * 100).toFixed(2)}%`);
 */
export function getMemoryUsage(): MemoryUsage {
  try {
    const total = os.totalmem();
    const free = os.freemem();
    const used = total - free;
    const usedPercent = total > 0 ? used / total : 0; // Evita divisão por zero

    return { total, free, used, usedPercent };
  } catch (error: any) {
    throw new SystemInteractionError(`Falha ao obter informações de memória: ${error.message}`);
  }
}

// --- Funções de CPU ---

/**
 * Interface que descreve uma CPU lógica, estendendo a interface nativa do Node.js.
 */
export interface CpuInfo extends os.CpuInfo {
  // A interface os.CpuInfo já contém:
  // model: string;
  // speed: number; // em MHz
  // times: { user, nice, sys, idle, irq };
}

/**
 * Retorna um array de objetos contendo informações sobre cada core lógico da CPU.
 * Inclui modelo, velocidade em MHz e tempos de uso em milissegundos.
 *
 * @returns Um array de objetos `CpuInfo`.
 *
 * @example
 * const cpus = getCpuInfo();
 * console.log(`O sistema tem ${cpus.length} cores lógicos.`);
 * console.log(`Modelo da CPU: ${cpus[0].model}`);
 */
export function getCpuInfo(): CpuInfo[] {
  try {
    return os.cpus();
  } catch (error: any) {
    throw new SystemInteractionError(`Falha ao obter informações da CPU: ${error.message}`);
  }
}

// --- Outras Informações de Uso ---

/**
 * Retorna a carga média do sistema (load average) para intervalos de 1, 5 e 15 minutos.
 * Este valor é significativo apenas em sistemas baseados em Unix (macOS, Linux).
 * No Windows, o valor retornado será sempre `[0, 0, 0]`.
 *
 * @returns Um array com três números: [1 min, 5 min, 15 min].
 *
 * @example
 * const load = getLoadAverage();
 * console.log(`Carga média (1m, 5m, 15m): ${load.join(', ')}`);
 */
export function getLoadAverage(): [number, number, number] {
  try {
    return os.loadavg() as [number, number, number];
  } catch (error: any) {
    throw new SystemInteractionError(`Falha ao obter a carga média do sistema: ${error.message}`);
  }
}

/**
 * Retorna o tempo de atividade do sistema (uptime) em segundos.
 *
 * @returns O número de segundos que o sistema está online.
 *
 * @example
 * const uptimeInSeconds = getUptime();
 * const hours = Math.floor(uptimeInSeconds / 3600);
 * console.log(`Sistema ativo por aproximadamente ${hours} horas.`);
 */
export function getUptime(): number {
  try {
    return os.uptime();
  } catch (error: any) {
    throw new SystemInteractionError(`Falha ao obter o tempo de atividade do sistema: ${error.message}`);
  }
}
