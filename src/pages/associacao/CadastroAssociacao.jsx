import React, { useState } from "react";

function CadastroAssociacao({ onSave, onCancel }) {
  const cursos = ["Análise e Desenvolvimento de Sistemas"];
  const turnos = ["Vespertino"];
  const semestres = ["1º Semestre 2025"];

  const disciplinas = {
    "1º Semestre 2025": [
      "Arquitetura e Organização de Computadores",
      "Matemática Discreta",
      "Programação em Microinformática"
    ]
  };

  const professores = {
    "Arquitetura e Organização de Computadores": ["Ulisses Ribeiro"],
    "Matemática Discreta": ["Fernando Cachucho"],
    "Programação em Microinformática": ["Rita Félix"]
  };

  const salasDisponiveis = {
    "Arquitetura e Organização de Computadores": ["Sala 06"],
    "Matemática Discreta": ["Sala 06"],
    "Programação em Microinformática": ["Sala 06"]
  };

  const [form, setForm] = useState({
    curso: "",
    turno: "",
    semestre: "",
    disciplina: "",
    professor: "",
    sala: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(form).some((v) => !v)) {
      alert("Preencha todos os campos.");
      return;
    }
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onCancel} className="close-button">×</button>
        <h3>Nova Associação</h3>
        <form onSubmit={handleSubmit} className="form-associacao">
          <div className="linha-campos">
            <label>
              Curso:
              <select name="curso" value={form.curso} onChange={handleChange}>
                <option value="">Selecione</option>
                {cursos.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>

            <label>
              Turno:
              <select name="turno" value={form.turno} onChange={handleChange}>
                <option value="">Selecione</option>
                {turnos.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>

            <label>
              Semestre:
              <select name="semestre" value={form.semestre} onChange={handleChange}>
                <option value="">Selecione</option>
                {semestres.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Disciplina:
            <select name="disciplina" value={form.disciplina} onChange={handleChange}>
              <option value="">Selecione</option>
              {(disciplinas[form.semestre] || []).map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>

          <label>
            <h2 class="text-2xl font-bold mb-4 text-center">Horário</h2>
          </label>

          <div className="linha-campos">
            <label>
              Professor:
              <select name="professor" value={form.professor} onChange={handleChange}>
                <option value="">Selecione</option>
                {(professores[form.disciplina] || []).map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>

            <label>
              Sala:
              <select name="sala" value={form.sala} onChange={handleChange}>
                <option value="">Selecione</option>
                {(salasDisponiveis[form.disciplina] || []).map((sala) => {
                  return <option key={sala}>{sala}</option>;
                })}
              </select>
            </label>
          </div>

          <button type="submit" className="btn-vermelho">SALVAR</button>
        </form>

      </div>
    </div>
  );
}

export default CadastroAssociacao;
