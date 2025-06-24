import React, { useState, useEffect } from 'react';
import './ThDashboard.css';
import { api } from '../../../utils/api'; // Importa o utilitário de API

export default function AlocacaoFIltro() {
  const [alocacoesCompletas, setAlocacoesCompletas] = useState([]);
  const [filtros, setFiltros] = useState({ curso: '', turno: '', semestre: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlocacoes = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = await api.get('/allocations'); 
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

  // Deriva as opções de filtro dos dados carregados
  // Adiciona a opção fixa 'ADS' no início das opções de curso
  const cursosUnicos = [...new Set(alocacoesCompletas.map(item => item.curso).filter(Boolean))];
  // *** MODIFICAÇÃO AQUI: Adicionar o item 'ADS' fixo ***
  const cursos = ['ADS_FIXED_NO_FILTER', ...cursosUnicos]; // Usamos um valor único para o item fixo que não vai filtrar

  const turnos = [...new Set(alocacoesCompletas.map(item => item.disciplina_turno).filter(Boolean))];
  const semestres = [...new Set(alocacoesCompletas.map(item => item.semestre_alocacao).filter(Boolean))];

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const dadosFiltrados = alocacoesCompletas.filter(item =>
    // *** MODIFICAÇÃO AQUI: Lógica para o filtro de curso não fazer nada se 'ADS_FIXED_NO_FILTER' for selecionado ***
    (filtros.curso === 'ADS_FIXED_NO_FILTER' || !filtros.curso || item.curso === filtros.curso) && 
    (!filtros.turno || item.disciplina_turno === filtros.turno) &&
    (!filtros.semestre || item.semestre_alocacao === parseInt(filtros.semestre))
  );

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
        <h2>Filtros de Alocação</h2>
      </div>
      <hr className="linha-separadora" />
      <div className="filtros">
        <div className="filtro">
          <label>Curso</label>
          <select name="curso" value={filtros.curso} onChange={handleFiltroChange}>
            <option value="">Todos</option>
            {cursos.map(curso => (
              // *** MODIFICAÇÃO AQUI: Exibir 'ADS' para o valor fixo ***
              <option key={curso} value={curso}>
                {curso === 'ADS_FIXED_NO_FILTER' ? 'ADS' : curso}
              </option>
            ))}
          </select>
        </div>

        <div className="filtro">
          <label>Turno</label>
          <select name="turno" value={filtros.turno} onChange={handleFiltroChange}>
            <option value="">Todos</option>
            {turnos.map(turno => (
              <option key={turno} value={turno}>{turno}</option>
            ))}
          </select>
        </div>
        <div className="filtro">
          <label>Semestre</label>
          <select name="semestre" value={filtros.semestre} onChange={handleFiltroChange}>
            <option value="">Todos</option>
            {semestres.map(semestre => (
              <option key={semestre} value={semestre}>{semestre}</option>
            ))}
          </select>
        </div>
      </div>

      <table className="tabela">
        <thead>
          <tr>
            <th>Curso</th>
            <th>Turno</th>
            <th>Semestre</th>
            <th>Disciplina</th>
            <th>Professor</th>
            <th>Sala</th>
          </tr>
        </thead>
        <tbody>
          {dadosFiltrados.map((item, index) => (
            <tr key={`mock-${item.numero_sala}-${item.tipo_sala}-${item.id_professor}-${item.nome || item.disciplina_nome}-${item.turno || item.disciplina_turno}-${item.ano || item.semestre_alocacao}`}>
              <td data-label="Curso">{'ADS'}</td> {/* Hardcoded 'ADS' na coluna da tabela */}
              <td data-label="Turno">{item.disciplina_turno}</td>
              <td data-label="Semestre">{item.semestre_alocacao}</td>
              <td data-label="Disciplina">{item.disciplina_nome}</td>
              <td data-label="Professor">{item.professor_nome}</td>
              <td data-label="Sala">{item.numero_sala} ({item.tipo_sala})</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}