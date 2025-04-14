// src/components/Footer.jsx
import React from 'react';
import '../styles/Footer.css';

function Footer() {
  console.log('Rendering Footer');
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Spotify Playlist Downloader</p>
      <div className="disclaimer">
        <p>
          This tool is designed for personal use only. Please respect copyright laws and 
          artists' rights by only downloading content you have the right to access.
        </p>
        <p>
          This application is not affiliated with or endorsed by Spotify.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

// src/utils/helpers.js
// Parse hash parameters from URL
export const getHashParams = () => {
  const hashParams = {};
  const hash = window.location.hash.substring(1);
  const params = hash.split('&');
  
  for (let i = 0; i < params.length; i++) {
    if (!params[i]) continue;
    
    const pair = params[i].split('=');
    hashParams[pair[0]] = decodeURIComponent(pair[1]);
  }
  
  return hashParams;
};

// Extract playlist ID from URL
export const extractPlaylistId = (url) => {
  if (!url) return null;
  
  // Handle direct Spotify URLs
  if (url.includes('spotify.com/playlist/')) {
    const matches = url.match(/spotify\.com\/playlist\/([a-zA-Z0-9]+)/);
    return matches ? matches[1] : null;
  }
  
  // Handle direct IDs
  if (/^[a-zA-Z0-9]{22}$/.test(url.trim())) {
    return url.trim();
  }
  
  return null;
};

// Format milliseconds to MM:SS format
export const formatDuration = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};