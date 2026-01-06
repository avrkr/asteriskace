import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Play, BookOpen, Globe, Calendar, Search, FileVideo } from 'lucide-react';
import { motion } from 'framer-motion';

const UserDashboard = () => {
    const [content, setContent] = useState({ domains: [], topics: [], videos: [] });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await axios.get('/api/user/content');
                setContent(res.data);
            } catch (error) {
                console.error('Failed to load content');
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    const filteredVideos = content.videos.filter(v =>
        v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.domain?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.topic?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center py-20">Securely loading your content...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 style={{ fontSize: '32px' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Here is the content you have access to.</p>
                </div>
                <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} size={18} />
                    <input
                        type="text"
                        placeholder="Search your library..."
                        style={{ paddingLeft: '40px', width: '300px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {content.videos.length === 0 ? (
                <div className="card text-center py-20">
                    <Globe size={48} className="mb-4 opacity-20" style={{ display: 'block', margin: '0 auto' }} />
                    <h3>No Content Available</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>
                        It looks like you don't have any active access rules. <br />
                        Please contact your administrator for permissions.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-6">
                    {filteredVideos.map((video) => (
                        <div key={video._id} className="card">
                            <div className="flex items-center gap-3 mb-4">
                                <div style={{ background: 'rgba(74, 222, 128, 0.1)', padding: '10px', borderRadius: '8px' }}>
                                    <FileVideo className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '16px' }}>{video.title}</h4>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        {video.domain?.name} • {video.topic?.name}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 py-2 border-t border-b border-border mb-4" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {video.day}/{video.month}/{video.year}
                                </div>
                            </div>

                            <Link to={`/watch/${video._id}`} className="btn btn-primary" style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}>
                                <Play size={18} fill="currentColor" />
                                Watch Now
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default UserDashboard;
