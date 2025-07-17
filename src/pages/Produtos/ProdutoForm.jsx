import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './ProdutoForm.css';

export default function ProdutoForm({ produtoEditado, onSuccess, selectedEmpresaId }) {
    const { user } = useContext(AuthContext);
    const [nome, setNome] = useState(produtoEditado?.nome || '');
    const [valor, setValor] = useState(produtoEditado?.valor || '');
    const [descricao, setDescricao] = useState(produtoEditado?.descricao || '');
    const [empresaId, setEmpresaId] = useState(produtoEditado?.empresa || selectedEmpresaId || user?.empresaId || '');
    const [empresas, setEmpresas] = useState([]);

    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

    // Efeito para carregar a lista de empresas (apenas para admin/superadmin)
    useEffect(() => {
        if (isAdmin && user?.token) {
            axios.get('https://vendergas.up.railway.app/api/empresas', {
                headers: { Authorization: `Bearer ${user.token}` }
            })
                .then(res => {
                    setEmpresas(res.data.data);
                    // Se estiver criando um novo produto e uma empresa já estiver selecionada na página pai, use-a
                    if (!produtoEditado && selectedEmpresaId && res.data.data.some(emp => emp._id === selectedEmpresaId)) {
                        setEmpresaId(selectedEmpresaId);
                    } else if (!produtoEditado && res.data.data.length > 0 && !empresaId) {
                        // Se não houver empresa selecionada e for novo, use a primeira empresa disponível
                        setEmpresaId(res.data.data[0]._id);
                    }
                })
                .catch(err => {
                    console.error("Erro ao buscar empresas:", err.response?.data || err.message);
                    setFormError('Erro ao carregar empresas para seleção.');
                });
        } else if (user?.empresaId) {
            // Para usuários normais, a empresa é a deles
            setEmpresaId(user.empresaId);
        }
    }, [isAdmin, user?.token, user?.empresaId, produtoEditado, selectedEmpresaId, empresaId]); // Adicionado empresaId nas deps para evitar loop

    // Efeito para resetar o formulário quando produtoEditado muda (para novo ou outro produto)
    useEffect(() => {
        setFormError(null);
        setFormSuccess(null);
        if (produtoEditado) {
            setNome(produtoEditado.nome || '');
            setValor(produtoEditado.valor || '');
            setDescricao(produtoEditado.descricao || '');
            setEmpresaId(produtoEditado.empresa || '');
        } else {
            setNome('');
            setValor('');
            setDescricao('');
            // Ao criar novo, se selectedEmpresaId já existe, usa ela. Senão, tenta a empresa do user.
            setEmpresaId(selectedEmpresaId || user?.empresaId || '');
        }
    }, [produtoEditado, selectedEmpresaId, user?.empresaId]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        setFormSuccess(null);
        setIsSubmitting(true);

        // Validação básica
        if (!nome || !valor || !empresaId) {
            setFormError('Nome, Valor e Empresa são campos obrigatórios.');
            setIsSubmitting(false);
            return;
        }
        if (parseFloat(valor) <= 0) {
            setFormError('O valor deve ser maior que zero.');
            setIsSubmitting(false);
            return;
        }

        const payload = {
            nome,
            valor: parseFloat(valor), // Garante que o valor seja um número
            descricao,
            empresa: empresaId // Usa o empresaId do estado, que já considera admin/user normal
        };

        try {
            if (produtoEditado) {
                await axios.put(`https://vendergas.up.railway.app/api/produtos/${produtoEditado._id}`, payload, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setFormSuccess('Produto atualizado com sucesso!');
            } else {
                await axios.post('https://vendergas.up.railway.app/api/produtos', payload, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setFormSuccess('Produto cadastrado com sucesso!');
            }

            setTimeout(() => {
                onSuccess(); // Atualiza a lista e fecha o formulário
            }, 1500);
        } catch (err) {
            console.error('Erro ao salvar produto:', err.response?.data || err.message);
            setFormError('Erro ao salvar produto. Verifique os dados e tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="produto-form" noValidate>
            <h2>{produtoEditado ? 'Editar Produto' : 'Novo Produto'}</h2>

            {formError && <p className="error-message">{formError}</p>}
            {formSuccess && <p className="success-message">{formSuccess}</p>}

            <div className="form-group">
                <label htmlFor="nome-produto">Nome do Produto:</label>
                <input
                    id="nome-produto"
                    type="text"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    placeholder="Nome do produto"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="valor-produto">Valor:</label>
                <input
                    id="valor-produto"
                    type="number"
                    value={valor}
                    onChange={e => setValor(e.target.value)}
                    placeholder="Valor"
                    step="0.01" // Permite valores decimais
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="descricao-produto">Descrição:</label>
                <textarea
                    id="descricao-produto"
                    value={descricao}
                    onChange={e => setDescricao(e.target.value)}
                    placeholder="Descrição"
                    rows="3"
                />
            </div>

            {isAdmin && (
                <div className="form-group">
                    <label htmlFor="empresa-produto">Empresa:</label>
                    <select
                        id="empresa-produto"
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
                </div>
            )}

            <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : (produtoEditado ? 'Atualizar Produto' : 'Cadastrar Produto')}
            </button>
        </form>
    );
}