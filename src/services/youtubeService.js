// src/services/youtubeService.js

// Add your YouTube API key here
const YOUTUBE_API_KEY = 'AIzaSyCPr3xSoM6iRZwrGQcXOz1sbVMyQXEBxcA'; // Add your YouTube API key here

/**
 * Search YouTube for a track
 * @param {string} query Search query
 * @returns {Promise<Object|null>} First search result or null
 */
export const searchYouTube = async (query) => {
  try {
    // If no API key is provided, return null
    if (!YOUTUBE_API_KEY) {
      console.warn('No YouTube API key provided');
      return null;
    }
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query
      )}&type=video&maxResults=1&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return {
        id: data.items[0].id.videoId,
        title: data.items[0].snippet.title,
        thumbnail: data.items[0].snippet.thumbnails.medium.url
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return null;
  }
};

/**
 * Generate a direct YouTube URL from video ID
 * @param {string} videoId YouTube video ID
 * @returns {string} YouTube URL
 */
export const getYouTubeUrl = (videoId) => {
  return `https://www.youtube.com/watch?v=${videoId}`;
};

/**
 * Fallback search when API key is not available
 * @param {string} query Search query
 * @returns {Object} Video ID for Y2Mate
 */
export const fallbackYouTubeSearch = (query) => {
  // This just creates a predictable video ID based on the query
  // In a real implementation, you might want to use a more reliable method
  return {
    id: encodeURIComponent(query).substring(0, 11),
    title: query,
    thumbnail: null
  };
};