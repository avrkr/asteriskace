import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Settings, Lock, Key, Mail, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        setLoading(true);
        try {
            await axios.put('/api/auth/change-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            toast.success('Password updated successfully');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });

            // Update local user state to hide the temporary password warning
            if (user) {
                setUser({ ...user, isFirstLogin: false });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-8">
                <h1 style={{ fontSize: '32px' }}>Account Settings</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your personal credentials and security</p>
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div className="card">
                    <h3 className="mb-6 flex items-center gap-2">
                        <Lock size={20} className="text-primary" />
                        Security & Password
                    </h3>

                    {user?.isFirstLogin && (
                        <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '20px', fontSize: '14px', display: 'flex', gap: '10px' }}>
                            <ShieldAlert size={20} />
                            You are using a temporary password. Please change it now.
                        </div>
                    )}

                    <form onSubmit={handlePasswordChange}>
                        <div className="input-group">
                            <label className="label">Current Password</label>
                            <input
                                type="password"
                                value={passwords.currentPassword}
                                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="label">New Password</label>
                            <input
                                type="password"
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="label">Confirm New Password</label>
                            <input
                                type="password"
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            <Key size={18} />
                            Update Password
                        </button>
                    </form>
                </div>

                <div className="card">
                    <h3 className="mb-6 flex items-center gap-2">
                        <Mail size={20} className="text-accent" />
                        Profile Information
                    </h3>

                    <div className="input-group">
                        <label className="label">Email Address</label>
                        <input type="text" value={user?.email || ''} disabled style={{ opacity: 0.7 }} />
                    </div>

                    <div className="input-group">
                        <label className="label">Account Role</label>
                        <input type="text" value={user?.role?.toUpperCase() || ''} disabled style={{ opacity: 0.7 }} />
                    </div>

                    <div style={{ marginTop: '20px', padding: '20px', borderRadius: '12px', background: 'var(--bg-dark)', border: '1px dashed var(--border)' }}>
                        <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Security Information</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            Last Login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Just now'}<br />
                            Session ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
