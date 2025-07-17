import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ClienteForm from './ClienteForm';
import { AuthContext } from '../../context/AuthContext';
import './ClientesPage.css';

export default function ClientesPage() {
    const { user } = useContext(AuthContext);
    const [clientes, setClientes] = useState([]);
    const [formVisivel, setFormVisivel] = useState(false);
    const [clienteEditado, setClienteEditado] = useState(null);

    const carregarClientes = async (empresaId) => {
        try {
            const res = await axios.get(`https://vendergas.up.railway.app/api/clientes/empresa/${empresaId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            setClientes(res.data.data);
        } catch (err) {
            console.error('Erro ao buscar clientes:', err);
        }
    };


    useEffect(() => {
        if (user?.role === 'admin' || user?.role === 'superadmin') {
            // Admins podem gerenciar clientes de múltiplas empresas
            axios.get('https://vendergas.up.railway.app/api/empresas', {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }).then(res => {
                const empresas = res.data.data;
                if (empresas.length > 0) {
                    // Carrega clientes da primeira empresa como padrão
                    carregarClientes(empresas[0]._id);
                }
            }).catch(err => {
                console.error('Erro ao carregar empresas para admin:', err);
            });
        } else if (user?.empresaId) {
            // Usuários comuns
            carregarClientes(user.empresaId);
        }
    }, [user]);


    const excluirCliente = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;
        try {
        if(user.role === 'admin' || user.role === 'superadmin') {
            axios.delete(`https://vendergas.up.railway.app/api/clientes/${id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })
        }
            carregarClientes();
        }  catch (err) {
            console.error('Erro ao excluir cliente:', err);
            console.error('Axios error details:', err.response);
        }


    };

    return (
        <div className="clientes-container">
            <h2>Gerenciamento de Clientes</h2>
            <button className="btn-novo" onClick={() => { setClienteEditado(null); setFormVisivel(true); }}>
                + Novo Cliente
            </button>

            {formVisivel && (
                <ClienteForm
                    clienteEditado={clienteEditado}
                    onSuccess={() => {
                        setFormVisivel(false);
                        setClienteEditado(null);
                        carregarClientes();
                    }}
                />
            )}

            <ul className="clientes-lista">
                {clientes.map((cliente) => (
                    <li key={cliente._id} className="cliente-item">
                        <strong>{cliente.nome}</strong> – {cliente.email} – {cliente.telefone}
                        <button className="btn-editar" onClick={() => { setClienteEditado(cliente); setFormVisivel(true); }}>
                            Editar
                        </button>
                        <button className="btn-excluir" onClick={() => excluirCliente(cliente._id)}>
                            Excluir
                        </button>
                    </li>
                ))}
            </ul>
        </div>

    );
}
