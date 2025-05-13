const express = require('express');
const cors = require('cors');
const youtube = require('./youtube');
const ytdl = require('ytdl-core');
const archiver = require('archiver');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.post('/download', async (req, res) => {
  const archive = archiver('zip');

  archive.on('error', (err) => {
    res.status(500).json({ error: err.message });
  });

  try {
    const { tracks } = req.body;
    
    res.attachment('playlist.zip');
    archive.pipe(res);

    for (const track of tracks) {
      const videoUrl = await youtube.searchVideo(track.name, track.artists);
      const stream = ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' });
      archive.append(stream, { name: `${track.name}.mp3` });
    }

    await archive.finalize();
  } catch (error) {
    archive.abort();
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});