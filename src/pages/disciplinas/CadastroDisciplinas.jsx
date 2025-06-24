import { useState, useEffect } from "react";

function CadastroDisciplinas({ onSave, onCancel, initialData }) {
  const [nome, setNome] = useState("");
  const [turno, setTurno] = useState("");
  const [carga, setCarga] = useState("");
  const [semestre_curso, setSemestreCurso] = useState("");
  const [curso, setCurso] = useState("");

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome);
      setTurno(initialData.turno);
      setCarga(initialData.carga);
      setSemestreCurso(initialData.semestre_curso);
      setCurso(initialData.curso);
    } else {
      setNome("");
      setTurno("");
      setCarga("");
      setSemestreCurso("");
      setCurso("");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !nome.trim() ||
      !turno.trim() ||
      !carga ||
      !semestre_curso ||
      !curso.trim()
    ) {
      alert("Preencha todos os campos!");
      return;
    }

    onSave({
      nome,
      turno,
      carga: parseInt(carga),
      semestre_curso: parseInt(semestre_curso),
      curso
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
          {initialData ? "Editar Disciplina" : "Cadastrar Disciplina"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label className="flex flex-col text-sm font-medium text-gray-700">
            Nome:
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome da disciplina"
              className="mt-1 p-2 border border-gray-300 rounded"
              // ReadOnly se estiver editando (PK não editável diretamente no form para evitar confusão)
              readOnly={!!initialData}
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Turno:
            <select
              value={turno}
              onChange={(e) => setTurno(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded"
              disabled={!!initialData} // Desabilita se estiver editando
            >
              <option value="">Selecione</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
            </select>
          </label>


          <label className="flex flex-col text-sm font-medium text-gray-700">
            Carga Horária:
            <input
              type="number"
              min={1}
              max={4}
              step={1}
              value={carga}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (value >= 1 && value <= 4 || e.target.value === "") {
                  setCarga(e.target.value);
                }
              }}
              placeholder="Carga horária (1 a 4)"
              className="mt-1 p-2 border border-gray-300 rounded"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Semestre:
            <input
              type="number"
              min={1}
              max={6}
              step={1}
              value={semestre_curso}
              onChange={(e) => {
                const value = setSemestreCurso(e.target.value, 10);
                if (value >= 1 && value <= 6 || e.target.value === "") {
                  setSemestreCurso(value);
                }
              }}
              placeholder="Semestre"
              className="mt-1 p-2 border border-gray-300 rounded"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Curso:
            <input
              type="text"
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
              placeholder="Curso"
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

export default CadastroDisciplinas;