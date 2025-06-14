import { useState, useEffect } from "react";

function CadastroDisciplinas({ onSave, onCancel, initialData }) {
  const [nome, setNome] = useState("");
  const [turno, setTurno] = useState("");
  const [carga, setCarga] = useState("");
  const [semestre_curso, setSemestreCurso] = useState(""); // Nome corrigido para semestre_curso
  const [curso, setCurso] = useState("");

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome);
      setTurno(initialData.turno);
      setCarga(initialData.carga);
      setSemestreCurso(initialData.semestre_curso); // Nome corrigido
      setCurso(initialData.curso);
    } else {
      // Limpa os campos quando não há initialData (novo cadastro)
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
      !semestre_curso || // Campo corrigido
      !curso.trim()
    ) {
      alert("Preencha todos os campos!");
      return;
    }

    onSave({ nome, turno, carga: parseInt(carga), semestre_curso: parseInt(semestre_curso), curso }); // Garante que carga e semestre_curso são números
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
              // ReadOnly se estiver editando e o nome/turno for parte da PK (se não quiser que a PK mude)
              readOnly={initialData ? true : false}
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Turno:
            <select
              value={turno}
              onChange={(e) => setTurno(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded"
              // ReadOnly se estiver editando e o nome/turno for parte da PK
              readOnly={initialData ? true : false}
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
              value={carga}
              onChange={(e) => setCarga(e.target.value)}
              placeholder="Carga horária"
              className="mt-1 p-2 border border-gray-300 rounded"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Semestre:
            <input
              type="number"
              value={semestre_curso} // Campo corrigido
              onChange={(e) => setSemestreCurso(e.target.value)} // Campo corrigido
              placeholder="Semestre"
              min="1"
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