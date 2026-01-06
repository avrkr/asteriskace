import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
    UserPlus,
    Trash2,
    UserX,
    UserCheck,
    Mail,
    Plus,
    Shield,
    Key,
    Search
} from 'lucide-react';
import { motion } from 'framer-motion';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/admin/users');
            setUsers(res.data);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/users', { email });
            toast.success('User created and credentials emailed!');
            setEmail('');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create user');
        }
    };

    const handleToggleStatus = async (user) => {
        const newStatus = user.status === 'active' ? 'disabled' : 'active';
        try {
            await axios.put(`/api/admin/users/${user._id}`, { status: newStatus });
            toast.success(`User ${newStatus === 'active' ? 'enabled' : 'disabled'}`);
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? All access rules will be removed.')) return;
        try {
            await axios.delete(`/api/admin/users/${id}`);
            toast.success('User deleted');
            fetchUsers();
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 style={{ fontSize: '32px' }}>User Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Create and manage student accounts</p>
                </div>
                <div className="flex gap-4">
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            style={{ paddingLeft: '40px', width: '300px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="card" style={{ gridColumn: 'span 1' }}>
                    <h3 className="mb-4 flex items-center gap-2">
                        <UserPlus size={20} className="text-primary" />
                        Add New User
                    </h3>
                    <form onSubmit={handleCreateUser}>
                        <div className="input-group">
                            <label className="label">Student Email</label>
                            <input
                                type="email"
                                placeholder="user@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            <Plus size={18} />
                            Create & Send Credentials
                        </button>
                    </form>
                </div>

                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <h3>All Students ({users.length})</h3>
                    <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Last Login</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`badge badge-${user.status}`}>
                                                {user.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                            {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleToggleStatus(user)}
                                                    className="btn btn-secondary"
                                                    title={user.status === 'active' ? 'Disable User' : 'Enable User'}
                                                    style={{ padding: '8px' }}
                                                >
                                                    {user.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="btn btn-danger"
                                                    title="Delete User"
                                                    style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center" style={{ padding: '40px', color: 'var(--text-muted)' }}>
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default UserManagement;
