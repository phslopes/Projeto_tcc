import React, { useState } from "react";
import CadastroSalas from "./CadastroSalas";
import "./SalasPage.css";

function SalasPage() {
  const [salas, setSalas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [salaEditando, setSalaEditando] = useState(null);

  const adicionarSala = (sala) => {
    const duplicada = salas.some(
      (s) => s.number === sala.number && s.type === sala.type
    );
    if (duplicada) {
      alert("Sala já cadastrada com este número e tipo.");
      return;
    }
    setSalas([...salas, sala]);
    setMostrarForm(false);
  };

  const atualizarSala = (salaAtualizada) => {
    const { index } = salaEditando;
    const duplicada = salas.some(
      (s, i) =>
        i !== index &&
        s.number === salaAtualizada.number &&
        s.type === salaAtualizada.type
    );
    if (duplicada) {
      alert("Já existe uma sala com esse número e tipo.");
      return;
    }
    const novaLista = [...salas];
    novaLista[index] = salaAtualizada;
    setSalas(novaLista);
    setSalaEditando(null);
    setMostrarForm(false);
  };

  const excluirSala = (index) => {
    if (window.confirm("Tem certeza que deseja excluir esta sala?")) {
      const novaLista = [...salas];
      novaLista.splice(index, 1);
      setSalas(novaLista);
    }
  };

  const iniciarEdicao = (index) => {
    setSalaEditando({ ...salas[index], index });
    setMostrarForm(true);
  };

  return (
    <div className="container-salas">
      <div className="header-salas">
        <h2>Lista de Salas</h2>
        <button className="btn-add" onClick={() => {
          setSalaEditando(null);
          setMostrarForm(true);
        }}>
          ADC NOVA SALA
        </button>
      </div>

      <table className="table-salas">
        <thead>
          <tr className="header-linha">
            <th>Número</th>
            <th>Tipo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {salas.map((sala, index) => (
            <tr key={index}>
              <td>{sala.number}</td>
              <td>{sala.type}</td>
              <td>
                <button className="btn-acao" onClick={() => iniciarEdicao(index)}>✏️</button>
                <button className="btn-acao" onClick={() => excluirSala(index)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {mostrarForm && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => { setMostrarForm(false); setSalaEditando(null); }}>X</button>
            <h3>{salaEditando ? "Editar Sala" : "Cadastrar Sala"}</h3>
            <CadastroSalas
              onSave={salaEditando ? atualizarSala : adicionarSala}
              onCancel={() => { setMostrarForm(false); setSalaEditando(null); }}
              initialData={salaEditando}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default SalasPage;
