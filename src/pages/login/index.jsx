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

    const handleSubmitt = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Simulação de autenticação
        setTimeout(() => { //set timeout para simular o tempo de resposta do servidor 500ms
            if (username == ("admin")) {
                navigate("/admin");
                alert("Login como ADMIN!"); // simula redirecionamento
            }else if (username == ("aluno")) {
                navigate("/aluno");
                alert("Login como ALUNO!"); // simula redirecionamento
            } else if (username == ("professor")) {
                navigate("/professor");
                alert("Login como PROFESSOR!"); // simula redirecionamento
            }else {
                setError("Credenciais inválidas. Tente novamente.");
            }
            setIsLoading(false);
        }, 500);
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
                                type="text"
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
                                // required
                                autoComplete="current-password"
                            />
                        </div>

                        {error && <p className="login-error">{error}</p>}

                        <button type="submit" className="login-button" disabled={isLoading}>
                            {isLoading ? "Entrando..." : "Entrar"}
                        </button>

                    </form>

                    <div className="login-footer">
                        <p>Dica: Só existem os logins de usuario "admin, aluno, professor"</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
