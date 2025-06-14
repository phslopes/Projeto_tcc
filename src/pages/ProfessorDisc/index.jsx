// src/pages/ProfessorDisc/index.jsx
import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import CadastroProfessorDisciplina from "./CadastroProfessorDisciplina"; // Vamos criar este componente de formulário
import "./ProfessorDiscPage.css"; // Vamos criar este CSS também

function ProfDiscPage() {
  const [agendamentos, setAgendamentos] = useState([]); // Agora representa os agendamentos na tabela professor_disciplina
  const [mostrarForm, setMostrarForm] = useState(false);
  const [agendamentoEditando, setAgendamentoEditando] = useState(null);

  const adicionarAgendamento = (novoAgendamento) => {
    // A unicidade é baseada na chave composta da tabela professor_disciplina:
    // (id_professor, nome_disciplina, turno_disciplina, ano, semestre_alocacao)
    const duplicado = agendamentos.some(
      (agendamento) =>
        agendamento.id_professor === novoAgendamento.id_professor &&
        agendamento.nome === novoAgendamento.nome &&
        agendamento.turno === novoAgendamento.turno &&
        agendamento.ano === novoAgendamento.ano &&
        agendamento.semestre_alocacao === novoAgendamento.semestre_alocacao
    );

    if (duplicado) {
      alert("Este agendamento (Professor, Disciplina, Turno, Ano, Semestre) já existe.");
      return;
    }
    setAgendamentos([...agendamentos, novoAgendamento]);
    setMostrarForm(false);
  };

  const atualizarAgendamento = (agendamentoAtualizado) => {
    // A chave primária antiga é necessária para encontrar e atualizar o item correto
    const { oldIdProfessor, oldNome, oldTurno, oldAno, oldSemestreAlocacao } = agendamentoEditando;

    // Verifica se a nova PK conflita com outras existentes (exceto a original)
    const duplicado = agendamentos.some(
      (agendamento) =>
        !(
          agendamento.id_professor === oldIdProfessor &&
          agendamento.nome === oldNome &&
          agendamento.turno === oldTurno &&
          agendamento.ano === oldAno &&
          agendamento.semestre_alocacao === oldSemestreAlocacao
        ) && // Não é o próprio item que está sendo editado
        agendamento.id_professor === agendamentoAtualizado.id_professor &&
        agendamento.nome === agendamentoAtualizado.nome &&
        agendamento.turno === agendamentoAtualizado.turno &&
        agendamento.ano === agendamentoAtualizado.ano &&
        agendamento.semestre_alocacao === agendamentoAtualizado.semestre_alocacao
    );

    if (duplicado) {
      alert("Os novos dados de agendamento (Professor, Disciplina, Turno, Ano, Semestre) já existem.");
      return;
    }

    const novaLista = agendamentos.map((agendamento) =>
      agendamento.id_professor === oldIdProfessor &&
      agendamento.nome === oldNome &&
      agendamento.turno === oldTurno &&
      agendamento.ano === oldAno &&
      agendamento.semestre_alocacao === oldSemestreAlocacao
        ? agendamentoAtualizado
        : agendamento
    );
    setAgendamentos(novaLista);
    setAgendamentoEditando(null);
    setMostrarForm(false);
  };

  const excluirAgendamento = (agendamentoParaExcluir) => {
    if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
      const novaLista = agendamentos.filter(
        (agendamento) =>
          !(
            agendamento.id_professor === agendamentoParaExcluir.id_professor &&
            agendamento.nome === agendamentoParaExcluir.nome &&
            agendamento.turno === agendamentoParaExcluir.turno &&
            agendamento.ano === agendamentoParaExcluir.ano &&
            agendamento.semestre_alocacao === agendamentoParaExcluir.semestre_alocacao
          )
      );
      setAgendamentos(novaLista);
    }
  };

  const iniciarEdicao = (agendamento) => {
    // Ao iniciar a edição, armazena a PK antiga para identificação no update
    setAgendamentoEditando({
      ...agendamento,
      oldIdProfessor: agendamento.id_professor,
      oldNome: agendamento.nome,
      oldTurno: agendamento.turno,
      oldAno: agendamento.ano,
      oldSemestreAlocacao: agendamento.semestre_alocacao,
    });
    setMostrarForm(true);
  };

  return (
    <div className="container-profdisc">
      <div className="header-profdisc">
        <h2>Associação Professor-Disciplina</h2>
        <button
          className="btn-add"
          onClick={() => {
            setAgendamentoEditando(null);
            setMostrarForm(true);
          }}
        >
          NOVA ASSOCIAÇÃO
        </button>
      </div>

      <table className="table-profdisc">
        <thead>
          <tr className="header-linha">
            <th>ID Prof.</th>
            <th>Nome Disc.</th>
            <th>Turno Disc.</th>
            <th>Ano</th>
            <th>Semestre</th>
            <th>Dia Semana</th>
            <th>Hora Início</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {agendamentos.map((agendamento, index) => (
            // A key deve ser única, como a combinação da PK
            <tr key={`${agendamento.id_professor}-${agendamento.nome}-${agendamento.turno}-${agendamento.ano}-${agendamento.semestre_alocacao}-${index}`}>
              <td>{agendamento.id_professor}</td>
              <td>{agendamento.nome}</td>
              <td>{agendamento.turno}</td>
              <td>{agendamento.ano}</td>
              <td>{agendamento.semestre_alocacao}</td>
              <td>{agendamento.dia_semana}</td>
              <td>{agendamento.hora_inicio}</td>
              <td>
                <button className="btn-acao" onClick={() => iniciarEdicao(agendamento)}>
                  <FaEdit />
                </button>
                <button className="btn-acao" onClick={() => excluirAgendamento(agendamento)}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarForm && (
        <CadastroProfessorDisciplina
          onSave={agendamentoEditando ? atualizarAgendamento : adicionarAgendamento}
          onCancel={() => {
            setMostrarForm(false);
            setAgendamentoEditando(null);
          }}
          initialData={agendamentoEditando}
        />
      )}
    </div>
  );
}

export default ProfDiscPage;