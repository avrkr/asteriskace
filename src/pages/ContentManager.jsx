import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Globe, BookOpen, Plus, FolderPlus, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const ContentManager = () => {
    const [domains, setDomains] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState('');

    // Forms
    const [domainName, setDomainName] = useState('');
    const [domainDesc, setDomainDesc] = useState('');
    const [topicName, setTopicName] = useState('');
    const [topicDesc, setTopicDesc] = useState('');

    const fetchDomains = async () => {
        try {
            const res = await axios.get('/api/admin/domains');
            setDomains(res.data);
        } catch (error) {
            toast.error('Failed to fetch domains');
        }
    };

    const fetchTopics = async (domainId) => {
        try {
            const res = await axios.get(`/api/admin/topics/${domainId}`);
            setTopics(res.data);
        } catch (error) {
            toast.error('Failed to fetch topics');
        }
    };

    useEffect(() => {
        fetchDomains();
    }, []);

    useEffect(() => {
        if (selectedDomain) {
            fetchTopics(selectedDomain);
        } else {
            setTopics([]);
        }
    }, [selectedDomain]);

    const handleCreateDomain = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/domains', { name: domainName, description: domainDesc });
            toast.success('Domain created');
            setDomainName('');
            setDomainDesc('');
            fetchDomains();
        } catch (error) {
            toast.error('Failed to create domain');
        }
    };

    const handleCreateTopic = async (e) => {
        e.preventDefault();
        if (!selectedDomain) return toast.error('Select a domain first');
        try {
            await axios.post('/api/admin/topics', {
                name: topicName,
                domainId: selectedDomain,
                description: topicDesc
            });
            toast.success('Topic created');
            setTopicName('');
            setTopicDesc('');
            fetchTopics(selectedDomain);
        } catch (error) {
            toast.error('Failed to create topic');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-8">
                <h1 style={{ fontSize: '32px' }}>Content Manager</h1>
                <p style={{ color: 'var(--text-muted)' }}>Structure your learning library by Domains and Topics</p>
            </div>

            <div className="grid grid-cols-2 gap-8">
                {/* Domain Creation */}
                <section className="card">
                    <h3 className="mb-6 flex items-center gap-2">
                        <Globe size={20} className="text-primary" />
                        Manage Domains
                    </h3>

                    <form onSubmit={handleCreateDomain} className="mb-8">
                        <div className="input-group">
                            <label className="label">Domain Name (e.g. WebRTC)</label>
                            <input
                                value={domainName}
                                onChange={(e) => setDomainName(e.target.value)}
                                placeholder="Domain Name"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label className="label">Description</label>
                            <textarea
                                value={domainDesc}
                                onChange={(e) => setDomainDesc(e.target.value)}
                                placeholder="Brief description..."
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            <FolderPlus size={18} />
                            Create Domain
                        </button>
                    </form>

                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '10px' }}>Existing Domains</h4>
                        <div className="flex flex-wrap gap-2">
                            {domains.map(d => (
                                <button
                                    key={d._id}
                                    onClick={() => setSelectedDomain(d._id)}
                                    className={`btn ${selectedDomain === d._id ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ fontSize: '12px' }}
                                >
                                    {d.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Topic Creation */}
                <section className="card">
                    <h3 className="mb-6 flex items-center gap-2">
                        <BookOpen size={20} className="text-accent" />
                        Manage Topics
                    </h3>

                    {!selectedDomain ? (
                        <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
                            <Tag size={40} className="mb-4" style={{ opacity: 0.2, display: 'block', margin: '0 auto' }} />
                            <p>Select a domain to manage its topics</p>
                        </div>
                    ) : (
                        <>
                            <form onSubmit={handleCreateTopic} className="mb-8">
                                <div className="input-group">
                                    <label className="label">Topic Name</label>
                                    <input
                                        value={topicName}
                                        onChange={(e) => setTopicName(e.target.value)}
                                        placeholder="Topic Name"
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="label">Description</label>
                                    <textarea
                                        value={topicDesc}
                                        onChange={(e) => setTopicDesc(e.target.value)}
                                        placeholder="What's this topic about?"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', backgroundColor: 'var(--accent)', color: 'white' }}>
                                    <Plus size={18} />
                                    Add Topic to {domains.find(d => d._id === selectedDomain)?.name}
                                </button>
                            </form>

                            <div>
                                <h4 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '10px' }}>Topics in this Domain</h4>
                                <div className="flex flex-wrap gap-2">
                                    {topics.map(t => (
                                        <div key={t._id} className="badge badge-active" style={{ padding: '8px 12px' }}>
                                            {t.name}
                                        </div>
                                    ))}
                                    {topics.length === 0 && <p style={{ fontSize: '12px', fontStyle: 'italic' }}>No topics yet</p>}
                                </div>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </motion.div>
    );
};

export default ContentManager;
