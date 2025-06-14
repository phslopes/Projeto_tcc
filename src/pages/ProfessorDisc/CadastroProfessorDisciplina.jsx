// src/pages/ProfessorDisc/CadastroProfessorDisciplina.jsx
import { useState, useEffect } from "react";

function CadastroProfessorDisciplina({ onSave, onCancel, initialData }) {
  const [id_professor, setIdProfessor] = useState("");
  const [nome, setNome] = useState(""); // Nome da disciplina
  const [turno, setTurno] = useState(""); // Turno da disciplina
  const [ano, setAno] = useState("");
  const [semestre_alocacao, setSemestreAlocacao] = useState("");
  const [dia_semana, setDiaSemana] = useState("");
  const [hora_inicio, setHoraInicio] = useState("");

  useEffect(() => {
    if (initialData) {
      // Carrega os dados para edição
      setIdProfessor(initialData.id_professor);
      setNome(initialData.nome);
      setTurno(initialData.turno);
      setAno(initialData.ano);
      setSemestreAlocacao(initialData.semestre_alocacao);
      setDiaSemana(initialData.dia_semana);
      setHoraInicio(initialData.hora_inicio);
    } else {
      // Limpa os campos para novo cadastro
      setIdProfessor("");
      setNome("");
      setTurno("");
      setAno("");
      setSemestreAlocacao("");
      setDiaSemana("");
      setHoraInicio("");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !id_professor || !nome.trim() || !turno.trim() || !ano || !semestre_alocacao ||
      !dia_semana || !hora_inicio.trim()
    ) {
      alert("Preencha todos os campos!");
      return;
    }

    onSave({
      id_professor: parseInt(id_professor),
      nome,
      turno,
      ano: parseInt(ano),
      semestre_alocacao: parseInt(semestre_alocacao),
      dia_semana: parseInt(dia_semana),
      hora_inicio,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative animate-fade-in-up">
        <button
          onClick={onCancel}
          className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-red-600 transition-colors"
        >
          ×
        </button>
        <h3 className="text-xl font-bold mb-4 text-center">
          {initialData ? "Editar Agendamento" : "Cadastrar Agendamento Professor-Disciplina"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label className="flex flex-col text-sm font-medium text-gray-700">
            ID Professor:
            <input
              type="number"
              value={id_professor}
              onChange={(e) => setIdProfessor(e.target.value)}
              placeholder="ID do Professor"
              className="mt-1 p-2 border border-gray-300 rounded"
              min="1"
              readOnly={initialData ? true : false} // Não permite mudar PK na edição
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Nome Disciplina:
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome da Disciplina"
              className="mt-1 p-2 border border-gray-300 rounded"
              readOnly={initialData ? true : false} // Não permite mudar PK na edição
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Turno Disciplina:
            <select
              value={turno}
              onChange={(e) => setTurno(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded"
              readOnly={initialData ? true : false} // Não permite mudar PK na edição
            >
              <option value="">Selecione o turno</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
            </select>
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Ano:
            <input
              type="number"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              placeholder="Ano (ex: 2024)"
              className="mt-1 p-2 border border-gray-300 rounded"
              min="1900"
              max="2100"
              readOnly={initialData ? true : false} // Não permite mudar PK na edição
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Semestre Alocação:
            <input
              type="number"
              value={semestre_alocacao}
              onChange={(e) => setSemestreAlocacao(e.target.value)}
              placeholder="Semestre (1 ou 2)"
              className="mt-1 p-2 border border-gray-300 rounded"
              min="1"
              max="2"
              readOnly={initialData ? true : false} // Não permite mudar PK na edição
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Dia da Semana (1 a 7):
            <input
              type="number"
              value={dia_semana}
              onChange={(e) => setDiaSemana(e.target.value)}
              placeholder="Dia (1=Dom, 7=Sáb)"
              className="mt-1 p-2 border border-gray-300 rounded"
              min="1"
              max="7"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Hora de Início:
            <input
              type="time"
              value={hora_inicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded"
            />
          </label>

          <button
            type="submit"
            className="w-full mt-2 bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700 transition-all"
          >
            SALVAR
          </button>
        </form>
      </div>
    </div>
  );
}

export default CadastroProfessorDisciplina;