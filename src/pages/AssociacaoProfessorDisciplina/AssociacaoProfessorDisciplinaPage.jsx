import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./AssociacaoProfessorDisciplinaPage.css"; 

const mockProfessores = [
  { id: "p1", nome: "Prof. Dr. João Silva" },
  { id: "p2", nome: "Prof. Msc. Maria Oliveira" },
  { id: "p3", nome: "Prof. Esp. Carlos Prado" },
];

const mockDisciplinasNomes = [
  "Cálculo I",
  "Algoritmos e Programação",
  "Engenharia de Software III",
  "Banco de Dados I",
  "Sistemas Operacionais",
];

function AssociacaoProfessorDisciplinaPage() {
  const [associacoes, setAssociacoes] = useState([
    { id: '1', professorId: "p1", professorNome: "Prof. Dr. João Silva", disciplinaNome: "Cálculo I" },
    { id: '2', professorId: "p2", professorNome: "Prof. Msc. Maria Oliveira", disciplinaNome: "Algoritmos e Programação"},
  ]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [associacaoEditando, setAssociacaoEditando] = useState(null);

  // Estados para o formulário do modal
  const [formProfessorId, setFormProfessorId] = useState("");
  const [formDisciplinaNome, setFormDisciplinaNome] = useState("");

  useEffect(() => {
    if (mostrarModal) {
      if (associacaoEditando) {
        setFormProfessorId(associacaoEditando.professorId || "");
        setFormDisciplinaNome(associacaoEditando.disciplinaNome || "");
      } else {
        // Reset para nova entrada
        setFormProfessorId("");
        setFormDisciplinaNome("");
      }
    }
  }, [mostrarModal, associacaoEditando]);

  const handleNovaAssociacao = () => {
    setAssociacaoEditando(null); // Garante que estamos no modo "novo"
    // Reseta os campos do formulário para o estado inicial de "novo"
    setFormProfessorId("");
    setFormDisciplinaNome("");
    setMostrarModal(true);
  };

  const handleEditarAssociacao = (associacao) => {
    setAssociacaoEditando(associacao);
    // Preenche os campos do formulário com os dados da associação para edição
    setFormProfessorId(associacao.professorId || "");
    setFormDisciplinaNome(associacao.disciplinaNome || "");
    setMostrarModal(true);
  };
  
  const handleCloseModal = () => {
    setMostrarModal(false);
    setAssociacaoEditando(null); // Limpa o estado de edição
    // Opcional: resetar os campos do formulário aqui também, embora o useEffect já lide com isso na abertura.
    setFormProfessorId("");
    setFormDisciplinaNome("");
  }

  const handleSalvarAssociacaoForm = (e) => {
    e.preventDefault();
    if (!formProfessorId || !formDisciplinaNome) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    const professorSelecionado = mockProfessores.find(p => p.id === formProfessorId);
    const novaAssociacaoData = {
      professorId: formProfessorId,
      professorNome: professorSelecionado ? professorSelecionado.nome : '',
      disciplinaNome: formDisciplinaNome,
    };

    if (associacaoEditando) {
      // Editar
      const duplicada = associacoes.some(
        (assoc) =>
          assoc.id !== associacaoEditando.id &&
          assoc.professorId === novaAssociacaoData.professorId &&
          assoc.disciplinaNome === novaAssociacaoData.disciplinaNome 
      );
      if (duplicada) {
        alert("Esta associação (Professor, Disciplina) já existe.");
        return;
      }
      setAssociacoes(
        associacoes.map((assoc) =>
          assoc.id === associacaoEditando.id ? { ...associacaoEditando, ...novaAssociacaoData } : assoc
        )
      );
    } else {
      // Adicionar nova
       const duplicada = associacoes.some(
        (assoc) =>
          assoc.professorId === novaAssociacaoData.professorId &&
          assoc.disciplinaNome === novaAssociacaoData.disciplinaNome 
      );
      if (duplicada) {
        alert("Esta associação (Professor, Disciplina, Turno) já existe.");
        return;
      }
      setAssociacoes([
        ...associacoes,
        { ...novaAssociacaoData, id: Date.now().toString() }, 
      ]);
    }
    handleCloseModal();
  };

  const handleExcluirAssociacao = (idAssociacao) => {
    if (window.confirm("Tem certeza que deseja excluir esta associação?")) {
      setAssociacoes(associacoes.filter((assoc) => assoc.id !== idAssociacao));
    }
  };

  return (
    <div className="container-assoc-prof-disc">
      <div className="header-assoc-prof-disc">
        <h2>Associação Professor-Disciplina</h2>
        <button className="btn-add-assoc" onClick={handleNovaAssociacao}>
          NOVA ASSOCIAÇÃO
        </button>
      </div>

      <table className="table-assoc-prof-disc">
        {/* ... Cabeçalho da tabela ... */}
        <thead>
          <tr>
            <th>Professor</th>
            <th>Disciplina</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {associacoes.map((assoc) => (
            <tr key={assoc.id}>
              <td>{assoc.professorNome}</td>
              <td>{assoc.disciplinaNome}</td>
              <td className="coluna-acoes">
                <button
                  className="btn-acao-edit"
                  onClick={() => handleEditarAssociacao(assoc)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn-acao-delete"
                  onClick={() => handleExcluirAssociacao(assoc.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
          {associacoes.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>Nenhuma associação cadastrada.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal*/}
      {mostrarModal && (
        <div className="modal-assoc-overlay">
          <div className="modal-assoc-content">
            <button className="modal-assoc-close-btn" onClick={handleCloseModal}>
              &times;
            </button>
            <h3>{associacaoEditando ? "Editar Associação" : "Nova Associação Professor-Disciplina"}</h3>
            <form onSubmit={handleSalvarAssociacaoForm} className="form-assoc">
              <label className="form-assoc-label">
                Professor:
                <select
                  className="form-assoc-select"
                  value={formProfessorId}
                  onChange={(e) => setFormProfessorId(e.target.value)}
                >
                  <option value="">Selecione o Professor</option>
                  {mockProfessores.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.nome}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-assoc-label">
                Disciplina:
                <select
                  className="form-assoc-select"
                  value={formDisciplinaNome}
                  onChange={(e) => setFormDisciplinaNome(e.target.value)}
                >
                  <option value="">Selecione a Disciplina</option>
                  {mockDisciplinasNomes.map((nome) => (
                    <option key={nome} value={nome}>
                      {nome}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className="btn-submit-assoc">
                SALVAR ASSOCIAÇÃO
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssociacaoProfessorDisciplinaPage;