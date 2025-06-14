// src/pages/Alocacoes/CadastroAlocacao.jsx
import { useState, useEffect } from "react";

function CadastroAlocacao({ onSave, onCancel, initialData }) {
  const [numero_sala, setNumeroSala] = useState("");
  const [tipo_sala, setTipoSala] = useState("");
  const [id_professor, setIdProfessor] = useState("");
  const [nome, setNome] = useState(""); // Nome da disciplina
  const [turno, setTurno] = useState(""); // Turno da disciplina
  const [ano, setAno] = useState("");
  const [semestre_alocacao, setSemestreAlocacao] = useState("");
  const [tipo_alocacao, setTipoAlocacao] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (initialData) {
      // Carrega os dados para edição
      setNumeroSala(initialData.numero_sala);
      setTipoSala(initialData.tipo_sala);
      setIdProfessor(initialData.id_professor);
      setNome(initialData.nome);
      setTurno(initialData.turno);
      setAno(initialData.ano);
      setSemestreAlocacao(initialData.semestre_alocacao);
      setTipoAlocacao(initialData.tipo_alocacao);
      setStatus(initialData.status);
    } else {
      // Limpa os campos para novo cadastro
      setNumeroSala("");
      setTipoSala("");
      setIdProfessor("");
      setNome("");
      setTurno("");
      setAno("");
      setSemestreAlocacao("");
      setTipoAlocacao("");
      setStatus("");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !numero_sala || !tipo_sala.trim() || !id_professor ||
      !nome.trim() || !turno.trim() || !ano || !semestre_alocacao ||
      !tipo_alocacao.trim() || !status.trim()
    ) {
      alert("Preencha todos os campos!");
      return;
    }

    onSave({
      numero_sala: parseInt(numero_sala),
      tipo_sala,
      id_professor: parseInt(id_professor),
      nome,
      turno,
      ano: parseInt(ano),
      semestre_alocacao: parseInt(semestre_alocacao),
      tipo_alocacao,
      status,
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
          {initialData ? "Editar Alocação" : "Cadastrar Alocação"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label className="flex flex-col text-sm font-medium text-gray-700">
            Número da Sala:
            <input
              type="number"
              value={numero_sala}
              onChange={(e) => setNumeroSala(e.target.value)}
              placeholder="Número da Sala"
              className="mt-1 p-2 border border-gray-300 rounded"
              min="1"
              readOnly={initialData ? true : false} // Não permite mudar PK na edição
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Tipo da Sala:
            <select
              value={tipo_sala}
              onChange={(e) => setTipoSala(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded"
              readOnly={initialData ? true : false} // Não permite mudar PK na edição
            >
              <option value="">Selecione o tipo</option>
              <option value="sala">Sala</option>
              <option value="laboratorio">Laboratório</option>
            </select>
          </label>

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
            Tipo de Alocação:
            <select
              value={tipo_alocacao}
              onChange={(e) => setTipoAlocacao(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded"
            >
              <option value="">Selecione o tipo</option>
              <option value="esporadico">Esporádico</option>
              <option value="fixo">Fixo</option>
            </select>
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Status:
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded"
            >
              <option value="">Selecione o status</option>
              <option value="confirmada">Confirmada</option>
              <option value="pendente">Pendente</option>
              <option value="cancelada">Cancelada</option>
            </select>
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

export default CadastroAlocacao;