import React, { useState } from "react";
import CadastroSalas from "./CadastroSalas";
import { FaEdit, FaTrash } from "react-icons/fa"; 
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
          NOVA SALA
        </button>
      </div>

      <table className="table-salas">
  <thead>
    <tr className="header-linha">
      <th>Número</th>
      <th>Tipo</th>
    </tr>
  </thead>
  <tbody>
    {salas.map((d, index) => (
      <tr key={index} className="linha-sala">
        <td className="coluna-centro">{d.number}</td>
        <td className="coluna-centro">{d.type}</td>
        <td className="coluna-centro">
          <div className="botoes-acoes">
            <button className="btn-acao" onClick={() => iniciarEdicao(index)}>
              <FaEdit />
            </button>
            <button className="btn-acao" onClick={() => excluirSala(index)}>
              <FaTrash />
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>



      {mostrarForm && (
  <CadastroSalas
    onSave={salaEditando ? atualizarSala : adicionarSala}
    onCancel={() => {
      setMostrarForm(false);
      setSalaEditando(null);
    }}
    initialData={salaEditando}
  />
)}

    </div>
  );
}

export default SalasPage;
