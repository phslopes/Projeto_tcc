import { useState, useEffect } from "react";

function CadastroProfessores({ onSave, onCancel, initialData }) {
  const [id_professor, setIdProfessor] = useState(""); // Novo estado para ID do professor (apenas para edição)
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");


  useEffect(() => {
    if (initialData) {
      setIdProfessor(initialData.id_professor); // Define o ID para edição
      setNome(initialData.nome);
      setTelefone(initialData.telefone);
      setEmail(initialData.email);
    } else {
      // Limpa os campos para novo cadastro
      setIdProfessor("");
      setNome("");
      setTelefone("");
      setEmail("");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !nome.trim() ||
      !telefone.trim() ||
      !email.trim()
    ) {
      alert("Preencha todos os campos!");
      return;
    }

    // Se for edição, inclui o id_professor no objeto
    const professorData = initialData ? { ...initialData, nome, telefone, email } : { nome, telefone, email };
    onSave(professorData);
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
          {initialData ? "Editar Cadastro" : "Cadastrar Professor"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {initialData && ( // Exibe o ID apenas em modo de edição
            <label className="flex flex-col text-sm font-medium text-gray-700">
              ID do Professor:
              <input
                type="text"
                value={id_professor}
                readOnly // ID não deve ser editável
                className="mt-1 p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
              />
            </label>
          )}

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Nome:
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do professor"
              className="mt-1 p-2 border border-gray-300 rounded"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Telefone:
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="Informe o telefone"
              className="mt-1 p-2 border border-gray-300 rounded"
              maxLength={11} // Limita o tamanho do telefone
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Email:
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Informe o email"
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

export default CadastroProfessores;