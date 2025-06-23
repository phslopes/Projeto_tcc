import React, { useState, useEffect } from 'react';
import './ReservaPage.css';
import { api } from '../../utils/api';

export default function ReservaAdmin() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);

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
        const response = await api.get('/allocations');
        // Filtra apenas alocações esporádicas
        const esporadicas = response.filter(allocation => 
          allocation.tipo_alocacao === 'esporadico'
        );
        setAllocations(esporadicas || []);
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
      // Formatar hora_inicio para o formato correto (HH:MM:SS)
      const horaInicio = allocation.hora_inicio ? 
        (allocation.hora_inicio.includes(':00') ? allocation.hora_inicio : allocation.hora_inicio + ':00') : 
        '00:00:00';

      await api.put(`/allocations/${allocation.numero_sala}/${allocation.tipo_sala}/${allocation.id_professor}/${allocation.disciplina_nome}/${allocation.disciplina_turno}/${allocation.ano}/${allocation.semestre_alocacao}/${allocation.dia_semana}/${horaInicio}/status`, {
        status: newStatus
      });

      // Atualiza a lista local
      setAllocations(prev => 
        prev.map(item => 
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
                  <select
                    value={item.alocacao_status}
                    onChange={(e) => handleStatusChange(item, e.target.value)}
                    disabled={updatingStatus === item.numero_sala + '-' + item.tipo_sala}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      fontSize: '12px'
                    }}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
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
    </div>
  );
}
