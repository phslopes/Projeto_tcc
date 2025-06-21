import React, { useState, useEffect, useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./AlocacoesPage.css"; // Usa o CSS adaptado
import { api } from "../../utils/api";

// Constantes fixas
const diasSemanaConst = [
  { value: 2, label: 'Segunda-feira' },
  { value: 3, label: 'Terça-feira' },
  { value: 4, label: 'Quarta-feira' },
  { value: 5, label: 'Quinta-feira' },
  { value: 6, label: 'Sexta-feira' },
  { value: 7, label: 'Sábado' },
];

const tiposSalaOptions = [{ value: 'sala', label: 'Sala' }, { value: 'laboratorio', label: 'Laboratório' }];
const statusAlocacaoOptions = [{ value: 'confirmada', label: 'Confirmada' }, { value: 'pendente', label: 'Pendente' }, { value: 'cancelada', label: 'Cancelada' }];
// tipoAlocacaoOptions não é mais necessário aqui, pois será 'fixo' por padrão.

function AlocacoesPage() {
  const [alocacoesExibidas, setAlocacoesExibidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [vinculosProfessorDisciplina, setVinculosProfessorDisciplina] = useState([]);

  // Estados dos filtros na tela principal
  const [filtroCurso, setFiltroCurso] = useState("");
  const [filtroTurno, setFiltroTurno] = useState("");
  const [filtroSemestreCurso, setFiltroSemestreCurso] = useState("");

  // Estados para o formulário principal de associação/alocação
  const [disciplinaSelecionadaForm, setDisciplinaSelecionadaForm] = useState("");
  const [professorAutoPreenchidoNome, setProfessorAutoPreenchidoNome] = useState("");
  const [professorAutoPreenchidoId, setProfessorAutoPreenchidoId] = useState("");
  const [salaSelecionadaForm, setSalaSelecionadaForm] = useState("");
  const [diaSemanaForm, setDiaSemanaForm] = useState("");
  const [horaInicioForm, setHoraInicioForm] = useState("");

  // Estado para o modal de edição (status)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAlocacao, setEditingAlocacao] = useState(null);
  const [editedStatus, setEditedStatus] = useState("");


  // Função para buscar alocações (dados da tabela)
  const fetchAlocacoes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      const fetched = await api.get('/allocations', { params });
      setAlocacoesExibidas(fetched);
    } catch (err) {
      setError(err.message || 'Erro ao carregar alocações.');
      console.error("Erro ao carregar alocações:", err);
      setAlocacoesExibidas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para buscar dados para os dropdowns
  const fetchDropdownData = useCallback(async () => {
    try {
      const [profs, discs, rooms, profDiscs] = await Promise.all([
        api.get('/professors'),
        api.get('/disciplines'),
        api.get('/rooms'),
        api.get('/professor-disciplines') // Buscar vínculos professor-disciplina
      ]);
      setProfessores(profs);
      setDisciplinas(discs);
      setSalas(rooms);
      setVinculosProfessorDisciplina(profDiscs);
    } catch (err) {
      console.error("Erro ao carregar dados para dropdowns:", err);
    }
  }, []);

  // Carrega dados iniciais e dropdowns ao montar
  useEffect(() => {
    fetchAlocacoes();
    fetchDropdownData();
  }, [fetchAlocacoes, fetchDropdownData]);


  // Auto-preenche professor e filtra horários/dias no formulário principal
  useEffect(() => {
    if (disciplinaSelecionadaForm) {
      const [discNome, discTurno] = disciplinaSelecionadaForm.split('|');
      const vinculo = vinculosProfessorDisciplina.find(v =>
        v.disciplina_nome === discNome &&
        v.disciplina_turno === discTurno
      );

      if (vinculo) {
        setProfessorAutoPreenchidoNome(vinculo.professor_nome);
        setProfessorAutoPreenchidoId(vinculo.id_professor);
        setDiaSemanaForm(vinculo.dia_semana ? String(vinculo.dia_semana) : '');
        setHoraInicioForm(vinculo.hora_inicio ? vinculo.hora_inicio.substring(0, 5) : '');
      } else {
        setProfessorAutoPreenchidoNome("Vínculo não encontrado");
        setProfessorAutoPreenchidoId("");
        setDiaSemanaForm("");
        setHoraInicioForm("");
      }
    } else {
      setProfessorAutoPreenchidoNome("");
      setProfessorAutoPreenchidoId("");
      setDiaSemanaForm("");
      setHoraInicioForm("");
    }
  }, [disciplinaSelecionadaForm, vinculosProfessorDisciplina]);


  // Handlers de Ações
  const handleAssociarAlocacao = async () => {
    if (!disciplinaSelecionadaForm || !professorAutoPreenchidoId || !salaSelecionadaForm || !diaSemanaForm || !horaInicioForm) {
      alert("Por favor, preencha todos os campos obrigatórios para a alocação.");
      return;
    }

    const [nomeDisc, turnoDisc] = disciplinaSelecionadaForm.split('|');
    const vinculoExistente = vinculosProfessorDisciplina.find(v =>
      v.id_professor === professorAutoPreenchidoId &&
      v.disciplina_nome === nomeDisc &&
      v.disciplina_turno === turnoDisc
    );

    if (!vinculoExistente) {
      alert("Vínculo Professor-Disciplina não encontrado para os dados selecionados. Verifique a associação Professor-Disciplina.");
      return;
    }
    
    const ano = vinculoExistente.ano;
    const semestre_alocacao = vinculoExistente.semestre_alocacao;


    const payload = {
        numero_sala: parseInt(salaSelecionadaForm),
        tipo_sala: salas.find(s => String(s.numero_sala) === salaSelecionadaForm)?.tipo_sala,
        nome: nomeDisc,
        turno: turnoDisc,
        ano: ano,
        semestre_alocacao: semestre_alocacao,
        // tipo_alocacao não é enviado, pois o banco de dados tem DEFAULT 'fixo'
        // Se a rota POST exigir explicitamente: tipo_alocacao: 'fixo'
    };

    try {
      await api.post('/allocations', payload);
      alert('Alocação criada com sucesso!');
      // Resetar formulário principal
      setDisciplinaSelecionadaForm("");
      setSalaSelecionadaForm("");
      setDiaSemanaForm("");
      setHoraInicioForm("");
      setProfessorAutoPreenchidoNome("");
      setProfessorAutoPreenchidoId("");
      fetchAlocacoes(); // Recarrega a lista
    } catch (err) {
      console.error("Erro ao associar/alocar:", err);
      alert(err.message || "Ocorreu um erro ao criar alocação. Sala já ocupada ou conflito.");
    }
  };

  const handleEditarAlocacao = (alocacao) => {
    setEditingAlocacao(alocacao);
    setEditedStatus(alocacao.alocacao_status);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingAlocacao(null);
    setEditedStatus("");
  };

  const handleSaveEditStatus = async () => {
    if (!editingAlocacao || !editedStatus) {
      alert("Status não pode ser vazio.");
      return;
    }

    try {
      const { numero_sala, tipo_sala, id_professor, disciplina_nome, disciplina_turno, ano, semestre_alocacao } = editingAlocacao;
      await api.put(
        `/allocations/${numero_sala}/${tipo_sala}/${id_professor}/${disciplina_nome}/${disciplina_turno}/${ano}/${semestre_alocacao}/status`,
        { status: editedStatus }
      );
      alert('Status da alocação atualizado com sucesso!');
      handleCloseEditModal();
      fetchAlocacoes();
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert(err.message || "Erro ao atualizar status.");
    }
  };

  const handleExcluirAlocacao = async (alocacaoParaExcluir) => {
    if (window.confirm("Tem certeza que deseja excluir esta alocação?")) {
      try {
        const { numero_sala, tipo_sala, id_professor, disciplina_nome, disciplina_turno, ano, semestre_alocacao } = alocacaoParaExcluir;
        await api.delete(
          `/allocations/${numero_sala}/${tipo_sala}/${id_professor}/${disciplina_nome}/${disciplina_turno}/${ano}/${semestre_alocacao}`
        );
        alert('Alocação excluída com sucesso!');
        fetchAlocacoes();
      } catch (err) {
        console.error("Erro ao excluir alocação:", err);
        alert(err.message || "Erro ao excluir alocação.");
      }
    }
  };

  if (loading) {
    return <div className="container-alocacoes"><p>Carregando alocações...</p></div>;
  }

  if (error) {
    return <div className="container-alocacoes"><p className="text-red-500">Erro: {error}</p></div>;
  }

  const cursosUnicos = [...new Set(disciplinas.map(d => d.curso))];
  const turnosDisciplinasUnicos = [...new Set(disciplinas.map(d => d.turno))];
  const semestresCursoUnicos = [...new Set(disciplinas.map(d => d.semestre_curso))].sort((a,b) => a-b);

  const disciplinasFiltradasParaForm = disciplinas.filter(
    (d) =>
      (!filtroCurso || d.curso === filtroCurso) &&
      (!filtroTurno || d.turno === filtroTurno) &&
      (!filtroSemestreCurso || d.semestre_curso === parseInt(filtroSemestreCurso))
  );

  return (
    <div className="container-alocacoes">
      <div className="header-alocacoes">
        <h2>Lista de Alocações</h2>
        {/* The "NOVA ALOCAÇÃO" button was removed as it was not functional. */}
      </div>

      <div className="filtros-alocacoes">
        <label>
          Curso:
          <select value={filtroCurso} onChange={(e) => setFiltroCurso(e.target.value)}>
            <option value="">Todos</option>
            {cursosUnicos.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Turno:
          <select value={filtroTurno} onChange={(e) => setFiltroTurno(e.target.value)}>
            <option value="">Todos</option>
            {turnosDisciplinasUnicos.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Semestre:
          <select value={filtroSemestreCurso} onChange={(e) => setFiltroSemestreCurso(e.target.value)}>
            <option value="">Todos</option>
            {semestresCursoUnicos.map((s) => (
              <option key={s} value={s}>{s}º</option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-associacao-alocacao">
        <label>
          Disciplina:
          <select
            value={disciplinaSelecionadaForm}
            onChange={(e) => setDisciplinaSelecionadaForm(e.target.value)}
          >
            <option value="">Selecione</option>
            {disciplinasFiltradasParaForm.map((d) => (
              <option key={`${d.nome}|${d.turno}`} value={`${d.nome}|${d.turno}`}>
                {d.nome} ({d.curso} - Sem: {d.semestre_curso} - {d.turno})
              </option>
            ))}
          </select>
        </label>

        <label>
          Professor:
          <input
            type="text"
            value={professorAutoPreenchidoNome}
            readOnly
            placeholder="Selecione uma disciplina"
            className="readonly-input-alocacao"
            style={{backgroundColor: '#e9ecef', cursor: 'default', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%', marginTop: '0.4rem'}}
          />
        </label>

        <label>
          Dia da Semana:
          <input
            type="text"
            value={diaSemanaForm ? diasSemanaConst.find(d => d.value === parseInt(diaSemanaForm))?.label : ''}
            readOnly
            placeholder="Automático da disciplina"
            className="readonly-input-alocacao"
          />
        </label>

        <label>
          Horário:
          <input
            type="text"
            value={horaInicioForm}
            readOnly
            placeholder="Automático da disciplina"
            className="readonly-input-alocacao"
          />
        </label>

        <label>
          Sala:
          <select
            value={salaSelecionadaForm}
            onChange={(e) => setSalaSelecionadaForm(e.target.value)}
          >
            <option value="">Selecione</option>
            {salas.map((s) => (
              <option key={`${s.numero_sala}-${s.tipo_sala}`} value={String(s.numero_sala)}>
                {s.tipo_sala === 'sala' ? 'Sala ' : 'Lab '}{s.numero_sala}
              </option>
            ))}
          </select>
        </label>
        
        <button className="btn-associar-alocacao" onClick={handleAssociarAlocacao}>ALOCAR</button>
      </div>

      <table className="table-alocacoes">
        <thead>
          <tr>
            <th>Disciplina</th>
            <th>Professor</th>
            <th>Sala</th>
            <th>Tipo Aloc.</th>
            <th>Status</th>
            <th>Ano</th>
            <th>Semestre</th>
            <th>Dia</th>
            <th>Horário</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {alocacoesExibidas.map((alocacao) => (
            <tr key={`${alocacao.numero_sala}-${alocacao.tipo_sala}-${alocacao.id_professor}-${alocacao.disciplina_nome}-${alocacao.disciplina_turno}-${alocacao.ano}-${alocacao.semestre_alocacao}`}>
              <td>{alocacao.disciplina_nome}</td>
              <td>{alocacao.professor_nome}</td>
              <td>{alocacao.tipo_sala === 'sala' ? 'Sala ' : 'Lab '}{alocacao.numero_sala}</td> {/* Display format "Sala X" or "Lab X" */}
              <td>{alocacao.tipo_alocacao}</td>
              <td>{alocacao.alocacao_status}</td>
              <td>{alocacao.ano}</td>
              <td>{alocacao.semestre_alocacao}</td>
              <td>{alocacao.dia_semana ? diasSemanaConst.find(d => d.value === alocacao.dia_semana)?.label : ''}</td>
              <td>{alocacao.hora_inicio ? alocacao.hora_inicio.substring(0, 5) : ''}</td>
              <td className="coluna-acoes">
                <button className="btn-acao" onClick={() => handleEditarAlocacao(alocacao)}>
                  <FaEdit />
                </button>
                <button className="btn-acao" onClick={() => handleExcluirAlocacao(alocacao)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
          {alocacoesExibidas.length === 0 && !loading && (
            <tr>
              <td colSpan="10" style={{ textAlign: "center" }}>Nenhuma alocação encontrada.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showEditModal && editingAlocacao && (
        <div className="modal-alocacoes-overlay">
          <div className="modal-alocacoes-content">
            <button className="modal-alocacoes-close-btn" onClick={handleCloseEditModal}>
              &times;
            </button>
            <h3>Editar Status da Alocação</h3>
            <div className="form-edit-alocacao-modal">
              <label>
                Status:
                <select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                >
                  <option value="">Selecione o status</option>
                  {statusAlocacaoOptions.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </label>
              <button className="btn-salvar-edicao" onClick={handleSaveEditStatus}>
                SALVAR ALTERAÇÕES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlocacoesPage;