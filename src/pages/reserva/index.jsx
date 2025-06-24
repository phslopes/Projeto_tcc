import React, { useState, useEffect } from 'react';
import './ReservaPage.css';
import { api } from '../../utils/api';

const horariosPorTurno = {
  "Manhã": ["08:00", "08:50", "09:40", "10:00", "10:40", "11:30"],
  "Tarde": ["13:00", "13:50", "14:40", "15:00", "15:50", "16:40", "16:50", "17:40"],
  "Noite": ["19:00", "19:50", "20:40", "21:00", "21:50"]
};

export default function Reserva() {
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [salas, setSalas] = useState([]);
  const [alocacoes, setAlocacoes] = useState([]);
  const [salasDisponiveis, setSalasDisponiveis] = useState([]);
  const [scheduleWarning, setScheduleWarning] = useState(null);
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
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);


  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [profRes, salaRes, alocacoesRes] = await Promise.all([
          api.get('/professors'),
          api.get('/rooms'),
          api.get('/allocations'),
        ]);
        setProfessores(profRes);
        setSalas(salaRes);
        setAlocacoes(alocacoesRes);
      } catch (err) {
        setError('Erro ao carregar dados iniciais: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);


  useEffect(() => {
    const fetchDisciplinas = async () => {
      if (filtros.id_professor) {
        try {
          const assocDoProfessor = await api.get(`/professors/${filtros.id_professor}/disciplines`);
          setDisciplinas(assocDoProfessor);
        } catch (err) {
          setError('Erro ao carregar disciplinas do professor: ' + err.message);
          setDisciplinas([]);
        }
      } else {
        setDisciplinas([]);
      }
    };
    fetchDisciplinas();
  }, [filtros.id_professor]);

  useEffect(() => {
    const checkProfessorSchedule = async () => {
      if (filtros.id_professor && filtros.nome && filtros.turno && filtros.dia_semana && filtros.horario) {
        try {
          const anoAtual = new Date().getFullYear();
          const mesAtual = new Date().getMonth() + 1;
          const semestreAtual = mesAtual <= 6 ? 1 : 2;

          const response = await api.get('/allocations/check-schedule', {
            params: {
              id_professor: filtros.id_professor,
              nome: filtros.nome,
              turno: filtros.turno,
              ano: anoAtual,
              semestre_alocacao: semestreAtual,
              dia_semana: filtros.dia_semana,
              hora_inicio: filtros.horario + ':00'
            }
          });

          if (!response.hasSchedule) {
            setScheduleWarning('Atenção: Este horário não está programado na grade do professor para esta disciplina.');
          } else {
            setScheduleWarning(null);
          }
        } catch (err) {
          console.error('Erro ao verificar programação:', err);
          setScheduleWarning(null);
        }
      } else {
        setScheduleWarning(null);
      }
    };
    checkProfessorSchedule();
  }, [filtros.id_professor, filtros.nome, filtros.turno, filtros.dia_semana, filtros.horario]);

  useEffect(() => {
    const fetchSalasDisponiveis = async () => {
      if (filtros.dia_semana && filtros.horario) {
        try {
          const response = await api.get('/allocations/room-availability', {
            params: {
              dia_semana: filtros.dia_semana,
              hora_inicio: filtros.horario + ':00'
            }
          });

          setSalasDisponiveis(response);
        } catch (err) {
          setError('Erro ao verificar disponibilidade de salas: ' + err.message);
          setSalasDisponiveis([]);
        }
      } else {
        setSalasDisponiveis([]);
      }
    };
    fetchSalasDisponiveis();
  }, [filtros.dia_semana, filtros.horario]);

  const anoAtual = new Date().getFullYear();
  const mesAtual = new Date().getMonth() + 1;
  const semestreAtual = mesAtual <= 6 ? 1 : 2;

  const nomesDisciplinasUnicos = Array.from(new Set(disciplinas.map(d => d.disciplina_nome)));

  const turnosDisponiveis = Array.from(
    new Set(
      disciplinas
        .filter(d => d.disciplina_nome === filtros.nome)
        .map(d => d.disciplina_turno)
    )
  );

  const horariosDisponiveis = filtros.turno ? horariosPorTurno[filtros.turno] || [] : [];

  const diasSemana = [
    { value: 2, label: 'Segunda-feira' },
    { value: 3, label: 'Terça-feira' },
    { value: 4, label: 'Quarta-feira' },
    { value: 5, label: 'Quinta-feira' },
    { value: 6, label: 'Sexta-feira' },
    { value: 7, label: 'Sábado' },
  ];

  const tiposSala = [
    { value: 'sala', label: 'Sala' },
    { value: 'laboratorio', label: 'Laboratório' },
  ];

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => {
      const newFiltros = { ...prev, [name]: value };

      if (name === 'id_professor') {
        newFiltros.nome = '';
        newFiltros.turno = '';
        newFiltros.dia_semana = '';
        newFiltros.horario = '';
        newFiltros.numero_sala = '';
        newFiltros.tipo_sala = '';
      }
      if (name === 'nome') {
        newFiltros.turno = '';
        newFiltros.dia_semana = '';
        newFiltros.horario = '';
        newFiltros.numero_sala = '';
        newFiltros.tipo_sala = '';
      }
      if (name === 'turno') {
        newFiltros.dia_semana = '';
        newFiltros.horario = '';
        newFiltros.numero_sala = '';
        newFiltros.tipo_sala = '';
      }
      if (name === 'dia_semana') {
        newFiltros.horario = '';
        newFiltros.numero_sala = '';
        newFiltros.tipo_sala = '';
      }
      if (name === 'horario') {
        newFiltros.numero_sala = '';
        newFiltros.tipo_sala = '';
      }

      return newFiltros;
    });
  };

  const handleConfirmar = (item) => {
    setLinhaConfirmada(item);
    setMostrarPopup(true);
  };

  const confirmarReserva = async () => {
    if (!filtros.id_professor) {
      setError("Por favor, selecione um professor.");
      setMostrarPopup(false);
      return;
    }
    if (!linhaConfirmada) return;

    setMostrarPopup(false);
    setError(null);
    setLoading(true);

    try {
      const payload = {
        numero_sala: linhaConfirmada.numero_sala,
        tipo_sala: linhaConfirmada.tipo_sala,
        id_professor: filtros.id_professor,
        nome: filtros.nome,
        turno: filtros.turno,
        ano: anoAtual,
        semestre_alocacao: semestreAtual,
        tipo_alocacao: 'esporadico',
        dia_semana: parseInt(filtros.dia_semana),
        hora_inicio: filtros.horario + ':00'
      };

      await api.post('/allocations', payload);

      setReservados([...reservados, linhaConfirmada]);
      setMostrarConfirmacao(true);

      const response = await api.get('/allocations/room-availability', {
        params: {
          dia_semana: filtros.dia_semana,
          hora_inicio: filtros.horario + ':00'
        }
      });
      setSalasDisponiveis(response);

    } catch (err) {
      console.error("Erro ao criar a reserva:", err.response || err);
      setError('Erro ao criar a reserva: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const linhasReserva = salasDisponiveis
    .map(sala => ({
      numero_sala: sala.numero_sala,
      tipo_sala: sala.tipo_sala,
      nome: filtros.nome,
      turno: filtros.turno,
      horario: filtros.horario,
      dia_semana: filtros.dia_semana,
    }))
    .filter(item => {
      return item.nome && item.turno && item.horario && item.dia_semana;
    });

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
          <select name="nome" value={filtros.nome} onChange={handleFiltroChange} disabled={!filtros.id_professor}>
            <option value="">Selecione</option>
            {nomesDisciplinasUnicos.map(nome => (
              <option key={nome} value={nome}>{nome}</option>
            ))}
          </select>
        </div>
        <div className="filtro">
          <label>Turno</label>
          <select name="turno" value={filtros.turno} onChange={handleFiltroChange} disabled={!filtros.nome}>
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
          <select name="dia_semana" value={filtros.dia_semana} onChange={handleFiltroChange} disabled={!filtros.turno}>
            <option value="">Selecione</option>
            {diasSemana.map(dia => (
              <option key={dia.value} value={dia.value}>{dia.label}</option>
            ))}
          </select>
        </div>
        <div className="filtro">
          <label>Horário</label>
          <select name="horario" value={filtros.horario} onChange={handleFiltroChange} disabled={!filtros.dia_semana}>
            <option value="">Selecione</option>
            {horariosDisponiveis.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
        <div className="filtro">
          <label>Tipo Sala</label>
          <select name="tipo_sala" value={filtros.tipo_sala} onChange={handleFiltroChange} disabled={!filtros.horario}>
            <option value="">Selecione</option>
            {tiposSala.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div className="filtro">
          <label>Sala</label>
          <select name="numero_sala" value={filtros.numero_sala} onChange={handleFiltroChange} disabled={!filtros.horario}>
            <option value="">Selecione</option>
            {salasDisponiveis
              .filter(s => !filtros.tipo_sala || s.tipo_sala === filtros.tipo_sala)
              .map(s => (
                <option key={s.numero_sala + '-' + s.tipo_sala} value={s.numero_sala}>
                  {s.numero_sala} ({s.tipo_sala})
                </option>
              ))}
          </select>
        </div>
      </div>

      <hr className="linha-separadora" />

      {scheduleWarning && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '5px', color: '#856404' }}>
          <strong>⚠️ Aviso:</strong> {scheduleWarning}
        </div>
      )}

      {filtros.dia_semana && filtros.horario && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <strong>Salas disponíveis para {diasSemana.find(d => String(d.value) === String(filtros.dia_semana))?.label} às {filtros.horario}:</strong> {salasDisponiveis.length} salas
        </div>
      )}

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
          {linhasReserva.length === 0 && filtros.dia_semana && filtros.horario && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', color: 'red' }}>
                Nenhuma sala disponível para o horário e dia selecionados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {mostrarPopup && linhaConfirmada && (
        <div className="popup-overlay">
          <div className="popup" style={{ minWidth: 320, padding: '2rem 2.5rem', borderRadius: 14, boxShadow: '0 4px 24px rgba(0,0,0,0.13)', textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: 38, color: '#4caf50', marginBottom: 10 }}>
              <span role="img" aria-label="confirmação">✔️</span>
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Confirmar Reserva</h3>
            <p style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>
              Reservar sala <b>{linhaConfirmada.numero_sala}</b> ({linhaConfirmada.tipo_sala})<br />
              <span style={{ fontWeight: 500 }}>Horário:</span> {linhaConfirmada.horario}
            </p>
            {scheduleWarning && (
              <p style={{ color: '#b20000', fontSize: '15px', marginBottom: 8 }}>
                <strong>Nota:</strong> Este horário não está programado na grade do professor.
              </p>
            )}
            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button
                onClick={confirmarReserva}
                style={{ background: '#4caf50', color: 'white', border: 'none', padding: '10px 28px', borderRadius: 6, fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(76,175,80,0.08)' }}
              >
                Sim, reservar
              </button>
              <button
                onClick={() => setMostrarPopup(false)}
                style={{ background: '#eee', color: '#333', border: 'none', padding: '10px 28px', borderRadius: 6, fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarConfirmacao && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: 32, borderRadius: 8, minWidth: 300, textAlign: 'center' }}>
            <h3>Reserva realizada com sucesso!</h3>
            <button onClick={() => setMostrarConfirmacao(false)} style={{ marginTop: 16, padding: '8px 24px', borderRadius: 4, background: '#4caf50', color: 'white', border: 'none', fontWeight: 'bold' }}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
