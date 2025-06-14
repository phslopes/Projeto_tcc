import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import CadastroProfessores from "./CadastroProfessores";
import "./ProfessoresPage.css";
import { api } from "../../utils/api"; // Importa o utilitário de API

function ProfessoresPage() {
  const [professores, setProfessores] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [professorEditando, setProfessorEditando] = useState(null); // Renomeado para professorEditando
  const [loading, setLoading] = useState(false); // Novo estado de loading
  const [error, setError] = useState(null); // Novo estado de erro

  // Função para buscar professores do backend
  const fetchProfessores = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/professors'); // Chama a API para obter professores
      setProfessores(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar professores.');
      console.error("Erro ao carregar professores:", err);
    } finally {
      setLoading(false);
    }
  };

  // Chama fetchProfessores ao montar o componente
  useEffect(() => {
    fetchProfessores();
  }, []);

  const adicionarProfessor = async (professor) => {
    // A verificação de duplicidade será feita principalmente no backend agora
    setLoading(true);
    setError(null);
    try {
      await api.post('/professors', professor); // Chama a API para adicionar
      setMostrarForm(false);
      setProfessorEditando(null); // Limpa o estado de edição
      fetchProfessores(); // Recarrega a lista
    } catch (err) {
      setError(err.message || 'Erro ao adicionar professor.');
      console.error("Erro ao adicionar professor:", err);
      alert(err.message || 'Erro ao adicionar professor.'); // Alerta o usuário
    } finally {
      setLoading(false);
    }
  };

  const atualizarProfessor = async (professorAtualizado) => {
    setLoading(true);
    setError(null);
    try {
      // O backend usa o id_professor para identificar o professor a ser atualizado
      await api.put(`/professors/${professorAtualizado.id_professor}`, professorAtualizado);
      setMostrarForm(false);
      setProfessorEditando(null); // Limpa o estado de edição
      fetchProfessores(); // Recarrega a lista
    } catch (err) {
      setError(err.message || 'Erro ao atualizar professor.');
      console.error("Erro ao atualizar professor:", err);
      alert(err.message || 'Erro ao atualizar professor.'); // Alerta o usuário
    } finally {
      setLoading(false);
    }
  };

  const excluirProfessor = async (id_professor) => {
    if (window.confirm("Tem certeza que deseja excluir este cadastro?")) {
      setLoading(true);
      setError(null);
      try {
        await api.delete(`/professors/${id_professor}`); // Chama a API para excluir
        fetchProfessores(); // Recarrega a lista
      } catch (err) {
        setError(err.message || 'Erro ao excluir professor.');
        console.error("Erro ao excluir professor:", err);
        alert(err.message || 'Erro ao excluir professor.'); // Alerta o usuário
      } finally {
        setLoading(false);
      }
    }
  };

  const iniciarEdicao = (professor) => {
    setProfessorEditando({ ...professor }); // Passa o objeto completo para o formulário
    setMostrarForm(true);
  };

  // Mensagens de Loading e Erro
  if (loading) {
    return <div className="container-professores"><p>Carregando professores...</p></div>;
  }

  if (error) {
    return <div className="container-professores"><p className="text-red-500">Erro: {error}</p></div>;
  }

  return (
    <div className="container-professores">
      <div className="header-professores">
        <h2>Lista de Professores</h2>
        <button
          className="btn-add"
          onClick={() => {
            setProfessorEditando(null);
            setMostrarForm(true);
          }}
        >
          NOVO CADASTRO
        </button>
      </div>

      <table className="table-professores">
        <thead>
          <tr className="header-linha">
            <th>ID</th> {/* Adicionado ID para corresponder ao DB */}
            <th>Nome</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Ações</th> {/* Renomeado para Ações */}
          </tr>
        </thead>
        <tbody>
          {professores.map((d, index) => (
            <tr key={d.id_professor || index}> {/* Usar id_professor como key */}
              <td>{d.id_professor}</td> {/* Exibir ID */}
              <td>{d.nome}</td>
              <td>{d.telefone}</td>
              <td>{d.email}</td>
              <td>
                <button className="btn-acao" onClick={() => iniciarEdicao(d)}>
                  <FaEdit />
                </button>
                <button className="btn-acao" onClick={() => excluirProfessor(d.id_professor)}>
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
                setProfessorEditando(null);
              }}
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
              {professorEditando ? "Editar Professor" : "Cadastrar Professor"}
            </h3>
            <CadastroProfessores
              onSave={professorEditando ? atualizarProfessor : adicionarProfessor}
              onCancel={() => {
                setMostrarForm(false);
                setProfessorEditando(null);
              }}
              initialData={professorEditando}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfessoresPage;