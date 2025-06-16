// src/pages/Alocacoes/index.jsx
import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import CadastroAlocacao from "./CadastroAlocacao"; // Vamos criar este componente de formulário
import "./AlocacoesPage.css"; // Vamos criar este CSS também

function AlocacoesPage() {
  const [alocacoes, setAlocacoes] = useState([]); // Agora representa os registros da tabela alocacao
  const [mostrarForm, setMostrarForm] = useState(false);
  const [alocacaoEditando, setAlocacaoEditando] = useState(null);

  const adicionarAlocacao = (novaAlocacao) => {
    // A unicidade é baseada na chave composta da tabela alocacao:
    // (numero_sala, tipo_sala, id_professor, nome, turno, ano, semestre_alocacao)
    const duplicado = alocacoes.some(
      (alocacao) =>
        alocacao.numero_sala === novaAlocacao.numero_sala &&
        alocacao.tipo_sala.toLowerCase() === novaAlocacao.tipo_sala.toLowerCase() &&
        alocacao.id_professor === novaAlocacao.id_professor &&
        alocacao.nome === novaAlocacao.nome &&
        alocacao.turno === novaAlocacao.turno &&
        alocacao.ano === novaAlocacao.ano &&
        alocacao.semestre_alocacao === novaAlocacao.semestre_alocacao
    );

    if (duplicado) {
      alert("Esta alocação (Sala, Professor, Disciplina, Ano, Semestre) já existe.");
      return;
    }
    setAlocacoes([...alocacoes, novaAlocacao]);
    setMostrarForm(false);
  };

  const atualizarAlocacao = (alocacaoAtualizada) => {
    // A chave primária antiga é necessária para encontrar e atualizar o item correto
    const {
      oldNumeroSala, oldTipoSala, oldIdProfessor,
      oldNome, oldTurno, oldAno, oldSemestreAlocacao
    } = alocacaoEditando;

    // Verifica se a nova PK conflita com outras existentes (exceto a original)
    const duplicado = alocacoes.some(
      (alocacao) =>
        !(
          alocacao.numero_sala === oldNumeroSala &&
          alocacao.tipo_sala.toLowerCase() === oldTipoSala.toLowerCase() &&
          alocacao.id_professor === oldIdProfessor &&
          alocacao.nome === oldNome &&
          alocacao.turno === oldTurno &&
          alocacao.ano === oldAno &&
          alocacao.semestre_alocacao === oldSemestreAlocacao
        ) && // Garante que não é o próprio item que está sendo editado
        alocacao.numero_sala === alocacaoAtualizada.numero_sala &&
        alocacao.tipo_sala.toLowerCase() === alocacaoAtualizada.tipo_sala.toLowerCase() &&
        alocacao.id_professor === alocacaoAtualizada.id_professor &&
        alocacao.nome === alocacaoAtualizada.nome &&
        alocacao.turno === alocacaoAtualizada.turno &&
        alocacao.ano === alocacaoAtualizada.ano &&
        alocacao.semestre_alocacao === alocacaoAtualizada.semestre_alocacao
    );

    if (duplicado) {
      alert("Os novos dados de alocação (Sala, Professor, Disciplina, Ano, Semestre) já existem.");
      return;
    }

    const novaLista = alocacoes.map((alocacao) =>
      alocacao.numero_sala === oldNumeroSala &&
      alocacao.tipo_sala.toLowerCase() === oldTipoSala.toLowerCase() &&
      alocacao.id_professor === oldIdProfessor &&
      alocacao.nome === oldNome &&
      alocacao.turno === oldTurno &&
      alocacao.ano === oldAno &&
      alocacao.semestre_alocacao === oldSemestreAlocacao
        ? alocacaoAtualizada
        : alocacao
    );
    setAlocacoes(novaLista);
    setAlocacaoEditando(null);
    setMostrarForm(false);
  };

  const excluirAlocacao = (alocacaoParaExcluir) => {
    if (window.confirm("Tem certeza que deseja excluir esta alocação?")) {
      const novaLista = alocacoes.filter(
        (alocacao) =>
          !(
            alocacao.numero_sala === alocacaoParaExcluir.numero_sala &&
            alocacao.tipo_sala.toLowerCase() === alocacaoParaExcluir.tipo_sala.toLowerCase() &&
            alocacao.id_professor === alocacaoParaExcluir.id_professor &&
            alocacao.nome === alocacaoParaExcluir.nome &&
            alocacao.turno === alocacaoParaExcluir.turno &&
            alocacao.ano === alocacaoParaExcluir.ano &&
            alocacao.semestre_alocacao === alocacaoParaExcluir.semestre_alocacao
          )
      );
      setAlocacoes(novaLista);
    }
  };

  const iniciarEdicao = (alocacao) => {
    // Ao iniciar a edição, armazena a PK antiga para identificação no update
    setAlocacaoEditando({
      ...alocacao,
      oldNumeroSala: alocacao.numero_sala,
      oldTipoSala: alocacao.tipo_sala,
      oldIdProfessor: alocacao.id_professor,
      oldNome: alocacao.nome,
      oldTurno: alocacao.turno,
      oldAno: alocacao.ano,
      oldSemestreAlocacao: alocacao.semestre_alocacao,
    });
    setMostrarForm(true);
  };

  return (
    <div className="container-alocacoes">
      <div className="header-alocacoes">
        <h2>Lista de Alocações</h2>
        <button
          className="btn-add"
          onClick={() => {
            setAlocacaoEditando(null);
            setMostrarForm(true);
          }}
        >
          NOVA ALOCAÇÃO
        </button>
      </div>

      <table className="table-alocacoes">
        <thead>
          <tr className="header-linha">
            <th>Número Sala</th>
            <th>Tipo Sala</th>
            <th>ID Prof.</th>
            <th>Nome Disc.</th>
            <th>Turno Disc.</th>
            <th>Ano</th>
            <th>Semestre</th>
            <th>Tipo Aloc.</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {alocacoes.map((alocacao, index) => (
            // A key deve ser única, como a combinação da PK
            <tr key={`${alocacao.numero_sala}-${alocacao.tipo_sala}-${alocacao.id_professor}-${alocacao.nome}-${alocacao.turno}-${alocacao.ano}-${alocacao.semestre_alocacao}-${index}`}>
              <td>{alocacao.numero_sala}</td>
              <td>{alocacao.tipo_sala}</td>
              <td>{alocacao.id_professor}</td>
              <td>{alocacao.nome}</td>
              <td>{alocacao.turno}</td>
              <td>{alocacao.ano}</td>
              <td>{alocacao.semestre_alocacao}</td>
              <td>{alocacao.tipo_alocacao}</td>
              <td>{alocacao.status}</td>
              <td>
                <button className="btn-acao" onClick={() => iniciarEdicao(alocacao)}>
                  <FaEdit />
                </button>
                <button className="btn-acao" onClick={() => excluirAlocacao(alocacao)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarForm && (
        <CadastroAlocacao
          onSave={alocacaoEditando ? atualizarAlocacao : adicionarAlocacao}
          onCancel={() => {
            setMostrarForm(false);
            setAlocacaoEditando(null);
          }}
          initialData={alocacaoEditando}
        />
      )}
    </div>
  );
}

export default AlocacoesPage;