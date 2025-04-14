import React, { useState } from 'react';
import '../styles/InputCard.css';

function InputCard({ onSubmit, loading, error }) {
  const [playlistUrl, setPlaylistUrl] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(playlistUrl);
  };
  
  return (
    <div className="card input-card">
      <h2>Step 2: Enter Playlist URL</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="playlist-url">Enter Spotify Playlist URL or ID:</label>
          <input
            type="text"
            id="playlist-url"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            placeholder="https://open.spotify.com/playlist/..."
            required
          />
        </div>
        
        {error && (
          <div className="error-message">{error}</div>
        )}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get Playlist'}
        </button>
      </form>
    </div>
  );
}

export default InputCard;