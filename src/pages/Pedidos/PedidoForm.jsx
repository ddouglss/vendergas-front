import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './PedidoForm.css';

export default function PedidoForm({ pedidoEditado, onSuccess, clientes = [], produtosDisponiveis = [], selectedEmpresaId }) {
    const { user } = useContext(AuthContext);

    const [clienteId, setClienteId] = useState(pedidoEditado?.cliente?._id || (clientes.length > 0 ? clientes[0]._id : ''));
    const [observacao, setObservacao] = useState(pedidoEditado?.observacao || '');
    const [itens, setItens] = useState(pedidoEditado?.produtos?.map(p => ({
        produto: p.produto._id,
        quantidade: p.quantidade
    })) || []);

    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormError(null);
        setFormSuccess(null);
        if (pedidoEditado) {
            setClienteId(pedidoEditado.cliente?._id || '');
            setObservacao(pedidoEditado.observacao || '');
            setItens(pedidoEditado.produtos?.map(p => ({
                produto: p.produto._id,
                quantidade: p.quantidade
            })) || []);
        } else {
            setClienteId(clientes.length > 0 ? clientes[0]._id : '');
            setObservacao('');
            setItens([]);
        }
    }, [pedidoEditado, clientes, produtosDisponiveis]);

    const adicionarItem = () => setItens([...itens, { produto: '', quantidade: 1 }]);

    const atualizarItem = (index, campo, valor) => {
        const novosItens = [...itens];
        novosItens[index][campo] = valor;
        setItens(novosItens);
    };

    const removerItem = (index) => {
        const novosItens = [...itens];
        novosItens.splice(index, 1);
        setItens(novosItens);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);
        setIsSubmitting(true);

        if (!clienteId) {
            setFormError('Por favor, selecione um cliente.');
            setIsSubmitting(false);
            return;
        }

        if (itens.length === 0) {
            setFormError('Adicione pelo menos um produto ao pedido.');
            setIsSubmitting(false);
            return;
        }

        for (const item of itens) {
            if (!item.produto || item.quantidade <= 0) {
                setFormError('Verifique se todos os produtos e quantidades estão preenchidos corretamente.');
                setIsSubmitting(false);
                return;
            }
        }

        const payload = {
            numero: pedidoEditado ? pedidoEditado.numero : `PED-${Date.now()}`,
            cliente: clienteId,
            empresa: selectedEmpresaId,
            observacao,
            produtos: itens.map(item => ({
                produto: item.produto,
                quantidade: Number(item.quantidade)
            }))
        };

        try {
            if (pedidoEditado) {
                await axios.put(`https://vendergas.up.railway.app/api/pedidos/${pedidoEditado._id}`, payload, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setFormSuccess('Pedido atualizado com sucesso!');
            } else {
                await axios.post('https://vendergas.up.railway.app/api/pedidos', payload, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setFormSuccess('Pedido cadastrado com sucesso!');
            }
            setTimeout(() => {
                onSuccess();
            }, 1500);
        } catch (err) {
            setFormError(`Erro ao salvar pedido: ${err.response?.data?.message || 'Verifique os dados e tente novamente.'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="pedido-form">
            <h2>{pedidoEditado ? 'Editar Pedido' : 'Novo Pedido'}</h2>

            {formError && <p className="error-message">{formError}</p>}
            {formSuccess && <p className="success-message">{formSuccess}</p>}

            <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : (pedidoEditado ? 'Salvar alterações' : 'Cadastrar Pedido')}
            </button>

            <div className="form-group">
                <label htmlFor="cliente-select">Cliente:</label>
                <select
                    id="cliente-select"
                    value={clienteId}
                    onChange={e => setClienteId(e.target.value)}
                    required
                >
                    <option value="">Selecione um cliente</option>
                    {clientes.map(cli => (
                        <option key={cli._id} value={cli._id}>{cli.nome}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="observacao-textarea">Observação:</label>
                <textarea
                    id="observacao-textarea"
                    value={observacao}
                    onChange={e => setObservacao(e.target.value)}
                    rows="3"
                />
            </div>

            <h3>Produtos do Pedido</h3>
            <div className="itens-pedido-list">
                {itens.length === 0 && <p className="status-message-small">Nenhum produto adicionado. Clique em "+ Adicionar Produto".</p>}
                {itens.map((item, index) => (
                    <div key={index} className="item-produto-row">
                        <div className="item-produto-select">
                            <select
                                id={`produto-select-${index}`}
                                value={item.produto}
                                onChange={e => atualizarItem(index, 'produto', e.target.value)}
                                required
                            >
                                <option value="">Selecione um produto</option>
                                {produtosDisponiveis.length > 0 ? (
                                    produtosDisponiveis.map(prod => (
                                        <option key={prod._id} value={prod._id}>{prod.nome}</option>
                                    ))
                                ) : (
                                    <option value="" disabled>Nenhum produto disponível</option>
                                )}
                            </select>
                        </div>
                        <div className="item-produto-quantidade">
                            <input
                                id={`quantidade-input-${index}`}
                                type="number"
                                min="1"
                                value={item.quantidade}
                                onChange={e => atualizarItem(index, 'quantidade', e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removerItem(index)}
                            className="btn-action delete-item"
                        >
                            Remover
                        </button>
                    </div>
                ))}
            </div>

            <button type="button" onClick={adicionarItem} className="btn-add-item">
                + Adicionar Produto
            </button>
        </form>
    );
}
