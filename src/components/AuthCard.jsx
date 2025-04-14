// src/components/AuthCard.jsx
import React from 'react';
import '../styles/AuthCard.css';

function AuthCard({ onLogin }) {
  console.log('Rendering AuthCard');
  return (
    <div className="card auth-card">
      <h2>Step 1: Connect with Spotify</h2>
      <p>To access your playlists, you'll need to authorize this app with your Spotify account.</p>
      <p>This is a client-side only application - your data never leaves your browser.</p>
      <button onClick={onLogin} className="spotify-login-btn">
        Connect with Spotify
      </button>
      <div className="disclaimer">
        <strong>Note:</strong> This app requires Spotify authentication to access playlist data.
        We don't store any of your information or access your account beyond retrieving
        playlist details that you explicitly request.
      </div>
    </div>
  );
}

export default AuthCard;

// src/components/InputCard.jsx
