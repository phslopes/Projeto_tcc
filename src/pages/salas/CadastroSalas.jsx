import { useState, useEffect } from "react";

function CadastroSalas({ onSave, onCancel, initialData }) {
  const [number, setNumber] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (initialData) {
      setNumber(initialData.number ? String(initialData.number) : "");
      setType(initialData.type ? initialData.type.toLowerCase() : "");
    } else {
      // Limpa os campos quando não há initialData (novo cadastro)
      setNumber("");
      setType("");
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!number || number.trim() === "") {
      alert("Preencha o número da sala!");
      return;
    }
    
    if (!type || type === "") {
      alert("Selecione o tipo da sala!");
      return;
    }
    
    // Debug dos valores enviados
    console.log("Enviando:", { number, type });
    onSave({ 
      number: parseInt(number), 
      type: type.toLowerCase() 
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
          {initialData ? "Editar Sala" : "Cadastrar Sala"}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label className="flex flex-col text-sm font-medium text-gray-700">
            Número da Sala:
            <input
              type="text"
              value={number}
              inputMode="numeric"
              onChange={(e) => {
                // Garante que o campo nunca fique vazio ao editar
                const value = e.target.value.replace(/\D/g, "");
                setNumber(value);
              }}
              placeholder="Número da sala"
              className="mt-1 p-2 border border-gray-300 rounded"
            />
          </label>

          <label className="flex flex-col text-sm font-medium text-gray-700">
            Tipo:
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded"
            >
              <option value="">Selecione o tipo</option>
              <option value="sala">Sala</option>
              <option value="laboratorio">Laboratório</option>
            </select>
          </label>

          <button
            type="submit"
            className="w-full mt-2 bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!number || !type}
          >
            SALVAR
          </button>
        </form>
      </div>
    </div>
  );
}

export default CadastroSalas;