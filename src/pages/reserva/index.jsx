import React, { useState, useEffect } from 'react';
import './ReservaPage.css';

const dados = [
  { curso: 'Segunda', turno: 'Manhã', semestre: '1º', disciplina: 'Cálculo', professor: 'Prof. Cachucho', sala: '8', tipoSala: 'Laboratório', horario: '08:00' },
  { curso: 'Terça', turno: 'Tarde', semestre: '2º', disciplina: 'Algoritmos', professor: 'Prof. Ulisses', sala: '5', tipoSala: 'Sala', horario: '13:00' },
  { curso: 'Quarta', turno: 'Manhã', semestre: '3º', disciplina: 'Física', professor: 'Prof. Ana', sala: '2', tipoSala: 'Laboratório', horario: '09:40' },
  { curso: 'Quinta', turno: 'Noite', semestre: '4º', disciplina: 'Banco de Dados', professor: 'Prof. Marcos', sala: '10', tipoSala: 'Sala', horario: '19:00' },
  { curso: 'Sexta', turno: 'Tarde', semestre: '2º', disciplina: 'Programação', professor: 'Prof. Bia', sala: '6', tipoSala: 'Laboratório', horario: '14:50' },
  { curso: 'Sábado', turno: 'Manhã', semestre: '1º', disciplina: 'Matemática', professor: 'Prof. Carla', sala: '3', tipoSala: 'Sala', horario: '10:00' },
  { curso: 'Segunda', turno: 'Noite', semestre: '5º', disciplina: 'Redes', professor: 'Prof. Leo', sala: '9', tipoSala: 'Laboratório', horario: '20:30' },
  { curso: 'Terça', turno: 'Tarde', semestre: '3º', disciplina: 'Engenharia de Software', professor: 'Prof. Paulo', sala: '4', tipoSala: 'Sala', horario: '15:30' },
];


  
export default function Reserva() {
  const [filtros, setFiltros] = useState({
    curso: '',
    turno: '',
    semestre: '',
    professor: '',
    disciplina: '',
    tipoSala: '',
    horario: '',
  });

const [selecionado, setSelecionado] = useState(null);

  const [reservados, setReservados] = useState([]);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [linhaConfirmada, setLinhaConfirmada] = useState(null);

 const handleSelecionar = (item) => {
  if (reservados.includes(item)) return;
  setSelecionado(selecionado === item ? null : item);
};


  const handleConfirmar = () => {
  setLinhaConfirmada(selecionado);
  setMostrarPopup(true);
};

  const confirmarReserva = () => {
  setReservados([...reservados, selecionado]);
  setSelecionado(null);
  setMostrarPopup(false);
};


  const gerarHorarios = () => {
    const horarios = [];
    let hora = 8;
    let minuto = 0;

    while (hora < 22 || (hora === 22 && minuto === 0)) {
      const horaFormatada = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
      horarios.push(horaFormatada);
      minuto += 50;
      if (minuto >= 60) {
        minuto -= 60;
        hora += 1;
      }
    }
    return horarios;
  };

  const horarios = gerarHorarios();

  const horariosPorTurno = {
    Manhã: horarios.filter(h => h >= '08:00' && h < '12:00'),
    Tarde: horarios.filter(h => h >= '12:00' && h < '18:00'),
    Noite: horarios.filter(h => h >= '18:00' && h <= '22:00'),
  };
  

const TurnoPorHorario = (horario) => {
  if (horario >= '08:00' && horario < '12:00') return 'Manhã';
  if (horario >= '12:00' && horario < '18:00') return 'Tarde';
  if (horario >= '18:00' && horario <= '22:00') return 'Noite';
  return '';
};

const handleFiltroChange = (e) => {
  const { name, value } = e.target;

  if (name === 'horario') {
    const turnoDetectado = TurnoPorHorario(value);
    setFiltros(prev => ({
      ...prev,
      horario: value,
      turno: turnoDetectado
    }));
  } else if (name === 'turno') {
    setFiltros(prev => ({
      ...prev,
      turno: value,
      horario: '' // reseta horário se turno mudar
    }));
  } else {
    setFiltros(prev => ({ ...prev, [name]: value }));
  }
};



  const professoresFiltrados = filtros.disciplina
    ? [...new Set(dados.filter(item => item.disciplina === filtros.disciplina).map(item => item.professor))]
    : [...new Set(dados.map(item => item.professor))];

  const disciplinasFiltradas = filtros.professor
    ? [...new Set(dados.filter(item => item.professor === filtros.professor).map(item => item.disciplina))]
    : [...new Set(dados.map(item => item.disciplina))];
  





const dadosFiltrados = dados.filter(item =>
  (!filtros.curso || item.curso === filtros.curso) &&
  (!filtros.turno || item.turno === filtros.turno) &&
  (!filtros.tipoSala || item.tipoSala === filtros.tipoSala) &&
  (!filtros.horario || item.horario === filtros.horario)
);


  const deveMostrarTabela =
    filtros.curso || filtros.turno || filtros.horario || filtros.tipoSala;

  return (
    <div className="container-dashboard">
      <div className="header-dashboard">
        <h2>Reserva de Sala</h2>
      </div>
      <hr className="linha-separadora" />

      <div className="filtros-superiores">
        <div className="filtro">
          <label>Professor</label>
          <select name="professor" value={filtros.professor} onChange={handleFiltroChange}>
            <option value="">Todos</option>
            {professoresFiltrados.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="filtro">
          <label>Disciplina</label>
          <select name="disciplina" value={filtros.disciplina} onChange={handleFiltroChange}>
            <option value="">Todas</option>
            {disciplinasFiltradas.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <hr className="linha-separadora" />

      <div className="filtros">
        <div className="filtro">
          <label>Dia da Semana</label>
          <select name="curso" value={filtros.curso} onChange={handleFiltroChange}>
            <option value="">Todos</option>
            <option value="Segunda">Segunda</option>
            <option value="Terça">Terça</option>
            <option value="Quarta">Quarta</option>
            <option value="Quinta">Quinta</option>
            <option value="Sexta">Sexta</option>
            <option value="Sábado">Sábado</option>
          </select>
        </div>
        <div className="filtro">
  <label>Turno</label>
  <select name="turno" value={filtros.turno} onChange={handleFiltroChange}>
    <option value="">Todos</option>
    <option value="Manhã">Manhã</option>
    <option value="Tarde">Tarde</option>
    <option value="Noite">Noite</option>
  </select>
</div>


        

        <div className="filtro">
          <label>Horário</label>
          <select name="horario" value={filtros.horario} onChange={handleFiltroChange}>
            <option value="">Todos</option>
            {(filtros.turno ? horariosPorTurno[filtros.turno] : horarios).map(h => (
  <option key={h} value={h}>{h}</option>
))}

          </select>
        </div>

        <div className="filtro">
          <label>Tipo Sala</label>
          <select name="tipoSala" value={filtros.tipoSala} onChange={handleFiltroChange}>
            <option value="">Todas</option>
            <option value="Laboratório">Laboratório</option>
            <option value="Sala">Sala</option>
          </select>
        </div>
      </div>

      {deveMostrarTabela && (
        <table className="tabela">
          <thead>
            <tr>
              <th>Sala</th>
              <th>Tipo</th>
              <th>Turno</th>
              <th>Horário</th>
              <th>Solicitar Reserva</th>
            </tr>
          </thead>
          <tbody>
            {dadosFiltrados.map((item, index) => (
              <tr key={index}>
                <td>{item.sala}</td>
                <td>{item.tipoSala}</td>
                <td>{item.turno}</td>
                <td>{item.horario}</td>
                <td>
                  {reservados.includes(item) ? (
                    <div style={{ backgroundColor: '#a8e6a3', padding: '4px 8px', borderRadius: '4px', textAlign: 'center' }}>
                      Solicitado
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        style={{ width: '18px', height: '18px' }}
                        checked={selecionado === item}
                        onChange={() => handleSelecionar(item)}
                      />
                      {selecionado === item && (
                        <button
                          style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                          onClick={handleConfirmar}
                        >
                          Confirmar
                        </button>
                      )}
                    </div>
                  )}
                  {mostrarPopup && (
  <div className="popup-overlay">
    <div className="popup">
      <h3>Confirmar Reserva</h3>
      <p>Você deseja reservar a sala {linhaConfirmada.sala} ({linhaConfirmada.tipoSala}) no horário {linhaConfirmada.horario}?</p>
      <div style={{ marginTop: '10px' }}>
        <button onClick={confirmarReserva} style={{ marginRight: '10px', backgroundColor: 'green', color: 'white' }}>Sim</button>
        <button onClick={() => setMostrarPopup(false)}>Cancelar</button>
      </div>
    </div>
  </div>
)}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
