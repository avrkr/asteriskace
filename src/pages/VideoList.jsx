import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Video, Upload, Trash2, Calendar, FileVideo, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const VideoList = () => {
    const [videos, setVideos] = useState([]);
    const [domains, setDomains] = useState([]);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewVideo, setPreviewVideo] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        domain: '',
        topic: '',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        description: ''
    });
    const [file, setFile] = useState(null);

    const fetchData = async () => {
        try {
            const [vRes, dRes] = await Promise.all([
                axios.get('/api/admin/videos'),
                axios.get('/api/admin/domains')
            ]);
            setVideos(vRes.data);
            setDomains(dRes.data);
        } catch (error) {
            toast.error('Failed to fetch data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDomainChange = async (e) => {
        const domainId = e.target.value;
        setFormData({ ...formData, domain: domainId, topic: '' });
        if (domainId) {
            const res = await axios.get(`/api/admin/topics/${domainId}`);
            setTopics(res.data);
        } else {
            setTopics([]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return toast.error('Please select a video file');

        const data = new FormData();
        data.append('video', file);
        Object.keys(formData).forEach(key => data.append(key, formData[key]));

        setLoading(true);
        try {
            await axios.post('/api/admin/videos', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Video uploaded successfully!');
            setFormData({
                title: '',
                domain: '',
                topic: '',
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                day: new Date().getDate(),
                description: ''
            });
            setFile(null);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this video?')) return;
        try {
            await axios.delete(`/api/admin/videos/${id}`);
            toast.success('Video deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete video');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-8">
                <h1 style={{ fontSize: '32px' }}>Video Management</h1>
                <p style={{ color: 'var(--text-muted)' }}>Upload and organize learning material</p>
            </div>

            <div className="grid grid-cols-3 gap-8">
                {/* Upload Form */}
                <div className="card" style={{ height: 'fit-content' }}>
                    <h3 className="mb-6 flex items-center gap-2">
                        <Upload size={20} className="text-primary" />
                        Upload New Video
                    </h3>
                    <form onSubmit={handleUpload}>
                        <div className="input-group">
                            <label className="label">Title</label>
                            <input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="label">Domain</label>
                                <select value={formData.domain} onChange={handleDomainChange} required>
                                    <option value="">Select Domain</option>
                                    {domains.map(d => (<option key={d._id} value={d._id}>{d.name}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="label">Topic</label>
                                <select value={formData.topic} onChange={(e) => setFormData({ ...formData, topic: e.target.value })} required>
                                    <option value="">Select Topic</option>
                                    {topics.map(t => (<option key={t._id} value={t._id}>{t.name}</option>))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <div>
                                <label className="label">Year</label>
                                <input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} required />
                            </div>
                            <div>
                                <label className="label">Month</label>
                                <input type="number" min="1" max="12" value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} required />
                            </div>
                            <div>
                                <label className="label">Day</label>
                                <input type="number" min="1" max="31" value={formData.day} onChange={(e) => setFormData({ ...formData, day: e.target.value })} required />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="label">Video File</label>
                            <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} required />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Uploading...' : 'Start Upload'}
                        </button>
                    </form>
                </div>

                {/* Video List */}
                <div className="col-span-2" style={{ gridColumn: 'span 2' }}>
                    <div className="grid grid-cols-2 gap-4">
                        {videos.map(video => (
                            <div key={video._id} className="card">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
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
                                    <button
                                        onClick={() => handleDelete(video._id)}
                                        className="btn btn-secondary"
                                        style={{ padding: '6px', color: 'var(--error)' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 py-2 border-t border-b border-border mb-4" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        {video.day}/{video.month}/{video.year}
                                    </div>
                                    <div>{(video.size / (1024 * 1024)).toFixed(2)} MB</div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPreviewVideo(video)}
                                        className="btn btn-secondary"
                                        style={{ flex: 1, fontSize: '13px' }}
                                    >
                                        <Play size={14} /> Preview
                                    </button>
                                </div>
                            </div>
                        ))}
                        {videos.length === 0 && (
                            <div className="col-span-2 text-center py-20 card" style={{ color: 'var(--text-muted)' }}>
                                <Video size={48} className="mb-4 opacity-20" style={{ display: 'block', margin: '0 auto' }} />
                                No videos uploaded yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Preview Modal */}
            {previewVideo && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px'
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '900px', position: 'relative', padding: 0, overflow: 'hidden' }}>
                        <button
                            onClick={() => setPreviewVideo(null)}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                background: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                cursor: 'pointer',
                                zIndex: 10
                            }}
                        >✕</button>
                        <video
                            controls
                            autoPlay
                            style={{ width: '100%', display: 'block' }}
                        >
                            <source src={`/api/admin/stream/${previewVideo._id}?token=${localStorage.getItem('token')}`} type="video/mp4" />
                        </video>
                        <div style={{ padding: '20px' }}>
                            <h3>{previewVideo.title}</h3>
                            <p style={{ color: 'var(--text-muted)' }}>{previewVideo.domain?.name} • {previewVideo.topic?.name}</p>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default VideoList;
