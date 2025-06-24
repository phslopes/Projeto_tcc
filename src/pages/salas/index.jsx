import React, { useState, useEffect } from "react";
import CadastroSalas from "./CadastroSalas";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./SalasPage.css";
import { api } from "../../utils/api";

function SalasPage() {
  const [salas, setSalas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [salaEditando, setSalaEditando] = useState(null);
  const [loading, setLoading] = useState(false);

  // Buscar salas ao carregar
  useEffect(() => {
    fetchSalas();
  }, []);

  const fetchSalas = async () => {
    setLoading(true);
    try {
      const data = await api.get("/rooms");
      setSalas(data);
    } catch (err) {
      alert("Erro ao buscar salas: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar sala via API
  const adicionarSala = async (sala) => {
    try {
      await api.post("/rooms", {
        numero_sala: sala.number,
        tipo_sala: sala.type.toLowerCase(),
      });
      fetchSalas();
      setMostrarForm(false);
    } catch (err) {
      alert("Erro ao cadastrar sala: " + err.message);
    }
  };

  // Atualizar sala via API
  const atualizarSala = async (salaAtualizada) => {
    if (!salaEditando) return;
    try {
      await api.put(
        `/rooms/${salaEditando.oldNumber}/${salaEditando.oldType.toLowerCase()}`,
        {
          numero_sala: salaAtualizada.number,
          tipo_sala: salaAtualizada.type.toLowerCase(),
          status: "livre", // ou mantenha o status atual se quiser buscar antes
        }
      );
      fetchSalas();
      setSalaEditando(null);
      setMostrarForm(false);
    } catch (err) {
      alert("Erro ao atualizar sala: " + err.message);
    }
  };

  // Excluir sala via API
  const excluirSala = async (salaParaExcluir) => {
    if (window.confirm("Tem certeza que deseja excluir esta sala?")) {
      try {
        await api.delete(
          `/rooms/${salaParaExcluir.number}/${salaParaExcluir.type.toLowerCase()}`
        );
        fetchSalas();
      } catch (err) {
        alert("Erro ao excluir sala: " + err.message);
      }
    }
  };

  // Função para editar sala
  const handleEditarSala = (sala) => {
    setSalaEditando({
      oldNumber: sala.numero_sala,
      oldType: sala.tipo_sala,
      number: sala.numero_sala,
      type: sala.tipo_sala,
    });
    setMostrarForm(true);
  };

  return (
    <div className="container-salas">
      <div className="header-salas">
        <h2>Lista de Salas</h2>
        <button
          className="btn-add"
          onClick={() => {
            setSalaEditando(null);
            setMostrarForm(true);
          }}
        >
          NOVA SALA
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="table-salas">
          <thead>
            <tr>
              <th>Número</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {salas.map((d, index) => (
              <tr key={`${d.numero_sala}-${d.tipo_sala}-${index}`}>
                <td>{d.numero_sala}</td>
                <td>{d.tipo_sala}</td>
                <td className="coluna-acoes">
                  <button
                    className="btn-acao-edit"
                    onClick={() => handleEditarSala(d)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-acao-delete"
                    onClick={() =>
                      excluirSala({ number: d.numero_sala, type: d.tipo_sala })
                    }
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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