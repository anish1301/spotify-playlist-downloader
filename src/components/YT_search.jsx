import { google } from 'googleapis';
// const youtube = google.youtube('v3');

// const API_KEY = process.env.YOUTUBE_API_KEY || 'YOUR_YOUTUBE_API_KEY'; // Add your YouTube API key here
const youtube = google.youtube('v3');

const API_KEY = 'AIzaSyCPr3xSoM6iRZwrGQcXOz1sbVMyQXEBxcA'; // Replace with your actual YouTube API key

// async function searchVideo(title, artists) {
//     try {
//         const query = `${title} ${artists.join(' ')} official audio`;
        
//         const response = await youtube.search.list({
//             key: API_KEY,
//             part: 'id',
//             q: query,
//             maxResults: 1,
//             type: 'video'
//         });

//         if (response.data.items.length === 0) {
//             throw new Error('No video found');
//         }

//         return `https://youtube.com/watch?v=${response.data.items[0].id.videoId}`;
//     } catch (error) {
//         throw new Error(`YouTube search failed: ${error.message}`);
//     }
// }

export { searchVideo };
async function searchVideo(title, artists) {
  try {
    const query = `${title} ${artists.join(' ')} official audio`;
    
    const response = await youtube.search.list({
      key: API_KEY,
      part: 'id',
      q: query,
      maxResults: 1,
      type: 'video'
    });

    if (response.data.items.length === 0) {
      throw new Error('No video found');
    }

    return `https://youtube.com/watch?v=${response.data.items[0].id.videoId}`;
  } catch (error) {
    throw new Error(`YouTube search failed: ${error.message}`);
  }
}

