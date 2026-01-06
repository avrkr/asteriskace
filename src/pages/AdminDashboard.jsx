import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ShieldCheck, Users, Video, Clock, ChevronRight, Lock, Unlock } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [domains, setDomains] = useState([]);
    const [topics, setTopics] = useState([]);
    const [rules, setRules] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State for Access Control
    const [accessForm, setAccessForm] = useState({
        userId: '',
        domain: '',
        topic: '',
        year: '',
        month: '',
        day: '',
        durationDays: '7'
    });

    const fetchData = async () => {
        try {
            const [uRes, dRes, lRes] = await Promise.all([
                axios.get('/api/admin/users'),
                axios.get('/api/admin/domains'),
                axios.get('/api/admin/logs')
            ]);
            setUsers(uRes.data);
            setDomains(dRes.data);
            setLogs(lRes.data);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (accessForm.domain) {
            axios.get(`/api/admin/topics/${accessForm.domain}`).then(r => setTopics(r.data));
        } else {
            setTopics([]);
        }
    }, [accessForm.domain]);

    useEffect(() => {
        if (accessForm.userId) {
            axios.get(`/api/admin/access-rules/${accessForm.userId}`).then(r => setRules(r.data));
        } else {
            setRules([]);
        }
    }, [accessForm.userId]);

    const handleGrantAccess = async (e) => {
        e.preventDefault();
        if (!accessForm.userId) return toast.error('Please select a user');

        try {
            await axios.post('/api/admin/access-rules', accessForm);
            toast.success('Access granted successfully');
            // Refresh rules
            const r = await axios.get(`/api/admin/access-rules/${accessForm.userId}`);
            setRules(r.data);
        } catch (error) {
            toast.error('Failed to grant access');
        }
    };

    const handleDeleteRule = async (id) => {
        try {
            await axios.delete(`/api/admin/access-rules/${id}`);
            toast.success('Access revoked');
            setRules(rules.filter(r => r._id !== id));
        } catch (error) {
            toast.error('Failed to revoke access');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-8">
                <h1 style={{ fontSize: '32px' }}>Access Control Command Center</h1>
                <p style={{ color: 'var(--text-muted)' }}>Precisely control who can see what and for how long.</p>
            </div>

            <div className="grid grid-cols-3 gap-8">
                {/* Left: Grant Access Form */}
                <div className="col-span-1">
                    <div className="card">
                        <h3 className="mb-6 flex items-center gap-2">
                            <Lock size={20} className="text-primary" />
                            Grant New Access
                        </h3>
                        <form onSubmit={handleGrantAccess}>
                            <div className="input-group">
                                <label className="label">Select Student</label>
                                <select
                                    value={accessForm.userId}
                                    onChange={(e) => setAccessForm({ ...accessForm, userId: e.target.value })}
                                    required
                                >
                                    <option value="">Choose User</option>
                                    {users.map(u => <option key={u._id} value={u._id}>{u.email}</option>)}
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="label">Domain (Optional - Leave blank for all)</label>
                                <select
                                    value={accessForm.domain}
                                    onChange={(e) => setAccessForm({ ...accessForm, domain: e.target.value, topic: '' })}
                                >
                                    <option value="">All Domains</option>
                                    {domains.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                                </select>
                            </div>

                            <div className="input-group">
                                <label className="label">Topic (Optional)</label>
                                <select
                                    value={accessForm.topic}
                                    onChange={(e) => setAccessForm({ ...accessForm, topic: e.target.value })}
                                    disabled={!accessForm.domain}
                                >
                                    <option value="">All Topics in Domain</option>
                                    {topics.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-4">
                                <div>
                                    <label className="label">Year</label>
                                    <input type="number" placeholder="Any" value={accessForm.year} onChange={(e) => setAccessForm({ ...accessForm, year: e.target.value })} />
                                </div>
                                <div>
                                    <label className="label">Month</label>
                                    <input type="number" placeholder="Any" value={accessForm.month} onChange={(e) => setAccessForm({ ...accessForm, month: e.target.value })} />
                                </div>
                                <div>
                                    <label className="label">Day</label>
                                    <input type="number" placeholder="Any" value={accessForm.day} onChange={(e) => setAccessForm({ ...accessForm, day: e.target.value })} />
                                </div>
                            </div>

                            <div className="input-group">
                                <label className="label">Access Duration (Days)</label>
                                <input
                                    type="number"
                                    value={accessForm.durationDays}
                                    onChange={(e) => setAccessForm({ ...accessForm, durationDays: e.target.value })}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                <ShieldCheck size={18} />
                                Confirm Permissions
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right: Active Rules List */}
                <div className="col-span-2">
                    <div className="card">
                        <h3 className="mb-6">Active Permissions</h3>
                        {!accessForm.userId ? (
                            <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
                                <Users size={40} className="mb-4 opacity-20" style={{ display: 'block', margin: '0 auto' }} />
                                Select a user to view their active access rules
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Resource</th>
                                            <th>Filter (Y/M/D)</th>
                                            <th>Expires At</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rules.map(rule => (
                                            <tr key={rule._id}>
                                                <td>
                                                    <div style={{ fontWeight: '500' }}>{rule.domain?.name || 'All Domains'}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{rule.topic?.name || 'All Topics'}</div>
                                                </td>
                                                <td style={{ fontSize: '12px' }}>
                                                    {rule.year || '*'}/{rule.month || '*'}/{rule.day || '*'}
                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2" style={{ color: new Date(rule.expiresAt) < new Date() ? 'var(--error)' : 'var(--success)' }}>
                                                        <Clock size={14} />
                                                        {new Date(rule.expiresAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => handleDeleteRule(rule._id)}
                                                        className="btn btn-secondary"
                                                        style={{ padding: '6px', color: 'var(--error)' }}
                                                    >
                                                        Revoke
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {rules.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="text-center py-10" style={{ color: 'var(--text-muted)' }}>
                                                    No active rules for this user
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Activity Logs Section */}
            <div className="mt-8">
                <div className="card">
                    <h3 className="mb-6 flex items-center gap-2">
                        <Clock size={20} className="text-accent" />
                        Live User Activity Logs (IP Monitoring)
                    </h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>User</th>
                                    <th>Action</th>
                                    <th>IP Address</th>
                                    <th>Resource</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <tr key={log._id}>
                                        <td style={{ fontSize: '12px' }}>{new Date(log.timestamp).toLocaleString()}</td>
                                        <td>{log.user?.email || 'System'}</td>
                                        <td>
                                            <span className="badge badge-active" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)' }}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: '13px', fontFamily: 'monospace' }}>{log.ip}</td>
                                        <td style={{ fontSize: '13px' }}>
                                            {log.action === 'LOGIN' ? 'Web Login' : (log.details?.title || '-')}
                                        </td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10" style={{ color: 'var(--text-muted)' }}>
                                            No activity logs found. Activity is recorded when users watch videos.
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

export default AdminDashboard;
