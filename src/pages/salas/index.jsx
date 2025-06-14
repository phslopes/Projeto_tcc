import React, { useState } from "react";
import CadastroSalas from "./CadastroSalas"; //
import { FaEdit, FaTrash } from "react-icons/fa";
import "./SalasPage.css"; //

function SalasPage() {
  const [salas, setSalas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [salaEditando, setSalaEditando] = useState(null);

  const adicionarSala = (sala) => {
    // Unicidade agora é baseada em numero_sala e tipo_sala
    const duplicada = salas.some(
      (s) => s.number === sala.number && s.type.toLowerCase() === sala.type.toLowerCase()
    );
    if (duplicada) {
      alert("Sala já cadastrada com este número e tipo.");
      return;
    }
    setSalas([...salas, sala]);
    setMostrarForm(false);
  };

  const atualizarSala = (salaAtualizada) => {
    // A salaEditando agora contém a PK original (number e type)
    const { oldNumber, oldType } = salaEditando;

    // Verifica duplicidade com outras salas, exceto a que está sendo editada
    const duplicada = salas.some(
      (s) =>
        !(s.number === oldNumber && s.type.toLowerCase() === oldType.toLowerCase()) && // Não é o item original
        s.number === salaAtualizada.number &&
        s.type.toLowerCase() === salaAtualizada.type.toLowerCase()
    );
    if (duplicada) {
      alert("Já existe uma sala com esse número e tipo.");
      return;
    }

    const novaLista = salas.map((s) =>
      // Identifica a sala a ser atualizada pela PK antiga (number e type)
      s.number === oldNumber && s.type.toLowerCase() === oldType.toLowerCase()
        ? salaAtualizada
        : s
    );
    setSalas(novaLista);
    setSalaEditando(null);
    setMostrarForm(false);
  };

  const excluirSala = (salaParaExcluir) => { // Recebe o objeto completo
    if (window.confirm("Tem certeza que deseja excluir esta sala?")) {
      const novaLista = salas.filter(
        (s) => !(s.number === salaParaExcluir.number && s.type.toLowerCase() === salaParaExcluir.type.toLowerCase())
      );
      setSalas(novaLista);
    }
  };

  const iniciarEdicao = (sala) => {
    // Ao iniciar a edição, guarda os dados originais da sala para identificar no update
    setSalaEditando({
      ...sala,
      oldNumber: sala.number, // Guarda o número original
      oldType: sala.type,   // Guarda o tipo original
    });
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
            <th>Ações</th> {/* Adicionado Ações */}
          </tr>
        </thead>
        <tbody>
          {salas.map((d, index) => (
            // A key deve ser única, como number+type. Fallback para index se a PK composta não for única no local.
            <tr key={`${d.number}-${d.type}-${index}`} className="linha-sala">
              <td className="coluna-centro">{d.number}</td>
              <td className="coluna-centro">{d.type}</td>
              <td className="coluna-centro">
                <div className="botoes-acoes">
                  <button className="btn-acao" onClick={() => iniciarEdicao(d)}>
                    <FaEdit />
                  </button>
                  <button className="btn-acao" onClick={() => excluirSala(d)}>
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