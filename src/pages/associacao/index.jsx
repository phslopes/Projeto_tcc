import React, { useState } from "react";
import CadastroAssociacao from "./CadastroAssociacao";
import "./AssociacaoPage.css";

function AssociacaoPage() {
  const [associacoes, setAssociacoes] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(null);

  const adicionarOuEditarAssociacao = (dados) => {
    if (editandoIndex !== null) {
      const atualizadas = [...associacoes];
      atualizadas[editandoIndex] = dados;
      setAssociacoes(atualizadas);
    } else {
      setAssociacoes([...associacoes, dados]);
    }
    setMostrarForm(false);
    setEditandoIndex(null);
  };

  const confirmarExcluir = (index) => {
    setConfirmandoExclusao(index);
  };

  const excluirAssociacao = () => {
    const atualizadas = associacoes.filter((_, i) => i !== confirmandoExclusao);
    setAssociacoes(atualizadas);
    setConfirmandoExclusao(null);
  };

  const iniciarEdicao = (index) => {
    setEditandoIndex(index);
    setMostrarForm(true);
  };

  return (
    <div className="container-associacao">
      <div className="header-associacao">
        <h2>Associações Cadastradas</h2>
        <button className="btn-add" onClick={() => {
          setMostrarForm(true);
          setEditandoIndex(null);
        }}>
          NOVA ASSOCIAÇÃO
        </button>
      </div>

      <div className="grade">
        {associacoes.map((item, index) => (
          <div className="bloco" key={index}>
            <div className="cabecalho-bloco">
              <strong>{item.semestre}</strong>
            </div>
            <div className="conteudo-bloco">
              {item.disciplina}<br />
              <small>{item.professor}</small><br />
              <strong>{item.sala}</strong>
              <div className="acoes">
                <button onClick={() => iniciarEdicao(index)} className="btn-editar">✎</button>
                <button onClick={() => confirmarExcluir(index)} className="btn-excluir">🗑</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mostrarForm && (
        <CadastroAssociacao
          onSave={adicionarOuEditarAssociacao}
          onCancel={() => {
            setMostrarForm(false);
            setEditandoIndex(null);
          }}
          dadosIniciais={editandoIndex !== null ? associacoes[editandoIndex] : null}
        />
      )}

      {confirmandoExclusao !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Deseja realmente excluir esta associação?</p>
            <div className="botoes-confirmar">
              <button className="btn-vermelho" onClick={excluirAssociacao}>Sim, excluir</button>
              <button onClick={() => setConfirmandoExclusao(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssociacaoPage;
