// src/components/PlaylistCard.jsx
import React, { useState } from 'react';
import { formatDuration, formatArtistNames, formatTrackCount } from '../utils/helpers';
import '../styles/PlaylistCard.css';
import TrackItem from './TrackItem' 
import axios from 'axios';

const PlaylistCard = ({ playlist, onBack }) => {
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  // Handle track selection
  const handleTrackSelection = (trackId) => {
    if (selectedTracks.includes(trackId)) {
      setSelectedTracks(selectedTracks.filter(id => id !== trackId));
    } else {
      setSelectedTracks([...selectedTracks, trackId]);
    }
  };
  
  // Select/deselect all tracks
  const handleSelectAll = () => {
    if (selectedTracks.length === playlist.tracks.items.length) {
      setSelectedTracks([]);
    } else {
      setSelectedTracks(playlist.tracks.items.map(item => item.track.id));
    }
  };
  
  // Handle download button click
  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      const response = await axios.post('http://localhost:3001/download', {
        tracks: playlist.tracks
      }, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setDownloadProgress(progress);
        }
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${playlist.name}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };
  
  // Calculate if all tracks are selected
  const allTracksSelected = playlist && 
    selectedTracks.length === playlist.tracks.items.length;
  
  return (
    <div className="playlist-card">
      {playlist && (
        <>
          <div className="playlist-header">
            <button className="back-button" onClick={onBack}>
              &larr; Back
            </button>
            
            <div className="playlist-info">
              {playlist.images && playlist.images[0] && (
                <img 
                  src={playlist.images[0].url} 
                  alt={playlist.name}
                  className="playlist-image" 
                />
              )}
              
              <div className="playlist-details">
                <h2>{playlist.name}</h2>
                <p>By {playlist.owner.display_name}</p>
                <p>{formatTrackCount(playlist.tracks.total)} • {playlist.followers.total} followers</p>
                <p className="playlist-description">{playlist.description}</p>
              </div>
            </div>
          </div>
          
          <div className="playlist-actions">
            <button 
              className="select-all-button"
              onClick={handleSelectAll}
            >
              {allTracksSelected ? 'Deselect All' : 'Select All'}
            </button>
            
            <button 
              className="download-button"
              disabled={selectedTracks.length === 0 || isDownloading}
              onClick={handleDownload}
            >
              {isDownloading 
                ? `Downloading... ${downloadProgress}%` 
                : `Download ${selectedTracks.length} selected`}
            </button>
          </div>
          
          {isDownloading && (
            <div className="progress-bar-container">
              <div 
                className="progress-bar" 
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
          )}
          
          <div className="tracks-container">
            <div className="tracks-header">
              <div className="track-number">#</div>
              <div className="track-info">Title</div>
              <div className="track-duration">Duration</div>
              <div className="track-selection">Select</div>
            </div>
            
            <div className="tracks-list">
              {playlist.tracks.items.map((item, index) => (
                <div key={item.track.id} className="track-item">
                  <div className="track-number">{index + 1}</div>
                  
                  <div className="track-info">
                    <div className="track-name">{item.track.name}</div>
                    <div className="track-artist">
                      {formatArtistNames(item.track.artists)}
                    </div>
                  </div>
                  
                  <div className="track-duration">
                    {formatDuration(item.track.duration_ms)}
                  </div>
                  
                  <div className="track-selection">
                    <input 
                      type="checkbox"
                      checked={selectedTracks.includes(item.track.id)}
                      onChange={() => handleTrackSelection(item.track.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlaylistCard;