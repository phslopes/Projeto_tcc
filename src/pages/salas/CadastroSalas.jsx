import React, { useState, useEffect } from "react";
import "./SalasPage.css";

function CadastroSalas({ onSave, onCancel, initialData }) {
    const [number, setNumber] = useState("");
    const [type, setType] = useState("");

    useEffect(() => {
        if (initialData) {
            setNumber(initialData.number);
            setType(initialData.type);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!number.trim() || !type.trim()) {
            alert("Preencha todos os campos!");
            return;
        }
        onSave({ number, type });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onCancel}>X</button>
                <form onSubmit={handleSubmit} className="form-sala">
                    <label>
                        Número da sala:

                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={number}
                            onChange={(e) => {
                                const onlyNumbers = e.target.value.replace(/\D/g, "");
                                setNumber(onlyNumbers);
                            }}
                            placeholder="NÚMERO"
                        />
                    </label>
                    <label>
                        Tipo:

                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="">TIPO</option>
                            <option value="Sala">SALA</option>
                            <option value="Laboratório">LABORATÓRIO</option>
                        </select>
                    </label>
                    <button type="submit" className="btn-vermelho">CADASTRAR</button>
                </form>


            </div>
        </div>
    );
}

export default CadastroSalas;
