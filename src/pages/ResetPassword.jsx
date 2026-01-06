import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Key, ShieldCheck, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const email = localStorage.getItem('resetEmail');
        if (email) {
            setFormData(prev => ({ ...prev, email }));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        setLoading(true);
        try {
            await axios.post('/api/auth/reset-password', {
                email: formData.email,
                otp: formData.otp,
                newPassword: formData.newPassword
            });
            toast.success('Password reset successful! Please login.');
            localStorage.removeItem('resetEmail');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b' }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-6">Reset Password</h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="label">Verification OTP</label>
                        <input
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={formData.otp}
                            onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="label">New Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="label">Confirm New Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
