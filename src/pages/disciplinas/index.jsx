import React, { useState, useEffect } from "react";
import CadastroDisciplinas from "./CadastroDisciplinas";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./DisciplinaPage.css"; // Certifique-se que o caminho está correto
import { api } from "../../utils/api";

function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [disciplinaEditando, setDisciplinaEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDisciplinas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get("/disciplines");
      setDisciplinas(data);
    } catch (err) {
      setError(err.message || "Erro ao carregar disciplinas.");
      console.error("Erro ao carregar disciplinas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  const adicionarDisciplina = async (disciplina) => {
    setLoading(true);
    setError(null);
    try {
      await api.post("/disciplines", disciplina);
      setMostrarForm(false);
      setDisciplinaEditando(null);
      fetchDisciplinas();
    } catch (err) {
      setError(err.message || "Erro ao adicionar disciplina.");
      console.error("Erro ao adicionar disciplina:", err);
      alert(err.message || "Erro ao adicionar disciplina.");
    } finally {
      setLoading(false);
    }
  };

  const atualizarDisciplina = async (disciplinaAtualizada) => {
    setLoading(true);
    setError(null);
    try {
      const { oldNome, oldTurno } = disciplinaEditando;
      await api.put(`/disciplines/${oldNome}/${oldTurno}`, disciplinaAtualizada);
      setMostrarForm(false);
      setDisciplinaEditando(null);
      fetchDisciplinas();
    } catch (err) {
      setError(err.message || "Erro ao atualizar disciplina.");
      console.error("Erro ao atualizar disciplina:", err);
      alert(err.message || "Erro ao atualizar disciplina.");
    } finally {
      setLoading(false);
    }
  };

  const excluirDisciplina = async (disciplinaParaExcluir) => {
    if (window.confirm("Tem certeza que deseja excluir esta disciplina?")) {
      setLoading(true);
      setError(null);
      try {
        await api.delete(
          `/disciplines/${disciplinaParaExcluir.nome}/${disciplinaParaExcluir.turno}`
        );
        fetchDisciplinas();
      } catch (err) {
        setError(err.message || "Erro ao excluir disciplina.");
        console.error("Erro ao excluir disciplina:", err);
        alert(err.message || "Erro ao excluir disciplina.");
      } finally {
        setLoading(false);
      }
    }
  };

  const iniciarEdicao = (disciplina) => {
    setDisciplinaEditando({
      ...disciplina,
      oldNome: disciplina.nome,
      oldTurno: disciplina.turno,
    });
    setMostrarForm(true);
  };

  if (loading) {
    return (
      <div className="container-disciplinas">
        <p>Carregando disciplinas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-disciplinas">
        <p className="text-red-500">Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="container-disciplinas">
      <div className="header-disciplinas">
        <h2>Lista de Disciplinas</h2>
        <button
          className="btn-add"
          onClick={() => {
            setDisciplinaEditando(null);
            setMostrarForm(true);
          }}
        >
          NOVA DISCIPLINA
        </button>
      </div>

      <table className="table-disciplinas">
        <thead>
          <tr>
            {" "}
            {/* Removida a classe 'header-linha' */}
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
            <tr key={`${d.nome}-${d.turno}-${index}`}>
              <td>{d.nome}</td>
              <td>{d.turno}</td>
              <td>{d.carga}</td>
              <td>{d.semestre_curso}</td>
              <td>{d.curso}</td>
              <td className="coluna-acoes">
                {" "}
                {/* Aplicada a nova classe 'coluna-acoes' */}
                <button className="btn-acao-edit" onClick={() => iniciarEdicao(d)}>
                  {" "}
                  {/* Nova classe 'btn-acao-edit' */}
                  <FaEdit />
                </button>
                <button className="btn-acao-delete" onClick={() => excluirDisciplina(d)}>
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