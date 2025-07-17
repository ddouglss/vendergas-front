import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api'; // Supondo que 'api' é sua instância do Axios ou fetch configurado
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/usuarios/login', {
                email,
                password: senha,
            });

            console.log("Dados recebidos da API de login:", response.data);

            login({
                token: response.data.token,
                id: response.data.user.id,
                nome: response.data.user.nome,
                email: response.data.user.email,
                role: response.data.user.role,
            });

            navigate('/empresas');
        } catch (error) {
            alert('Erro ao fazer login. Verifique suas credenciais.');
            console.error('Erro de login:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                />
                <button type="submit">Entrar</button>
                <p style={{ marginTop: 15, textAlign: 'center' }}>
                    Não tem conta? <Link to="/cadastrar">Cadastre-se aqui</Link>
                </p>
            </form>
        </div>
    );
}