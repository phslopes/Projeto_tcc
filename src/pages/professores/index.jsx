import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import CadastroProfessores from "./CadastroProfessores";
import "./ProfessoresPage.css";

function ProfessoresPage() {
  const [professores, setProfessores] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [professorEditando, setProfessoresEditando] = useState(null);

  const adicionarProfessor = (professor) => {
    const duplicada = professores.some(
      (d) => d.nome === professor.nome && d.email === professor.email && d.telefone === professor.telefone
    );
    if (duplicada) {
      alert("Já existe este cadastro.");
      return;
    }
    setProfessores([...professores, professor]);
    setMostrarForm(false);
  };

  const atualizarProfessor = (professorAtualizado) => {
    const { index } = professorEditando;
    const duplicada = professores.some(
      (d, i) =>
        i !== index &&
        d.nome === professorAtualizado.nome &&
        d.telefone === professorAtualizado.telefone &&
        d.email === professorAtualizado.email
    );
    if (duplicada) {
      alert("Já existe este cadastro.");
      return;
    }
    const novaLista = [...professores];
    novaLista[index] = professorAtualizado;
    setProfessores(novaLista);
    setProfessoresEditando(null);
    setMostrarForm(false);
  };

  const excluirProfessor = (index) => {
    if (window.confirm("Tem certeza que deseja excluir este cadastro?")) {
      const novaLista = [...professores];
      novaLista.splice(index, 1);
      setProfessores(novaLista);
    }
  };

  const iniciarEdicao = (index) => {
    setProfessoresEditando({ ...professores[index], index });
    setMostrarForm(true);
  };

  return (
    <div className="container-professores">
      <div className="header-professores">
        <h2>Lista de Professores</h2>
        <button
          className="btn-add"
          onClick={() => {
            setProfessoresEditando(null);
            setMostrarForm(true);
          }}
        >
          NOVO CADASTRO
        </button>
      </div>

      <table className="table-professores">
        <thead>
          <tr className="header-linha">
            <th>Nome</th>
            <th>Telefone</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {professores.map((d, index) => (
            <tr key={index}>
              <td>{d.nome}</td>
              <td>{d.telefone}</td>
              <td>{d.email}</td>
              <td>
                <button className="btn-acao" onClick={() => iniciarEdicao(index)}>
                  <FaEdit />
                </button>
                <button className="btn-acao" onClick={() => excluirProfessor(index)}>
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
                setProfessoresEditando(null);
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
                setProfessoresEditando(null);
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