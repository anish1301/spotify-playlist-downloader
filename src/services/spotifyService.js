import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();
const CLIENT_ID = '342988cefabe4cc38bfd832875278b34'; // Replace with your Spotify Client ID
const REDIRECT_URI = window.location.origin;
const SCOPE = 'playlist-read-private playlist-read-collaborative';

export const initSpotifyApi = (token) => {
  spotifyApi.setAccessToken(token);
};

export const authenticateSpotify = () => {
  const authUrl = 'https://accounts.spotify.com/authorize' +
    '?response_type=token' +
    '&client_id=' + encodeURIComponent(CLIENT_ID) +
    '&scope=' + encodeURIComponent(SCOPE) +
    '&redirect_uri=' + encodeURIComponent(REDIRECT_URI);
  
  window.location = authUrl;
};

export const fetchPlaylist = async (playlistId) => {
  try {
    const response = await spotifyApi.getPlaylist(playlistId);
    return response;
  } catch (error) {
    console.error('Error fetching playlist:', error);
    throw new Error('Could not fetch playlist. Please check the URL and try again.');
  }
};

export const fetchPlaylistTracks = async (playlistId) => {
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
          image: item.track.album.images[0]?.url,
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
    throw new Error('Could not fetch tracks. Please try again.');
  }
};