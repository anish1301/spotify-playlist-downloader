// spotifyService.js
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();
// Use environment variables in production
const CLIENT_ID = '342988cefabe4cc38bfd832875278b34'; // Replace with your Spotify Client ID
const REDIRECT_URI = 'http://localhost:5173/'; // Updated to root path for proper routing
const SCOPE = 'playlist-read-private playlist-read-collaborative';

export const initSpotifyApi = (token) => {
  spotifyApi.setAccessToken(token);
};

export const authenticateSpotify = () => {
  // Add state parameter for CSRF protection
  const state = generateRandomString(16);
  localStorage.setItem('spotify_auth_state', state);
  
  const authUrl = 'https://accounts.spotify.com/authorize' +
    '?response_type=token' +
    '&client_id=' + encodeURIComponent(CLIENT_ID) +
    '&scope=' + encodeURIComponent(SCOPE) +
    '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
    '&state=' + encodeURIComponent(state);
  
  window.location = authUrl;
};

export const fetchPlaylist = async (playlistId) => {
  if (!playlistId) {
    throw new Error('Playlist ID is required');
  }
  
  try {
    const response = await spotifyApi.getPlaylist(playlistId);
    return response;
  } catch (error) {
    console.error('Error fetching playlist:', error);
    if (error.status === 401) {
      throw new Error('Authentication expired. Please login again.');
    } else if (error.status === 403) {
      throw new Error('You don\'t have permission to access this playlist.');
    } else if (error.status === 404) {
      throw new Error('Playlist not found. Please check the URL and try again.');
    }
    throw new Error('Could not fetch playlist. Please check the URL and try again.');
  }
};

export const fetchPlaylistTracks = async (playlistId) => {
  if (!playlistId) {
    throw new Error('Playlist ID is required');
  }
  
  try {
    let tracks = [];
    let offset = 0;
    const limit = 100; // Spotify API limit
    let hasMore = true;
    
    while (hasMore) {
      const response = await spotifyApi.getPlaylistTracks(playlistId, {
        limit: limit,
        offset: offset
      });
      
      const trackItems = response.items
        .filter(item => item.track)
        .map(item => ({
          id: item.track.id,
          name: item.track.name,
          artist: item.track.artists.map(artist => artist.name).join(', '),
          album: item.track.album.name,
          duration: item.track.duration_ms,
          image: item.track.album.images[0]?.url || null,
          query: `${item.track.name} ${item.track.artists[0].name} audio`
        }));
      
      tracks = tracks.concat(trackItems);
      
      if (response.next) {
        offset += limit;
      } else {
        hasMore = false;
      }
    }
    
    return tracks;
  } catch (error) {
    console.error('Error fetching tracks:', error);
    if (error.status === 401) {
      throw new Error('Authentication expired. Please login again.');
    } else if (error.status === 403) {
      throw new Error('You don\'t have permission to access this playlist.');
    }
    throw new Error('Could not fetch tracks. Please try again.');
  }
};

// Helper function for generating random string for state parameter
function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  return text;
}

// Add a function to check if token is still valid
export const checkTokenValidity = async () => {
  try {
    await spotifyApi.getMe();
    return true;
  } catch (error) {
    return false;
  }
};