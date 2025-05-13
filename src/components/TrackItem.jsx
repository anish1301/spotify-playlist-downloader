// src/components/TrackItem.jsx
import { useState } from 'react';
import { formatDuration, formatArtistNames, createSearchQuery } from '../utils/helpers';
import { searchYouTube, getYouTubeUrl, fallbackYouTubeSearch } from '../services/youtubeService';
import '../styles/TrackItem.css';
import PropTypes from 'prop-types';

function TrackItem({ track, isSelected, onToggleSelect }) {
  const [youtubeResult, setYoutubeResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleFindOnYoutube = async (e) => {
    e.stopPropagation();
    
    if (youtubeResult) {
      setExpanded(!expanded);
      return;
    }
    
    setSearching(true);
    
    try {
      const query = createSearchQuery(track.name, formatArtistNames(track.artists));
      const result = await searchYouTube(query);
      
      if (result) {
        setYoutubeResult(result);
        setExpanded(true);
      } else {
        // Fallback to a simpler approach if API fails
        setYoutubeResult(fallbackYouTubeSearch(query));
        setExpanded(true);
      }
    } catch (error) {
      console.error('Error searching YouTube:', error);
    } finally {
      setSearching(false);
    }
  };
  TrackItem.propTypes = {
    track: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      artists: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired
      })).isRequired,
      album: PropTypes.shape({
        name: PropTypes.string,
        images: PropTypes.arrayOf(PropTypes.shape({
          url: PropTypes.string.isRequired
        }))
      }),
      duration_ms: PropTypes.number.isRequired
    }).isRequired,
    isSelected: PropTypes.bool.isRequired,
    onToggleSelect: PropTypes.func.isRequired
  };

  return (
    <div className={`track-item ${isSelected ? 'selected' : ''} ${expanded ? 'expanded' : ''}`}>
      <div className="track-main" onClick={onToggleSelect}>
        <div className="track-select">
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={onToggleSelect}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        <div className="track-image">
          {track.album?.images && track.album.images.length > 0 ? (
            <img src={track.album.images[track.album.images.length - 1].url} alt={track.album?.name} />
          ) : (
            <div className="placeholder-image"></div>
          )}
        </div>
        
        <div className="track-info">
          <div className="track-title">{track.name}</div>
          <div className="track-artist">{formatArtistNames(track.artists)}</div>
        </div>
        
        <div className="track-album">{track.album?.name}</div>
        
        <div className="track-duration">{formatDuration(track.duration_ms)}</div>
        
        <div className="track-actions">
          <button 
            className={`find-button ${searching ? 'searching' : ''} ${youtubeResult ? 'found' : ''}`}
            onClick={handleFindOnYoutube}
            disabled={searching}
          >
            {searching ? 'Searching...' : youtubeResult ? 'Show Result' : 'Find'}
          </button>
        </div>
      </div>
      
      {expanded && youtubeResult && (
        <div className="track-youtube">
          <div className="youtube-info">
            <div className="youtube-title">{youtubeResult.title || 'Video title not available'}</div>
          </div>
          
          <div className="youtube-actions">
            <a 
              href={getYouTubeUrl(youtubeResult.id)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="youtube-link"
            >
              Watch on YouTube
            </a>
            
            <a 
              href={`https://www.y2mate.com/youtube/${youtubeResult.id}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="download-link"
            >
              Download MP3
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackItem;