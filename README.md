# Documentação do Sistema de Administração Local
## Descrição Geral
- O sistema foi desenvolvido para gerenciar operações administrativas locais, como controle de frequência, pagamento e gestão de recepcionistas. Ele utiliza Node.js no backend com o framework Express e Prisma como ORM (Object-Relational Mapping). No frontend, há uma estrutura modular organizada em pastas para diferentes funcionalidades.
- Desenvolvido pelo grupo: Gabriela de Sousa, Laura Roscelle e Letícia Rauane

## Funcionalidades Principais
- Cadastro de Alunos : Interface para criação, leitura, atualização e exclusão de cadastros dos alunos.
- Cadastro e gerencia de Recepcionistas: Interface para criação, leitura, e exclusão de atendentes.
- Registro de Presença : Funcionalidade para registrar a presença dos alunos por meio de uma simulação de leitura de impressão digital.
- Relatórios e Dashboard : Painel com visão geral das presenças, pagamentos pendentes e alunos ativos.

## Benefícios
- Eficiência Operacional : A gestão de cadastro e cobranças é simplificada, reduzindo erros humanos. 
- Analise de Lucros e Demada: Facilita a análise anual do rendimento de lucros e gerencia do fluxo de alunos na academia;
- Automatização das Pendências de Pagamento: O recepcionista tem acesso as pendencias de pagamento daquele aluno e pode entrar em contato com ele;

## Público-Alvo e necessidades
- O público-alvo inclui proprietários de academias, administradores e recepcionistas que precisam de uma solução para gerenciamento do cadastro e presença de alunos, além de um sistema que facilita a gerencia de cobranças sobre pagamentos pendentes;
- A necessidade observada foi em base na academia Salutar de Parelhas que ainda conta com métodos arcaicos de frequência e cobrança das mensalidades.

## Explicação das Pastas e Arquivos:
- Backend (back/):
- middleware/: Contém a lógica para intercepção de requisições, como autenticação, verificação de erros, etc.
- node_modules/: Onde ficam as dependências do projeto (como express, prisma, etc).
- prisma/: Diretório relacionado ao ORM Prisma para manipulação de banco de dados. Aqui geralmente fica a configuração do banco e o esquema de banco de dados (schema.prisma).
- src/: Contém o código-fonte principal do backend.
- controllers/: Arquivos responsáveis pela lógica de controle das requisições.
- repositorys/: Repositórios de acesso ao banco de dados (geralmente com a lógica de persistência e query de dados).
- routes/: Arquivos que definem as rotas de cada recurso (usuários, pagamentos, etc).
- services/: Contém a lógica de serviços que pode ser reutilizada, como validação de dados, manipulação de arquivos, etc.
- index.js: Arquivo principal do backend, que configura o servidor express e inicia o projeto.
- Frontend (views/):
- admin/: Páginas administrativas, onde o usuário admin pode interagir com o sistema.
- CSS/: Arquivos de estilo do projeto.
- frequencia/: Páginas ou componentes relacionados ao controle de frequência.
- inicio/: Página inicial do sistema.
- JS/: Arquivos JavaScript que integram o frontend com o backend, além de lógicas de dinamização.
- pagamento/: Páginas relacionadas a pagamentos ou processamento de transações.
- recepcionista/: Páginas ou funcionalidades relacionadas ao recepcionista.

## Bibliotecas, dependências e aplicações instaladas para o uso do sistema
- Prisma Studio
- Express
- Node.js e suas dependencias (Nodemon)
- Postgres
- Biblioteca JWT
- Biblioteca Bcrypt
- Biblioteca Inputmask
- Biblioteca Node-cron
- Boostrap

## Observações necessárias
- É um sistema Local utilizado em duas máquinas ou até mais, mas inicialmente temos a parte do gerenciamento (Administrador ou Recepcionista) e outra tela usada para realizar o cadastro das frequencias (utilizadas pelo aluno);
- O aluno apenas interage localmente com a tela da frequencia (ao entrar e sair da academia), entretanto no cadastro do aluno há a inserção de dados como email, usuario e senha, que podem ser usados para uma expansão desse sistema, para notificar o aluno remotamente e automaticamento dos pagamentos, e ainda a criação de um sistema mobile para o acesso exclusivo de promoções, exercícios pelos alunos.
- O arquivo .config que está dentro do diretório JS, apresenta a variável global do link do servidor;
- A nomeação de controllers, repositorys e rotas referentes a cada identidade, referencia a lógica de pertencer aquela entidade, ou seja, açoes que acontecem com o administrador, recepcionista, aluno;
- A nomeação da parte do FrontEnd (views) segue a mesma lógica;
- Já a nomeação da parte da integração (diretório JS), segue a lógica das ações que cada entidade faz, por exemplo o scripts_Recep está ligado à pagina do Recepcionista, mas lá há o CRUD do aluno, pois o recepcionista faz isso. Enquanto que no scripts_Admin está ligado à página do Administador, e há o CRUD imparcial do Recepcionista, pois o administrador é responsável por gerenciar esse controle dos atendentes.
- Ao cadastrar aluno, ja considera pago a primeira parcela do mês, o valor está declarado como variavel global no repository de aluno, sendo o padrão de 80;

## Amostra do sistema
![Captura de tela de 2025-01-13 09-12-46](https://github.com/user-attachments/assets/0e419c8d-b156-4eae-a197-076e8f648cf0)
![Captura de tela de 2025-01-13 09-32-49](https://github.com/user-attachments/assets/8f0f92fc-1a5c-49d8-99c6-6679d1c9ed2a)
![image](https://github.com/user-attachments/assets/bca1c0b8-bd9e-473b-a542-d5e9fab0b9e8)
![image](https://github.com/user-attachments/assets/2ee12207-4bae-4683-b349-cf9580eb0c51)
![image](https://github.com/user-attachments/assets/258bc704-abdb-4f19-b6d5-df090388fc86)





