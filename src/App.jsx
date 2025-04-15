// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import AuthCard from './components/AuthCard';
import InputCard from './components/InputCard';
import PlaylistCard from './components/PlaylistCard';
import Footer from './components/Footer';
import { initSpotifyApi, authenticateSpotify, fetchPlaylist, fetchPlaylistTracks, checkTokenValidity } from './services/spotifyService';

// Main app wrapper with router
function App() {
  return (
    <BrowserRouter>
      <SpotifyApp />
    </BrowserRouter>
  );
}

function SpotifyApp() {
  const [accessToken, setAccessToken] = useState(() => {
    // Check if token exists in localStorage first
    return localStorage.getItem('spotify_access_token') || null;
  });
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we have a token in the URL hash
    const hash = window.location.hash;
    if (hash) {
      try {
        const hashParams = new URLSearchParams(hash.substring(1));
        const token = hashParams.get('access_token');
        const state = hashParams.get('state');
        const storedState = localStorage.getItem('spotify_auth_state');
        
        // Verify state to prevent CSRF attacks
        if (state === null || state !== storedState) {
          setError('State mismatch. Authentication failed.');
        } else if (token) {
          // Save token to localStorage
          localStorage.setItem('spotify_access_token', token);
          setAccessToken(token);
          initSpotifyApi(token);
          
          // Clear the hash from URL
          window.history.replaceState(null, null, '/');
          
          // Navigate to input after successful auth
          navigate('/input');
        }
      } catch (err) {
        console.error('Error parsing hash params:', err);
        setError('Authentication failed. Please try again.');
      }
    }
    
    // Initialize API if we already have a token
    if (accessToken) {
      initSpotifyApi(accessToken);
      
      // Check if the token is still valid
      checkTokenValidity().then(isValid => {
        if (!isValid) {
          // Token expired, log out
          handleLogout();
        } else if (location.pathname === '/') {
          // If we're at the root path with a valid token, redirect to input
          navigate('/input');
        }
      });
    } else if (location.pathname !== '/' && location.pathname !== '/auth') {
      // If no token but trying to access protected routes, redirect to auth
      navigate('/auth');
    }
    
    setAuthLoading(false);
  }, [location.pathname]);

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
      
      // Navigate to the playlist route with the ID
      navigate(`/playlist/${playlistId}`);
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
    navigate('/input');
  };

  const handleLogout = () => {
    setAccessToken(null);
    setPlaylist(null);
    setTracks([]);
    setError(null);
    localStorage.removeItem('spotify_access_token');
    navigate('/auth');
  };

  // Component that handles the playlist route with ID parameter
  const PlaylistRoute = () => {
    const { playlistId } = useParams();
    
    useEffect(() => {
      // If we have a playlist ID from URL but no playlist data, fetch it
      if (playlistId && (!playlist || playlist.id !== playlistId)) {
        const fetchPlaylistData = async () => {
          setLoading(true);
          try {
            const playlistData = await fetchPlaylist(playlistId);
            setPlaylist(playlistData);
            
            const tracksData = await fetchPlaylistTracks(playlistId);
            setTracks(tracksData);
          } catch (err) {
            console.error('Error fetching playlist by ID:', err);
            setError(err.message || 'Failed to load playlist. Please try again.');
            navigate('/input');
          } finally {
            setLoading(false);
          }
        };
        
        fetchPlaylistData();
      }
    }, [playlistId]);
    
    if (loading) {
      return <div className="loading-spinner">Loading playlist...</div>;
    }
    
    return (
      <PlaylistCard
        playlist={playlist}
        tracks={tracks}
        onBack={handleBack}
        error={error}
      />
    );
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
        <Routes>
          <Route path="/" element={accessToken ? <Navigate to="/input" /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={accessToken ? <Navigate to="/input" /> : <AuthCard onLogin={handleLogin} />} />
          <Route path="/input" element={
            !accessToken ? <Navigate to="/auth" /> : 
            <InputCard onSubmit={handleSubmit} loading={loading} error={error} />
          } />
          <Route path="/playlist/:playlistId" element={
            !accessToken ? <Navigate to="/auth" /> : <PlaylistRoute />
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;