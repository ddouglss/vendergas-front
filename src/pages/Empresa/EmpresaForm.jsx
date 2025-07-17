// src/pages/Empresas/EmpresaForm.jsx
import React, { useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import './EmpresasPage.css';
import './EmpresaForm.css';

export default function EmpresaForm({ onEmpresaAdded }) {
    const { user } = useContext(AuthContext);
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [razaoSocial, setRazaoSocial] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

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
            const empresaData = {
                nomeFantasia,
                razaoSocial,
                cnpj,
            };

            const response = await api.post('/api/empresas/', empresaData, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            setSuccess(true);
            setNomeFantasia('');
            setRazaoSocial('');
            setCnpj('');
            onEmpresaAdded(response.data);
        } catch (err) {
            console.error("Erro ao cadastrar empresa:", err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Erro ao cadastrar empresa. Verifique o CNPJ ou tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="empresa-form-container">
            <h2>Cadastrar Nova Empresa</h2>
            <form onSubmit={handleSubmit} className="empresa-form">
                <div className="form-group">
                    <label htmlFor="nomeFantasia">Nome Fantasia:</label>
                    <input
                        type="text"
                        id="nomeFantasia"
                        value={nomeFantasia}
                        onChange={(e) => setNomeFantasia(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="razaoSocial">Razão Social:</label>
                    <input
                        type="text"
                        id="razaoSocial"
                        value={razaoSocial}
                        onChange={(e) => setRazaoSocial(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="cnpj">CNPJ:</label>
                    <input
                        type="text"
                        id="cnpj"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        required
                        maxLength="18"
                        placeholder="XX.XXX.XXX/XXXX-XX"
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">Empresa cadastrada com sucesso!</p>}
                <button type="submit" disabled={loading} className="btn-submit">
                    {loading ? 'Cadastrando...' : 'Cadastrar Empresa'}
                </button>
            </form>
        </div>
    );
}