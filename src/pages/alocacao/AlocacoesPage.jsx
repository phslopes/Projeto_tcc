import React, { useState, useEffect, useCallback } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./AlocacoesPage.css";
import { api } from "../../utils/api";

const diasSemanaConst = [
    { value: 2, label: 'Segunda-feira' },
    { value: 3, label: 'Terça-feira' },
    { value: 4, label: 'Quarta-feira' },
    { value: 5, label: 'Quinta-feira' },
    { value: 6, label: 'Sexta-feira' },
    { value: 7, label: 'Sábado' },
];

function AlocacoesPage() {
  const [alocacoesExibidas, setAlocacoesExibidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [disciplinas, setDisciplinas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [vinculosProfessorDisciplina, setVinculosProfessorDisciplina] = useState([]);

  const [filtroCurso, setFiltroCurso] = useState("");
  const [filtroTurno, setFiltroTurno] = useState("");
  const [filtroSemestreCurso, setFiltroSemestreCurso] = useState("");

  const [disciplinaSelecionadaForm, setDisciplinaSelecionadaForm] = useState("");
  const [professorAutoPreenchidoNome, setProfessorAutoPreenchidoNome] = useState("");
  const [professorAutoPreenchidoId, setProfessorAutoPreenchidoId] = useState("");
  const [salaSelecionadaForm, setSalaSelecionadaForm] = useState("");
  const [diaSemanaForm, setDiaSemanaForm] = useState("");
  const [horaInicioForm, setHoraInicioForm] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAlocacao, setEditingAlocacao] = useState(null);
  const [newlySelectedRoom, setNewlySelectedRoom] = useState("");

  const fetchAlocacoes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetched = await api.get('/allocations', {});
      setAlocacoesExibidas(fetched);
    } catch (err) {
      setError(err.message || 'Erro ao carregar alocações.');
      setAlocacoesExibidas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDropdownData = useCallback(async () => {
    try {
      const [discs, rooms, profDiscs] = await Promise.all([
        api.get('/disciplines'),
        api.get('/rooms'),
        api.get('/professor-disciplines')
      ]);
      setDisciplinas(discs);
      setSalas(rooms);
      setVinculosProfessorDisciplina(profDiscs);
    } catch (err) {
      console.error("Erro ao carregar dados para dropdowns:", err);
    }
  }, []);

  useEffect(() => {
    fetchAlocacoes();
    fetchDropdownData();
  }, [fetchAlocacoes, fetchDropdownData]);
  
  useEffect(() => {
    if (disciplinaSelecionadaForm) {
      const [discNome, discTurno] = disciplinaSelecionadaForm.split('|');
      const vinculo = vinculosProfessorDisciplina.find(v => v.disciplina_nome === discNome && v.disciplina_turno === discTurno);
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

  const handleAssociarAlocacao = async () => {
    if (!disciplinaSelecionadaForm || !professorAutoPreenchidoId || !salaSelecionadaForm) {
      alert("Por favor, preencha todos os campos obrigatórios para a alocação.");
      return;
    }
    const [nomeDisc, turnoDisc] = disciplinaSelecionadaForm.split('|');
    const vinculoExistente = vinculosProfessorDisciplina.find(v => v.id_professor === professorAutoPreenchidoId && v.disciplina_nome === nomeDisc && v.disciplina_turno === turnoDisc);
    if (!vinculoExistente) {
      alert("Vínculo Professor-Disciplina não encontrado. Verifique a associação.");
      return;
    }
    
    if (!vinculoExistente.dia_semana || !vinculoExistente.hora_inicio) {
      alert("Vínculo Professor-Disciplina não possui dia da semana ou horário definido. Verifique a associação.");
      return;
    }
    
    const [numero_sala_str, tipo_sala] = salaSelecionadaForm.split('|');
    const payload = {
        numero_sala: parseInt(numero_sala_str),
        tipo_sala: tipo_sala,
        id_professor: professorAutoPreenchidoId,
        nome: nomeDisc,
        turno: turnoDisc,
        ano: vinculoExistente.ano,
        semestre_alocacao: vinculoExistente.semestre_alocacao,
        tipo_alocacao: 'fixo',
        dia_semana: vinculoExistente.dia_semana,
        hora_inicio: vinculoExistente.hora_inicio
    };
    try {
      await api.post('/allocations', payload);
      alert('Alocação criada com sucesso!');
      setDisciplinaSelecionadaForm("");
      setSalaSelecionadaForm("");
      fetchAlocacoes(); 
    } catch (err) {
      console.error("Erro ao associar/alocar:", err);
      alert(err.message || "Ocorreu um erro ao criar alocação.");
    }
  };
  
  const handleEditarAlocacao = (alocacao) => {
    setEditingAlocacao(alocacao);
    setNewlySelectedRoom("");
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingAlocacao(null);
    setNewlySelectedRoom("");
  };

  const handleSaveRoomChange = async () => {
    if (!editingAlocacao || !newlySelectedRoom) {
      alert("Por favor, selecione uma nova sala.");
      return;
    }

    const [new_numero_sala, new_tipo_sala] = newlySelectedRoom.split('|');
    const { numero_sala, tipo_sala, id_professor, disciplina_nome, disciplina_turno, ano, semestre_alocacao } = editingAlocacao;

    try {
      await api.put(
        `/allocations/change-room/${numero_sala}/${tipo_sala}/${id_professor}/${disciplina_nome}/${disciplina_turno}/${ano}/${semestre_alocacao}`,
        { new_numero_sala: parseInt(new_numero_sala), new_tipo_sala }
      );
      alert('Sala da alocação alterada com sucesso!');
      handleCloseEditModal();
      fetchAlocacoes();
    } catch (err) {
      console.error("Erro ao alterar sala da alocação:", err);
      alert(err.message || "Ocorreu um erro ao tentar alterar a sala.");
    }
  };

  const handleExcluirAlocacao = async (alocacaoParaExcluir) => {
    if (window.confirm("Tem certeza que deseja excluir esta alocação?")) {
      try {
        const { numero_sala, tipo_sala, id_professor, disciplina_nome, disciplina_turno, ano, semestre_alocacao } = alocacaoParaExcluir;
        await api.delete(`/allocations/${numero_sala}/${tipo_sala}/${id_professor}/${disciplina_nome}/${disciplina_turno}/${ano}/${semestre_alocacao}`);
        alert('Alocação excluída com sucesso!');
        fetchAlocacoes();
      } catch (err) {
        alert(err.message || "Erro ao excluir alocação.");
      }
    }
  };

  if (loading) {
    return <div className="container-alocacoes"><p>Carregando...</p></div>;
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
      </div>

      <div className="filtros-alocacoes">
        <label>
          Curso:
          <select value={filtroCurso} onChange={(e) => setFiltroCurso(e.target.value)}>
            <option value="">Todos</option>
            {cursosUnicos.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </label>
        <label>
          Turno:
          <select value={filtroTurno} onChange={(e) => setFiltroTurno(e.target.value)}>
            <option value="">Todos</option>
            {turnosDisciplinasUnicos.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </label>
        <label>
          Semestre:
          <select value={filtroSemestreCurso} onChange={(e) => setFiltroSemestreCurso(e.target.value)}>
            <option value="">Todos</option>
            {semestresCursoUnicos.map((s) => (<option key={s} value={s}>{s}º</option>))}
          </select>
        </label>
      </div>

      <div className="form-associacao-alocacao">
        <label>
          Disciplina:
          <select value={disciplinaSelecionadaForm} onChange={(e) => setDisciplinaSelecionadaForm(e.target.value)}>
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
          <input type="text" value={professorAutoPreenchidoNome} readOnly className="readonly-input-alocacao" />
        </label>
        <label>
          Dia da Semana:
          <input type="text" value={diaSemanaForm ? diasSemanaConst.find(d => d.value === parseInt(diaSemanaForm))?.label : ''} readOnly className="readonly-input-alocacao" />
        </label>
        <label>
          Horário:
          <input type="text" value={horaInicioForm} readOnly className="readonly-input-alocacao" />
        </label>
        <label>
          Sala:
          <select value={salaSelecionadaForm} onChange={(e) => setSalaSelecionadaForm(e.target.value)}>
            <option value="">Selecione</option>
            {salas.map((s) => (
              <option key={`${s.numero_sala}-${s.tipo_sala}`} value={`${s.numero_sala}|${s.tipo_sala}`}>
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
            <th>Disciplina</th><th>Professor</th><th>Sala</th><th>Status</th>
            <th>Ano</th><th>Semestre</th><th>Dia</th><th>Horário</th><th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {alocacoesExibidas.map((alocacao) => (
            <tr key={`${alocacao.numero_sala}-${alocacao.tipo_sala}-${alocacao.id_professor}-${alocacao.disciplina_nome}-${alocacao.disciplina_turno}-${alocacao.ano}-${alocacao.semestre_alocacao}`}>
              <td>{alocacao.disciplina_nome}</td><td>{alocacao.professor_nome}</td>
              <td>{alocacao.tipo_sala === 'sala' ? 'Sala ' : 'Lab '}{alocacao.numero_sala}</td>
              <td>{alocacao.alocacao_status}</td><td>{alocacao.ano}</td>
              <td>{alocacao.semestre_alocacao}</td>
              <td>{diasSemanaConst.find(d => d.value === alocacao.dia_semana)?.label || ''}</td>
              <td>{alocacao.hora_inicio ? alocacao.hora_inicio.substring(0, 5) : ''}</td>
              <td className="coluna-acoes">
                <button className="btn-acao-edit" onClick={() => handleEditarAlocacao(alocacao)}><FaEdit /></button>
                <button className="btn-acao-delete" onClick={() => handleExcluirAlocacao(alocacao)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {showEditModal && editingAlocacao && (
        <div className="modal-alocacoes-overlay">
          <div className="modal-alocacoes-content">
            <button className="modal-alocacoes-close-btn" onClick={handleCloseEditModal}>&times;</button>
            <h3>Alterar Sala da Alocação</h3>
            <p className="readonly-input-alocacao-modal" style={{textAlign: 'center', marginBottom: '1rem'}}>
                {`${editingAlocacao.disciplina_nome} - ${editingAlocacao.professor_nome}`}
            </p>
            <div className="form-edit-alocacao-modal">
              <label>
                Nova Sala:
                <select value={newlySelectedRoom} onChange={(e) => setNewlySelectedRoom(e.target.value)}>
                  <option value="">Selecione a nova sala</option>
                  {salas.map(s => (
                    <option key={`${s.numero_sala}-${s.tipo_sala}`} value={`${s.numero_sala}|${s.tipo_sala}`}>
                      {s.tipo_sala === 'sala' ? 'Sala ' : 'Lab '}{s.numero_sala}
                    </option>
                  ))}
                </select>
              </label>
              <button className="btn-salvar-edicao" onClick={handleSaveRoomChange}>SALVAR ALTERAÇÃO</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlocacoesPage;