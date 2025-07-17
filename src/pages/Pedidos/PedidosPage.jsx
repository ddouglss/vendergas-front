import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import PedidoForm from './PedidoForm';
import './PedidosPage.css';

export default function PedidosPage() {
    const { user } = useContext(AuthContext);
    const [pedidos, setPedidos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [selectedEmpresaId, setSelectedEmpresaId] = useState('');
    const [formVisivel, setFormVisivel] = useState(false);
    const [pedidoEditado, setPedidoEditado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const carregarClientes = useCallback(async (empresaId) => {
        if (!user?.token || !empresaId) return;
        try {
            const res = await axios.get(`https://vendergas.up.railway.app/api/clientes/empresa/${empresaId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setClientes(res.data.data);
        } catch (err) {
            console.error('Erro ao buscar clientes:', err);
        }
    }, [user?.token]);

    const carregarPedidos = useCallback(async (empresaId) => {
        if (!user?.token || !empresaId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`https://vendergas.up.railway.app/api/pedidos/empresa/${empresaId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setPedidos(res.data.data);
        } catch (err) {
            console.error('Erro ao buscar pedidos:', err);
            setError('Erro ao carregar pedidos. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }, [user?.token]);

    const carregarProdutos = useCallback(async (empresaId) => {
        if (!user?.token || !empresaId) return;
        try {
            const res = await axios.get(`https://vendergas.up.railway.app/api/produtos/${empresaId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setProdutos(res.data.data);
        } catch (err) {
            console.error('Erro ao carregar produtos:', err);
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
        } else if (user.cliente) {
            setSelectedEmpresaId(user.cliente);
        }
    }, [user, carregarEmpresas]);

    useEffect(() => {
        if (selectedEmpresaId) {
            if (user?.role === 'admin' || user?.role === 'superadmin' || user?.empresaId) {
                carregarClientes(selectedEmpresaId);
            }
            carregarPedidos(selectedEmpresaId);
            carregarProdutos(selectedEmpresaId);
        }
    }, [selectedEmpresaId, carregarClientes, carregarPedidos, carregarProdutos, user?.role, user?.empresaId]);

    const excluirPedido = async (id) => {
        if (!window.confirm('Deseja realmente excluir este pedido?')) return;
        try {
            await axios.delete(`https://vendergas.up.railway.app/api/pedidos/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            carregarPedidos(selectedEmpresaId);
        } catch (err) {
            console.error('Erro ao excluir pedido:', err);
            setError('Erro ao excluir pedido. Tente novamente.');
        }
    };

    return (
        <div className="pedidos-container">
            <div className="pedidos-header">
                <h1>Gerenciamento de Pedidos</h1>
                <button className="btn-novo" onClick={() => { setPedidoEditado(null); setFormVisivel(true); }}>
                    + Novo Pedido
                </button>
            </div>

            {(user?.role === 'admin' || user?.role === 'superadmin') && empresas.length > 0 && (
                <div className="form-group empresa-select-group">
                    <label htmlFor="empresa-select">Visualizar Dados da Empresa:</label>
                    <select
                        id="empresa-select"
                        value={selectedEmpresaId}
                        onChange={(e) => setSelectedEmpresaId(e.target.value)}
                    >
                        {empresas.map((emp) => (
                            <option key={emp._id} value={emp._id}>{emp.nomeFantasia}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className={`form-card ${formVisivel ? 'expanded' : ''}`}>
                {formVisivel && (
                    <PedidoForm
                        pedidoEditado={pedidoEditado}
                        clientes={clientes}
                        produtosDisponiveis={produtos}
                        selectedEmpresaId={selectedEmpresaId}
                        onSuccess={() => {
                            setFormVisivel(false);
                            setPedidoEditado(null);
                            carregarPedidos(selectedEmpresaId);
                        }}
                    />
                )}
            </div>

            <div className="pedidos-list-container">
                <h2>Lista de Pedidos</h2>
                {loading && <p className="status-message">Carregando pedidos...</p>}
                {error && <p className="status-message error">{error}</p>}
                {!loading && !error && pedidos.length === 0 && (
                    <p className="status-message">Nenhum pedido encontrado.</p>
                )}
                {!loading && !error && pedidos.length > 0 && (
                    <ul className="pedidos-list">
                        {pedidos.map(pedido => (
                            <li key={pedido._id} className="pedido-item">
                                <div className="pedido-info">
                                    <h3>Pedido #{pedido.numero}</h3>
                                    <p><strong>Cliente:</strong> {pedido.cliente?.nome || 'N/A'}</p>
                                    <p><strong>Data:</strong> {new Date(pedido.data).toLocaleDateString('pt-BR')}</p>
                                    <p>
                                        <strong>Produtos:</strong>{' '}
                                        {pedido.produtos && pedido.produtos.length > 0
                                            ? pedido.produtos.map(p => `${p.produto?.nome || 'Produto Desconhecido'} (x${p.quantidade})`).join(', ')
                                            : 'Nenhum produto'}
                                    </p>
                                    <p><strong>Observação:</strong> {pedido.observacao || 'N/A'}</p>
                                </div>
                                <div className="pedido-actions">
                                    <button className="btn-action" onClick={() => { setPedidoEditado(pedido); setFormVisivel(true); }}>
                                        Editar
                                    </button>
                                    <button className="btn-action delete" onClick={() => excluirPedido(pedido._id)}>
                                        Excluir
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="produtos-in-pedidos-list-container">
                <h2>Produtos Disponíveis</h2>
                {loading && <p className="status-message">Carregando produtos...</p>}
                {error && <p className="status-message error">{error}</p>}
                {!loading && !error && produtos.length === 0 && (
                    <p className="status-message">Nenhum produto disponível para esta empresa.</p>
                )}
                {!loading && !error && produtos.length > 0 && (
                    <ul className="produtos-list">
                        {produtos.map(prod => (
                            <li key={prod._id} className="produto-item">
                                <div className="produto-info">
                                    <h3>{prod.nome}</h3>
                                    <p><strong>Valor:</strong> R$ {parseFloat(prod.valor).toFixed(2).replace('.', ',')}</p>
                                    <p><strong>Descrição:</strong> {prod.descricao || 'N/A'}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
