import * as path from 'path';
import { promises as fs } from 'fs';
import { file } from '../src'; // Importa a API do ponto de entrada principal
import { IS_WINDOWS } from '../src/utils/platform'; // Usado para pular testes específicos

// --- Configuração do Ambiente de Teste ---

// Define o caminho para um diretório temporário onde os testes serão executados.
const TEST_DIR = path.join(__dirname, 'test-temp-dir');

// `beforeAll` é executado uma vez, antes de todos os testes neste arquivo.
beforeAll(async () => {
  // Garante que o diretório de teste não exista e o cria.
  // O `force: true` em `rm` evita erros se o diretório não existir.
  await fs.rm(TEST_DIR, { recursive: true, force: true });
  await fs.mkdir(TEST_DIR, { recursive: true });
});

// `afterAll` é executado uma vez, após todos os testes neste arquivo.
afterAll(async () => {
  // Limpa o diretório de teste para não deixar arquivos residuais.
  await fs.rm(TEST_DIR, { recursive: true, force: true });
});

// --- Suíte de Testes para o Módulo 'file' ---

describe('Módulo file', () => {
  // Testes para a função `exists`
  describe('exists()', () => {
    it('deve retornar true para um arquivo que existe', async () => {
      const filePath = path.join(TEST_DIR, 'exists_test.txt');
      await fs.writeFile(filePath, 'hello');
      await expect(file.exists(filePath)).resolves.toBe(true);
    });

    it('deve retornar false para um arquivo que não existe', async () => {
      const filePath = path.join(TEST_DIR, 'non_existent_file.txt');
      await expect(file.exists(filePath)).resolves.toBe(false);
    });
  });

  // Testes para a função `getMetadata`
  describe('getMetadata()', () => {
    it('deve retornar os metadados de um arquivo', async () => {
      const filePath = path.join(TEST_DIR, 'metadata_test.txt');
      const content = 'metadata content';
      await fs.writeFile(filePath, content);

      const metadata = await file.getMetadata(filePath);
      expect(metadata).toBeDefined();
      expect(metadata.size).toBe(content.length);
      expect(metadata.isFile()).toBe(true);
    });

    it('deve lançar um erro para um arquivo que não existe', async () => {
      const filePath = path.join(TEST_DIR, 'non_existent_metadata.txt');
      // `expect().rejects` é a forma correta de testar se uma Promise é rejeitada.
      await expect(file.getMetadata(filePath)).rejects.toThrow();
    });
  });

  // Testes para a função `setPermissions`
  // A função `describe.skip` pula este bloco de testes.
  // O `chmod` no Windows tem comportamento muito limitado, então pulamos o teste lá.
  describe.skipIf(IS_WINDOWS)('setPermissions()', () => {
    it('deve alterar as permissões de um arquivo', async () => {
      const filePath = path.join(TEST_DIR, 'permissions_test.sh');
      await fs.writeFile(filePath, '#!/bin/bash');

      // Define a permissão para 755 (rwxr-xr-x)
      await file.setPermissions(filePath, 0o755);

      const { mode } = await fs.stat(filePath);
      // Verifica se o bit de execução para o usuário está definido.
      // A verificação exata do modo pode variar entre sistemas, mas a permissão de execução é um bom teste.
      expect(mode & 0o100).toBe(0o100); // Verifica o bit de execução do proprietário
    });
  });

  // Testes para a função `watch`
  describe('watch()', () => {
    it('deve detectar a adição de um novo arquivo', async () => {
      const newFilePath = path.join(TEST_DIR, 'watch_add_test.txt');

      // Cria uma Promise que será resolvida quando o evento 'add' for recebido.
      const onAddPromise = new Promise<string>((resolve) => {
        const watcher = file.watch(TEST_DIR);
        watcher.on('add', (addedPath) => {
          // Normaliza o caminho para consistência entre SOs
          const normalizedPath = path.normalize(addedPath);
          watcher.close(); // Para o monitoramento para não interferir em outros testes
          resolve(normalizedPath);
        });
      });

      // Atraso mínimo para garantir que o watcher esteja pronto
      await new Promise(res => setTimeout(res, 100));

      // Ação que dispara o evento: criar o arquivo.
      await fs.writeFile(newFilePath, 'watching');

      // Aguarda a Promise ser resolvida e verifica se o caminho do arquivo detectado está correto.
      await expect(onAddPromise).resolves.toBe(path.normalize(newFilePath));
    });

    it('deve detectar a alteração de um arquivo', async () => {
        const filePath = path.join(TEST_DIR, 'watch_change_test.txt');
        await fs.writeFile(filePath, 'initial content');
  
        const onChangePromise = new Promise<string>((resolve) => {
          const watcher = file.watch(filePath); // Monitora o arquivo diretamente
          watcher.on('change', (changedPath) => {
            watcher.close();
            resolve(path.normalize(changedPath));
          });
        });
  
        await new Promise(res => setTimeout(res, 100));
  
        // Ação: altera o conteúdo do arquivo.
        await fs.appendFile(filePath, ' more content');
  
        await expect(onChangePromise).resolves.toBe(path.normalize(filePath));
      });
  });
});
