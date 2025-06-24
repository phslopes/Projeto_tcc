import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import CadastroProfessores from "./CadastroProfessores";
import "./ProfessoresPage.css"; // Certifique-se que o caminho está correto
import { api } from "../../utils/api";

function ProfessoresPage() {
  const [professores, setProfessores] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [professorEditando, setProfessorEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfessores = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get("/professors");
      setProfessores(data);
    } catch (err) {
      setError(err.message || "Erro ao carregar professores.");
      console.error("Erro ao carregar professores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessores();
  }, []);

  const adicionarProfessor = async (professor) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/professors", professor);
      setMostrarForm(false);
      setProfessorEditando(null);
      fetchProfessores();
    } catch (err) {
      setError(err.message || "Erro ao adicionar professor.");
      console.error("Erro ao adicionar professor:", err);
      alert(err.message || "Erro ao adicionar professor.");
    } finally {
      setLoading(false);
    }
  };

  const atualizarProfessor = async (professorAtualizado) => {
    setLoading(true);
    setError(null);
    try {
      await api.put(
        `/professors/${professorAtualizado.id_professor}`,
        professorAtualizado
      );
      setMostrarForm(false);
      setProfessorEditando(null);
      fetchProfessores();
    } catch (err) {
      setError(err.message || "Erro ao atualizar professor.");
      console.error("Erro ao atualizar professor:", err);
      alert(err.message || "Erro ao atualizar professor.");
    } finally {
      setLoading(false);
    }
  };

  const excluirProfessor = async (id_professor) => {
    if (window.confirm("Tem certeza que deseja excluir este cadastro?")) {
      setLoading(true);
      setError(null);
      try {
        await api.delete(`/professors/${id_professor}`);
        fetchProfessores();
      } catch (err) {
        setError(err.message || "Erro ao excluir professor.");
        console.error("Erro ao excluir professor:", err);
        alert(err.message || "Erro ao excluir professor.");
      } finally {
        setLoading(false);
      }
    }
  };

  const iniciarEdicao = (professor) => {
    setProfessorEditando({ ...professor });
    setMostrarForm(true);
  };

  if (loading) {
    return (
      <div className="container-professores">
        <p>Carregando professores...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-professores">
        <p className="text-red-500">Erro: {error}</p>
      </div>
    );
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
          <tr>
            {" "}
            {/* Removida a classe 'header-linha' */}
            <th>Nome</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {professores.map((d, index) => (
            <tr key={d.id_professor || index}>
              <td>{d.nome}</td>
              <td>{d.telefone}</td>
              <td>{d.email}</td>
              <td className="coluna-acoes">
                {" "}
                {/* Aplicada a nova classe 'coluna-acoes' */}
                <button
                  className="btn-acao-edit"
                  onClick={() => iniciarEdicao(d)}
                >
                  {" "}
                  {/* Nova classe 'btn-acao-edit' */}
                  <FaEdit />
                </button>
                <button
                  className="btn-acao-delete"
                  onClick={() => excluirProfessor(d.id_professor)}
                >
                  {" "}
                  {/* Nova classe 'btn-acao-delete' */}
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