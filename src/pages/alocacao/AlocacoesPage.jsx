import React, { useState, useEffect, useCallback } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import './AlocacoesPage.css'
import { api } from '../../utils/api'

const diasSemanaConst = [
  { value: 2, label: 'Segunda-feira' },
  { value: 3, label: 'Terça-feira' },
  { value: 4, label: 'Quarta-feira' },
  { value: 5, label: 'Quinta-feira' },
  { value: 6, label: 'Sexta-feira' },
  { value: 7, label: 'Sábado' }
]

function AlocacoesPage() {
  const [alocacoesExibidas, setAlocacoesExibidas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [disciplinas, setDisciplinas] = useState([])
  const [salas, setSalas] = useState([])
  const [vinculosProfessorDisciplina, setVinculosProfessorDisciplina] =
    useState([])

  const [disciplinaSelecionadaForm, setDisciplinaSelecionadaForm] = useState('')
  const [professorAutoPreenchidoNome, setProfessorAutoPreenchidoNome] =
    useState('')
  const [professorAutoPreenchidoId, setProfessorAutoPreenchidoId] = useState('')
  const [salaSelecionadaForm, setSalaSelecionadaForm] = useState('')
  const [diaSemanaForm, setDiaSemanaForm] = useState('')
  const [horaInicioForm, setHoraInicioForm] = useState('')

  const [showEditModal, setShowEditModal] = useState(false)
  const [editingAlocacao, setEditingAlocacao] = useState(null)
  const [newlySelectedRoom, setNewlySelectedRoom] = useState('')

  const now = new Date()
  const anoAtual = now.getFullYear()
  const semestreAtual = now.getMonth() < 6 ? 1 : 2

  const fetchAlocacoes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const fetched = await api.get('/allocations', {
        params: {
          ano: anoAtual,
          semestreAlocacao: semestreAtual
        }
      })
      setAlocacoesExibidas(fetched)
    } catch (err) {
      setError(err.message || 'Erro ao carregar alocações.')
      setAlocacoesExibidas([])
    } finally {
      setLoading(false)
    }
  }, [anoAtual, semestreAtual])

  const fetchDropdownData = useCallback(async () => {
    try {
      const [discs, rooms, profDiscs] = await Promise.all([
        api.get('/disciplines'),
        api.get('/rooms'),
        api.get('/professor-disciplines', {
          params: { anoSemestre: `${anoAtual}${semestreAtual}` }
        })
      ])
      setDisciplinas(discs)
      setSalas(rooms.sort((a, b) => a.numero_sala - b.numero_sala))
      setVinculosProfessorDisciplina(profDiscs)
    } catch (err) {
      console.error('Erro ao carregar dados para dropdowns:', err)
    }
  }, [anoAtual, semestreAtual])

  useEffect(() => {
    fetchAlocacoes()
    fetchDropdownData()
  }, [fetchAlocacoes, fetchDropdownData])

  useEffect(() => {
    if (disciplinaSelecionadaForm) {
      const [discNome, discTurno] = disciplinaSelecionadaForm.split('|')
      const vinculo = vinculosProfessorDisciplina.find(
        v =>
          v.disciplina_nome === discNome &&
          v.disciplina_turno === discTurno &&
          v.ano === anoAtual &&
          v.semestre_alocacao === semestreAtual
      )
      if (vinculo) {
        setProfessorAutoPreenchidoNome(vinculo.professor_nome)
        setProfessorAutoPreenchidoId(vinculo.id_professor)
        setDiaSemanaForm(vinculo.dia_semana ? String(vinculo.dia_semana) : '')
        setHoraInicioForm(
          vinculo.hora_inicio ? vinculo.hora_inicio.substring(0, 5) : ''
        )
      } else {
        setProfessorAutoPreenchidoNome('Vínculo não encontrado')
        setProfessorAutoPreenchidoId('')
        setDiaSemanaForm('')
        setHoraInicioForm('')
      }
    } else {
      setProfessorAutoPreenchidoNome('')
      setProfessorAutoPreenchidoId('')
      setDiaSemanaForm('')
      setHoraInicioForm('')
    }
  }, [
    disciplinaSelecionadaForm,
    vinculosProfessorDisciplina,
    anoAtual,
    semestreAtual
  ])

  const handleAssociarAlocacao = async () => {
    if (
      !disciplinaSelecionadaForm ||
      !professorAutoPreenchidoId ||
      !salaSelecionadaForm
    ) {
      alert('Por favor, preencha todos os campos obrigatórios para a alocação.')
      return
    }
    const [nomeDisc, turnoDisc] = disciplinaSelecionadaForm.split('|')
    const vinculoExistente = vinculosProfessorDisciplina.find(
      v =>
        v.id_professor === professorAutoPreenchidoId &&
        v.disciplina_nome === nomeDisc &&
        v.disciplina_turno === turnoDisc
    )
    if (!vinculoExistente) {
      alert(
        'Vínculo Professor-Disciplina não encontrado. Verifique a associação.'
      )
      return
    }

    if (!vinculoExistente.dia_semana || !vinculoExistente.hora_inicio) {
      alert(
        'Vínculo Professor-Disciplina não possui dia da semana ou horário definido. Verifique a associação.'
      )
      return
    }

    const [numero_sala_str, tipo_sala] = salaSelecionadaForm.split('|')
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
    }
    try {
      await api.post('/allocations', payload)
      alert('Alocação criada com sucesso!')
      setDisciplinaSelecionadaForm('')
      setSalaSelecionadaForm('')
      fetchAlocacoes()
    } catch (err) {
      console.error('Erro ao associar/alocar:', err)
      alert(err.message || 'Ocorreu um erro ao criar alocação.')
    }
  }

  const handleEditarAlocacao = alocacao => {
    setEditingAlocacao(alocacao)
    setNewlySelectedRoom('')
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setEditingAlocacao(null)
    setNewlySelectedRoom('')
  }

  const handleSaveRoomChange = async () => {
    if (!editingAlocacao || !newlySelectedRoom) {
      alert('Por favor, selecione uma nova sala.')
      return
    }

    const [new_numero_sala, new_tipo_sala] = newlySelectedRoom.split('|')
    const {
      numero_sala,
      tipo_sala,
      id_professor,
      disciplina_nome,
      disciplina_turno,
      ano,
      semestre_alocacao
    } = editingAlocacao

    try {
      await api.put(
        `/allocations/change-room/${numero_sala}/${tipo_sala}/${id_professor}/${disciplina_nome}/${disciplina_turno}/${ano}/${semestre_alocacao}`,
        { new_numero_sala: parseInt(new_numero_sala), new_tipo_sala }
      )
      alert('Sala da alocação alterada com sucesso!')
      handleCloseEditModal()
      fetchAlocacoes()
    } catch (err) {
      console.error('Erro ao alterar sala da alocação:', err)
      alert(err.message || 'Ocorreu um erro ao tentar alterar a sala.')
    }
  }

  const handleExcluirAlocacao = async alocacaoParaExcluir => {
    if (window.confirm('Tem certeza que deseja excluir esta alocação?')) {
      try {
        const {
          numero_sala,
          tipo_sala,
          id_professor,
          disciplina_nome,
          disciplina_turno,
          ano,
          semestre_alocacao
        } = alocacaoParaExcluir
        await api.delete(
          `/allocations/${numero_sala}/${tipo_sala}/${id_professor}/${disciplina_nome}/${disciplina_turno}/${ano}/${semestre_alocacao}`
        )
        alert('Alocação excluída com sucesso!')
        fetchAlocacoes()
      } catch (err) {
        alert(err.message || 'Erro ao excluir alocação.')
      }
    }
  }

  if (loading) {
    return (
      <div className="container-alocacoes">
        <p>Carregando...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="container-alocacoes">
        <p className="text-red-500">Erro: {error}</p>
      </div>
    )
  }

  const disciplinasDisponiveisParaForm = [
    ...new Map(
      vinculosProfessorDisciplina.map(item => [
        `${item.disciplina_nome}|${item.disciplina_turno}`,
        item
      ])
    ).values()
  ].sort((a, b) => a.disciplina_nome.localeCompare(b.disciplina_nome))

  return (
    <div
      className="container-alocacoes"
      style={{
        background: '#fafbfc',
        minHeight: '100vh',
        fontFamily: 'Segoe UI, Arial, sans-serif',
        padding: '2rem 1.5rem'
      }}
    >
      <div
        className="header-alocacoes"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}
      >
        <h2
          style={{
            fontSize: '1.7rem',
            fontWeight: 600,
            color: '#333',
            letterSpacing: '0.5px',
            marginBottom: '0.3rem'
          }}
        >
          Lista de Alocações
        </h2>
      </div>

      <div
        className="form-associacao-alocacao"
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}
      >
        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '0.97rem',
            fontWeight: 500,
            color: '#333',
            flexGrow: 1,
            minWidth: '150px'
          }}
        >
          Disciplina:
          <select
            value={disciplinaSelecionadaForm}
            onChange={e => setDisciplinaSelecionadaForm(e.target.value)}
            style={{
              marginTop: '0.25rem',
              padding: '0.6rem',
              borderRadius: '5px',
              border: '1.2px solid #ccc',
              width: '100%',
              fontSize: '1rem'
            }}
          >
            <option value="">Selecione</option>
            {disciplinasDisponiveisParaForm.map(d => (
              <option
                key={`${d.disciplina_nome}|${d.disciplina_turno}`}
                value={`${d.disciplina_nome}|${d.disciplina_turno}`}
              >
                {d.disciplina_nome} ({d.disciplina_turno})
              </option>
            ))}
          </select>
        </label>
        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '0.97rem',
            fontWeight: 500,
            color: '#333',
            flexGrow: 1,
            minWidth: '150px'
          }}
        >
          Professor:
          <input
            type="text"
            value={professorAutoPreenchidoNome}
            readOnly
            style={{
              marginTop: '0.25rem',
              padding: '0.6rem',
              borderRadius: '5px',
              border: '1.2px solid #ccc',
              width: '100%',
              background: '#f5f5f5',
              color: '#888'
            }}
          />
        </label>
        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '0.97rem',
            fontWeight: 500,
            color: '#333',
            flexGrow: 1,
            minWidth: '150px'
          }}
        >
          Dia da Semana:
          <input
            type="text"
            value={
              diaSemanaForm
                ? diasSemanaConst.find(d => d.value === parseInt(diaSemanaForm))
                    ?.label
                : ''
            }
            readOnly
            style={{
              marginTop: '0.25rem',
              padding: '0.6rem',
              borderRadius: '5px',
              border: '1.2px solid #ccc',
              width: '100%',
              background: '#f5f5f5',
              color: '#888'
            }}
          />
        </label>
        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '0.97rem',
            fontWeight: 500,
            color: '#333',
            flexGrow: 1,
            minWidth: '150px',
            maxWidth: '120px'
          }}
        >
          Horário:
          <input
            type="text"
            value={horaInicioForm}
            readOnly
            style={{
              marginTop: '0.25rem',
              padding: '0.6rem',
              borderRadius: '5px',
              border: '1.2px solid #ccc',
              width: '120px',
              background: '#f5f5f5',
              color: '#888'
            }}
          />
        </label>
        <label
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '0.97rem',
            fontWeight: 500,
            color: '#333',
            flexGrow: 1,
            minWidth: '150px'
          }}
        >
          Sala:
          <select
            value={salaSelecionadaForm}
            onChange={e => setSalaSelecionadaForm(e.target.value)}
            style={{
              marginTop: '0.25rem',
              padding: '0.6rem',
              borderRadius: '5px',
              border: '1.2px solid #ccc',
              width: '100%',
              fontSize: '1rem'
            }}
          >
            <option value="">Selecione</option>
            {salas.map(s => (
              <option
                key={`${s.numero_sala}-${s.tipo_sala}`}
                value={`${s.numero_sala}|${s.tipo_sala}`}
              >
                {s.tipo_sala === 'sala' ? 'Sala ' : 'Lab '}
                {s.numero_sala}
              </option>
            ))}
          </select>
        </label>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            marginLeft: '1rem'
          }}
        >
          <button
            className="btn-associar-alocacao"
            style={{
              height: 'auto',
              padding: '0.65rem 1.2rem',
              backgroundColor: '#b20000',
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.18s'
            }}
            onClick={handleAssociarAlocacao}
          >
            ALOCAR
          </button>
        </div>
      </div>

      <table
        className="table-alocacoes"
        style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: 0,
          background: '#fff',
          borderRadius: '10px',
          marginTop: '0.5rem',
          fontSize: '1rem'
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                fontWeight: 600,
                background: '#f5f5f5',
                color: '#333',
                borderBottom: '2px solid #e0e0e0',
                padding: '0.85rem 1rem'
              }}
            >
              Disciplina
            </th>
            <th
              style={{
                fontWeight: 600,
                background: '#f5f5f5',
                color: '#333',
                borderBottom: '2px solid #e0e0e0',
                padding: '0.85rem 1rem'
              }}
            >
              Professor
            </th>
            <th
              style={{
                fontWeight: 600,
                background: '#f5f5f5',
                color: '#333',
                borderBottom: '2px solid #e0e0e0',
                padding: '0.85rem 1rem'
              }}
            >
              Sala
            </th>
            <th
              style={{
                fontWeight: 600,
                background: '#f5f5f5',
                color: '#333',
                borderBottom: '2px solid #e0e0e0',
                padding: '0.85rem 1rem'
              }}
            >
              Status
            </th>
            <th
              style={{
                fontWeight: 600,
                background: '#f5f5f5',
                color: '#333',
                borderBottom: '2px solid #e0e0e0',
                padding: '0.85rem 1rem'
              }}
            >
              Tipo
            </th>
            <th
              style={{
                fontWeight: 600,
                background: '#f5f5f5',
                color: '#333',
                borderBottom: '2px solid #e0e0e0',
                padding: '0.85rem 1rem'
              }}
            >
              Ano/Semestre
            </th>
            <th
              style={{
                fontWeight: 600,
                background: '#f5f5f5',
                color: '#333',
                borderBottom: '2px solid #e0e0e0',
                padding: '0.85rem 1rem'
              }}
            >
              Semestre do Curso
            </th>
            <th
              style={{
                fontWeight: 600,
                background: '#f5f5f5',
                color: '#333',
                borderBottom: '2px solid #e0e0e0',
                padding: '0.85rem 1rem'
              }}
            >
              Dia
            </th>
            <th
              style={{
                fontWeight: 600,
                background: '#f5f5f5',
                color: '#333',
                borderBottom: '2px solid #e0e0e0',
                padding: '0.85rem 1rem'
              }}
            >
              Horário
            </th>
            <th
              style={{
                fontWeight: 600,
                background: '#f5f5f5',
                color: '#333',
                borderBottom: '2px solid #e0e0e0',
                padding: '0.85rem 1rem',
                textAlign: 'center'
              }}
            >
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {alocacoesExibidas.map(alocacao => (
            <tr
              key={`${alocacao.numero_sala}-${alocacao.tipo_sala}-${alocacao.id_professor}-${alocacao.disciplina_nome}-${alocacao.disciplina_turno}-${alocacao.ano}-${alocacao.semestre_alocacao}`}
              style={{ transition: 'background 0.15s' }}
            >
              <td
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  color: '#333',
                  padding: '0.85rem 1rem'
                }}
              >
                {alocacao.disciplina_nome}
              </td>
              <td
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  color: '#333',
                  padding: '0.85rem 1rem'
                }}
              >
                {alocacao.professor_nome}
              </td>
              <td
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  color: '#333',
                  padding: '0.85rem 1rem'
                }}
              >
                {alocacao.tipo_sala === 'sala' ? 'Sala ' : 'Lab '}
                {alocacao.numero_sala}
              </td>
              <td
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  color: '#333',
                  padding: '0.85rem 1rem'
                }}
              >
                {alocacao.alocacao_status}
              </td>
              <td
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  color: '#333',
                  padding: '0.85rem 1rem'
                }}
              >
                {alocacao.tipo_alocacao === 'fixo' ? 'Fixo' : 'Esporádico'}
              </td>
              <td
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  color: '#333',
                  padding: '0.85rem 1rem'
                }}
              >{`${alocacao.ano}/${alocacao.semestre_alocacao}`}</td>
              <td
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  color: '#333',
                  padding: '0.85rem 1rem'
                }}
              >
                {alocacao.semestre_curso}º Semestre
              </td>
              <td
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  color: '#333',
                  padding: '0.85rem 1rem'
                }}
              >
                {diasSemanaConst.find(d => d.value === alocacao.dia_semana)
                  ?.label || ''}
              </td>
              <td
                style={{
                  borderBottom: '1px solid #f0f0f0',
                  color: '#333',
                  padding: '0.85rem 1rem'
                }}
              >
                {alocacao.hora_inicio
                  ? alocacao.hora_inicio.substring(0, 5)
                  : ''}
              </td>
              <td
                className="coluna-acoes"
                style={{
                  display: 'flex',
                  gap: '1.2rem',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <button
                  className="btn-acao-edit"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    padding: '0.3rem',
                    color: '#888',
                    transition: 'color 0.18s, transform 0.18s'
                  }}
                  onClick={() => handleEditarAlocacao(alocacao)}
                  onMouseOver={e => (e.currentTarget.style.color = '#b20000')}
                  onMouseOut={e => (e.currentTarget.style.color = '#888')}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn-acao-delete"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    padding: '0.3rem',
                    color: '#888',
                    transition: 'color 0.18s, transform 0.18s'
                  }}
                  onClick={() => handleExcluirAlocacao(alocacao)}
                  onMouseOver={e => (e.currentTarget.style.color = '#b20000')}
                  onMouseOut={e => (e.currentTarget.style.color = '#888')}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showEditModal && editingAlocacao && (
        <div className="modal-alocacoes-overlay">
          <div className="modal-alocacoes-content">
            <button
              className="modal-alocacoes-close-btn"
              onClick={handleCloseEditModal}
            >
              &times;
            </button>
            <h3>Alterar Sala da Alocação</h3>
            <p
              className="readonly-input-alocacao-modal"
              style={{ textAlign: 'center', marginBottom: '1rem' }}
            >
              {`${editingAlocacao.disciplina_nome} - ${editingAlocacao.professor_nome}`}
            </p>
            <div className="form-edit-alocacao-modal">
              <label>
                Nova Sala:
                <select
                  value={newlySelectedRoom}
                  onChange={e => setNewlySelectedRoom(e.target.value)}
                >
                  <option value="">Selecione a nova sala</option>
                  {salas.map(s => (
                    <option
                      key={`${s.numero_sala}-${s.tipo_sala}`}
                      value={`${s.numero_sala}|${s.tipo_sala}`}
                    >
                      {s.tipo_sala === 'sala' ? 'Sala ' : 'Lab '}
                      {s.numero_sala}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="btn-salvar-edicao"
                onClick={handleSaveRoomChange}
              >
                SALVAR ALTERAÇÃO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AlocacoesPage
