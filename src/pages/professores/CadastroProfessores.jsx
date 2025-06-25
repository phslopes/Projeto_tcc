import { useState, useEffect } from "react";

function CadastroProfessores({ onSave, onCancel, initialData }) {
  const [id_professor, setIdProfessor] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [erros, setErros] = useState({});

  useEffect(() => {
    if (initialData) {
      setIdProfessor(initialData.id_professor);
      setNome(initialData.nome);
      setTelefone(initialData.telefone);
      setEmail(initialData.email);
    } else {

      setIdProfessor("");
      setNome("");
      setTelefone("");
      setEmail("");
    }
  }, [initialData]);

  function formatarTelefone(valor) {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length <= 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
    } else {
      return numeros.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
    }
  }

  function validarEmail(email) {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const novosErros = {};
    if (!nome.trim()) novosErros.nome = "Nome obrigatório.";
    if (!telefone.trim() || telefone.replace(/\D/g, "").length < 10) novosErros.telefone = "Telefone válido obrigatório.";
    if (!email.trim() || !validarEmail(email)) novosErros.email = "E-mail válido obrigatório.";
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) return;

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
          <label className="flex flex-col text-sm font-medium text-gray-700">
            Nome:
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do professor"
              className="mt-1 p-2 border border-gray-300 rounded"
            />
            {erros.nome && <span className="text-red-600 text-xs mt-1">{erros.nome}</span>}
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Telefone:
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
              placeholder="(99) 99999-9999"
              className="mt-1 p-2 border border-gray-300 rounded"
              maxLength={15}
            />
            {erros.telefone && <span className="text-red-600 text-xs mt-1">{erros.telefone}</span>}
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Informe o email"
              className="mt-1 p-2 border border-gray-300 rounded"
            />
            {erros.email && <span className="text-red-600 text-xs mt-1">{erros.email}</span>}
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