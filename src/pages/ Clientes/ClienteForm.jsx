import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './ClientesPage.css';

export default function ClienteForm({ clienteEditado, onSuccess }) {
    const { user } = useContext(AuthContext);
    const [nome, setNome] = useState(clienteEditado?.nome || '');
    const [email, setEmail] = useState(clienteEditado?.email || '');
    const [telefone, setTelefone] = useState(clienteEditado?.telefone || '');
    const [endereco, setEndereco] = useState(clienteEditado?.endereco || '');
    const [empresaId, setEmpresaId] = useState(clienteEditado?.empresa || '');
    const [empresas, setEmpresas] = useState([]);

    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState('');

    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

    useEffect(() => {
        if (isAdmin) {
            axios.get('https://vendergas.up.railway.app/api/empresas', {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })
                .then(res => {
                    setEmpresas(res.data.data);
                })
                .catch(err => {
                    console.error("Erro ao buscar empresas:", err.response?.data || err.message);
                });
        } else {
            setEmpresaId(user?.empresaId);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensagem('');

        const payload = {
            nome,
            email,
            telefone,
            endereco,
            empresa: isAdmin ? empresaId : user?.empresaId
        };

        try {
            if (clienteEditado) {
                await axios.put(`https://vendergas.up.railway.app/api/clientes/${clienteEditado._id}`, payload, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setMensagem('Cliente atualizado com sucesso!');
            } else {
                await axios.post('https://vendergas.up.railway.app/api/clientes', payload, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setMensagem('Cliente cadastrado com sucesso!');
            }

            onSuccess(); // Atualiza a lista e fecha o formulário
        } catch (err) {
            console.error('Erro ao salvar cliente:', err.response?.data || err.message);
            alert('Erro ao salvar cliente');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="cliente-form" noValidate>
            <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Nome"
                required
            />
            <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="tel"
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
                placeholder="Telefone"
                required
            />
            <input
                type="text"
                value={endereco}
                onChange={e => setEndereco(e.target.value)}
                placeholder="Endereço"
                required
            />

            {isAdmin && (
                <>
                    <label htmlFor="empresa">Empresa</label>
                    <select
                        id="empresa"
                        value={empresaId}
                        onChange={e => setEmpresaId(e.target.value)}
                        required
                    >
                        <option value="">Selecione uma empresa</option>
                        {empresas.map(emp => (
                            <option key={emp._id} value={emp._id}>
                                {emp.nomeFantasia}
                            </option>
                        ))}
                    </select>
                </>
            )}

            <button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : clienteEditado ? 'Atualizar' : 'Cadastrar'}
            </button>

            {mensagem && <p className="mensagem-sucesso">{mensagem}</p>}
        </form>

    );
}
