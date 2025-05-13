import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

export const initializeSpotifyApi = async (token) => {
  if (!token) {
    throw new Error('No token provided');
  }
  
  spotifyApi.setAccessToken(token);
  try {
    // Verify token by making a test API call
    await spotifyApi.getMe();
    return true;
  } catch (error) {
    console.error('Failed to initialize Spotify API:', error);
    throw error;
  }
};
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = window.location.origin; // This will redirect to your app's root URL
const SCOPES = ['playlist-read-private', 'playlist-read-collaborative'];

export const getAuthUrl = () => {
  return 'https://accounts.spotify.com/authorize?' + 
    `client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(SCOPES.join(' '))}` +
    '&response_type=token';
};

export const getUser = async () => {
  try {
    return await spotifyApi.getMe();
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};