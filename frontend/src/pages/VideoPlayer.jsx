import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [channelName, setChannelName] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);

  const loadVideo = async () => {
    const res = await api.get(`/videos/${videoId}`);
    setVideo(res.data.video);
    setChannelName(res.data.channelName);
  };

  const loadComments = async () => {
    const res = await api.get(`/comments/${videoId}`);
    setComments(res.data);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await Promise.all([loadVideo(), loadComments()]);
      } catch {
        setVideo(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [videoId]);

  const handleLike = async () => {
    if (!user) return;
    const res = await api.post(`/videos/${videoId}/like`);
    setVideo((prev) => ({ ...prev, likes: res.data.likes, dislikes: res.data.dislikes }));
  };

  const handleDislike = async () => {
    if (!user) return;
    const res = await api.post(`/videos/${videoId}/dislike`);
    setVideo((prev) => ({ ...prev, likes: res.data.likes, dislikes: res.data.dislikes }));
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    const res = await api.post(`/comments/${videoId}`, { text: newComment });
    setComments([res.data, ...comments]);
    setNewComment('');
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;
    const res = await api.put(`/comments/${commentId}`, { text: editText });
    setComments(comments.map((c) => (c.commentId === commentId ? res.data : c)));
    setEditingId(null);
    setEditText('');
  };

  const handleDeleteComment = async (commentId) => {
    await api.delete(`/comments/${commentId}`);
    setComments(comments.filter((c) => c.commentId !== commentId));
  };

  if (loading) return <div className="loading page-container">Loading video...</div>;
  if (!video) return <div className="loading page-container">Video not found.</div>;

  return (
    <div className="page-container video-player-page">
      <div className="player-section">
        <div className="video-player-wrap">
          <video src={video.videoUrl} controls autoPlay />
        </div>

        <h1 className="player-title">{video.title}</h1>

        <div className="player-actions">
          <div className="like-dislike">
            <button onClick={handleLike} disabled={!user} title={!user ? 'Sign in to like' : ''}>
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
              {video.likes}
            </button>
            <button onClick={handleDislike} disabled={!user} title={!user ? 'Sign in to dislike' : ''}>
              <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/></svg>
              {video.dislikes}
            </button>
          </div>
          <span className="view-count">{video.views.toLocaleString()} views</span>
        </div>

        <div className="channel-bar">
          <Link to={`/channel/${video.channelId}`} className="channel-link">
            <div className="channel-avatar">{channelName.charAt(0)}</div>
            <span>{channelName}</span>
          </Link>
        </div>

        <div className="video-description">
          <p>{video.description}</p>
        </div>
      </div>

      <div className="comments-section">
        <h2>{comments.length} Comments</h2>

        {user ? (
          <form className="comment-form" onSubmit={handleAddComment}>
            <img src={user.avatar} alt="" className="comment-avatar" />
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="btn-primary" disabled={!newComment.trim()}>Comment</button>
          </form>
        ) : (
          <p className="sign-in-prompt">
            <Link to="/auth">Sign in</Link> to leave a comment.
          </p>
        )}

        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.commentId} className="comment-item">
              <div className="comment-avatar-placeholder">{comment.username.charAt(0)}</div>
              <div className="comment-body">
                <p className="comment-author">{comment.username}</p>
                {editingId === comment.commentId ? (
                  <div className="edit-comment">
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button onClick={() => handleEditComment(comment.commentId)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                ) : (
                  <p className="comment-text">{comment.text}</p>
                )}
                {user && user.userId === comment.userId && editingId !== comment.commentId && (
                  <div className="comment-actions">
                    <button onClick={() => { setEditingId(comment.commentId); setEditText(comment.text); }}>Edit</button>
                    <button onClick={() => handleDeleteComment(comment.commentId)}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
