import React, { useState } from 'react';
import './ThDashboard.css';

const dados = [
  { curso: 'ADS', turno: 'Tarde', semestre: '1º', disciplina: 'Cálculo', professor: 'Prof. Cachucho', sala: '8' },
  { curso: 'ADS', turno: 'Noite', semestre: '2º', disciplina: 'Algoritimos', professor: 'Prof. Ulisses', sala: '5' },
  { curso: 'GCOM', turno: 'Manhã', semestre: '1º', disciplina: 'Administração', professor: 'Prof. Lima', sala: '201' },
  { curso: 'GCOM', turno: 'Noite', semestre: '2º', disciplina: 'Marketing', professor: 'Prof. Mendes', sala: '202' },
  // Adicione mais dados conforme necessário
];

export default function DashboardAdmin() {
  const [filtros, setFiltros] = useState({ curso: '', turno: '', semestre: '' });

  const cursos = [...new Set(dados.map(item => item.curso))];
  const turnos = [...new Set(dados.map(item => item.turno))];
  const semestres = [...new Set(dados.map(item => item.semestre))];

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const dadosFiltrados = dados.filter(item =>
    (!filtros.curso || item.curso === filtros.curso) &&
    (!filtros.turno || item.turno === filtros.turno) &&
    (!filtros.semestre || item.semestre === filtros.semestre)
  );

  return (
    <div className="container-dashboard">
      <div className="header-dashboard">
        <h2>Filtrar Associações</h2>
        </div>
        <hr className="linha-separadora" />
      <div className="filtros">
        <div className="filtro">
          <label>Curso</label>
          <select name="curso" value={filtros.curso} onChange={handleFiltroChange}>
            <option value="">Todos</option>
            {cursos.map(curso => (
              <option key={curso} value={curso}>{curso}</option>
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
            <tr key={index}>
              <td>{item.curso}</td>
              <td>{item.turno}</td>
              <td>{item.semestre}</td>
              <td>{item.disciplina}</td>
              <td>{item.professor}</td>
              <td>{item.sala}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


