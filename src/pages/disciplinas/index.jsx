import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import CadastroDisciplinas from "./CadastroDisciplinas";
import "./DisciplinaPage.css";

function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [disciplinaEditando, setDisciplinaEditando] = useState(null);

  const adicionarDisciplina = (disciplina) => {
    const duplicada = disciplinas.some(
      (d) => d.nome === disciplina.nome && d.turno === disciplina.turno
    );
    if (duplicada) {
      alert("Já existe uma disciplina com esse nome e turno.");
      return;
    }
    setDisciplinas([...disciplinas, disciplina]);
    setMostrarForm(false);
  };

  const atualizarDisciplina = (disciplinaAtualizada) => {
    const { index } = disciplinaEditando;
    const duplicada = disciplinas.some(
      (d, i) =>
        i !== index &&
        d.nome === disciplinaAtualizada.nome &&
        d.turno === disciplinaAtualizada.turno
    );
    if (duplicada) {
      alert("Já existe uma disciplina com esse nome e turno.");
      return;
    }
    const novaLista = [...disciplinas];
    novaLista[index] = disciplinaAtualizada;
    setDisciplinas(novaLista);
    setDisciplinaEditando(null);
    setMostrarForm(false);
  };

  const excluirDisciplina = (index) => {
    if (window.confirm("Tem certeza que deseja excluir esta disciplina?")) {
      const novaLista = [...disciplinas];
      novaLista.splice(index, 1);
      setDisciplinas(novaLista);
    }
  };

  const iniciarEdicao = (index) => {
    setDisciplinaEditando({ ...disciplinas[index], index });
    setMostrarForm(true);
  };

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
            <th>Dia</th>
            <th>Hora Início</th>
            <th>Semestre</th>
            <th>Curso</th>
          </tr>
        </thead>
        <tbody>
          {disciplinas.map((d, index) => (
            <tr key={index}>
              <td>{d.nome}</td>
              <td>{d.turno}</td>
              <td>{d.carga}</td>
              <td>{d.dia}</td>
              <td>{d.hora_inicio}</td>
              <td>{d.semestre}</td>
              <td>{d.curso}</td>
              <td>
                <button className="btn-acao" onClick={() => iniciarEdicao(index)}>
                  <FaEdit />
                </button>
                <button className="btn-acao" onClick={() => excluirDisciplina(index)}>
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
