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

-- Tabela para Professor (RN004)
CREATE TABLE professor (
    id_professor INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20),
    nome VARCHAR(100) NOT NULL
);

-- Tabela para Disciplina (RN003)
CREATE TABLE disciplina (
    nome VARCHAR(100) NOT NULL,
    turno VARCHAR(20),
    carga INT,
    semestre_curso INT,
    curso VARCHAR(100) NOT NULL,
    primary key (nome, turno)
);

-- Tabela para Professor_Disciplina (RN008)
CREATE TABLE professor_disciplina (
    id_professor INT,
    nome VARCHAR(100),
    turno VARCHAR(20),
    ano INT, 
    semestre_alocacao INT, 
    dia_semana INT, 
    hora_inicio TIME,
    PRIMARY KEY (id_professor, nome, turno, ano, semestre_alocacao),
    FOREIGN KEY (id_professor) REFERENCES professor(id_professor),
    FOREIGN KEY (nome, turno) REFERENCES disciplina(nome, turno)
);


-- Tabela para Sala (RN005)
CREATE TABLE sala (
    numero_sala int NOT NULL,
    tipo_sala ENUM('sala', 'laboratorio') NOT NULL DEFAULT 'sala',
    status ENUM('livre', 'ocupada') DEFAULT 'livre',
    primary key (numero_sala, tipo_sala)
);

-- Tabela para Alocacao 
CREATE TABLE alocacao (
    numero_sala INT NOT NULL,
    tipo_sala ENUM('sala', 'laboratorio') NOT NULL,
    id_professor INT NOT NULL,
    ano int,
    semestre_alocacao int,
    nome varchar(100),
    turno varchar(20),
    tipo_alocacao ENUM('esporadico', 'fixo') NOT NULL,
    status ENUM('confirmada', 'pendente', 'cancelada') DEFAULT 'pendente',

    FOREIGN KEY (numero_sala, tipo_sala) REFERENCES sala(numero_sala, tipo_sala),
    FOREIGN KEY (id_professor, nome, turno, ano, semestre_alocacao) REFERENCES professor_disciplina(id_professor, nome, turno, ano, semestre_alocacao),
    primary key (numero_sala,tipo_sala,id_professor, nome, turno, ano, semestre_alocacao)
);

INSERT INTO users (username, password, role) VALUES ('Andreia.machion@fatec.sp.gov.br', '$2b$10$lAfcLCdg5Fv51uZfUK0Mw.1A6URNbP82NXCdN2xVibrfdHRJL66D2', 'admin');
INSERT INTO users (username, password, role) VALUES ('professor@Professor.com', '$2b$10$lAfcLCdg5Fv51uZfUK0Mw.1A6URNbP82NXCdN2xVibrfdHRJL66D2', 'professor');