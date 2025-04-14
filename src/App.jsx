import React, { useState, useEffect } from 'react';
import AuthCard from './components/AuthCard';
import InputCard from './components/InputCard';
import PlaylistCard from './components/PlaylistCard';
import Footer from './components/Footer';
import { initSpotifyApi, authenticateSpotify, fetchPlaylist, fetchPlaylistTracks } from './services/spotifyService';


function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if we have a token in the URL hash
    const hash = window.location.hash;
    if (hash) {
      const token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];
      if (token) {
        setAccessToken(token);
        initSpotifyApi(token);
        // Clear the hash from URL
        window.location.hash = '';
      }
    }
  }, []);

  const handleLogin = () => {
    authenticateSpotify();
  };

  const handleSubmit = async (playlistUrl) => {
    setLoading(true);
    setError(null);
    try {
      // Extract playlist ID from URL
      const playlistId = playlistUrl.split('playlist/')[1]?.split('?')[0];
      if (!playlistId) {
        throw new Error('Invalid playlist URL');
      }

      const playlistData = await fetchPlaylist(playlistId);
      setPlaylist(playlistData);

      const tracksData = await fetchPlaylistTracks(playlistId);
      setTracks(tracksData);
    } catch (err) {
      setError(err.message);
      setPlaylist(null);
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setPlaylist(null);
    setTracks([]);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">Spotify Playlist Downloader</div>
        <div className="tagline">Download your favorite tracks for offline listening</div>
      </header>

      <main className="app-main">
        {!accessToken && <AuthCard onLogin={handleLogin} />}
        
        {accessToken && !playlist && (
          <InputCard 
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        )}
        
        {accessToken && playlist && (
          <PlaylistCard 
            playlist={playlist}
            tracks={tracks}
            onBack={handleBack}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;