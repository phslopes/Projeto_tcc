import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./AlocacoesPage.css"; // Updated CSS import

const cursos = ["ADS", "Big Data", "Eventos"];
const turnos = ["Manhã", "Vespertino", "Noturno"]; 
const semestres = [1, 2, 3, 4, 5, 6];

// Mock de Professor
const todosProfessoresOriginal = ["Prof. Cachucho", "Prof. Aninha", "Prof. Levi", "Prof. Normie"];

// Mock Disciplina
const todasDisciplinas = [
  { nome: "Matemática Cachuche", curso: "ADS", turno: "Noturno", semestre: 1 },
  { nome: "Engenharia de festa", curso: "Eventos", turno: "Manhã", semestre: 2 },
  { nome: "Power BI sei la", curso: "Big Data", turno: "Manhã", semestre: 3 },
  { nome: "Engenharia de Software", curso: "ADS", turno: "Noturno", semestre: 3 },
  { nome: "Banco de Dados", curso: "ADS", turno: "Noturno", semestre: 2 },
];
const todasSalas = ["S01", "S02", "S03", "L01", "L02", "Auditório A"];

const professorDisciplinaVinculos = [
  { disciplinaKey: { nome: "Matemática Cachuche", curso: "ADS", turno: "Noturno", semestre: 1 }, professorNome: "Prof. Cachucho" },
  { disciplinaKey: { nome: "Engenharia de festa", curso: "Eventos", turno: "Manhã", semestre: 2 }, professorNome: "Prof. Aninha" },
  { disciplinaKey: { nome: "Power BI sei la", curso: "Big Data", turno: "Manhã", semestre: 3 }, professorNome: "Prof. Levi" }, 
  { disciplinaKey: { nome: "Engenharia de Software", curso: "ADS", turno: "Noturno", semestre: 3 }, professorNome: "Prof. Normie" }, 
  { disciplinaKey: { nome: "Banco de Dados", curso: "ADS", turno: "Noturno", semestre: 2 }, professorNome: "Prof. Cachucho" }, 

];

export default function AlocacoesPage() { // Renamed component
  const [cursoFiltro, setCursoFiltro] = useState(""); 
  const [turnoFiltro, setTurnoFiltro] = useState(""); 
  const [semestreFiltro, setSemestreFiltro] = useState(""); 

  // Estado para o formulário de nova associação
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState("");
  const [professorAutoPreenchido, setProfessorAutoPreenchido] = useState(""); // professor read-only
  const [salaSelecionada, setSalaSelecionada] = useState("");

  // Estado original das associações (alocações)
  const [associacoes, setAssociacoes] = useState([
    { disciplina: "Matemática Cachuche", professor: "Prof. Cachucho", sala: "S01" },
    { disciplina: "Engenharia de festa", professor: "Prof. Aninha", sala: "L01" },
  ]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAssociation, setEditingAssociation] = useState(null); 
  
  // Estados para o modal de edição
  const [editedDisciplina, setEditedDisciplina] = useState(""); // Mantém o nome da disciplina
  const [editedProfessorAutoPreenchido, setEditedProfessorAutoPreenchido] = useState("");
  const [editedSala, setEditedSala] = useState("");

  // Lógica de filtragem original
  const disciplinasFiltradasParaNovo = todasDisciplinas.filter(
    (d) =>
      (!cursoFiltro || d.curso === cursoFiltro) &&
      (!turnoFiltro || d.turno === turnoFiltro) &&
      (!semestreFiltro || d.semestre === parseInt(semestreFiltro))
  );

  // Efeito para auto-preencher professor no formulário principal
  useEffect(() => {
    if (disciplinaSelecionada) {
      const discObj = todasDisciplinas.find(d => d.nome === disciplinaSelecionada);
      if (discObj) {
        const vinculo = professorDisciplinaVinculos.find(v =>
          v.disciplinaKey.nome === discObj.nome &&
          v.disciplinaKey.curso === discObj.curso &&
          v.disciplinaKey.turno === discObj.turno &&
          v.disciplinaKey.semestre === discObj.semestre
        );
        setProfessorAutoPreenchido(vinculo ? vinculo.professorNome : "Vínculo não encontrado");
      } else {
        setProfessorAutoPreenchido("");
      }
    } else {
      setProfessorAutoPreenchido("");
    }
  }, [disciplinaSelecionada]);

  // Efeito para auto-preencher professor no modal de edição
  useEffect(() => {
    if (showEditModal && editingAssociation && editedDisciplina) {
      const discObj = todasDisciplinas.find(d => d.nome === editedDisciplina);
      if (discObj) {
        const vinculo = professorDisciplinaVinculos.find(v =>
          v.disciplinaKey.nome === discObj.nome &&
          v.disciplinaKey.curso === discObj.curso &&
          v.disciplinaKey.turno === discObj.turno &&
          v.disciplinaKey.semestre === discObj.semestre
        );
        setEditedProfessorAutoPreenchido(vinculo ? vinculo.professorNome : "Vínculo não encontrado");
      } else {
        setEditedProfessorAutoPreenchido("");
      }
    } else if (!showEditModal) {
        setEditedProfessorAutoPreenchido(""); // Limpa quando o modal fecha
    }
  }, [editedDisciplina, showEditModal, editingAssociation]);


  const associar = () => {
    if (!disciplinaSelecionada || !professorAutoPreenchido || !salaSelecionada || professorAutoPreenchido === "Vínculo não encontrado") {
      alert("Selecione a disciplina (verifique o vínculo do professor) e a sala.");
      return;
    }

    const jaExiste = associacoes.some(
      (a) =>
        a.disciplina === disciplinaSelecionada &&
        a.professor === professorAutoPreenchido && // Usa o professor auto-preenchido
        a.sala === salaSelecionada
    );

    if (jaExiste) {
      alert("Essa alocação (Disciplina, Professor, Sala) já existe.");
      return;
    }

    setAssociacoes([
      ...associacoes,
      {
        disciplina: disciplinaSelecionada,
        professor: professorAutoPreenchido, 
        sala: salaSelecionada,
      },
    ]);
    setDisciplinaSelecionada("");
    setSalaSelecionada("");
  };

  const handleEdit = (index) => {
    const assoc = associacoes[index];
    setEditingAssociation({ ...assoc, index }); 
    setEditedDisciplina(assoc.disciplina);
    setEditedSala(assoc.sala);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingAssociation(null);
    setEditedDisciplina("");
    // setEditedProfessorAutoPreenchido(""); // Será limpo pelo useEffect
    setEditedSala("");
  };

  const handleSaveEdit = () => {
    if (!editedDisciplina || !editedProfessorAutoPreenchido || !editedSala || editedProfessorAutoPreenchido === "Vínculo não encontrado") {
      alert("Disciplina (verifique o vínculo do professor) e Sala não podem ser vazios na edição.");
      return;
    }

    const jaExiste = associacoes.some(
      (a, i) =>
        i !== editingAssociation.index &&
        a.disciplina === editedDisciplina &&
        a.professor === editedProfessorAutoPreenchido && 
        a.sala === editedSala
    );

    if (jaExiste) {
      alert("Essa combinação de Disciplina, Professor e Sala já existe em outra alocação.");
      return;
    }

    const updatedAssociacoes = [...associacoes];
    updatedAssociacoes[editingAssociation.index] = {
      disciplina: editedDisciplina,
      professor: editedProfessorAutoPreenchido, 
      sala: editedSala,
    };
    setAssociacoes(updatedAssociacoes);
    handleCloseEditModal();
  };

  const handleDelete = (index) => {
    if (confirm("Tem certeza que deseja excluir esta alocação?")) {
      const novasAssociacoes = associacoes.filter((_, i) => i !== index);
      setAssociacoes(novasAssociacoes);
    }
  };

  return (
    <div className="container-alocacoes">
      <h2>Alocação: Disciplina, Professor e Sala</h2>

      <div className="filtros-alocacao"> {/* Corrected class name */}
        <label>
          Curso:
          <select value={cursoFiltro} onChange={(e) => setCursoFiltro(e.target.value)}>
            <option value="">Todos</option>
            {cursos.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Turno:
          <select value={turnoFiltro} onChange={(e) => setTurnoFiltro(e.target.value)}>
            <option value="">Todos</option>
            {turnos.map((t) => ( 
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Semestre:
          <select value={semestreFiltro} onChange={(e) => setSemestreFiltro(e.target.value)}>
            <option value="">Todos</option>
            {semestres.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-alocacao"> {/* Corrected class name */}
        <label>
          Disciplina:
          <select
            value={disciplinaSelecionada}
            onChange={(e) => setDisciplinaSelecionada(e.target.value)}
          >
            <option value="">Selecione</option>
            {disciplinasFiltradasParaNovo.map((d) => (
              <option key={d.nome} value={d.nome}> 
                {d.nome} ({d.curso} - Sem: {d.semestre} - {d.turno})
              </option>
            ))}
          </select>
        </label>

        <label>
          Professor:
          <input
            type="text"
            value={professorAutoPreenchido}
            readOnly
            placeholder="Selecione uma disciplina"
            className="readonly-input-alocacao" // Corrected class name
            style={{backgroundColor: '#e9ecef', cursor: 'default', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%', marginTop: '0.4rem'}} 
          />
        </label>

        <label>
          Sala:
          <select
            value={salaSelecionada}
            onChange={(e) => setSalaSelecionada(e.target.value)}
          >
            <option value="">Selecione</option>
            {todasSalas.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <button className="btn-alocar" onClick={associar}>ASSOCIAR</button> {/* Corrected class name */}
      </div>

      <table className="table-alocacoes"> {/* Corrected class name */}
        <thead>
          <tr>
            <th>Disciplina</th>
            <th>Professor</th>
            <th>Sala</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {associacoes.map((a, i) => ( // 'i' como key se não houver ID único na associação original
            <tr key={i}> 
              <td>{a.disciplina}</td>
              <td>{a.professor}</td>
              <td>{a.sala}</td>
              <td className="coluna-acoes">
                <button onClick={() => handleEdit(i)} className="btn-acao-edit">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(i)} className="btn-acao-delete">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showEditModal && editingAssociation && (
        <div className="modal-alocacao-overlay"> {/* Corrected class name */}
          <div className="modal-alocacao-content"> {/* Corrected class name */}
            <button className="modal-alocacao-close-btn" onClick={handleCloseEditModal}> {/* Corrected class name */}
              &times;
            </button>
            <h3>Editar Alocação</h3>
            <div className="form-edit-alocacao"> {/* Corrected class name */}
              <label>
                Disciplina:
                <select
                  value={editedDisciplina}
                  onChange={(e) => setEditedDisciplina(e.target.value)}
                >
                  <option value="">Selecione uma disciplina</option>
                  {todasDisciplinas.map((d) => (
                    <option key={d.nome} value={d.nome}>
                      {d.nome} ({d.curso} - Sem: {d.semestre} - {d.turno})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Professor:
                <input
                  type="text"
                  value={editedProfessorAutoPreenchido}
                  readOnly
                  placeholder="Selecione uma disciplina"
                  className="readonly-input-alocacao-modal" // Corrected class name
                  style={{backgroundColor: '#e9ecef', cursor: 'default', width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', marginTop: '0.5rem', marginBottom: '1rem'}} 
                />
              </label>
              <label>
                Sala:
                <select
                  value={editedSala}
                  onChange={(e) => setEditedSala(e.target.value)}
                >
                  <option value="">Selecione uma sala</option>
                  {todasSalas.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <button className="btn-salvar-edicao" onClick={handleSaveEdit}>
                SALVAR ALTERAÇÕES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}