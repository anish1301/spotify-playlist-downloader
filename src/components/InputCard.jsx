// src/components/InputCard.jsx
import { useState } from 'react';
import { getPlaylist, getPlaylistTracks } from '../services/spotifyService';
import { extractPlaylistId } from '../utils/helpers';
import '../styles/InputCard.css';

function InputCard({ onSuccess, onError, isLoading, setLoading }) {
  const [playlistUrl, setPlaylistUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedUrl = playlistUrl.trim();
    if (!trimmedUrl) {
      onError('Please enter a Spotify playlist URL or ID');
      return;
    }
    
    setLoading(true);
    
    try {
      const playlistId = extractPlaylistId(trimmedUrl);
      if (!playlistId) {
        throw new Error('Invalid playlist URL or ID');
      }
  
      const playlistData = await getPlaylist(playlistId);
      const tracks = await getPlaylistTracks(playlistId);
      
      onSuccess({
        ...playlistData,
        tracks: { items: tracks.items }
      });
    } catch (error) {
      console.error('Error:', error);
      if (error.status === 404) {
        onError('Playlist not found or is private');
      } else if (error.status === 401) {
        onError('Session expired. Please login again');
        localStorage.removeItem('spotify_token');
        setTimeout(() => window.location.reload(), 2000);
      } else {
        onError(error.message || 'Failed to load playlist');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="input-card">
      <h2>Enter Playlist</h2>
      <p className="instruction">
        Paste a Spotify playlist URL or ID
      </p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={playlistUrl}
          onChange={(e) => setPlaylistUrl(e.target.value)}
          placeholder="https://open.spotify.com/playlist/..."
          disabled={isLoading}
        />
        
        <button 
          type="submit"
          disabled={isLoading}
          className={isLoading ? 'loading' : ''}
        >
          {isLoading ? 'Loading...' : 'Search'}
        </button>
      </form>
      
      <div className="examples">
        <p>Examples:</p>
        <ul>
          <li>https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M</li>
          <li>spotify:playlist:37i9dQZF1DXcBWIGoYBM5M</li>
          <li>37i9dQZF1DXcBWIGoYBM5M</li>
        </ul>
      </div>
    </div>
  );
}

export default InputCard;