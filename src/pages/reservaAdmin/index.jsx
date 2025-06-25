import React, { useState, useEffect } from 'react';
import './ReservaPage.css';
import { api } from '../../utils/api';

function ConfirmPopup({ open, onClose, onConfirm, popupMode, professorEmail }) {
  const [step, setStep] = useState(0);
  React.useEffect(() => { if (open) setStep(0); }, [open]);
  if (!open) return null;
  return (
    <div className="popup-overlay">
      <div className="popup" style={{ minWidth: 320, padding: '2rem 2.5rem', borderRadius: 14, boxShadow: '0 4px 24px rgba(0,0,0,0.13)', textAlign: 'center', position: 'relative' }}>
        {step === 0 ? (
          <>
            <div style={{ fontSize: 38, color: popupMode === 'delete' ? '#f44336' : '#4caf50', marginBottom: 10 }}>
              <span role="img" aria-label={popupMode === 'delete' ? 'exclusão' : 'confirmação'}>{popupMode === 'delete' ? '🗑️' : '✔️'}</span>
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{popupMode === 'delete' ? 'Excluir Reserva' : 'Confirmar Reserva'}</h3>
            <p style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>{popupMode === 'delete' ? 'Tem certeza que deseja excluir esta reserva? Esta ação não poderá ser desfeita.' : 'Tem certeza que deseja confirmar esta reserva?'}</p>
            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button
                onClick={async () => { await onConfirm(); setStep(1); }}
                style={{ background: popupMode === 'delete' ? '#f44336' : '#4caf50', color: 'white', border: 'none', padding: '10px 28px', borderRadius: 6, fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: popupMode === 'delete' ? '0 2px 8px rgba(244,67,54,0.08)' : '0 2px 8px rgba(76,175,80,0.08)' }}
              >
                {popupMode === 'delete' ? 'Sim, excluir' : 'Sim, confirmar'}
              </button>
              <button
                onClick={onClose}
                style={{ background: '#eee', color: '#333', border: 'none', padding: '10px 28px', borderRadius: 6, fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 38, color: popupMode === 'delete' ? '#f44336' : '#4caf50', marginBottom: 10 }}>
              <span role="img" aria-label={popupMode === 'delete' ? 'exclusão' : 'confirmação'}>{popupMode === 'delete' ? '🗑️' : '✔️'}</span>
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{popupMode === 'delete' ? 'Reserva excluída!' : 'Reserva confirmada!'}</h3>
            <p style={{ fontSize: 16, color: '#333', marginBottom: 8 }}>{popupMode === 'delete' ? 'A reserva foi excluída com sucesso.' : `Um e-mail foi enviado para o professor${professorEmail ? ` (${professorEmail})` : ''}.`}</p>
            <button onClick={onClose} style={{ marginTop: 16, padding: '10px 28px', borderRadius: 6, background: popupMode === 'delete' ? '#f44336' : '#4caf50', color: 'white', border: 'none', fontWeight: 600, fontSize: 16, boxShadow: popupMode === 'delete' ? '0 2px 8px rgba(244,67,54,0.08)' : '0 2px 8px rgba(76,175,80,0.08)', cursor: 'pointer' }}>OK</button>
          </>
        )}
      </div>
    </div>
  );
}

export default function ReservaAdmin() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupItem, setPopupItem] = useState(null);
  const [popupMode, setPopupMode] = useState('confirm');

  const diasSemana = [
    { value: 2, label: 'Segunda-feira' },
    { value: 3, label: 'Terça-feira' },
    { value: 4, label: 'Quarta-feira' },
    { value: 5, label: 'Quinta-feira' },
    { value: 6, label: 'Sexta-feira' },
    { value: 7, label: 'Sábado' },
  ];

  const statusOptions = [
    { value: 'pendente', label: 'Pendente', color: '#ffa500' },
    { value: 'confirmada', label: 'Confirmada', color: '#4caf50' },
    { value: 'cancelada', label: 'Cancelada', color: '#f44336' },
  ];

  useEffect(() => {
    const fetchAllocations = async () => {
      setLoading(true);
      try {
        const response = await api.get('/allocations', { params: { tipoAlocacao: 'esporadico', status: 'pendente' } });
        setAllocations(response || []);
      } catch (err) {
        setError('Erro ao carregar as alocações: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllocations();
  }, []);

  const handleStatusChange = async (allocation, newStatus) => {
    setUpdatingStatus(allocation.numero_sala + '-' + allocation.tipo_sala);

    try {
      const horaInicio = allocation.hora_inicio ?
        (allocation.hora_inicio.includes(':00') ? allocation.hora_inicio : allocation.hora_inicio + ':00') :
        '00:00:00';

      await api.put(`/allocations/${allocation.numero_sala}/${allocation.tipo_sala}/${allocation.id_professor}/${allocation.disciplina_nome}/${allocation.disciplina_turno}/${allocation.ano}/${allocation.semestre_alocacao}/${allocation.dia_semana}/${horaInicio}/status`, {
        status: newStatus
      });

      setAllocations(prev =>
        newStatus === 'confirmada'
          ? prev.filter(item =>
            !(
              item.numero_sala === allocation.numero_sala &&
              item.tipo_sala === allocation.tipo_sala &&
              item.id_professor === allocation.id_professor &&
              item.disciplina_nome === allocation.disciplina_nome &&
              item.disciplina_turno === allocation.disciplina_turno &&
              item.ano === allocation.ano &&
              item.semestre_alocacao === allocation.semestre_alocacao &&
              item.dia_semana === allocation.dia_semana &&
              item.hora_inicio === allocation.hora_inicio
            )
          )
          : prev.map(item =>
            item.numero_sala === allocation.numero_sala &&
              item.tipo_sala === allocation.tipo_sala &&
              item.id_professor === allocation.id_professor &&
              item.disciplina_nome === allocation.disciplina_nome &&
              item.disciplina_turno === allocation.disciplina_turno &&
              item.ano === allocation.ano &&
              item.semestre_alocacao === allocation.semestre_alocacao &&
              item.dia_semana === allocation.dia_semana &&
              item.hora_inicio === allocation.hora_inicio
              ? { ...item, alocacao_status: newStatus }
              : item
          )
      );

    } catch (err) {
      setError('Erro ao atualizar status: ' + err.message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.color : '#666';
  };

  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.label : status;
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="container-dashboard">
      <div className="header-dashboard">
        <h2>Gerenciamento de Reservas Esporádicas</h2>
      </div>
      <hr className="linha-separadora" />

      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <strong>Total de reservas esporádicas:</strong> {allocations.length}
      </div>

      <table className="tabela">
        <thead>
          <tr>
            <th>Professor</th>
            <th>Disciplina</th>
            <th>Sala</th>
            <th>Tipo Sala</th>
            <th>Turno</th>
            <th>Horário</th>
            <th>Dia</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {allocations.length > 0 ? (
            allocations.map((item, index) => (
              <tr key={index}>
                <td>{item.professor_nome}</td>
                <td>{item.disciplina_nome}</td>
                <td>{item.numero_sala}</td>
                <td>{item.tipo_sala}</td>
                <td>{item.disciplina_turno}</td>
                <td>{item.hora_inicio ? item.hora_inicio.substring(0, 5) : ''}</td>
                <td>{diasSemana.find(d => String(d.value) === String(item.dia_semana))?.label || item.dia_semana}</td>
                <td>
                  <span style={{
                    backgroundColor: getStatusColor(item.alocacao_status),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {getStatusLabel(item.alocacao_status)}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => { setPopupItem(item); setPopupMode('confirm'); setPopupOpen(true); }}
                    disabled={updatingStatus === item.numero_sala + '-' + item.tipo_sala || item.alocacao_status === 'confirmada'}
                    style={{
                      backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', marginRight: 8, fontWeight: 'bold', cursor: item.alocacao_status === 'confirmada' ? 'not-allowed' : 'pointer'
                    }}
                  >Confirmar</button>
                  <button
                    onClick={() => { setPopupItem(item); setPopupMode('delete'); setPopupOpen(true); }}
                    disabled={updatingStatus === item.numero_sala + '-' + item.tipo_sala}
                    style={{
                      backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', fontWeight: 'bold', cursor: 'pointer'
                    }}
                  >Cancelar</button>
                  {updatingStatus === item.numero_sala + '-' + item.tipo_sala && (
                    <span style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>
                      Atualizando...
                    </span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center' }}>Nenhuma reserva esporádica encontrada.</td>
            </tr>
          )}
        </tbody>
      </table>
      <ConfirmPopup
        open={popupOpen}
        onClose={() => { setPopupOpen(false); setPopupItem(null); }}
        onConfirm={async () => {
          if (popupItem && popupMode === 'confirm') await handleStatusChange(popupItem, 'confirmada');
          if (popupItem && popupMode === 'delete') {
            try {
              await api.delete(`/allocations/${popupItem.numero_sala}/${popupItem.tipo_sala}/${popupItem.id_professor}/${popupItem.disciplina_nome}/${popupItem.disciplina_turno}/${popupItem.ano}/${popupItem.semestre_alocacao}`);
              setAllocations(prev => prev.filter(item =>
                !(
                  item.numero_sala === popupItem.numero_sala &&
                  item.tipo_sala === popupItem.tipo_sala &&
                  item.id_professor === popupItem.id_professor &&
                  item.disciplina_nome === popupItem.disciplina_nome &&
                  item.disciplina_turno === popupItem.disciplina_turno &&
                  item.ano === popupItem.ano &&
                  item.semestre_alocacao === popupItem.semestre_alocacao
                )
              ));
              setPopupOpen(false);
              setPopupItem(null);
            } catch (err) {
              setError('Erro ao excluir reserva: ' + err.message);
            }
          }
        }}
        popupMode={popupMode}
        professorEmail={popupItem?.professor_email || ''}
      />
    </div>
  );
}
