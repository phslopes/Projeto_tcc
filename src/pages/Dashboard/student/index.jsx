import React, { useState, useEffect } from 'react';
import './ThDashboard.css';
import { api } from '../../../utils/api';
import { useNavigate } from 'react-router-dom';

export default function AlocacaoFIltro() {
  const [alocacoesCompletas, setAlocacoesCompletas] = useState([]);
  const [filtros, setFiltros] = useState({ curso: '', turno: '', semestre: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchAlocacoes = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = await api.get('/allocations', { params: { tipoAlocacao: 'fixo' } });
      setAlocacoesCompletas(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar dados do dashboard.');
      console.error("Erro ao carregar dados do dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlocacoes();
  }, []);

  const cursosUnicos = [...new Set(alocacoesCompletas.map(item => item.curso).filter(Boolean))];
  const cursos = ['ADS_FIXED_NO_FILTER', ...cursosUnicos];

  const turnos = [...new Set(alocacoesCompletas.map(item => item.disciplina_turno).filter(Boolean))];
  const semestres = [...new Set(alocacoesCompletas.map(item => item.semestre_alocacao).filter(Boolean))];

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const dadosFiltrados = alocacoesCompletas.filter(item =>
    (filtros.curso === 'ADS_FIXED_NO_FILTER' || !filtros.curso || item.curso === filtros.curso) &&
    (!filtros.turno || item.disciplina_turno === filtros.turno) &&
    (!filtros.semestre || item.semestre_alocacao === parseInt(filtros.semestre))
  );

  const podeExibirTabela = filtros.curso && filtros.turno;

  if (loading) {
    return (
      <div className="container-dashboard">
        <p>Carregando dados do dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-dashboard">
        <p className="text-red-500">Erro: {error}</p>
        <p>Verifique se o backend está rodando e se você está logado com permissão de administrador.</p>
      </div>
    );
  }

  return (
    <div className="container-dashboard">
      <div className="header-dashboard">
        <h2>Grade de Aulas</h2>
        <button className="logout-button" onClick={handleLogout}>Sair</button> {/* Botão agora está aqui */}
      </div>
      <hr className="linha-separadora" />
      <div className="filtros">
        <div className="filtro">
          <label>Curso</label>
          <select name="curso" value={filtros.curso} onChange={handleFiltroChange}>
            <option value="" disabled>Selecione um Curso</option>
            {cursos.map(curso => (
              <option key={curso} value={curso}>
                {curso === 'ADS_FIXED_NO_FILTER' ? 'ADS' : curso}
              </option>
            ))}
          </select>
        </div>

        <div className="filtro">
          <label>Turno</label>
          <select name="turno" value={filtros.turno} onChange={handleFiltroChange}>
            <option value="" disabled>Selecione um Turno</option>
            {turnos.map(turno => (
              <option key={turno} value={turno}>{turno}</option>
            ))}
          </select>
        </div>
        <div className="filtro">
          <label>Semestre</label>
          <select name="semestre" value={filtros.semestre} onChange={handleFiltroChange}>
            <option value="" disabled>Selecione um Semestre</option>
            {semestres.map(semestre => (
              <option key={semestre} value={semestre}>{semestre}</option>
            ))}
          </select>
        </div>
      </div>

      {podeExibirTabela ? (
        <table className="tabela">
          <thead>
            <tr>
              <th>Semestre</th>
              <th>Horário Início</th>
              <th>Dia da Semana</th>
              <th>Disciplina</th>
              <th>Professor</th>
              <th>Sala</th>
            </tr>
          </thead>
          <tbody>
            {dadosFiltrados.map((item, index) => (
              <tr key={`mock-${item.numero_sala}-${item.tipo_sala}-${item.id_professor}-${item.nome || item.disciplina_nome}-${item.turno || item.disciplina_turno}-${item.ano || item.semestre_alocacao}`}>
                <td>{item.semestre_alocacao}</td>
                <td>{item.hora_inicio ? item.hora_inicio.substring(0, 5) : ''}</td>
                <td>{(() => {
                  const dias = {
                    2: 'Segunda-feira',
                    3: 'Terça-feira',
                    4: 'Quarta-feira',
                    5: 'Quinta-feira',
                    6: 'Sexta-feira',
                    7: 'Sábado'
                  };
                  return dias[item.dia_semana] || '';
                })()}</td>
                <td>{item.disciplina_nome}</td>
                <td>{item.professor_nome}</td>
                <td>{item.numero_sala} ({item.tipo_sala})</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ marginTop: 32, color: '#b20000', fontWeight: 'bold', textAlign: 'center' }}>
          Selecione <u>Curso</u> e <u>Turno</u> para visualizar a tabela de alocações.
        </div>
      )}
    </div>
  );
}