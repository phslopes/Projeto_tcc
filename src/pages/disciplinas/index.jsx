import React, { useState } from "react";
import CadastroDisciplinas from "./CadastroDisciplinas";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./DisciplinaPage.css"; //

function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [disciplinaEditando, setDisciplinaEditando] = useState(null);

  const adicionarDisciplina = (disciplina) => {
    // Unicidade agora é baseada em nome e turno (chave composta)
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
    // A disciplinaEditando agora contém a PK original (nome e turno)
    const { oldNome, oldTurno } = disciplinaEditando;

    // Verifica duplicidade com outras disciplinas, exceto a que está sendo editada
    const duplicada = disciplinas.some(
      (d) =>
        !(d.nome === oldNome && d.turno === oldTurno) && // Não é o item original
        d.nome === disciplinaAtualizada.nome &&
        d.turno === disciplinaAtualizada.turno
    );
    if (duplicada) {
      alert("Já existe uma disciplina com esse nome e turno.");
      return;
    }

    const novaLista = disciplinas.map((d) =>
      // Identifica a disciplina a ser atualizada pela PK antiga (nome e turno)
      d.nome === oldNome && d.turno === oldTurno ? disciplinaAtualizada : d
    );
    setDisciplinas(novaLista);
    setDisciplinaEditando(null);
    setMostrarForm(false);
  };

  const excluirDisciplina = (disciplinaParaExcluir) => { // Recebe o objeto completo
    if (window.confirm("Tem certeza que deseja excluir esta disciplina?")) {
      const novaLista = disciplinas.filter(
        (d) => !(d.nome === disciplinaParaExcluir.nome && d.turno === disciplinaParaExcluir.turno)
      );
      setDisciplinas(novaLista);
    }
  };

  const iniciarEdicao = (disciplina) => {
    // Ao iniciar a edição, guarda os dados originais da disciplina para identificar no update
    setDisciplinaEditando({
      ...disciplina,
      oldNome: disciplina.nome, // Guarda o nome original
      oldTurno: disciplina.turno, // Guarda o turno original
    });
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
            <th>Semestre</th>
            <th>Curso</th>
            <th>Ações</th> {/* Adicionado Ações */}
          </tr>
        </thead>
        <tbody>
          {disciplinas.map((d, index) => (
            // A key deve ser única, como nome+turno. Fallback para index se a PK composta não for única no local.
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