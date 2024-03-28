# Documentação do Projeto

### Versões

**node** - 18.17.0

### Inicialização

### Back-end

npm install

npm start

### Front-end

npm install

npm run dev

## Funcionamento

Para o front utilizei a validação de arquivos e campos de formulários utilizando o React Hook Form e o Zod, também fiz o projeto utilizando o TailwindCss que facilitia muita na construção mais rápida.

Já no back-end, enfrentei alguns desafios por ainda não ter tido que desenvolver diretamente com arquivos, mas utilizei o Fastify junto com algumas bibliotecas nativas do Node como o xlsx.

Trabalhei com os métodos de leitura de arquivo do módulo de file system também, e posteriormente o xlsx pra transformar para json. Perecebi que o nome das colunas que eu recebia não era muito adequado pra estar trabalhando, então acabei renomeando pra facilitar

Percebi que há alguns casos de exceção como a situação de vir alguma questão a mais ou a menos de alguns alunos mas que acabei não implementando, mas acabei realizando a tratativa para quando a questão do aluno vier sem nenhum valor pra auxiliar na contagem de questões corretas.

Acabei não conseguindo retornar para o front-end a informação e não calculei o a porcentagem geral de acerto.

O resultado que seria enviado para o front-end pode ser visto no back end após enviar a requisição com os arquivos, no console log de “Resultados”
