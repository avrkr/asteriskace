import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Video,
    Settings,
    LogOut,
    ShieldCheck,
    Globe,
    BookOpen,
    History
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const adminLinks = [
        { to: '/admin', icon: LayoutDashboard, label: 'Admin Panel' },
        { to: '/admin/users', icon: Users, label: 'User Management' },
        { to: '/admin/content', icon: Globe, label: 'Content Manager' },
        { to: '/admin/videos', icon: Video, label: 'Videos' },
    ];

    const userLinks = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/my-content', icon: BookOpen, label: 'My Learning' },
    ];

    const links = user?.role === 'admin' ? adminLinks : userLinks;

    return (
        <div className="sidebar">
            <div className="logo">
                <img src="/favicon.png" alt="Logo" style={{ width: '32px', height: '32px' }} />
                <span>Asterisk Ace</span>
            </div>

            <nav style={{ flex: 1 }}>
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        end={link.to === '/'}
                    >
                        <link.icon size={20} />
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <NavLink to="/profile" className="nav-link">
                    <Settings size={20} />
                    Profile
                </NavLink>
                <button onClick={logout} className="nav-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <LogOut size={20} />
                    Logout
                </button>
            </div>

            <div style={{ marginTop: '20px', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', fontSize: '11px', color: 'var(--text-muted)' }}>
                Logged in as:<br />
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{user?.email}</span>
            </div>
        </div>
    );
};

export default Sidebar;
