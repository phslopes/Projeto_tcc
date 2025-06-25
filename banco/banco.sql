DROP TABLE IF EXISTS alocacao;
DROP TABLE IF EXISTS professor_disciplina;
DROP TABLE IF EXISTS disciplina;
DROP TABLE IF EXISTS professor;
DROP TABLE IF EXISTS sala;
DROP TABLE IF EXISTS users;

-- Tabela para Usuários
CREATE TABLE users (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Armazena senhas hashed
    role ENUM('admin', 'professor', 'aluno') NOT NULL
);

-- Tabela para Professor
CREATE TABLE professor (
    id_professor INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20),
    nome VARCHAR(100) NOT NULL
);

-- Tabela para Disciplina
CREATE TABLE disciplina (
    nome VARCHAR(100) NOT NULL,
    turno VARCHAR(20),
    carga INT,
    semestre_curso INT,
    curso VARCHAR(100) NOT NULL,
    PRIMARY KEY (nome, turno)
);

-- Tabela para Sala
CREATE TABLE sala (
    numero_sala INT NOT NULL,
    tipo_sala ENUM('sala', 'laboratorio') NOT NULL DEFAULT 'sala',
    status ENUM('livre', 'ocupada') DEFAULT 'livre',
    PRIMARY KEY (numero_sala, tipo_sala)
);

-- Tabela para Professor_Disciplina
CREATE TABLE professor_disciplina (
    id_professor INT,
    nome VARCHAR(100),
    turno VARCHAR(20),
    ano INT, 
    semestre_alocacao INT, 
    dia_semana INT, 
    hora_inicio TIME,
    PRIMARY KEY (id_professor, nome, turno, ano, semestre_alocacao),
    FOREIGN KEY (id_professor) REFERENCES professor(id_professor)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (nome, turno) REFERENCES disciplina(nome, turno)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela para Alocacao
CREATE TABLE alocacao (
    numero_sala INT NOT NULL,
    tipo_sala ENUM('sala', 'laboratorio') NOT NULL,
    id_professor INT NOT NULL,
    ano INT,
    semestre_alocacao INT,
    nome VARCHAR(100),
    turno VARCHAR(20),
    tipo_alocacao ENUM('esporadico', 'fixo') DEFAULT 'fixo',
    status ENUM('Confirmada', 'Pendente', 'Cancelada') DEFAULT 'Pendente',
    dia_semana INT,
    hora_inicio TIME,
    PRIMARY KEY (numero_sala, tipo_sala, id_professor, nome, turno, ano, semestre_alocacao, dia_semana, hora_inicio),
    FOREIGN KEY (numero_sala, tipo_sala) REFERENCES sala(numero_sala, tipo_sala)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_professor, nome, turno, ano, semestre_alocacao) REFERENCES professor_disciplina(id_professor, nome, turno, ano, semestre_alocacao)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Usuários iniciais
INSERT INTO users (username, password, role) VALUES
('Andreia.machion@fatec.sp.gov.br', '$2b$10$t3dlGVrAvYpLJVRhYYYMjuyclqe24JAP6Lu5fh9umfElP.Iv4Hwrm', 'admin'),
('professor@professor.com', '$2b$10$t3dlGVrAvYpLJVRhYYYMjuyclqe24JAP6Lu5fh9umfElP.Iv4Hwrm', 'professor'),
('aluno@a.com', '$2b$10$t3dlGVrAvYpLJVRhYYYMjuyclqe24JAP6Lu5fh9umfElP.Iv4Hwrm', 'aluno');

INSERT INTO professor (nome, email, telefone) VALUES
('Ulisses Ribeiro', 'ulisses.ribeiro@teste.com.br', '(11) 98765-4321'),
('Rita Felix', 'rita.felix@teste.com.br', '(21) 91234-5678'),
('Fernando Cachucho', 'fernando.cachucho@teste.com.br', '(31) 98888-7777'),
('Antonio Venancio', 'antonio.venancio@teste.com.br', '(41) 97654-3210'),
('Marcio Rodrigues', 'marcio.rodrigues@teste.com.br', '(51) 96543-2109'),
('Norton Glaser', 'norton.glaser@teste.com.br', '(61) 95432-1098'),
('Erick Henrique', 'erick.henrique@teste.com.br', '(71) 94321-0987'),
('Jose Augusto', 'jose.augusto@teste.com.br', '(81) 93210-9876'),
('Roberto Nicolosi', 'roberto.nicolosi@teste.com.br', '(91) 92109-8765'),
('Ana Travassos', 'ana.travassos@teste.com.br', '(12) 98765-1234'),
('Manoel Guaranha', 'manoel.guaranha@teste.com.br', '(22) 97654-2345'),
('Carlos Menezes', 'carlos.menezes@teste.com.br', '(32) 96543-3456'),
('Danilo Rocha', 'danilo.rocha@teste.com.br', '(42) 95432-4567'),
('Maria Ines', 'maria.ines@teste.com.br', '(52) 94321-5678'),
('Wagner Varalda', 'wagner.varalda@teste.com.br', '(72) 92109-7890'),
('Carlos Aragao', 'carlos.aragao@teste.com.br', '(82) 91098-8901'),
('Lucio Tadeu', 'lucio.tadeu@teste.com.br', '(92) 99876-9012'),
('Renato Ribeiro', 'renato.ribeiro@teste.com.br', '(13) 98765-4321'),
('Marcio Cammaroto', 'marcio.cammaroto@teste.com.br', '(23) 97654-1234'),
('Ana Claudia', 'ana.claudia@teste.com.br', '(33) 96543-2345'),
('Rodrigo Bossini', 'rodrigo.bossini@teste.com.br', '(43) 95432-3456'),
('Luis Antonio', 'luis.antonio@teste.com.br', '(53) 94321-4567'),
('Luciene Novais', 'luciene.novais@teste.com.br', '(63) 93210-5678'),
('Elisabete Villas Boas', 'elisabete.villasboas@teste.com.br', '(73) 92109-6789'),
('Helio Rubens', 'helio.rubens@teste.com.br', '(83) 91098-7890');

-- Inserção de dados na tabela de Disciplinas
INSERT INTO disciplina (nome, turno, carga, semestre_curso, curso) VALUES
('Arquitetura e Organização de Computadores', 'Noite', 4, 1, 'ADS'),
('Programação em Microinformatica', 'Noite', 4, 1, 'ADS'),
('Matemática Discreta', 'Noite', 4, 1, 'ADS'),
('Administração Geral', 'Noite', 4, 1, 'ADS'),
('Ética e Resp. Social', 'Noite', 2, 1, 'ADS'),
('Inglês I', 'Noite', 2, 1, 'ADS'),
('Algoritmos', 'Noite', 4, 1, 'ADS'),
('Inglês II', 'Noite', 2, 2, 'ADS'),
('Montagem e Config. de Hardware', 'Noite', 2, 2, 'ADS'),
('Cálculo', 'Noite', 4, 2, 'ADS'),
('Banco de Dados', 'Noite', 4, 2, 'ADS'),
('Sistemas Operacionais I', 'Noite', 4, 2, 'ADS'),
('Comunicação e Expressão', 'Noite', 4, 2, 'ADS'),
('Programação Estruturada e Modular', 'Noite', 4, 2, 'ADS'),
('Engenharia de Software I', 'Noite', 4, 3, 'ADS'),
('Laboratório de Banco de Dados', 'Noite', 4, 3, 'ADS'),
('Fund. de Sist. de Informação', 'Noite', 2, 3, 'ADS'),
('Inglês III', 'Noite', 2, 3, 'ADS'),
('Programação Orientada a Objetos', 'Noite', 4, 3, 'ADS'),
('Estrutura de Dados', 'Noite', 4, 3, 'ADS'),
('Sistemas Operacionais II', 'Noite', 4, 3, 'ADS'),
('Engenharia de Software II', 'Noite', 4, 4, 'ADS'),
('Inglês IV', 'Noite', 2, 4, 'ADS'),
('Fundamentos de Redes de Computadores', 'Noite', 2, 4, 'ADS'),
('Programação para WEB', 'Noite', 4, 4, 'ADS'),
('Estatística Aplicada', 'Noite', 4, 4, 'ADS'),
('Programação Linear e Aplicações', 'Noite', 4, 4, 'ADS'),
('Programação Avançada Orientada a Objetos', 'Noite', 4, 4, 'ADS'),
('Contabilidade', 'Noite', 2, 5, 'ADS'),
('Empreendedorismo', 'Noite', 2, 5, 'ADS'),
('Inglês V', 'Noite', 2, 5, 'ADS'),
('Interação Humano-Computador', 'Noite', 2, 5, 'ADS'),
('Engenharia de Software III', 'Noite', 4, 5, 'ADS'),
('Programação para Dispositivos Móveis', 'Noite', 4, 5, 'ADS'),
('Programação para Banco de Dados', 'Noite', 4, 5, 'ADS'),
('Metodologia de Pesquisa', 'Noite', 2, 6, 'ADS'),
('Gestão de Equipes', 'Noite', 2, 6, 'ADS'),
('Segurança da Informação', 'Noite', 4, 6, 'ADS'),
('Gestão de Projetos', 'Noite', 4, 6, 'ADS'),
('Laboratório de Engenharia de Software', 'Noite', 4, 6, 'ADS'),
('Testes de Software', 'Noite', 4, 6, 'ADS'),
('Economia e Finanças', 'Noite', 4, 6, 'ADS'),
('Gestão e Governança de Tecnologia da Informação', 'Noite', 4, 6, 'ADS');

-- Inserção de dados na tabela de Salas
INSERT INTO sala (numero_sala, tipo_sala) VALUES
(03, 'Laboratório'),
(17, 'Sala'),
(01, 'Laboratório'),
(13, 'Sala'),
(07, 'Laboratório'),
(05, 'Laboratório'),
(12, 'Sala'),
(06, 'Laboratório'),
(18, 'Sala'),
(04, 'Laboratório'),
(02, 'Sala'),
(16, 'Sala');
