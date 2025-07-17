import Topbar from './Topbar';
import '../styles/layout.css';
import AppSidebar from './AppSidebar.jsx';

export default function DashboardLayout({ children }) {
    return (
        <div className="layout-container">
            <AppSidebar />
            <div className="main-content">
                <Topbar />
                <div className="content-area">{children}</div>
            </div>
        </div>
    );
}
