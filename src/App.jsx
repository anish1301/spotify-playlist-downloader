// src/App.jsx
import SpotifyWebApi from 'spotify-web-api-js';
import { useState, useEffect } from 'react';
import { getHashParams } from './utils/helpers';
import { getUser, initializeSpotifyApi } from './services/spotifyService'; // Added initializeSpotifyApi
import AuthCard from './components/AuthCard';
import InputCard from './components/InputCard';
import PlaylistCard from './components/PlaylistCard';
import Footer from './components/Footer';
import './styles/App.css';


function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playlist, setPlaylist] = useState(null);

  // Check for token on page load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const params = getHashParams();
        if (params.access_token) {
          await initializeSpotifyApi(params.access_token);
          setToken(params.access_token);
          localStorage.setItem('spotify_token', params.access_token);
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          const storedToken = localStorage.getItem('spotify_token');
          if (storedToken) {
            try {
              await initializeSpotifyApi(storedToken);
              setToken(storedToken);
            } catch (error) {
              localStorage.removeItem('spotify_token');
              setToken(null);
              throw new Error('Stored token is invalid');
            }
          }
        }
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('spotify_token');
        setToken(null);
        setError(error.message || 'Failed to initialize Spotify API');
      }
    };
  
    initAuth();
  }, []);

  // Fetch user profile when token is available
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  // Fetch user profile from Spotify
  const fetchUserProfile = async () => {
    try {
      const userData = await getUser(token);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // If token is invalid, clear it
      if (error.status === 401) {
        localStorage.removeItem('spotify_token');
        setToken(null);
      }
    }
  };

  // Handle errors
  const handleError = (message) => {
    setError(message);
    setIsLoading(false);
    
    // Clear error after 5 seconds
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  // Handle successful playlist fetch
  const handlePlaylistSuccess = (data) => {
    setPlaylist(data);
    setIsLoading(false);
    setError(null);
  };

  // Go back to input screen
  const handleBackToInput = () => {
    setPlaylist(null);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('spotify_token');
    setToken(null);
    setUser(null);
    setPlaylist(null);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <img src="/logo192.png" alt="Spotify Playlist Downloader" />
          <h1>Spotify Playlist Downloader</h1>
        </div>
        
        {user && (
          <div className="user-info">
            <span>Hello, {user.display_name}</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </header>
      
      <main className="main-content">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {!token ? (
          <AuthCard />
        ) : playlist ? (
          <PlaylistCard 
            playlist={playlist} 
            onBack={handleBackToInput} 
          />
        ) : (
          <InputCard 
            onSuccess={handlePlaylistSuccess}
            onError={handleError}
            isLoading={isLoading}
            setLoading={setIsLoading}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;