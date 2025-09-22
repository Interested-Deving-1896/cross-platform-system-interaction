import { execute as internalExecute, ManagedProcess } from './manager';
import { ProcessError } from '../utils/errors';
import { IS_WINDOWS } from '../utils/platform';

/**
 * @module Process
 *
 * Este módulo fornece uma API unificada e robusta para iniciar, gerenciar e
 * interagir com processos filhos do sistema operacional.
 *
 * @example
 * import { process as proc } from 'cross-platform-system-interaction';
 *
 * try {
 *   const { stdout } = await proc.execute('git', ['rev-parse', 'HEAD']).finished;
 *   console.log('Último commit hash:', stdout.trim());
 * } catch (error) {
 *   if (error instanceof proc.ProcessError) {
 *     console.error(`Comando falhou com código ${error.exitCode}: ${error.stderr}`);
 *   }
 * }
 */

// --- Reexportações do Módulo Manager ---

// Reexporta a função `execute` principal.
export { execute } from './manager';

// Reexporta os tipos para que os usuários possam usá-los.
export type { ManagedProcess };

// Reexporta a classe de erro para tratamento específico.
export { ProcessError } from '../utils/errors';


// --- Novas Funções Utilitárias ---

/**
 * Encerra um processo com base no seu ID (PID).
 * Abstrai a diferença entre `taskkill` (Windows) e `kill` (Unix).
 *
 * @param pid O ID do processo a ser encerrado.
 * @param force Se `true`, força o encerramento (equivalente a `SIGKILL` ou `/F`). Padrão: `false`.
 * @returns Uma Promise que resolve quando o comando de encerramento é concluído.
 */
export async function kill(pid: number, force: boolean = false): Promise<void> {
  if (!pid || typeof pid !== 'number') {
    throw new ProcessError('PID inválido fornecido para a função kill.');
  }

  const command = IS_WINDOWS ? 'taskkill' : 'kill';
  const args = IS_WINDOWS
    ? ['/PID', pid.toString(), force ? '/F' : '/T']
    : [force ? '-9' : '-15', pid.toString()];

  try {
    // Usamos nossa própria API `execute` para rodar o comando de kill.
    // Usamos `internalExecute` para evitar referência circular se exportado como `execute`.
    const proc = internalExecute(command, args);
    await proc.finished;
  } catch (error: any) {
    // É comum tentar matar um processo que já terminou.
    // Se o erro indicar que o processo não foi encontrado, consideramos a operação um sucesso.
    const stderr = error.stderr || '';
    if (stderr.includes('não pôde ser encontrado') || stderr.includes('No such process')) {
      return; // Sucesso, o processo não existe mais.
    }
    // Para outros erros, relançamos um erro mais descritivo.
    throw new ProcessError(`Falha ao encerrar o processo ${pid}`, {
      command: `${command} ${args.join(' ')}`,
      exitCode: error.exitCode,
      stderr: stderr,
    });
  }
}

/**
 * Encontra processos em execução por nome.
 * A correspondência não diferencia maiúsculas de minúsculas.
 *
 * @param name O nome (ou parte do nome) do processo a ser encontrado.
 * @returns Uma Promise que resolve com um array de PIDs correspondentes.
 */
export async function findProcessByName(name: string): Promise<number[]> {
  if (!name) return [];

  const command = IS_WINDOWS ? 'wmic' : 'ps';
  const args = IS_WINDOWS
    ? ['process', 'where', `"name like '%${name}%'"`, 'get', 'processid']
    : ['-A', '-o', 'pid,comm'];

  try {
    const { stdout } = await internalExecute(command, args).finished;
    const pids: number[] = [];
    const lines = stdout.trim().split(/[\r\n]+/).slice(1); // Pula o cabeçalho

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      if (IS_WINDOWS) {
        const pid = parseInt(trimmedLine, 10);
        if (!isNaN(pid)) pids.push(pid);
      } else {
        // Formato do `ps`: "  1234 /path/to/command"
        const parts = trimmedLine.split(/\s+/);
        const pid = parseInt(parts[0], 10);
        const commandName = parts.slice(1).join(' ');
        if (!isNaN(pid) && commandName.toLowerCase().includes(name.toLowerCase())) {
          pids.push(pid);
        }
      }
    }
    return pids;
  } catch (error: any) {
    // Se o wmic não encontrar nada, ele pode retornar um código de erro. Tratamos isso como um array vazio.
    if (error instanceof ProcessError && error.stderr?.includes('Nenhuma Instância')) {
      return [];
    }
    throw new ProcessError(`Falha ao buscar processos por nome: ${name}`, {
      command: `${command} ${args.join(' ')}`,
      exitCode: error.exitCode,
      stderr: error.stderr,
    });
  }
}
