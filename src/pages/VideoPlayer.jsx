import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ArrowLeft, ShieldAlert, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const VideoPlayer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const videoRef = useRef(null);

    useEffect(() => {
        // Disable right click
        const handleContextMenu = (e) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);

        // Disable keyboard shortcuts for downloading/source view
        const handleKeyDown = (e) => {
            if ((e.ctrlKey && (e.key === 's' || e.key === 'u')) || e.key === 'F12') {
                e.preventDefault();
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Use token for streaming authorization
    const token = localStorage.getItem('token');
    const videoUrl = `/api/user/stream/${id}?token=${token}`;

    // In actual implementation, we might use a blob URL or a specialized player, 
    // but standard <video> with token-guarded API works for this requirement.

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button onClick={() => navigate(-1)} className="btn btn-secondary mb-6">
                <ArrowLeft size={18} />
                Back to Library
            </button>

            <div className="card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px', z: '10', pointerEvents: 'none' }}>
                    <div className="badge badge-active" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: 'white' }}>
                        <Lock size={12} style={{ marginRight: '5px' }} />
                        Protected Stream
                    </div>
                </div>

                <video
                    ref={videoRef}
                    controls
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                    style={{ width: '100%', display: 'block', maxHeight: '75vh' }}
                >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-8">
                <div>
                    <h2 className="mb-2">Streaming Security Policy</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                        This session is being monitored. Your IP address and account activity are logged for security purposes.
                        Sharing or recording this content is strictly prohibited and can lead to account suspension.
                    </p>
                </div>
                <div className="flex items-center justify-end">
                    <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', gap: '12px' }}>
                        <ShieldAlert className="text-accent" />
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            <strong style={{ color: 'var(--text-main)', display: 'block' }}>Digital Rights Protected</strong>
                            Content is encrypted and delivered via secure gateway.
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default VideoPlayer;
