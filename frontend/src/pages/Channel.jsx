import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Channel.css';

const Channel = () => {
  const { channelId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myChannels, setMyChannels] = useState([]);
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showUploadVideo, setShowUploadVideo] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  const [channelForm, setChannelForm] = useState({ channelName: '', description: '' });
  const [videoForm, setVideoForm] = useState({
    title: '', description: '', videoUrl: '', thumbnailUrl: '', category: 'Education',
  });
  const [error, setError] = useState('');

  const isOwner = user && channel && channel.owner === user.userId;

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        if (channelId) {
          const res = await api.get(`/channels/${channelId}`);
          setChannel(res.data.channel);
          setVideos(res.data.videos);
          setOwner(res.data.owner);
        } else {
          const res = await api.get('/channels/my');
          setMyChannels(res.data);
          if (res.data.length > 0) {
            navigate(`/channel/${res.data[0].channelId}`);
          }
        }
      } catch {
        setError('Failed to load channel data');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [channelId, user, navigate]);

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/channels', channelForm);
      navigate(`/channel/${res.data.channelId}`);
      setShowCreateChannel(false);
      setChannelForm({ channelName: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create channel');
    }
  };

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingVideo) {
        await api.put(`/videos/${editingVideo.videoId}`, videoForm);
      } else {
        await api.post('/videos', { ...videoForm, channelId: channel.channelId });
      }
      const res = await api.get(`/channels/${channel.channelId}`);
      setVideos(res.data.videos);
      setShowUploadVideo(false);
      setEditingVideo(null);
      setVideoForm({ title: '', description: '', videoUrl: '', thumbnailUrl: '', category: 'Education' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save video');
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Delete this video?')) return;
    await api.delete(`/videos/${videoId}`);
    setVideos(videos.filter((v) => v.videoId !== videoId));
  };

  const startEdit = (video) => {
    setEditingVideo(video);
    setVideoForm({
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      category: video.category,
    });
    setShowUploadVideo(true);
  };

  if (!user) return null;

  if (loading) return <div className="loading page-container">Loading channel...</div>;

  if (!channelId && myChannels.length === 0) {
    return (
      <div className="page-container channel-page">
        <div className="no-channel">
          <h2>You don't have a channel yet</h2>
          <p>Create one to start uploading videos.</p>
          <button className="btn-primary" onClick={() => setShowCreateChannel(true)}>Create Channel</button>
        </div>

        {showCreateChannel && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Create Your Channel</h3>
              <form onSubmit={handleCreateChannel}>
                <div className="form-group">
                  <label>Channel Name</label>
                  <input
                    value={channelForm.channelName}
                    onChange={(e) => setChannelForm({ ...channelForm, channelName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={channelForm.description}
                    onChange={(e) => setChannelForm({ ...channelForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                {error && <p className="error-msg">{error}</p>}
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowCreateChannel(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!channel) return <div className="loading page-container">Channel not found.</div>;

  return (
    <div className="page-container channel-page">
      <div className="channel-banner">
        <img src={channel.channelBanner} alt="" />
      </div>

      <div className="channel-header">
        <div className="channel-avatar-lg">{channel.channelName.charAt(0)}</div>
        <div className="channel-info">
          <h1>{channel.channelName}</h1>
          <p>{channel.subscribers.toLocaleString()} subscribers · {videos.length} videos</p>
          <p className="channel-desc">{channel.description}</p>
          {owner && <p className="channel-owner">by {owner.username}</p>}
        </div>
        {isOwner && (
          <div className="channel-actions">
            <button className="btn-primary" onClick={() => { setEditingVideo(null); setShowUploadVideo(true); }}>
              Upload Video
            </button>
          </div>
        )}
      </div>

      <h2 className="section-title">Videos</h2>
      <div className="channel-videos">
        {videos.length === 0 ? (
          <p className="no-videos">No videos uploaded yet.</p>
        ) : (
          videos.map((video) => (
            <div key={video.videoId} className="channel-video-card">
              <Link to={`/watch/${video.videoId}`}>
                <img src={video.thumbnailUrl} alt={video.title} />
                <div className="cv-info">
                  <h3>{video.title}</h3>
                  <p>{video.views.toLocaleString()} views · {video.category}</p>
                </div>
              </Link>
              {isOwner && (
                <div className="cv-actions">
                  <button onClick={() => startEdit(video)}>Edit</button>
                  <button onClick={() => handleDeleteVideo(video.videoId)}>Delete</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showUploadVideo && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingVideo ? 'Edit Video' : 'Upload Video'}</h3>
            <form onSubmit={handleUploadVideo}>
              <div className="form-group">
                <label>Title</label>
                <input value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={videoForm.description} onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })} rows={3} />
              </div>
              <div className="form-group">
                <label>Video URL</label>
                <input value={videoForm.videoUrl} onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })} required placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Thumbnail URL (optional)</label>
                <input value={videoForm.thumbnailUrl} onChange={(e) => setVideoForm({ ...videoForm, thumbnailUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={videoForm.category} onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}>
                  <option>Education</option>
                  <option>Tech</option>
                  <option>Gaming</option>
                  <option>Music</option>
                  <option>Entertainment</option>
                  <option>News</option>
                </select>
              </div>
              {error && <p className="error-msg">{error}</p>}
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => { setShowUploadVideo(false); setEditingVideo(null); }}>Cancel</button>
                <button type="submit" className="btn-primary">{editingVideo ? 'Save Changes' : 'Upload'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Channel;
