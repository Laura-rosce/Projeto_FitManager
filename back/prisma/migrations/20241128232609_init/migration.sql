-- CreateTable
CREATE TABLE "Administrador" (
    "cpfAdmin" VARCHAR(11) NOT NULL,
    "chaveAdmin" TEXT NOT NULL,

    CONSTRAINT "Administrador_pkey" PRIMARY KEY ("cpfAdmin")
);

-- CreateTable
CREATE TABLE "Aluno" (
    "cpfAluno" VARCHAR(11) NOT NULL,
    "nomeAluno" TEXT NOT NULL,
    "idade" INTEGER NOT NULL,
    "emailAluno" TEXT NOT NULL,
    "telefoneAluno" TEXT NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusPagamento" TEXT NOT NULL,
    "vencimentoFatura" TIMESTAMP(3) NOT NULL,
    "usuarioAluno" TEXT NOT NULL,
    "senhaAluno" TEXT NOT NULL,

    CONSTRAINT "Aluno_pkey" PRIMARY KEY ("cpfAluno")
);

-- CreateTable
CREATE TABLE "Recepcionista" (
    "cpfRecep" VARCHAR(11) NOT NULL,
    "nomeRecep" TEXT NOT NULL,
    "emailRecep" TEXT NOT NULL,
    "TelefoneRecep" TEXT,
    "usuarioRecep" TEXT NOT NULL,
    "senhaRecep" TEXT NOT NULL,

    CONSTRAINT "Recepcionista_pkey" PRIMARY KEY ("cpfRecep")
);

-- CreateTable
CREATE TABLE "Frequencia" (
    "idFreq" SERIAL NOT NULL,
    "idAluno" VARCHAR(11) NOT NULL,
    "tempo" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Frequencia_pkey" PRIMARY KEY ("idFreq")
);

-- CreateTable
CREATE TABLE "Receita" (
    "idReceita" SERIAL NOT NULL,
    "idAluno" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "statusPagamento" TEXT NOT NULL,
    "dataPagamento" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Receita_pkey" PRIMARY KEY ("idReceita")
);

-- CreateIndex
CREATE UNIQUE INDEX "Administrador_cpfAdmin_key" ON "Administrador"("cpfAdmin");

-- CreateIndex
CREATE UNIQUE INDEX "Aluno_cpfAluno_key" ON "Aluno"("cpfAluno");

-- CreateIndex
CREATE UNIQUE INDEX "Recepcionista_cpfRecep_key" ON "Recepcionista"("cpfRecep");
