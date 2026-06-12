import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import VideoPlayer from './pages/VideoPlayer';
import Channel from './pages/Channel';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="app-layout">
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      <Routes>
        <Route
          path="/auth"
          element={
            <main className="main-content">
              <Auth />
            </main>
          }
        />
        <Route
          path="/*"
          element={
            <>
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
              <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Home
                        searchQuery={searchQuery}
                        activeCategory={activeCategory}
                        onCategoryChange={setActiveCategory}
                      />
                    }
                  />
                  <Route path="/watch/:videoId" element={<VideoPlayer />} />
                  <Route path="/channel" element={<Channel />} />
                  <Route path="/channel/:channelId" element={<Channel />} />
                </Routes>
              </main>
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
