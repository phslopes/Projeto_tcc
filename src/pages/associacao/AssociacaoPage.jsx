import React, { useState, useEffect, useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./AssociacaoPage.css";
import { api } from "../../utils/api"; 

const horariosPorTurno = {
  "Manhã": ["07:00", "07:50", "08:40", "09:30", "10:20", "11:10"],
  "Tarde": ["13:00", "13:50", "14:40", "15:30", "16:20", "17:10"],
  "Noite": ["18:00", "18:50", "19:40", "20:30", "21:20", "22:10"]
};

const diasSemanaConst = [ 
  { value: 2, label: 'Segunda-feira' },
  { value: 3, label: 'Terça-feira' },
  { value: 4, label: 'Quarta-feira' },
  { value: 5, label: 'Quinta-feira' },
  { value: 6, label: 'Sexta-feira' },
  { value: 7, label: 'Sábado' },
];

const getCurrentYearSemesterFormatted = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-11
  const currentSemester = currentMonth < 6 ? 1 : 2; // Jan-Jun = 1º Sem, Jul-Dec = 2º Sem
  return `${currentYear}${currentSemester}`;
};


const generateYearsSemesters = () => {
  const currentYear = new Date().getFullYear();
  const yearsSemesters = [];
  for (let i = -2; i <= 2; i++) { // Mostra 2 anos pra frente ou pra tras
    const year = currentYear + i;
    yearsSemesters.push(`${year}1`);
    yearsSemesters.push(`${year}2`);
  }
  return yearsSemesters.sort();
};

function AssociacaoPage() {
  const [displayAssociacoes, setDisplayAssociacoes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [associacaoEditando, setAssociacaoEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // dados da api
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [cursosUnicos, setCursosUnicos] = useState([]);
  const [turnosUnicos, setTurnosUnicos] = useState([]);
  const [semestresCursoUnicos, setSemestresCursoUnicos] = useState([]);
  const yearsSemestersOptions = generateYearsSemesters(); // Gerado no frontend

  // Estados dos filtros na tela principal
  const [filtroAnoSemestre, setFiltroAnoSemestre] = useState(getCurrentYearSemesterFormatted());
  const [filtroCurso, setFiltroCurso] = useState('');
  const [filtroTurno, setFiltroTurno] = useState('');
  const [filtroSemestreCurso, setFiltroSemestreCurso] = useState('');

  // Estados para o formulário do modal
  const [formProfessorId, setFormProfessorId] = useState("");
  const [formDisciplinaNome, setFormDisciplinaNome] = useState("");
  const [formTurnoDisciplina, setFormTurnoDisciplina] = useState(""); // Turno da disciplina selecionada no modal
  const [formAnoSemestre, setFormAnoSemestre] = useState(getCurrentYearSemesterFormatted());
  const [formDiaSemana, setFormDiaSemana] = useState("");
  const [formHorario, setFormHorario] = useState("");


  // Função para buscar associações da API com os filtros atuais
  const fetchAssociacoes = useCallback(async (currentFilters) => { 
    setLoading(true);
    setError(null);
    try {
      const params = {
        anoSemestre: currentFilters.filtroAnoSemestre,
        curso: currentFilters.filtroCurso,
        turno: currentFilters.filtroTurno,
        semestreCurso: currentFilters.filtroSemestreCurso
      };
      const fetchedAssociations = await api.get('/professor-disciplines', { params }); 
      setDisplayAssociacoes(fetchedAssociations);
    } catch (err) {
      setError(err.message || 'Erro ao carregar associações.');
      console.error("Erro ao carregar associações:", err);
      setDisplayAssociacoes([]);
    } finally {
      setLoading(false);
    }
  }, []); 

  // Função para buscar dados para popular os dropdowns
  const fetchDropdownData = useCallback(async () => {
    try {
      const fetchedProfs = await api.get('/professors');
      setProfessores(fetchedProfs);

      const fetchedDiscs = await api.get('/disciplines');
      setDisciplinas(fetchedDiscs);

      // extrai cursos, turnos e semestres únicos da tabela de disciplinas para popular os filtros
      const cursos = [...new Set(fetchedDiscs.map(d => d.curso))];
      const turnos = [...new Set(fetchedDiscs.map(d => d.turno))];
      const semestres = [...new Set(fetchedDiscs.map(d => d.semestre_curso))].sort((a,b) => a-b);
      
      setCursosUnicos(cursos);
      setTurnosUnicos(turnos);
      setSemestresCursoUnicos(semestres);

    } catch (err) {
      console.error("Erro ao carregar dados para dropdowns:", err);
    }
  }, []);

  // UseEffect para carregar os dados iniciais e os dados dos dropdowns
  useEffect(() => {
    fetchDropdownData();
    // Chame fetchAssociacoes com os filtros iniciais ao montar
    fetchAssociacoes({
      filtroAnoSemestre: getCurrentYearSemesterFormatted(),
      filtroCurso: '',
      filtroTurno: '',
      filtroSemestreCurso: ''
    });
  }, [fetchDropdownData, fetchAssociacoes]);


  // Handler para o clique do botão "Aplicar"
  const handleAplicarFiltros = () => {
    // fetchAssociacoes é chamado APENAS quando o botão é clicado,com os filtros ATUAIS.
    fetchAssociacoes({
      filtroAnoSemestre,
      filtroCurso,
      filtroTurno,
      filtroSemestreCurso
    });
  };

  // Efeito para preencher o formulário do modal (edição ou nova)
  useEffect(() => {
    if (mostrarModal) {
      if (associacaoEditando) {
        setFormProfessorId(associacaoEditando.id_professor || "");
        setFormDisciplinaNome(associacaoEditando.disciplina_nome || "");
        setFormTurnoDisciplina(associacaoEditando.disciplina_turno || "");
        setFormAnoSemestre(`${associacaoEditando.ano}${associacaoEditando.semestre_alocacao}` || "");
        setFormDiaSemana(String(associacaoEditando.dia_semana) || "");
        setFormHorario(associacaoEditando.hora_inicio.substring(0,5) || ""); // Formata para HH:MM
      } else {
        // Nova Associação: Preenche com os valores dos filtros da tela principal
        setFormProfessorId("");
        setFormDisciplinaNome("");
        setFormTurnoDisciplina("");
        setFormAnoSemestre(filtroAnoSemestre || getCurrentYearSemesterFormatted());
        setFormDiaSemana("");
        setFormHorario("");
      }
    }
  }, [mostrarModal, associacaoEditando, filtroAnoSemestre, filtroCurso, filtroTurno, filtroSemestreCurso]); // Dependências de filtro para preenchimento


  const handleNovaAssociacao = () => {
    setAssociacaoEditando(null);
    setMostrarModal(true);
  };

  const handleEditarAssociacao = (associacao) => {
    setAssociacaoEditando({
        ...associacao,
        oldIdProfessor: associacao.id_professor,
        oldNomeDisc: associacao.disciplina_nome,
        oldTurnoDisc: associacao.disciplina_turno,
        oldAno: associacao.ano,
        oldSemestreAlocacao: associacao.semestre_alocacao
    });
    setMostrarModal(true);
  };
  
  const handleCloseModal = () => {
    setMostrarModal(false);
    setAssociacaoEditando(null);
    // Reset dos estados do formulário
    setFormProfessorId("");
    setFormDisciplinaNome("");
    setFormTurnoDisciplina("");
    setFormAnoSemestre(getCurrentYearSemesterFormatted());
    setFormDiaSemana("");
    setFormHorario("");
  }

  const handleSalvarAssociacaoForm = async (e) => {
    e.preventDefault();
    if (!formProfessorId || !formDisciplinaNome || !formTurnoDisciplina || !formAnoSemestre || !formDiaSemana || !formHorario) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const ano = parseInt(formAnoSemestre.substring(0, 4));
    const semestre_alocacao = parseInt(formAnoSemestre.substring(4, 5));

    // Encontrar o turno da disciplina selecionada para filtrar os horários no modal
    const disciplinaSelecionadaNoModal = disciplinas.find(d => 
        d.nome === formDisciplinaNome && d.turno === formTurnoDisciplina
    );
    const turnoDaDisciplinaModal = disciplinaSelecionadaNoModal ? disciplinaSelecionadaNoModal.turno : '';


    // Validação de Horário com base no turno da Disciplina selecionada no modal
    if (turnoDaDisciplinaModal && horariosPorTurno[turnoDaDisciplinaModal] && !horariosPorTurno[turnoDaDisciplinaModal].includes(formHorario)) {
        alert(`O horário ${formHorario} não é válido para o turno ${turnoDaDisciplinaModal} da disciplina.`);
        return;
    }

    const payload = {
        id_professor: parseInt(formProfessorId),
        nome: formDisciplinaNome, // nome da disciplina
        turno: formTurnoDisciplina, // turno da disciplina
        ano,
        semestre_alocacao,
        dia_semana: parseInt(formDiaSemana),
        hora_inicio: formHorario // Já está no formato HH:MM
    };

    try {
      if (associacaoEditando) {
        // Modo Edição (PUT)
        const { oldIdProfessor, oldNomeDisc, oldTurnoDisc, oldAno, oldSemestreAlocacao } = associacaoEditando;
        await api.put(`/professor-disciplines/${oldIdProfessor}/${oldNomeDisc}/${oldTurnoDisc}/${oldAno}/${oldSemestreAlocacao}`, payload);
        alert('Associação atualizada com sucesso!');
      } else {
        // Modo Nova Associação (POST)
        await api.post('/professor-disciplines', payload);
        alert('Associação criada com sucesso!');
      }
      handleCloseModal();
      fetchAssociacoes({ 
        filtroAnoSemestre,
        filtroCurso,
        filtroTurno,
        filtroSemestreCurso
      });
    } catch (err) {
      console.error("Erro ao salvar associação:", err);
      alert(err.message || "Ocorreu um erro ao salvar a associação.");
    }
  };

  const handleExcluirAssociacao = async (assocParaExcluir) => {
    if (window.confirm("Tem certeza que deseja excluir esta associação?")) {
      try {
        const { id_professor, disciplina_nome, disciplina_turno, ano, semestre_alocacao } = assocParaExcluir;
        await api.delete(`/professor-disciplines/${id_professor}/${disciplina_nome}/${disciplina_turno}/${ano}/${semestre_alocacao}`);
        alert('Associação excluída com sucesso!');
        fetchAssociacoes({ // Recarrega a lista após excluir
          filtroAnoSemestre,
          filtroCurso,
          filtroTurno,
          filtroSemestreCurso
        });
      } catch (err) {
        console.error("Erro ao excluir associação:", err);
        alert(err.message || "Ocorreu um erro ao excluir a associação.");
      }
    }
  };

  const handleCopiarAssociacao = async () => {
    const currentAnoSemestre = getCurrentYearSemesterFormatted();
    
    let targetYear = parseInt(currentAnoSemestre.substring(0, 4));
    let targetSemester = parseInt(currentAnoSemestre.substring(4, 5));

    if (targetSemester === 1) {
      targetSemester = 2;
    } else {
      targetYear += 1;
      targetSemester = 1;
    }
    const targetAnoSemestre = `${targetYear}${targetSemester}`;

    if (window.confirm(`Deseja copiar as associações do semestre ${currentAnoSemestre} para o semestre ${targetAnoSemestre}?`)) {
        try {
            const response = await api.post('/professor-disciplines/copy', {
                sourceAnoSemestre: currentAnoSemestre,
                targetAnoSemestre: targetAnoSemestre
            });
            alert(response.message);
            fetchAssociacoes({ // mostrar as novas cópias
              filtroAnoSemestre,
              filtroCurso,
              filtroTurno,
              filtroSemestreCurso
            });
        } catch (err) {
            console.error("Erro ao copiar associações:", err);
            alert(err.message || "Ocorreu um erro ao copiar as associações.");
        }
    }
  };


  if (loading) {
    return <div className="container-associacao"><p>Carregando associações...</p></div>;
  }

  if (error) {
    return <div className="container-associacao"><p className="text-red-500">Erro: {error}</p></div>;
  }


  return (
    <div className="container-associacao">
      <div className="header-associacao">
        <h2>Associação Professor-Disciplina</h2>
        <button className="btn-add-associacao" onClick={handleNovaAssociacao}>
          NOVA ASSOCIAÇÃO
        </button>
      </div>

      {/* Seção de Filtros */}
      <div className="filtros-container">
        <label>
          Ano/Semestre:
          <select value={filtroAnoSemestre} onChange={(e) => setFiltroAnoSemestre(e.target.value)}>
            <option value="">Todos</option>
            {yearsSemestersOptions.map((yearSem) => (
              <option key={yearSem} value={yearSem}>{yearSem}</option>
            ))}
          </select>
        </label>
        <label>
          Curso:
          <select value={filtroCurso} onChange={(e) => setFiltroCurso(e.target.value)}>
            <option value="">Todos</option>
            {cursosUnicos.map((curso) => (
              <option key={curso} value={curso}>{curso}</option>
            ))}
          </select>
        </label>
        <label>
          Turno:
          <select value={filtroTurno} onChange={(e) => setFiltroTurno(e.target.value)}>
            <option value="">Todos</option>
            {turnosUnicos.map((turno) => (
              <option key={turno} value={turno}>{turno}</option>
            ))}
          </select>
        </label>
        <label>
          Semestre (Curso):
          <select value={filtroSemestreCurso} onChange={(e) => setFiltroSemestreCurso(e.target.value)}>
            <option value="">Todos</option>
            {semestresCursoUnicos.map((semestre) => (
              <option key={semestre} value={semestre}>{semestre}º</option>
            ))}
          </select>
        </label>
        <button className="btn-aplicar-filtros" onClick={handleAplicarFiltros}>Aplicar</button>
      </div>

      <div className="table-and-copy-container">
        <table className="table-associacoes">
          <thead>
            <tr>
              <th>Professor</th>
              <th>Disciplina</th>
              <th>Turno Disc.</th>
              <th>Ano/Semestre</th>
              <th>Dia Semana</th>
              <th>Horário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {displayAssociacoes.map((assoc) => (
              <tr key={`${assoc.id_professor}-${assoc.disciplina_nome}-${assoc.disciplina_turno}-${assoc.ano}-${assoc.semestre_alocacao}`}>
                <td>{assoc.professor_nome}</td>
                <td>{assoc.disciplina_nome}</td>
                <td>{assoc.disciplina_turno}</td>
                <td>{`${assoc.ano}${assoc.semestre_alocacao}`}</td>
                <td>{diasSemanaConst.find(d => d.value === assoc.dia_semana)?.label || assoc.dia_semana}</td>
                <td>{assoc.hora_inicio.substring(0, 5)}</td> {/* Formata hora para HH:MM */}
                <td className="coluna-acoes">
                  <button
                    className="btn-acao-edit"
                    onClick={() => handleEditarAssociacao(assoc)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-acao-delete"
                    onClick={() => handleExcluirAssociacao(assoc)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {displayAssociacoes.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>Nenhuma associação encontrada para os filtros aplicados.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="copy-button-wrapper">
             <button className="btn-copy-assoc" onClick={handleCopiarAssociacao}>
                COPIAR ASSOCIAÇÃO
             </button>
        </div>
      </div>

      {mostrarModal && (
        <div className="modal-associacao-overlay">
          <div className="modal-associacao-content">
            <button className="modal-associacao-close-btn" onClick={handleCloseModal}>
              &times;
            </button>
            <h3>{associacaoEditando ? "Editar Associação" : "Nova Associação Professor-Disciplina"}</h3>
            <form onSubmit={handleSalvarAssociacaoForm} className="form-associacao">
              <label className="form-associacao-label">
                Professor:
                <select
                  className="form-associacao-select"
                  value={formProfessorId}
                  onChange={(e) => setFormProfessorId(e.target.value)}
                >
                  <option value="">Selecione o Professor</option>
                  {professores.map((prof) => (
                    <option key={prof.id_professor} value={prof.id_professor}>
                      {prof.nome}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-associacao-label">
                Disciplina:
                <select
                  className="form-associacao-select"
                  value={formDisciplinaNome && formTurnoDisciplina ? `${formDisciplinaNome}|${formTurnoDisciplina}` : ""}
                  onChange={(e) => {
                    const [nome, turno] = e.target.value.split('|');
                    setFormDisciplinaNome(nome);
                    setFormTurnoDisciplina(turno);
                  }}
                >
                  <option value="">Selecione a Disciplina</option>
                  {disciplinas
                    .filter(d => {
                      // Filtra disciplinas para o modal com base nos filtros da tela principal
                      return (
                        (!filtroCurso || d.curso === filtroCurso) &&
                        (!filtroTurno || d.turno === filtroTurno) && // Filtra pelo turno da disciplina
                        (!filtroSemestreCurso || String(d.semestre_curso) === filtroSemestreCurso)
                      );
                    })
                    .map((d) => (
                    <option key={`${d.nome}-${d.turno}`} value={`${d.nome}|${d.turno}`}>
                      {d.nome} ({d.curso} - {d.turno} - {d.semestre_curso}º Sem)
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-associacao-label">
                Ano/Semestre (Alocação):
                <select
                  value={formAnoSemestre}
                  onChange={(e) => setFormAnoSemestre(e.target.value)}
                  className="form-associacao-select"
                >
                  <option value="">Selecione o Ano/Semestre</option>
                  {yearsSemestersOptions.map((yearSem) => (
                    <option key={yearSem} value={yearSem}>{yearSem}</option>
                  ))}
                </select>
              </label>

              <label className="form-associacao-label">
                Dia da Semana:
                <select
                  className="form-associacao-select"
                  value={formDiaSemana}
                  onChange={(e) => setFormDiaSemana(e.target.value)}
                >
                  <option value="">Selecione o Dia</option>
                  {diasSemanaConst.map((dia) => (
                    <option key={dia.value} value={dia.value}>
                      {dia.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="form-associacao-label">
                Horário:
                <select
                  className="form-associacao-select"
                  value={formHorario}
                  onChange={(e) => setFormHorario(e.target.value)}
                >
                  <option value="">Selecione o Horário</option>
                  {/* Horários disponíveis dependem DO TURNO DA DISCIPLINA SELECIONADA NO MODAL */}
                  {formTurnoDisciplina && horariosPorTurno[formTurnoDisciplina] ? (
                    horariosPorTurno[formTurnoDisciplina].map((horario) => (
                      <option key={horario} value={horario}>
                        {horario}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Selecione uma Disciplina para ver horários</option>
                  )}
                </select>
              </label>

              <button type="submit" className="btn-submit-associacao">
                SALVAR ASSOCIAÇÃO
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssociacaoPage;