import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import EmpresaForm from './EmpresaForm';
import EmpresaEditForm from './EmpresaEditForm';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { Edit, Trash2, LayoutList, } from 'lucide-react';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import './EmpresasPage.css';


export default function EmpresasPage() {
    const { user } = useContext(AuthContext);
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingEmpresa, setEditingEmpresa] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [empresaToDelete, setEmpresaToDelete] = useState(null);
    const [deleteCascade, setDeleteCascade] = useState(false);

    // Função para buscar as empresas do usuário
    const fetchEmpresas = async () => {
        if (!user || !user.token) {
            setError('Usuário não autenticado.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/empresas', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setEmpresas(response.data.data);
        } catch (err) {
            console.error("Erro ao buscar empresas:", err.response ? err.response.data : err.message, err);
            setError('Erro ao carregar empresas. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmpresas();
    }, [user]);

    const handleEmpresaAdded = (newEmpresa) => {
        setEmpresas((prevEmpresas) => [...prevEmpresas, newEmpresa]);
        setShowCreateForm(false);
    };

    const handleEmpresaUpdated = (updatedEmpresa) => {
        setEmpresas((prevEmpresas) =>
            prevEmpresas.map((emp) => (emp._id === updatedEmpresa._id ? updatedEmpresa : emp))
        );
        setEditingEmpresa(null);
    };

    const handleEditClick = (empresa) => {
        setEditingEmpresa(empresa);
        setShowCreateForm(false);
    };

    const handleDeleteClick = (empresa, cascade = false) => {
        setEmpresaToDelete(empresa);
        setDeleteCascade(cascade);
        setShowDeleteConfirm(true);
    };

    // Confirmar e executar a deleção
    const confirmDelete = async () => {
        if (!empresaToDelete || !user || !user.token) return;

        setLoading(true);
        setError(null);
        setShowDeleteConfirm(false);

        try {
            const deleteUrl = deleteCascade
                ? `/api/empresas/empresa-cascade/${empresaToDelete._id}`
                : `/api/empresas/empresa/${empresaToDelete._id}`;

            await api.delete(deleteUrl, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            setEmpresas((prevEmpresas) =>
                prevEmpresas.filter((emp) => emp._id !== empresaToDelete._id)
            );
            alert(`Empresa "${empresaToDelete.nomeFantasia}" deletada com sucesso!`);
        } catch (err) {
            console.error("Erro ao deletar empresa:", err.response ? err.response.data : err.message);
            setError(`Erro ao deletar empresa. ${err.response?.data?.message || 'Tente novamente.'}`);
        } finally {
            setLoading(false);
            setEmpresaToDelete(null);
        }
    };

    if (loading && !empresas.length) {
        return <div className="empresas-container">Carregando empresas...</div>;
    }

    if (error && !empresas.length) {
        return <div className="empresas-container error">{error}</div>;
    }

    return (
        <div className="empresas-container">
            <div className="empresas-header">
                <h1>Gerenciamento de Empresas</h1>
                <button
                    className="btn-primary"
                    onClick={() => {
                        setShowCreateForm(!showCreateForm);
                        setEditingEmpresa(null);
                    }}
                >
                    {showCreateForm ? 'Fechar Cadastro' : 'Cadastrar Nova Empresa'}
                </button>
            </div>

            <div className={`form-card ${showCreateForm ? 'expanded' : ''}`}>
                {showCreateForm && (
                    <EmpresaForm onEmpresaAdded={handleEmpresaAdded} />
                )}
            </div>

            <div className={`form-card ${editingEmpresa ? 'expanded' : ''}`}>
                {editingEmpresa && (
                    <EmpresaEditForm
                        empresa={editingEmpresa}
                        onEmpresaUpdated={handleEmpresaUpdated}
                        onCancel={() => setEditingEmpresa(null)}
                    />
                )}
            </div>

            {/* Lista de Empresas */}
            <div className="empresas-list-container">
                <h2>Suas Empresas ({empresas.length})</h2>
                {empresas.length > 0 ? (
                    <ul className="empresas-list">
                        {empresas.map((empresa) => (
                            <li key={empresa._id} className="empresa-item">
                                <div className="empresa-item-avatar">
                                    {empresa.nomeFantasia ? empresa.nomeFantasia[0].toUpperCase() : 'E'}
                                </div>

                                <div className="empresa-info">
                                    <h3>{empresa.nomeFantasia}</h3>
                                    <p>
                                        <strong>Razão Social:</strong> {empresa.razaoSocial}
                                    </p>
                                    <p>
                                        <strong>CNPJ:</strong> {empresa.cnpj}
                                    </p>
                                </div>

                                <div className="empresa-actions">
                                    <button
                                        className="btn-action"
                                        onClick={() => handleEditClick(empresa)}
                                        title="Editar Empresa"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger asChild>
                                            <button className="btn-action" title="Opções de Exclusão">
                                                <Trash2 size={18} />
                                            </button>
                                        </DropdownMenu.Trigger>
                                        <DropdownMenu.Portal>
                                            <DropdownMenu.Content
                                                className="DropdownMenuContent"
                                                sideOffset={5}
                                                align="end"
                                            >
                                                <DropdownMenu.Item
                                                    className="DropdownMenuItem"
                                                    onSelect={() => handleDeleteClick(empresa, false)}
                                                >
                                                    <Trash2 size={16} /> Excluir Simples
                                                </DropdownMenu.Item>
                                                <DropdownMenu.Item
                                                    className="DropdownMenuItem delete-option"
                                                    onSelect={() => handleDeleteClick(empresa, true)}
                                                >
                                                    <LayoutList size={16} /> Excluir c/ Relacionados
                                                </DropdownMenu.Item>
                                            </DropdownMenu.Content>
                                        </DropdownMenu.Portal>
                                    </DropdownMenu.Root>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="status-message">Nenhuma empresa cadastrada ainda.</p>
                )}
            </div>

            {showDeleteConfirm && (
                <ConfirmationDialog
                    message={`Tem certeza que deseja deletar a empresa "${empresaToDelete?.nomeFantasia}" ${deleteCascade ? 'E TODOS OS DADOS RELACIONADOS (clientes, produtos, pedidos)?' : '?'}`}
                    onConfirm={confirmDelete}
                    onCancel={() => setShowDeleteConfirm(false)}
                    confirmButtonText={deleteCascade ? 'Sim, Deletar Tudo!' : 'Sim, Deletar'}
                    confirmButtonClass="btn-danger"
                />
            )}

            {loading && empresas.length > 0 && (
                <div className="overlay-loader">Carregando...</div>
            )}
        </div>
    );
}

