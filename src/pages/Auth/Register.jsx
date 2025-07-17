import { useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/usuarios/cadastrar', { nome, email, password: senha });
            login({ token: response.data.token, role: response.data.role });
            navigate('/empresas');
        } catch (err) {
            console.error(err);
            alert('Erro ao cadastrar usuário');
        }
    };

    const navigateToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>Cadastro</h2>
                <input
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                />
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
                <button type="submit">Cadastrar</button>

                <button
                    type="button"
                    onClick={navigateToLogin}
                    style={{
                        marginTop: '10px',
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Voltar para Login
                </button>
            </form>
        </div>
    );
}
