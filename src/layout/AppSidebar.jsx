import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
     Users, Box, Package, LogOut, Briefcase
} from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import './AppSidebar.css';

export default function AppSidebar() {
    const { user, logout } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const getUserInitials = (name, email) => {
        if (name) {
            const parts = name.split(' ');
            if (parts.length > 1) {
                return (parts[0][0] + parts[1][0]).toUpperCase();
            }
            return parts[0][0].toUpperCase();
        }
        if (email) {
            return email[0].toUpperCase();
        }
        return '??';
    };

    const userInitials = getUserInitials(user?.name, user?.email);

    return (
        <div className={`app-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                {/* Logo/Nome "Vender Gás" no topo */}
                <h2 className="sidebar-logo">Vender Gás</h2>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <NavLink to="/clientes" className={({ isActive }) => isActive ? 'active' : ''}>
                            <Users size={20} />
                            <span>Clientes</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/produtos" className={({ isActive }) => isActive ? 'active' : ''}>
                            <Box size={20} />
                            <span>Produtos</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/pedidos" className={({ isActive }) => isActive ? 'active' : ''}>
                            <Package size={20} />
                            <span>Pedidos</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/empresas" className={({ isActive }) => isActive ? 'active' : ''}>
                            <Briefcase size={20} />
                            <span>Empresas</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile-widget">
                    <div className="user-avatar">{userInitials}</div>
                    <div className="user-details">
                        <span className="user-name">{user?.name || 'Usuário'}</span>
                        <span className="user-email">{user?.email || 'email@exemplo.com'}</span>
                    </div>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="user-options-btn">
                                <span className="dots">...</span>
                            </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content className="user-dropdown-content" sideOffset={5} align="end">
                                <DropdownMenu.Item className="user-dropdown-item" onSelect={logout}>
                                    <LogOut size={16} /> Logout
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
                <button className="toggle-sidebar-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? '<' : '>'}
                </button>
            </div>
        </div>
    );
}