import React, { useState, useEffect } from 'react';
import './ReservaPage.css';
import { api } from '../../utils/api';

export default function Reserva() {
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [associacoes, setAssociacoes] = useState([]);
  const [filtros, setFiltros] = useState({
    id_professor: '',
    nome: '',
    turno: '',
    numero_sala: '',
    tipo_sala: '',
    dia_semana: '',
    horario: '',
  });
  const [reservados, setReservados] = useState([]);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [linhaConfirmada, setLinhaConfirmada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Busca dados do backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profRes, discRes, salaRes, assocRes] = await Promise.all([
          api.get('/professors'),
          api.get('/disciplines'),
          api.get('/rooms'),
          api.get('/professor-disciplines'),
        ]);
        setProfessores(profRes);
        setDisciplinas(discRes);
        setSalas(salaRes);
        setAssociacoes(assocRes);
      } catch (err) {
        setError('Erro ao carregar dados: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calcula ano e semestre atuais
  const anoAtual = new Date().getFullYear();
  const mesAtual = new Date().getMonth() + 1;
  const semestreAtual = mesAtual <= 6 ? 1 : 2;

  // Filtra disciplinas do professor selecionado
  const disciplinasDoProfessor = associacoes
    .filter(a => String(a.id_professor) === String(filtros.id_professor))
    .map(a => ({ nome: a.disciplina_nome, turno: a.disciplina_turno }));

  // Disciplinas únicas para o select de disciplina
  const nomesDisciplinasUnicos = Array.from(new Set(disciplinasDoProfessor.map(d => d.nome)));

  // Turnos disponíveis para a disciplina selecionada
  const turnosDisponiveis = Array.from(
    new Set(
      disciplinasDoProfessor
        .filter(d => d.nome === filtros.nome)
        .map(d => d.turno)
    )
  );

  // Salas disponíveis (todas)
  const tiposSala = [
    { value: 'sala', label: 'Sala' },
    { value: 'laboratorio', label: 'Laboratório' },
  ];

  // Dias e horários disponíveis para a associação selecionada
  const diasDisponiveis = Array.from(
    new Set(
      associacoes
        .filter(a => String(a.id_professor) === String(filtros.id_professor) && a.disciplina_nome === filtros.nome && a.disciplina_turno === filtros.turno)
        .map(a => a.dia_semana)
    )
  );

  const horariosDisponiveis = Array.from(
    new Set(
      associacoes
        .filter(a => String(a.id_professor) === String(filtros.id_professor) && a.disciplina_nome === filtros.nome && a.disciplina_turno === filtros.turno && String(a.dia_semana) === String(filtros.dia_semana))
        .map(a => a.hora_inicio)
    )
  );

  // Dias da semana
  const diasSemana = [
    { value: 2, label: 'Segunda' },
    { value: 3, label: 'Terça' },
    { value: 4, label: 'Quarta' },
    { value: 5, label: 'Quinta' },
    { value: 6, label: 'Sexta' },
    { value: 7, label: 'Sábado' },
  ];

  // Handle filtro change
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value,
      // Se mudar disciplina, limpa turno
      ...(name === 'nome' ? { turno: '' } : {})
    }));
  };

  // Handle reserva
  const handleConfirmar = (item) => {
    setLinhaConfirmada(item);
    setMostrarPopup(true);
  };

  const confirmarReserva = async () => {
    setMostrarPopup(false);
    setError(null);
    try {
      // Ajusta horário para formato HH:MM:SS
      let horario = filtros.horario;
      if (horario && horario.length === 5) horario = horario + ':00';
      await api.post('/allocations', {
        numero_sala: parseInt(filtros.numero_sala),
        tipo_sala: filtros.tipo_sala,
        id_professor: parseInt(filtros.id_professor),
        nome: filtros.nome,
        turno: filtros.turno,
        ano: anoAtual,
        semestre_alocacao: semestreAtual,
        dia_semana: parseInt(filtros.dia_semana),
        hora_inicio: horario,
        tipo_alocacao: 'esporadico',
      });
      setReservados([...reservados, linhaConfirmada]);
      alert('Reserva solicitada com sucesso!');
    } catch (err) {
      setError('Erro ao solicitar reserva: ' + err.message);
    }
  };

  // Monta linhas possíveis para reserva
  const linhasReserva = salas
    .filter(sala =>
      (!filtros.tipo_sala || sala.tipo_sala === filtros.tipo_sala) &&
      (!filtros.numero_sala || String(sala.numero_sala) === String(filtros.numero_sala))
    )
    .map(sala => ({
      numero_sala: sala.numero_sala,
      tipo_sala: sala.tipo_sala,
      nome: filtros.nome,
      turno: filtros.turno,
      horario: filtros.horario,
      dia_semana: filtros.dia_semana,
    }))
    .filter(item => item.nome && item.turno && item.horario && item.dia_semana);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="container-dashboard">
      <div className="header-dashboard">
        <h2>Reserva de Sala</h2>
      </div>
      <hr className="linha-separadora" />

      <div className="filtros-superiores">
        <div className="filtro">
          <label>Professor</label>
          <select name="id_professor" value={filtros.id_professor} onChange={handleFiltroChange}>
            <option value="">Selecione</option>
            {professores.map(p => (
              <option key={p.id_professor} value={p.id_professor}>{p.nome}</option>
            ))}
          </select>
        </div>
        <div className="filtro">
          <label>Disciplina</label>
          <select name="nome" value={filtros.nome} onChange={handleFiltroChange}>
            <option value="">Selecione</option>
            {nomesDisciplinasUnicos.map(nome => (
              <option key={nome} value={nome}>{nome}</option>
            ))}
          </select>
        </div>
        <div className="filtro">
          <label>Turno</label>
          <select name="turno" value={filtros.turno} onChange={handleFiltroChange}>
            <option value="">Selecione</option>
            {turnosDisponiveis.map(turno => (
              <option key={turno} value={turno}>{turno}</option>
            ))}
          </select>
        </div>
      </div>

      <hr className="linha-separadora" />

      <div className="filtros">
        <div className="filtro">
          <label>Dia da Semana</label>
          <select name="dia_semana" value={filtros.dia_semana} onChange={handleFiltroChange}>
            <option value="">Selecione</option>
            {diasDisponiveis.map(d => (
              <option key={d} value={d}>{diasSemana.find(ds => String(ds.value) === String(d))?.label || d}</option>
            ))}
          </select>
        </div>
        <div className="filtro">
          <label>Horário</label>
          <select name="horario" value={filtros.horario} onChange={handleFiltroChange}>
            <option value="">Selecione</option>
            {horariosDisponiveis.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
        <div className="filtro">
          <label>Tipo Sala</label>
          <select name="tipo_sala" value={filtros.tipo_sala} onChange={handleFiltroChange}>
            <option value="">Selecione</option>
            {tiposSala.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="filtro">
          <label>Sala</label>
          <select name="numero_sala" value={filtros.numero_sala} onChange={handleFiltroChange}>
            <option value="">Selecione</option>
            {salas.filter(s => !filtros.tipo_sala || s.tipo_sala === filtros.tipo_sala).map(s => (
              <option key={s.numero_sala + '-' + s.tipo_sala} value={s.numero_sala}>{s.numero_sala}</option>
            ))}
          </select>
        </div>
      </div>

      <hr className="linha-separadora" />

      <table className="tabela">
        <thead>
          <tr>
            <th>Sala</th>
            <th>Tipo</th>
            <th>Turno</th>
            <th>Horário</th>
            <th>Dia</th>
            <th>Solicitar Reserva</th>
          </tr>
        </thead>
        <tbody>
          {linhasReserva.map((item, index) => (
            <tr key={index}>
              <td>{item.numero_sala}</td>
              <td>{item.tipo_sala}</td>
              <td>{item.turno}</td>
              <td>{item.horario}</td>
              <td>{diasSemana.find(d => String(d.value) === String(item.dia_semana))?.label || ''}</td>
              <td>
                {reservados.some(r => r.numero_sala === item.numero_sala && r.tipo_sala === item.tipo_sala && r.nome === item.nome && r.turno === item.turno && r.horario === item.horario && r.dia_semana === item.dia_semana) ? (
                  <div style={{ backgroundColor: '#a8e6a3', padding: '4px 8px', borderRadius: '4px', textAlign: 'center' }}>
                    Solicitado
                  </div>
                ) : (
                  <button
                    style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                    onClick={() => handleConfirmar(item)}
                  >
                    Confirmar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarPopup && linhaConfirmada && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Confirmar Reserva</h3>
            <p>Você deseja reservar a sala {linhaConfirmada.numero_sala} ({linhaConfirmada.tipo_sala}) no horário {linhaConfirmada.horario}?</p>
            <div style={{ marginTop: '10px' }}>
              <button onClick={confirmarReserva} style={{ marginRight: '10px', backgroundColor: 'green', color: 'white' }}>Sim</button>
              <button onClick={() => setMostrarPopup(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
