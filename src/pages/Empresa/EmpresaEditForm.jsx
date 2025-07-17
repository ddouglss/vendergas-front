// src/pages/Empresas/EmpresaEditForm.jsx
import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { X } from 'lucide-react'; // Ícone para fechar
import './EmpresasPage.css'; // Reutilizando os estilos

export default function EmpresaEditForm({ empresa, onEmpresaUpdated, onCancel }) {
    const { user } = useContext(AuthContext);
    const [nomeFantasia, setNomeFantasia] = useState(empresa.nomeFantasia);
    const [razaoSocial, setRazaoSocial] = useState(empresa.razaoSocial);
    const [cnpj, setCnpj] = useState(empresa.cnpj);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setNomeFantasia(empresa.nomeFantasia);
        setRazaoSocial(empresa.razaoSocial);
        setCnpj(empresa.cnpj);
        setError(null);
        setSuccess(false);
    }, [empresa]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !user.token) {
            setError('Usuário não autenticado ou token não disponível.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const updatedData = {
                nomeFantasia,
                razaoSocial,
                cnpj,
            };

            const response = await api.put(`/api/empresas/${empresa._id}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            setSuccess(true);
            onEmpresaUpdated(response.data.empresa);
            alert('Empresa atualizada com sucesso!');
        } catch (err) {
            console.error("Erro ao atualizar empresa:", err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Erro ao atualizar empresa. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="empresa-form-container edit-form">
            <h2>
                Editar Empresa: {empresa.nomeFantasia}
                <button onClick={onCancel} className="close-btn" title="Fechar Formulário">
                    <X size={20} />
                </button>
            </h2>
            <form onSubmit={handleSubmit} className="empresa-form">
                <div className="form-group">
                    <label htmlFor="editNomeFantasia">Nome Fantasia:</label>
                    <input
                        type="text"
                        id="editNomeFantasia"
                        value={nomeFantasia}
                        onChange={(e) => setNomeFantasia(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="editRazaoSocial">Razão Social:</label>
                    <input
                        type="text"
                        id="editRazaoSocial"
                        value={razaoSocial}
                        onChange={(e) => setRazaoSocial(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="editCnpj">CNPJ:</label>
                    <input
                        type="text"
                        id="editCnpj"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        required
                        maxLength="18"
                        placeholder="XX.XXX.XXX/XXXX-XX"
                        disabled={true}
                        title="CNPJ não pode ser alterado"
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">Empresa atualizada com sucesso!</p>}
                <div className="form-actions">
                    <button type="button" onClick={onCancel} className="btn-cancel">
                        Cancelar
                    </button>
                    <button type="submit" disabled={loading} className="btn-submit">
                        {loading ? 'Atualizando...' : 'Atualizar Empresa'}
                    </button>
                </div>
            </form>
        </div>
    );
}