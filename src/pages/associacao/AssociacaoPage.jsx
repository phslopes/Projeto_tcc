import React, { useState, useEffect, useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./AssociacaoPage.css";
import { api } from "../../utils/api";

const horariosPorTurno = {
  "Manhã": ["08:00", "08:50", "09:40", "10:00", "10:40", "11:30"],
  "Tarde": ["13:00", "13:50", "15:00", "15:50", "16:50", "17:40"],
  "Noite": ["19:00", "19:50", "21:00", "21:50"]
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
  const currentMonth = new Date().getMonth();
  const currentSemester = currentMonth < 6 ? 1 : 2;
  return `${currentYear}${currentSemester}`;
};

const generateYearsSemesters = () => {
  const currentYear = new Date().getFullYear();
  const yearsSemesters = [];
  for (let i = -2; i <= 2; i++) {
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
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [cursosUnicos, setCursosUnicos] = useState([]);
  const [turnosUnicos, setTurnosUnicos] = useState([]);
  const [semestresCursoUnicos, setSemestresCursoUnicos] = useState([]);
  const yearsSemestersOptions = generateYearsSemesters();
  const [filtroAnoSemestre, setFiltroAnoSemestre] = useState(getCurrentYearSemesterFormatted());
  const [filtroCurso, setFiltroCurso] = useState('');
  const [filtroTurno, setFiltroTurno] = useState('');
  const [filtroSemestreCurso, setFiltroSemestreCurso] = useState('');
  const [formProfessorId, setFormProfessorId] = useState("");
  const [formDisciplinaNome, setFormDisciplinaNome] = useState("");
  const [formTurnoDisciplina, setFormTurnoDisciplina] = useState("");
  const [formAnoSemestre, setFormAnoSemestre] = useState(getCurrentYearSemesterFormatted());
  const [formDiaSemana, setFormDiaSemana] = useState("");
  const [formHorario, setFormHorario] = useState("");

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
      setDisplayAssociacoes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDropdownData = useCallback(async () => {
    try {
      const fetchedProfs = await api.get('/professors');
      setProfessores(fetchedProfs);

      const fetchedDiscs = await api.get('/disciplines');
      setDisciplinas(fetchedDiscs);

      const cursos = [...new Set(fetchedDiscs.map(d => d.curso))];
      const turnos = [...new Set(fetchedDiscs.map(d => d.turno))];
      const semestres = [...new Set(fetchedDiscs.map(d => d.semestre_curso))].sort((a, b) => a - b);

      setCursosUnicos(cursos);
      setTurnosUnicos(turnos);
      setSemestresCursoUnicos(semestres);

    } catch (err) {
      console.error("Erro ao carregar dados para dropdowns:", err);
    }
  }, []);

  useEffect(() => {
    fetchDropdownData();
    fetchAssociacoes({
      filtroAnoSemestre: getCurrentYearSemesterFormatted(),
      filtroCurso: '',
      filtroTurno: '',
      filtroSemestreCurso: ''
    });
  }, [fetchDropdownData, fetchAssociacoes]);

  const handleAplicarFiltros = () => {
    fetchAssociacoes({
      filtroAnoSemestre,
      filtroCurso,
      filtroTurno,
      filtroSemestreCurso
    });
  };

  useEffect(() => {
    if (mostrarModal) {
      if (associacaoEditando) {
        setFormProfessorId(associacaoEditando.id_professor || "");
        setFormDisciplinaNome(associacaoEditando.disciplina_nome || "");
        setFormTurnoDisciplina(associacaoEditando.disciplina_turno || "");
        setFormAnoSemestre(`${associacaoEditando.ano}${associacaoEditando.semestre_alocacao}` || "");
        setFormDiaSemana(String(associacaoEditando.dia_semana) || "");
        setFormHorario(associacaoEditando.hora_inicio.substring(0, 5) || "");
      } else {
        setFormProfessorId("");
        setFormDisciplinaNome("");
        setFormTurnoDisciplina("");
        setFormAnoSemestre(filtroAnoSemestre || getCurrentYearSemesterFormatted());
        setFormDiaSemana("");
        setFormHorario("");
      }
    }
  }, [mostrarModal, associacaoEditando, filtroAnoSemestre]);

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

    const payload = {
      id_professor: parseInt(formProfessorId),
      nome: formDisciplinaNome,
      turno: formTurnoDisciplina,
      ano,
      semestre_alocacao,
      dia_semana: parseInt(formDiaSemana),
      hora_inicio: formHorario
    };

    try {
      if (associacaoEditando) {
        const { oldIdProfessor, oldNomeDisc, oldTurnoDisc, oldAno, oldSemestreAlocacao } = associacaoEditando;
        await api.put(`/professor-disciplines/${oldIdProfessor}/${oldNomeDisc}/${oldTurnoDisc}/${oldAno}/${oldSemestreAlocacao}`, payload);
        alert('Associação atualizada com sucesso!');
      } else {
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
        fetchAssociacoes({
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
    let currentYear = parseInt(currentAnoSemestre.substring(0, 4));
    let currentSemester = parseInt(currentAnoSemestre.substring(4, 5));

    let sourceYear = currentYear;
    let sourceSemester = currentSemester - 1;

    if (sourceSemester === 0) {
      sourceSemester = 2;
      sourceYear -= 1;
    }

    const sourceAnoSemestre = `${sourceYear}${sourceSemester}`;
    const targetAnoSemestre = currentAnoSemestre;

    if (window.confirm(`Deseja copiar as associações do semestre ${sourceAnoSemestre} para o semestre atual ${targetAnoSemestre}?`)) {
      try {
        const response = await api.post('/professor-disciplines/copy', {
          sourceAnoSemestre: sourceAnoSemestre,
          targetAnoSemestre: targetAnoSemestre
        });
        alert(response.message);
        fetchAssociacoes({
          filtroAnoSemestre,
          filtroCurso,
          filtroTurno,
          filtroSemestreCurso
        });
      } catch (err) {
        console.error("Erro ao copiar associações:", err);
        alert(err.message || "Ocorreu um erro ao copiar.");
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
        <button className="btn-add" onClick={handleNovaAssociacao}>
          NOVA ASSOCIAÇÃO
        </button>
      </div>

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
          Semestre:
          <select value={filtroSemestreCurso} onChange={(e) => setFiltroSemestreCurso(e.target.value)}>
            <option value="">Todos</option>
            {semestresCursoUnicos.map((semestre) => (
              <option key={semestre} value={semestre}>{semestre}º Semestre</option>
            ))}
          </select>
        </label>
        <button className="btn-aplicar-filtros" onClick={handleAplicarFiltros}>APLICAR</button>
      </div>

      <div className="table-and-copy-container">
        <table className="table-associacao">
          <thead>
            <tr>
              <th>Professor</th>
              <th>Disciplina</th>
              <th>Turno</th>
              <th>Semestre</th>
              <th>Dia da Semana</th>
              <th>Horário de Início</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {displayAssociacoes.map((assoc) => (
              <tr key={`${assoc.id_professor}-${assoc.disciplina_nome}-${assoc.disciplina_turno}-${assoc.ano}-${assoc.semestre_alocacao}`}>
                <td>{assoc.professor_nome}</td>
                <td>{assoc.disciplina_nome}</td>
                <td>{assoc.disciplina_turno}</td>
                <td>{assoc.semestre_curso ? `${assoc.semestre_curso}º Semestre` : 'N/A'}</td>
                <td>{diasSemanaConst.find(d => d.value === assoc.dia_semana)?.label || assoc.dia_semana}</td>
                <td>{assoc.hora_inicio.substring(0, 5)}</td>
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
          </tbody>
        </table>
        <div className="copy-button-wrapper">
          <button className="btn-copy-assoc" onClick={handleCopiarAssociacao}>
            COPIAR ASSOCIAÇÃO
          </button>
        </div>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg relative p-6">
            <button className="absolute right-4 top-4 text-2xl font-bold" onClick={handleCloseModal}>&times;</button>
            <h3 className="text-xl font-bold text-center mb-4 mt-2">{associacaoEditando ? "Editar Associação" : "Nova Associação"}</h3>
            <form onSubmit={handleSalvarAssociacaoForm} className="flex flex-col gap-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1">Professor:</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-700"
                  value={formProfessorId}
                  onChange={(e) => setFormProfessorId(e.target.value)}
                >
                  <option value="">Selecione o Professor</option>
                  {professores
                    .slice()
                    .sort((a, b) => a.nome.localeCompare(b.nome)) 
                    .map((prof) => (
                      <option key={prof.id_professor} value={prof.id_professor}>
                        {prof.nome}
                      </option>
                    ))}
                </select>

              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1">Disciplina:</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-700"
                  value={formDisciplinaNome && formTurnoDisciplina ? `${formDisciplinaNome}|${formTurnoDisciplina}` : ""}
                  onChange={(e) => {
                    const [nome, turno] = e.target.value.split('|');
                    setFormDisciplinaNome(nome);
                    setFormTurnoDisciplina(turno);
                  }}
                >
                  <option value="">Selecione a Disciplina</option>
                  {disciplinas
                    .filter(d => (
                      (!filtroCurso || d.curso === filtroCurso) &&
                      (!filtroTurno || d.turno === filtroTurno) &&
                      (!filtroSemestreCurso || String(d.semestre_curso) === filtroSemestreCurso)
                    ))
                    .map((d) => (
                      <option key={`${d.nome}-${d.turno}`} value={`${d.nome}|${d.turno}`}>
                        {d.nome} ({d.curso} - {d.turno} - {d.semestre_curso}º Sem)
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1">Ano/Semestre (Alocação):</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-700"
                  value={formAnoSemestre}
                  onChange={(e) => setFormAnoSemestre(e.target.value)}
                >
                  <option value="">Selecione</option>
                  {yearsSemestersOptions.map((yearSem) => (
                    <option key={yearSem} value={yearSem}>{yearSem}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1">Dia da Semana:</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-700"
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
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1">Horário:</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-700"
                  value={formHorario}
                  onChange={(e) => setFormHorario(e.target.value)}
                >
                  <option value="">Selecione o Horário</option>
                  {(() => {
                    if (!formTurnoDisciplina || !formProfessorId || !formDiaSemana) {
                      return <option value="" disabled>Preencha os outros campos</option>;
                    }
                    let horariosDisponiveis;
                    if (formTurnoDisciplina === 'Noite' && parseInt(formDiaSemana) === 7) {
                      horariosDisponiveis = [...(horariosPorTurno['Manhã'] || [])];
                    } else {
                      horariosDisponiveis = [...(horariosPorTurno[formTurnoDisciplina] || [])];
                    }
                    const ano = parseInt(formAnoSemestre.substring(0, 4));
                    const semestre = parseInt(formAnoSemestre.substring(4, 5));
                    const disciplinaSelecionadaInfo = disciplinas.find(d => d.nome === formDisciplinaNome && d.turno === formTurnoDisciplina);
                    if (!disciplinaSelecionadaInfo) {
                      return <option value="" disabled>Selecione uma disciplina válida</option>;
                    }
                    const { curso: cursoSelecionado, semestre_curso: semestreCursoSelecionado } = disciplinaSelecionadaInfo;
                    const associacoesConflitantes = displayAssociacoes.filter(assoc => {
                      const infoDisciplinaExistente = disciplinas.find(d => d.nome === assoc.disciplina_nome && d.turno === assoc.disciplina_turno);
                      const conflitoProfessor = assoc.id_professor === parseInt(formProfessorId);
                      const conflitoTurma = infoDisciplinaExistente?.curso === cursoSelecionado && infoDisciplinaExistente?.semestre_curso === semestreCursoSelecionado;
                      return (conflitoProfessor || conflitoTurma) &&
                        assoc.dia_semana === parseInt(formDiaSemana) &&
                        assoc.ano === ano &&
                        assoc.semestre_alocacao === semestre;
                    });
                    const uniqueConflitos = [...new Map(associacoesConflitantes.map(item => [JSON.stringify(item), item])).values()];
                    uniqueConflitos.forEach(assoc => {
                      const disciplinaDaAssociacao = disciplinas.find(d => d.nome === assoc.disciplina_nome && d.turno === assoc.disciplina_turno);
                      if (!disciplinaDaAssociacao) return;
                      const carga = disciplinaDaAssociacao.carga || 1;
                      const horaInicio = assoc.hora_inicio.substring(0, 5);
                      const startIndex = horariosPorTurno[formTurnoDisciplina]?.indexOf(horaInicio);
                      if (startIndex > -1) {
                        for (let i = 0; i < carga; i++) {
                          const indexToRemove = startIndex + i;
                          if (indexToRemove < horariosPorTurno[formTurnoDisciplina].length) {
                            horariosDisponiveis[indexToRemove] = null;
                          }
                        }
                      }
                    });
                    return horariosDisponiveis.filter(h => h !== null).map((horario) => (
                      <option key={horario} value={horario}>{horario}</option>
                    ));
                  })()}
                </select>
              </div>
              <button type="submit" className="w-full mt-2 bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700 transition-all">
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