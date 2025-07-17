import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import ProdutoForm from './ProdutoForm';
import { AuthContext } from '../../context/AuthContext';
import './ProdutosPage.css';

export default function ProdutosPage() {
    const { user } = useContext(AuthContext);
    const [produtos, setProdutos] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [selectedEmpresaId, setSelectedEmpresaId] = useState('');
    const [formVisivel, setFormVisivel] = useState(false);
    const [produtoEditado, setProdutoEditado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const carregarProdutos = useCallback(async (empresaId) => {
        if (!user?.token || !empresaId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`https://vendergas.up.railway.app/api/produtos/${empresaId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setProdutos(res.data.data);
        } catch (err) {
            console.error('Erro ao carregar produtos:', err);
            setError('Erro ao carregar produtos. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }, [user?.token]);

    const carregarEmpresas = useCallback(async () => {
        if (!user?.token || (user.role !== 'admin' && user.role !== 'superadmin')) return;
        try {
            const res = await axios.get('https://vendergas.up.railway.app/api/empresas', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setEmpresas(res.data.data);
            if (res.data.data.length > 0 && !selectedEmpresaId) {
                setSelectedEmpresaId(res.data.data[0]._id);
            }
        } catch (err) {
            console.error('Erro ao carregar empresas:', err);
            setError('Erro ao carregar empresas para seleção.');
        }
    }, [user?.token, user?.role, selectedEmpresaId]);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        if (user.role === 'admin' || user.role === 'superadmin') {
            carregarEmpresas();
        } else if (user.empresaId) {
            setSelectedEmpresaId(user.empresaId);
        }
    }, [user, carregarEmpresas]);

    useEffect(() => {
        if (selectedEmpresaId) {
            carregarProdutos(selectedEmpresaId);
        }
    }, [selectedEmpresaId, carregarProdutos]);

    const excluirProduto = async (id) => {
        if (!window.confirm("Deseja mesmo excluir este produto?")) return;

        try {
            await axios.delete(`https://vendergas.up.railway.app/api/produtos/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            carregarProdutos(selectedEmpresaId);
        } catch (err) {
            console.error("Erro ao excluir produto:", err);
            setError('Erro ao excluir produto. Tente novamente.');
        }
    };

    return (
        <div className="produtos-page">
            <div className="produtos-header">
                <h1>Gerenciamento de Produtos</h1>
                <button
                    className="btn-novo"
                    onClick={() => {
                        setProdutoEditado(null);
                        setFormVisivel(true);
                    }}
                >
                    + Novo Produto
                </button>
            </div>

            {(user?.role === 'admin' || user?.role === 'superadmin') && empresas.length > 0 && (
                <div className="form-group empresa-select-group">
                    <label htmlFor="empresa-select">Visualizar Produtos da Empresa:</label>
                    <select
                        id="empresa-select"
                        value={selectedEmpresaId}
                        onChange={(e) => setSelectedEmpresaId(e.target.value)}
                    >
                        {empresas.map((emp) => (
                            <option key={emp._id} value={emp._id}>
                                {emp.nomeFantasia}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className={`form-card ${formVisivel ? 'expanded' : ''}`}>
                {formVisivel && (
                    <ProdutoForm
                        produtoEditado={produtoEditado}
                        onSuccess={() => {
                            setFormVisivel(false);
                            setProdutoEditado(null);
                            carregarProdutos(selectedEmpresaId);
                        }}
                        selectedEmpresaId={selectedEmpresaId}
                    />
                )}
            </div>

            <div className="produtos-list-container">
                <h2>Lista de Produtos</h2>

                {loading && <p className="status-message">Carregando produtos...</p>}

                {error && <p className="status-message error">{error}</p>}

                {!loading && !error && produtos.length === 0 && (
                    <p className="status-message">Nenhum produto encontrado.</p>
                )}

                {!loading && !error && produtos.length > 0 && (
                    <ul className="produtos-list">
                        {produtos.map((prod) => (
                            <li key={prod._id} className="produto-item">
                                <div className="produto-info">
                                    <h3>{prod.nome}</h3>
                                    <p>
                                        <strong>Valor:</strong> R$ {parseFloat(prod.valor).toFixed(2).replace('.', ',')}
                                    </p>
                                    <p>
                                        <strong>Descrição:</strong> {prod.descricao || 'N/A'}
                                    </p>
                                </div>

                                <div className="produto-actions">
                                    <button
                                        className="btn-action"
                                        onClick={() => {
                                            setProdutoEditado(prod);
                                            setFormVisivel(true);
                                        }}
                                    >
                                        Editar
                                    </button>

                                    <button className="btn-action delete" onClick={() => excluirProduto(prod._id)}>
                                        Excluir
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
