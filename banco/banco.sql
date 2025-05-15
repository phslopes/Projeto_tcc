CREATE TABLE Professor (
    id_professor INT PRIMARY KEY,
    e-mail VARCHAR(50),
    telefone VARCHAR(15),
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE Disciplina (
    id_disciplina INT,
    nome VARCHAR(100) NOT NULL,
    turno VARCHAR(20),
    carga INT,
    dia INT,
    hora_inicio HORA,
    semestre INT,
    curso VARCHAR(100);
    PRIMARY KEY (id_disciplina, turno)
);

CREATE TABLE professor_disciplina(
    id_professor INT,
    id_disciplina INT,
    ano INT,
    semestre INT,
    PRIMARY KEY (id_professor, id_disciplina)
    FOREIGN KEY (id_professor) REFERENCES Professor(id_professor),
    FOREIGN KEY (id_disciplina) REFERENCES Disciplina(id_disciplina)
);

CREATE TABLE Sala (
    numero_sala INT ,
    tipo_sala VARCHAR(50) NOT NULL,
    status BOOLEAN
    PRIMARY KEY (numero_sala, tipo_sala)
);

CREATE TABLE alocacao (
    id_sala INT,
    id_disciplina,
    ano INT,
    semestre INT,
    tipo VARCHAR(50),
    PRIMARY KEY (id_sala, id_disciplina)
    FOREIGN KEY (id_sala) REFERENCES Sala(id_sala),
    FOREIGN KEY (id_disciplina) REFERENCES Disciplina (id_diciplina)
);


