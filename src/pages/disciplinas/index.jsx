import React, { useState, useEffect } from "react";
import CadastroDisciplinas from "./CadastroDisciplinas";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./DisciplinaPage.css";
import { api } from "../../utils/api"; // Importa o utilitário de API

function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [disciplinaEditando, setDisciplinaEditando] = useState(null);
  const [loading, setLoading] = useState(false); // Estado de loading
  const [error, setError] = useState(null); // Estado de erro

  // Função para buscar disciplinas do backend
  const fetchDisciplinas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/disciplines'); // Chama a API para obter disciplinas
      setDisciplinas(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar disciplinas.');
      console.error("Erro ao carregar disciplinas:", err);
    } finally {
      setLoading(false);
    }
  };

  // Chama fetchDisciplinas ao montar o componente
  useEffect(() => {
    fetchDisciplinas();
  }, []);

  const adicionarDisciplina = async (disciplina) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/disciplines', disciplina); // Chama a API para adicionar
      setMostrarForm(false);
      setDisciplinaEditando(null); // Limpa o estado de edição
      fetchDisciplinas(); // Recarrega a lista
    } catch (err) {
      setError(err.message || 'Erro ao adicionar disciplina.');
      console.error("Erro ao adicionar disciplina:", err);
      alert(err.message || 'Erro ao adicionar disciplina.'); // Alerta o usuário
    } finally {
      setLoading(false);
    }
  };

  const atualizarDisciplina = async (disciplinaAtualizada) => {
    setLoading(true);
    setError(null);
    try {
      // O backend precisa do nome e turno antigos para identificar a disciplina
      const { oldNome, oldTurno } = disciplinaEditando;
      await api.put(`/disciplines/${oldNome}/${oldTurno}`, disciplinaAtualizada);
      setMostrarForm(false);
      setDisciplinaEditando(null); // Limpa o estado de edição
      fetchDisciplinas(); // Recarrega a lista
    } catch (err) {
      setError(err.message || 'Erro ao atualizar disciplina.');
      console.error("Erro ao atualizar disciplina:", err);
      alert(err.message || 'Erro ao atualizar disciplina.'); // Alerta o usuário
    } finally {
      setLoading(false);
    }
  };

  const excluirDisciplina = async (disciplinaParaExcluir) => {
    if (window.confirm("Tem certeza que deseja excluir esta disciplina?")) {
      setLoading(true);
      setError(null);
      try {
        // O backend precisa do nome e turno para excluir a disciplina
        await api.delete(`/disciplines/${disciplinaParaExcluir.nome}/${disciplinaParaExcluir.turno}`);
        fetchDisciplinas(); // Recarrega a lista
      } catch (err) {
        setError(err.message || 'Erro ao excluir disciplina.');
        console.error("Erro ao excluir disciplina:", err);
        alert(err.message || 'Erro ao excluir disciplina.'); // Alerta o usuário
      } finally {
        setLoading(false);
      }
    }
  };

  const iniciarEdicao = (disciplina) => {
    // Ao iniciar a edição, guarda os dados originais da disciplina para identificar no update
    setDisciplinaEditando({
      ...disciplina,
      oldNome: disciplina.nome, // Guarda o nome original para a chamada PUT
      oldTurno: disciplina.turno, // Guarda o turno original para a chamada PUT
    });
    setMostrarForm(true);
  };

  // Mensagens de Loading e Erro
  if (loading) {
    return <div className="container-disciplinas"><p>Carregando disciplinas...</p></div>;
  }

  if (error) {
    return <div className="container-disciplinas"><p className="text-red-500">Erro: {error}</p></div>;
  }

  return (
    <div className="container-disciplinas">
      <div className="header-disciplinas">
        <h2>Lista de Disciplinas</h2>
        <button className="btn-add" onClick={() => {
          setDisciplinaEditando(null);
          setMostrarForm(true);
        }}>
          NOVA DISCIPLINA
        </button>
      </div>

      <table className="table-disciplinas">
        <thead>
          <tr className="header-linha">
            <th>Nome</th>
            <th>Turno</th>
            <th>Carga</th>
            <th>Semestre</th>
            <th>Curso</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {disciplinas.map((d, index) => (
            // A key deve ser única, como nome+turno. O index é um fallback seguro para local.
            <tr key={`${d.nome}-${d.turno}-${index}`}>
              <td>{d.nome}</td>
              <td>{d.turno}</td>
              <td>{d.carga}</td>
              <td>{d.semestre_curso}</td>
              <td>{d.curso}</td>
              <td>
                <button className="btn-acao" onClick={() => iniciarEdicao(d)}>
                  <FaEdit />
                </button>
                <button className="btn-acao" onClick={() => excluirDisciplina(d)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative animate-fade-in-up">
            <button
              className="absolute top-3 right-4 text-2xl font-bold text-gray-600 hover:text-red-500 transition"
              onClick={() => {
                setMostrarForm(false);
                setDisciplinaEditando(null);
              }}
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
              {disciplinaEditando ? "Editar Disciplina" : "Cadastrar Disciplina"}
            </h3>
            <CadastroDisciplinas
              onSave={disciplinaEditando ? atualizarDisciplina : adicionarDisciplina}
              onCancel={() => {
                setMostrarForm(false);
                setDisciplinaEditando(null);
              }}
              initialData={disciplinaEditando}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DisciplinasPage;