import { spawn, ChildProcess, SpawnOptions } from 'child_process';
import { ProcessError } from '../utils/errors';

/**
 * Interface que define a estrutura do resultado de um processo gerenciado.
 * Este objeto é retornado imediatamente pela função `execute`.
 */
export interface ManagedProcess {
  /** O objeto do processo filho original do Node.js, permitindo controle avançado (ex: .kill()). */
  readonly process: ChildProcess;

  /** O ID do processo no sistema operacional. */
  readonly pid?: number;

  /** Todo o conteúdo capturado da saída padrão (stdout) como uma string. */
  stdout: string;

  /** Todo o conteúdo capturado da saída de erro (stderr) como uma string. */
  stderr: string;

  /** O código de saída do processo. Será `null` se o processo ainda estiver em execução. */
  exitCode: number | null;

  /**
   * Uma Promise que é resolvida **apenas se o processo for concluído com sucesso (código 0)**.
   * Se o processo falhar (código de saída diferente de 0) ou não puder ser iniciado, a Promise será **rejeitada** com um `ProcessError`.
   */
  readonly finished: Promise<{ stdout: string; stderr: string; exitCode: 0 }>;

  /**
   * Escreve dados na entrada padrão (stdin) do processo filho.
   * @param data A string ou Buffer a ser escrita no stdin.
   * @returns Uma Promise que resolve quando os dados foram enviados.
   */
  writeToStdin(data: string | Buffer): Promise<void>;
}

/**
 * Inicia e gerencia um processo externo, fornecendo uma API robusta para interagir com ele.
 *
 * @param command O comando a ser executado (ex: 'npm', 'ls', 'python').
 * @param args Um array de argumentos para o comando (ex: ['install', '-g', 'typescript']).
 * @param options Opções de spawn do Node.js (ex: cwd, env, shell).
 * @returns Um objeto `ManagedProcess` que representa o processo em execução.
 */
export function execute(command: string, args: string[] = [], options: SpawnOptions = {}): ManagedProcess {
  const childProc = spawn(command, args, options);
  const commandStr = `${command} ${args.join(' ')}`;

  // O objeto `managedProc` é construído de forma a ser retornado imediatamente.
  const managedProc: ManagedProcess = {
    process: childProc,
    pid: childProc.pid,
    stdout: '',
    stderr: '',
    exitCode: null,

    writeToStdin: (data: string | Buffer): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!childProc.stdin || childProc.stdin.destroyed) {
          return reject(new ProcessError('stdin não está disponível ou foi destruído para este processo.', { command: commandStr }));
        }
        childProc.stdin.write(data, (err) => {
          if (err) {
            return reject(new ProcessError(`Falha ao escrever no stdin: ${err.message}`, { command: commandStr }));
          }
          resolve();
        });
      });
    },

    finished: new Promise((resolve, reject) => {
      // Acumula as saídas de stdout e stderr
      childProc.stdout?.on('data', (data: Buffer) => {
        managedProc.stdout += data.toString();
      });
      childProc.stderr?.on('data', (data: Buffer) => {
        managedProc.stderr += data.toString();
      });

      // Trata erros de spawn (ex: comando não encontrado)
      childProc.on('error', (err) => {
        reject(new ProcessError(err.message, { command: commandStr, stderr: managedProc.stderr }));
      });

      // Trata o fechamento do processo
      childProc.on('close', (code) => {
        managedProc.exitCode = code;

        if (code === 0) {
          // Sucesso: resolve a promise com o resultado.
          resolve({
            stdout: managedProc.stdout,
            stderr: managedProc.stderr,
            exitCode: 0, // Garante a tipagem de sucesso
          });
        } else {
          // Falha: rejeita a promise com um erro detalhado.
          reject(new ProcessError('Processo finalizado com erro.', {
            command: commandStr,
            exitCode: code,
            stderr: managedProc.stderr,
          }));
        }
      });
    }),
  };

  return managedProc;
}
