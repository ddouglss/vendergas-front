import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

import ClientesPage from '../pages/ Clientes/ClientesPage.jsx';
import ProdutosPage from '../pages/Produtos/ProdutosPage';
import PedidosPage from '../pages/Pedidos/PedidosPage';

import PrivateRoute from './PrivateRoute';
import DashboardLayout from '../layout/ DashboardLayout.jsx';
import EmpresasPage from "../pages/Empresa/EmpresasPage.jsx";

export default function AppRoutes() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/cadastrar" element={<Register />} />

                <Route
                    path="/clientes"
                    element={
                        <PrivateRoute>
                            <DashboardLayout>
                                <ClientesPage />
                            </DashboardLayout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/produtos"
                    element={
                        <PrivateRoute>
                            <DashboardLayout>
                                <ProdutosPage />
                            </DashboardLayout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/pedidos"
                    element={
                        <PrivateRoute>
                            <DashboardLayout>
                                <PedidosPage />
                            </DashboardLayout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/empresas"
                    element={
                        <PrivateRoute>
                            <DashboardLayout>
                                <EmpresasPage />
                            </DashboardLayout>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}