import React from 'react';
import '../styles/TrackItem.css';

function TrackItem({ track, index, status, onDownload }) {
  // Format track duration from milliseconds to MM:SS
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Get status label and class
  const getStatusInfo = () => {
    switch (status) {
      case 'searching':
        return { label: 'Searching...', className: 'status-searching' };
      case 'generating':
        return { label: 'Generating link...', className: 'status-generating' };
      case 'downloaded':
        return { label: 'Downloaded', className: 'status-downloaded' };
      case 'error':
        return { label: 'Error', className: 'status-error' };
      default:
        return { label: '', className: '' };
    }
  };
  
  const statusInfo = getStatusInfo();

  return (
    <div className={`track-item ${statusInfo.className}`}>
      <div className="track-number">{index + 1}</div>
      <div className="track-title">
        <strong>{track.name}</strong>
        <span className="track-artist">{track.artist}</span>
      </div>
      <div className="track-duration">{formatDuration(track.duration)}</div>
      <div className="track-status">{statusInfo.label}</div>
      <button 
        onClick={onDownload} 
        className="track-download-btn"
        disabled={status === 'searching' || status === 'generating' || status === 'downloaded'}
      >
        {status ? (status === 'downloaded' ? '✓' : '...') : 'Download'}
      </button>
    </div>
  );
}

export default TrackItem;