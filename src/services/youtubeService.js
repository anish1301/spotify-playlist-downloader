// src/services/spotifyService.js


// src/services/youtubeService.js
const YOUTUBE_API_KEY = 'AIzaSyCPr3xSoM6iRZwrGQcXOz1sbVMyQXEBxcA'; // Replace with your YouTube API key

// Search for a track on YouTube
export const searchYouTube = async (query) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('YouTube search failed');
    }
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      return {
        videoId: data.items[0].id.videoId,
        title: data.items[0].snippet.title,
        url: `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`
      };
    }
    
    throw new Error('No results found');
  } catch (error) {
    console.error('Error searching YouTube:', error);
    throw error;
  }
};

// Generate Y2Mate download URL from YouTube URL
export const getY2MateDownloadUrl = (youtubeUrl) => {
  const videoId = youtubeUrl.split('v=')[1];
  return `https://y2mate.nu/en-CVeZ/download?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${videoId}&format=mp3`;
};