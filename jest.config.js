/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    // O preset que informa ao Jest para usar o ts-jest para transpilar arquivos TypeScript.
    preset: 'ts-jest',
  
    // O ambiente onde os testes serão executados. Para um pacote de backend/CLI como o nosso, é 'node'.
    testEnvironment: 'node',
  
    // Limpa automaticamente os mocks entre cada teste.
    // Isso é uma boa prática para garantir que os testes sejam isolados uns dos outros.
    clearMocks: true,
  
    // O diretório onde o Jest deve armazenar os relatórios de cobertura de código.
    coverageDirectory: 'coverage',
  
    // Um padrão de glob que indica ao Jest onde encontrar os arquivos de teste.
    // Esta configuração padrão já encontra `*.test.ts` e `*.spec.ts` em qualquer pasta.
    testMatch: [
      '**/tests/**/*.test.ts',
    ],
  
    // Ignora os diretórios `dist` (código compilado) e `node_modules` durante a execução dos testes.
    testPathIgnorePatterns: [
      '/node_modules/',
      '/dist/',
    ],
  
    // Configuração para o ts-jest, especificando qual tsconfig usar.
    // Isso garante que os testes sejam compilados com as mesmas regras do código-fonte.
    transform: {
      '^.+\\.ts$': ['ts-jest', {
        tsconfig: 'tsconfig.json',
      }],
    },
  };
  