import { useState } from "react";
import "./LoginPage.css"; 

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Simulação de autenticação
        setTimeout(() => { //set timeout para simular o tempo de resposta do servidor 500ms
            if (username == ("admin")) {
                alert("Login como ADMIN!"); // simula redirecionamento
            } else {
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
                    <h2 className="login-title">Login</h2>
                    <p className="login-description">Entre com seus dados para acessar</p>

                    <form onSubmit={handleSubmit} className="login-form">

                        <div className="login-field">
                            <label htmlFor="username">Email</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                                // autoComplete="username"
                            />
                        </div>
                        
                        <div className="login-field">
                            <label htmlFor="password">Senha</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                // autoComplete="current-password"
                            />
                        </div>

                        {error && <p className="login-error">{error}</p>}
                        <button type="submit" className="login-button" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Dica: No momento só existe um login de usuario "admin"</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
