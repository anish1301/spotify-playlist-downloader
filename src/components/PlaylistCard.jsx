// src/components/PlaylistCard.jsx
import React, { useState } from 'react';
import TrackItem from './TrackItem';
import { searchYouTube, getY2MateDownloadUrl } from '../services/youtubeService';
import '../styles/PlaylistCard.css';

function PlaylistCard({ playlist, tracks, onBack }) {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [trackStatuses, setTrackStatuses] = useState({});

  // Update status for a specific track
  const updateTrackStatus = (trackId, status) => {
    setTrackStatuses(prev => ({
      ...prev,
      [trackId]: status
    }));
  };

  // Download a single track
  const downloadTrack = async (track) => {
    try {
      updateTrackStatus(track.id, 'searching');
      
      // Search for the track on YouTube
      const youtubeResult = await searchYouTube(track.query);
      
      updateTrackStatus(track.id, 'generating');
      
      // Get Y2Mate download URL
      const downloadUrl = getY2MateDownloadUrl(youtubeResult.url);
      
      // Open download in new tab (user will need to confirm)
      window.open(downloadUrl, '_blank');
      
      updateTrackStatus(track.id, 'downloaded');
      return true;
    } catch (error) {
      console.error(`Error downloading track ${track.name}:`, error);
      updateTrackStatus(track.id, 'error');
      return false;
    }
  };

  // Download all tracks sequentially
  const downloadAllTracks = async () => {
    setDownloading(true);
    
    for (let i = 0; i < tracks.length; i++) {
      setCurrentTrackIndex(i);
      setProgress(Math.floor((i / tracks.length) * 100));
      
      await downloadTrack(tracks[i], i);
      
      // Small delay between downloads to prevent overloading
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setProgress(100);
    setCurrentTrackIndex(null);
    setDownloading(false);
  };

  if (!playlist) return null;

  return (
    <div className="card playlist-card">
      <h2>Step 3: Download Tracks</h2>
      
      <div className="playlist-info">
        <img 
          src={playlist.images[0]?.url || '/placeholder.jpg'} 
          alt={playlist.name} 
          className="playlist-image"
        />
        <div className="playlist-details">
          <h3>{playlist.name}</h3>
          <p>By {playlist.owner.display_name}</p>
          <p>{tracks.length} tracks</p>
        </div>
      </div>
      
      <div className="track-list">
        {tracks.map((track, index) => (
          <TrackItem
            key={track.id}
            track={track}
            index={index}
            status={trackStatuses[track.id]}
            onDownload={() => downloadTrack(track)}
          />
        ))}
      </div>
      
      {downloading && (
        <div className="download-progress">
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p>
            Downloading {currentTrackIndex !== null ? `track ${currentTrackIndex + 1} of ${tracks.length}` : ''}
            ({progress}% complete)
          </p>
        </div>
      )}
      
      <div className="playlist-actions">
        <button 
          onClick={downloadAllTracks}
          disabled={downloading}
          className="download-all-btn"
        >
          {downloading ? 'Downloading...' : 'Download All Tracks'}
        </button>
        <button onClick={onBack} className="back-btn">
          Back to Search
        </button>
      </div>
      
      <div className="download-notice">
        <p>
          <strong>Note:</strong> Due to browser security restrictions, you may need to allow pop-ups
          and confirm each download. This is to ensure your security.
        </p>
      </div>
    </div>
  );
}

export default PlaylistCard;

// src/components/TrackItem.jsx
