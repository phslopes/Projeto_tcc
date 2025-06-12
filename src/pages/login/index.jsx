import { useState } from "react";
import "./LoginPage.css";
import imgFatec from "../../assets/imgFatec.png";//para importar a imagem do assets
import { useNavigate } from "react-router-dom"; //para redirecionar o usuario para outra pagina

function LoginPage() {
    const navigate = useNavigate();//hook
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmitt = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const response = await fetch('http://localhost:3001/api/auth/login', { // Endpoint do seu backend
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Se a resposta não for OK (ex: 400, 401), lança um erro
                throw new Error(data.message || "Erro ao tentar fazer login.");
            }

            // Login bem-sucedido: armazena token e role
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.role); // Armazena o papel do usuário

            // Redireciona com base no papel do usuário
            switch (data.role) {
                case "admin":
                    navigate("/admin");
                    break;
                case "aluno":
                    navigate("/aluno");
                    break;
                case "professor":
                    navigate("/professor");
                    break;
                default:
                    setError("Papel de usuário desconhecido.");
                    // Opcional: Redirecionar para uma página de erro ou home default
                    navigate("/");
            }

        } catch (err) {
            console.error("Login failed:", err);
            setError(err.message || "Ocorreu um erro inesperado. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

return (
    <div className="login-page">
        <div className="login-container">
            <div className="login-header">
                <h1>Sistema de Reserva de Salas de Aula</h1>
            </div>

            <div className="login-card">
                <img src={imgFatec} alt="Logo" className="login-logo" />
                <p className="login-description">Entre com seus dados para acessar</p>

                <form onSubmit={handleSubmitt} className="login-form">

                    <div className="login-field">
                        <label htmlFor="username">Email</label>
                        <input
                            id="username"
                            type="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Entre com seu email"
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="password">Senha</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Entre com sua senha"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {error && <p className="login-error">{error}</p>}

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? "Entrando..." : "Entrar"}
                    </button>

                </form>

                <div className="login-footer">
                    <p>Dica: Os usuarios só podem ser cadastrados pelos desenvolvedores do site</p>
                </div>
            </div>
        </div>
    </div>
);
}

export default LoginPage;
