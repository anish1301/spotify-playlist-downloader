import React, { useState, useEffect } from 'react';
import AuthCard from './components/AuthCard';
import InputCard from './components/InputCard';
import PlaylistCard from './components/PlaylistCard';
import Footer from './components/Footer';
import { initSpotifyApi, authenticateSpotify, fetchPlaylist, fetchPlaylistTracks } from './services/spotifyService';

function App() {
  const [accessToken, setAccessToken] = useState(() => {
    // Check if token exists in localStorage first
    return localStorage.getItem('spotify_access_token') || null;
  });
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if we have a token in the URL hash
    const hash = window.location.hash;
    if (hash) {
      try {
        const hashParams = new URLSearchParams(hash.substring(1));
        const token = hashParams.get('access_token');
        
        if (token) {
          // Save token to localStorage
          localStorage.setItem('spotify_access_token', token);
          setAccessToken(token);
          initSpotifyApi(token);
          
          // Clear the hash from URL
          window.history.replaceState(null, null, ' ');
        }
      } catch (err) {
        console.error('Error parsing hash params:', err);
        setError('Authentication failed. Please try again.');
      }
    }
    
    // Initialize API if we already have a token
    if (accessToken) {
      initSpotifyApi(accessToken);
    }
    
    setAuthLoading(false);
  }, []);

  // Effect to handle token expiration or removal
  useEffect(() => {
    if (!accessToken) {
      localStorage.removeItem('spotify_access_token');
    }
  }, [accessToken]);

  const handleLogin = () => {
    setAuthLoading(true);
    authenticateSpotify();
  };

  const handleSubmit = async (playlistUrl) => {
    if (!playlistUrl || !playlistUrl.trim()) {
      setError('Please enter a playlist URL');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Extract playlist ID from URL - support multiple URL formats
      let playlistId;
      
      if (playlistUrl.includes('playlist/')) {
        playlistId = playlistUrl.split('playlist/')[1]?.split(/[/?#]/)[0];
      } else if (playlistUrl.includes('open.spotify.com')) {
        const urlObj = new URL(playlistUrl);
        const pathParts = urlObj.pathname.split('/');
        const playlistIndex = pathParts.indexOf('playlist');
        if (playlistIndex !== -1 && playlistIndex < pathParts.length - 1) {
          playlistId = pathParts[playlistIndex + 1];
        }
      }
      
      if (!playlistId) {
        throw new Error('Invalid playlist URL. Please check the URL and try again.');
      }

      const playlistData = await fetchPlaylist(playlistId);
      setPlaylist(playlistData);

      const tracksData = await fetchPlaylistTracks(playlistId);
      setTracks(tracksData);
    } catch (err) {
      console.error('Error fetching playlist:', err);
      setError(err.message || 'Failed to load playlist. Please try again.');
      setPlaylist(null);
      setTracks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setPlaylist(null);
    setTracks([]);
    setError(null);
  };

  const handleLogout = () => {
    setAccessToken(null);
    setPlaylist(null);
    setTracks([]);
    setError(null);
    localStorage.removeItem('spotify_access_token');
  };

  if (authLoading) {
    return (
      <div className="app-container">
        <header className="app-header">
          <div className="logo">Spotify Playlist Downloader</div>
        </header>
        <main className="app-main">
          <div className="loading-spinner">Loading authentication...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">Spotify Playlist Downloader</div>
        <div className="tagline">Download your favorite tracks for offline listening</div>
        {accessToken && (
          <button 
            className="logout-button" 
            onClick={handleLogout}
            aria-label="Logout from Spotify"
          >
            Logout
          </button>
        )}
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
            error={error}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;