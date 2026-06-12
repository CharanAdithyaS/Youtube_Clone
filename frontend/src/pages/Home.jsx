import { useState, useEffect } from 'react';
import api from '../api/axios';
import FilterButtons from '../components/FilterButtons';
import VideoCard from '../components/VideoCard';
import './Home.css';

const Home = ({ searchQuery, activeCategory, onCategoryChange }) => {
  const [videos, setVideos] = useState([]);
  const [channelMap, setChannelMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (activeCategory && activeCategory !== 'All') params.category = activeCategory;

        const res = await api.get('/videos', { params });
        setVideos(res.data);

        const channelIds = [...new Set(res.data.map((v) => v.channelId))];
        const names = {};
        await Promise.all(
          channelIds.map(async (id) => {
            try {
              const ch = await api.get(`/channels/${id}`);
              names[id] = ch.data.channel.channelName;
            } catch {
              names[id] = 'Unknown Channel';
            }
          })
        );
        setChannelMap(names);
      } catch {
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchQuery, activeCategory]);

  return (
    <div className="page-container home-page">
      <FilterButtons activeCategory={activeCategory} onCategoryChange={onCategoryChange} />

      {loading ? (
        <div className="loading">Loading videos...</div>
      ) : videos.length === 0 ? (
        <div className="loading">No videos found. Try a different search or filter.</div>
      ) : (
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard
              key={video.videoId}
              video={video}
              channelName={channelMap[video.channelId]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
