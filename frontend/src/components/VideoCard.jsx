import { Link } from 'react-router-dom';
import './VideoCard.css';

const formatViews = (views) => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
  return `${views} views`;
};

const VideoCard = ({ video, channelName }) => {
  return (
    <Link to={`/watch/${video.videoId}`} className="video-card">
      <div className="thumbnail-wrap">
        <img src={video.thumbnailUrl} alt={video.title} loading="lazy" />
      </div>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <p className="channel-name">{channelName || 'Unknown Channel'}</p>
        <p className="video-meta">{formatViews(video.views)}</p>
      </div>
    </Link>
  );
};

export default VideoCard;
